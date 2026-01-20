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
    provider?: 'thaiid' | 'local';
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

export async function GET(req: NextRequest) {
    const url = req.nextUrl.clone();
    const code = url.searchParams.get('code') || '';
    const state = url.searchParams.get('state') || '';

    const expectedState = req.cookies.get('thaid_state')?.value || '';
    const verifier = req.cookies.get('thaid_verifier')?.value || '';
    const redirectTo = req.cookies.get('thaid_redirect')?.value || '/';

    if (!state || state !== expectedState) {
        return NextResponse.json({ error: 'invalid_state' }, { status: 400 });
    }

    let userInfo: { sub?: string; name?: string; email?: string } = {};
    const clientId = process.env.THAID_CLIENT_ID || '';
    const tokenUrl = process.env.THAID_TOKEN_URL || '';
    const userinfoUrl = process.env.THAID_USERINFO_URL || '';
    const redirectUri = process.env.THAID_REDIRECT_URI || `${url.protocol}//${url.host}/api/auth/thaid/callback`;
    const clientSecret = process.env.THAID_CLIENT_SECRET || '';

    if (code === 'demo' || !tokenUrl || !userinfoUrl || !clientId) {
        userInfo = { sub: 'demo-sub', name: 'ThaiID User', email: 'thaiid@example.com' };
    } else {
        const tokenParams = new URLSearchParams({
            grant_type: 'authorization_code',
            code,
            client_id: clientId,
            redirect_uri: redirectUri,
            code_verifier: verifier,
        });
        if (clientSecret) tokenParams.append('client_secret', clientSecret);

        const tokenRes = await fetch(tokenUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: tokenParams.toString(),
        });
        if (!tokenRes.ok) {
            return NextResponse.json({ error: 'token_exchange_failed' }, { status: 400 });
        }
        const tokenJson = (await tokenRes.json()) as { access_token?: string; id_token?: string };
        const accessToken = tokenJson.access_token || '';
        const uiRes = await fetch(userinfoUrl, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!uiRes.ok) {
            return NextResponse.json({ error: 'userinfo_failed' }, { status: 400 });
        }
        const ui = (await uiRes.json()) as { sub?: string; name?: string; email?: string };
        userInfo = ui;
    }

    const usersData = readJsonFile<UsersFile>(usersFilePath, { users: [] });
    const bySub = usersData.users.find((u) => u.provider === 'thaiid' && u.providerSub === userInfo.sub);
    const byEmail = userInfo.email ? usersData.users.find((u) => u.email === userInfo.email) : undefined;
    let finalUser = bySub || byEmail;

    if (!finalUser) {
        finalUser = {
            id: typeof crypto?.randomUUID === 'function' ? crypto.randomUUID() : `${Date.now()}-${crypto.randomBytes(8).toString('hex')}`,
            email: userInfo.email || '',
            name: userInfo.name || '',
            createdAt: new Date().toISOString(),
            provider: 'thaiid',
            providerSub: userInfo.sub || '',
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
    res.cookies.set('thaid_verifier', '', { path: '/', maxAge: 0 });
    res.cookies.set('thaid_state', '', { path: '/', maxAge: 0 });
    res.cookies.set('thaid_redirect', '', { path: '/', maxAge: 0 });
    res.cookies.set('thaid_nonce', '', { path: '/', maxAge: 0 });
    return res;
}

