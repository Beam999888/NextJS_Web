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

export async function GET(req: NextRequest) {
    const url = req.nextUrl.clone();
    const code = url.searchParams.get('code') || '';
    const state = url.searchParams.get('state') || '';

    const expectedState = req.cookies.get('oauth_linkedin_state')?.value || '';
    const redirectTo = req.cookies.get('oauth_linkedin_redirect')?.value || '/';

    if (!state || state !== expectedState) {
        return NextResponse.json({ error: 'invalid_state' }, { status: 400 });
    }

    let userInfo: { sub?: string; name?: string; email?: string } = {};
    const clientId = process.env.LINKEDIN_CLIENT_ID || '';
    const clientSecret = process.env.LINKEDIN_CLIENT_SECRET || '';
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${url.protocol}//${url.host}`;
    const redirectUri = process.env.LINKEDIN_REDIRECT_URI || `${baseUrl}/api/auth/linkedin/callback`;

    if (code === 'demo' || !clientId) {
        userInfo = { sub: 'demo-linkedin-sub', name: 'LinkedIn User', email: 'linkedin@example.com' };
    } else {
        const tokenParams = new URLSearchParams({
            grant_type: 'authorization_code',
            code,
            client_id: clientId,
            client_secret: clientSecret,
            redirect_uri: redirectUri,
        });
        const tokenRes = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: tokenParams.toString(),
        });
        if (!tokenRes.ok) {
            return NextResponse.json({ error: 'token_exchange_failed' }, { status: 400 });
        }
        const tokenJson = (await tokenRes.json()) as { access_token?: string };
        const accessToken = tokenJson.access_token || '';

        const uiRes = await fetch('https://api.linkedin.com/v2/userinfo', {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (uiRes.ok) {
            const ui = (await uiRes.json()) as { sub?: string; name?: string; email?: string };
            userInfo = ui;
        } else {
            const meRes = await fetch('https://api.linkedin.com/v2/me', {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            const emailRes = await fetch('https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))', {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            if (!meRes.ok || !emailRes.ok) {
                return NextResponse.json({ error: 'userinfo_failed' }, { status: 400 });
            }
            const me = (await meRes.json()) as { id?: string; localizedFirstName?: string; localizedLastName?: string };
            const emails = (await emailRes.json()) as { elements?: Array<{ 'handle~'?: { emailAddress?: string } }> };
            const email = emails.elements?.[0]?.['handle~']?.emailAddress || '';
            const name = [me.localizedFirstName, me.localizedLastName].filter(Boolean).join(' ').trim();
            userInfo = { sub: me.id, name, email };
        }
    }

    const usersData = readJsonFile<UsersFile>(usersFilePath, { users: [] });
    const bySub = usersData.users.find((u) => u.provider === 'linkedin' && u.providerSub === userInfo.sub);
    const byEmail = userInfo.email ? usersData.users.find((u) => u.email === userInfo.email) : undefined;
    let finalUser = bySub || byEmail;

    if (!finalUser) {
        finalUser = {
            id: typeof crypto?.randomUUID === 'function' ? crypto.randomUUID() : `${Date.now()}-${crypto.randomBytes(8).toString('hex')}`,
            email: userInfo.email || '',
            name: userInfo.name || '',
            createdAt: new Date().toISOString(),
            provider: 'linkedin',
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
    res.cookies.set('oauth_linkedin_state', '', { path: '/', maxAge: 0 });
    res.cookies.set('oauth_linkedin_redirect', '', { path: '/', maxAge: 0 });
    return res;
}

export async function POST(req: NextRequest) {
    const form = await req.formData();
    const code = String(form.get('code') || '');
    const state = String(form.get('state') || '');
    const url = req.nextUrl.clone();

    const expectedState = req.cookies.get('oauth_linkedin_state')?.value || '';
    const redirectTo = req.cookies.get('oauth_linkedin_redirect')?.value || '/';

    if (!state || state !== expectedState) {
        return NextResponse.json({ error: 'invalid_state' }, { status: 400 });
    }

    let userInfo: { sub?: string; name?: string; email?: string } = {};
    const clientId = process.env.LINKEDIN_CLIENT_ID || '';
    const clientSecret = process.env.LINKEDIN_CLIENT_SECRET || '';
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${url.protocol}//${url.host}`;
    const redirectUri = process.env.LINKEDIN_REDIRECT_URI || `${baseUrl}/api/auth/linkedin/callback`;

    if (code === 'demo' || !clientId) {
        userInfo = { sub: 'demo-linkedin-sub', name: 'LinkedIn User', email: 'linkedin@example.com' };
    } else {
        const tokenParams = new URLSearchParams({
            grant_type: 'authorization_code',
            code,
            client_id: clientId,
            client_secret: clientSecret,
            redirect_uri: redirectUri,
        });
        const tokenRes = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: tokenParams.toString(),
        });
        if (!tokenRes.ok) {
            return NextResponse.json({ error: 'token_exchange_failed' }, { status: 400 });
        }
        const tokenJson = (await tokenRes.json()) as { access_token?: string };
        const accessToken = tokenJson.access_token || '';

        const uiRes = await fetch('https://api.linkedin.com/v2/userinfo', {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (uiRes.ok) {
            const ui = (await uiRes.json()) as { sub?: string; name?: string; email?: string };
            userInfo = ui;
        } else {
            const meRes = await fetch('https://api.linkedin.com/v2/me', {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            const emailRes = await fetch('https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))', {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            if (!meRes.ok || !emailRes.ok) {
                return NextResponse.json({ error: 'userinfo_failed' }, { status: 400 });
            }
            const me = (await meRes.json()) as { id?: string; localizedFirstName?: string; localizedLastName?: string };
            const emails = (await emailRes.json()) as { elements?: Array<{ 'handle~'?: { emailAddress?: string } }> };
            const email = emails.elements?.[0]?.['handle~']?.emailAddress || '';
            const name = [me.localizedFirstName, me.localizedLastName].filter(Boolean).join(' ').trim();
            userInfo = { sub: me.id, name, email };
        }
    }

    const usersData = readJsonFile<UsersFile>(usersFilePath, { users: [] });
    const bySub = usersData.users.find((u) => u.provider === 'linkedin' && u.providerSub === userInfo.sub);
    const byEmail = userInfo.email ? usersData.users.find((u) => u.email === userInfo.email) : undefined;
    let finalUser = bySub || byEmail;

    if (!finalUser) {
        finalUser = {
            id: typeof crypto?.randomUUID === 'function' ? crypto.randomUUID() : `${Date.now()}-${crypto.randomBytes(8).toString('hex')}`,
            email: userInfo.email || '',
            name: userInfo.name || '',
            createdAt: new Date().toISOString(),
            provider: 'linkedin',
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
    res.cookies.set('oauth_linkedin_state', '', { path: '/', maxAge: 0 });
    res.cookies.set('oauth_linkedin_redirect', '', { path: '/', maxAge: 0 });
    return res;
}
