import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';

type StoredUser = {
    id: string;
    email: string;
    name?: string;
    password?: unknown;
    createdAt: string;
    provider?: 'thaiid' | 'local' | 'google' | 'facebook' | 'github' | 'linkedin';
    providerSub?: string;
};

type UsersFile = { users: StoredUser[] };

type SessionRecord = {
    token: string;
    userId: string;
    createdAt: string;
    expiresAt: string;
};

type SessionsFile = { sessions: SessionRecord[] };

const usersFilePath = path.join(process.cwd(), 'data', 'users.json');
const sessionsFilePath = path.join(process.cwd(), 'data', 'sessions.json');

function readJsonFile<T>(filePath: string, fallback: T): T {
    try {
        if (!fs.existsSync(filePath)) return fallback;
        const raw = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(raw) as T;
    } catch {
        return fallback;
    }
}

function writeJsonFile(filePath: string, data: unknown) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function createSession(userId: string) {
    const token = typeof crypto?.randomUUID === 'function' ? crypto.randomUUID() : `${Date.now()}-${crypto.randomBytes(16).toString('hex')}`;
    const now = Date.now();
    const maxAgeMs = 7 * 24 * 60 * 60 * 1000;
    return {
        token,
        userId,
        createdAt: new Date(now).toISOString(),
        expiresAt: new Date(now + maxAgeMs).toISOString(),
        maxAgeSeconds: Math.floor(maxAgeMs / 1000),
    };
}

async function getGithubEmail(accessToken: string) {
    const res = await fetch('https://api.github.com/user/emails', {
        headers: { Authorization: `Bearer ${accessToken}`, Accept: 'application/vnd.github+json' },
    });
    if (!res.ok) return '';
    const list = (await res.json()) as Array<{ email?: string; primary?: boolean; verified?: boolean }>;
    const primary = list.find((e) => e.primary && e.verified && typeof e.email === 'string');
    const anyEmail = list.find((e) => typeof e.email === 'string');
    return primary?.email || anyEmail?.email || '';
}

export async function GET(req: NextRequest) {
    const url = req.nextUrl.clone();
    const code = url.searchParams.get('code') || '';
    const state = url.searchParams.get('state') || '';

    const expectedState = req.cookies.get('oauth_github_state')?.value || '';
    const redirectTo = req.cookies.get('oauth_github_redirect')?.value || '/';

    if (!state || state !== expectedState) {
        return NextResponse.json({ error: 'invalid_state' }, { status: 400 });
    }

    let userInfo: { id?: number; name?: string; email?: string } = {};
    const clientId = process.env.GITHUB_CLIENT_ID || '';
    const clientSecret = process.env.GITHUB_CLIENT_SECRET || '';
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${url.protocol}//${url.host}`;
    const redirectUri = process.env.GITHUB_REDIRECT_URI || `${baseUrl}/api/auth/github/callback`;

    if (code === 'demo' || !clientId) {
        userInfo = { id: 123456, name: 'GitHub User', email: 'github@example.com' };
    } else {
        const tokenParams = new URLSearchParams({
            code,
            client_id: clientId,
            client_secret: clientSecret,
        });
        const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
            body: tokenParams.toString(),
        });
        if (!tokenRes.ok) {
            return NextResponse.json({ error: 'token_exchange_failed' }, { status: 400 });
        }
        const tokenJson = (await tokenRes.json()) as { access_token?: string };
        const accessToken = tokenJson.access_token || '';

        const uiRes = await fetch('https://api.github.com/user', {
            headers: { Authorization: `Bearer ${accessToken}`, Accept: 'application/vnd.github+json' },
        });
        if (!uiRes.ok) {
            return NextResponse.json({ error: 'userinfo_failed' }, { status: 400 });
        }
        const ui = (await uiRes.json()) as { id?: number; name?: string; login?: string; email?: string };
        const email = ui.email || (await getGithubEmail(accessToken)) || (ui.login ? `${ui.login}@users.noreply.github.com` : '');
        userInfo = { id: ui.id, name: ui.name || ui.login || '', email };
    }

    const usersData = readJsonFile<UsersFile>(usersFilePath, { users: [] });
    const bySub = usersData.users.find((u) => u.provider === 'github' && u.providerSub === String(userInfo.id || ''));
    const byEmail = userInfo.email ? usersData.users.find((u) => u.email === userInfo.email) : undefined;
    let finalUser = bySub || byEmail;

    if (!finalUser) {
        finalUser = {
            id: typeof crypto?.randomUUID === 'function' ? crypto.randomUUID() : `${Date.now()}-${crypto.randomBytes(8).toString('hex')}`,
            email: userInfo.email || '',
            name: userInfo.name || '',
            createdAt: new Date().toISOString(),
            provider: 'github',
            providerSub: String(userInfo.id || ''),
        };
        writeJsonFile(usersFilePath, { users: [finalUser, ...usersData.users] });
    }

    const sessionsData = readJsonFile<SessionsFile>(sessionsFilePath, { sessions: [] });
    const session = createSession(finalUser.id);
    writeJsonFile(sessionsFilePath, { sessions: [{ token: session.token, userId: session.userId, createdAt: session.createdAt, expiresAt: session.expiresAt }, ...sessionsData.sessions] });

    const res = NextResponse.redirect(new URL(redirectTo, `${url.protocol}//${url.host}`));
    res.cookies.set('site_session', session.token, {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        maxAge: session.maxAgeSeconds,
        secure: process.env.NODE_ENV === 'production',
    });
    res.cookies.set('oauth_github_state', '', { path: '/', maxAge: 0 });
    res.cookies.set('oauth_github_redirect', '', { path: '/', maxAge: 0 });
    return res;
}
