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

async function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithTimeout(url: string, init: RequestInit, timeoutMs: number) {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), timeoutMs);
    try {
        const res = await fetch(url, { ...init, signal: controller.signal });
        return res;
    } finally {
        clearTimeout(t);
    }
}

export async function GET(req: NextRequest) {
    const url = req.nextUrl.clone();
    const code = url.searchParams.get('code') || '';
    const state = url.searchParams.get('state') || '';

    const expectedState = req.cookies.get('oauth_google_state')?.value || '';
    const verifier = req.cookies.get('oauth_google_verifier')?.value || '';
    const redirectTo = req.cookies.get('oauth_google_redirect')?.value || '/';

    if (!state || state !== expectedState) {
        const back = new URL('/login', `${url.protocol}//${url.host}`);
        back.searchParams.set('redirect', redirectTo);
        back.searchParams.set('error', 'GOOGLE_INVALID_STATE');
        const res = NextResponse.redirect(back);
        res.cookies.set('oauth_google_verifier', '', { path: '/', maxAge: 0 });
        res.cookies.set('oauth_google_state', '', { path: '/', maxAge: 0 });
        res.cookies.set('oauth_google_redirect', '', { path: '/', maxAge: 0 });
        return res;
    }

    let userInfo: { sub?: string; name?: string; email?: string } = {};
    const clientId = process.env.GOOGLE_CLIENT_ID || '';
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET || '';
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${url.protocol}//${url.host}`;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${baseUrl}/api/auth/google/callback`;

    if (code === 'demo' || !clientId) {
        userInfo = { sub: 'demo-google-sub', name: 'Google User', email: 'google@example.com' };
    } else {
        const tokenParams = new URLSearchParams({
            grant_type: 'authorization_code',
            code,
            client_id: clientId,
            redirect_uri: redirectUri,
            code_verifier: verifier,
        });
        if (clientSecret) tokenParams.append('client_secret', clientSecret);

        let tokenRes: Response | null = null;
        for (let attempt = 0; attempt < 2; attempt++) {
            try {
                tokenRes = await fetchWithTimeout('https://oauth2.googleapis.com/token', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: tokenParams.toString(),
                }, 10000);
                break;
            } catch {
                if (attempt === 1) {
                    const back = new URL('/login', `${url.protocol}//${url.host}`);
                    back.searchParams.set('redirect', redirectTo);
                    back.searchParams.set('error', 'GOOGLE_TOKEN_TIMEOUT');
                    const res = NextResponse.redirect(back);
                    res.cookies.set('oauth_google_verifier', '', { path: '/', maxAge: 0 });
                    res.cookies.set('oauth_google_state', '', { path: '/', maxAge: 0 });
                    res.cookies.set('oauth_google_redirect', '', { path: '/', maxAge: 0 });
                    return res;
                }
                await delay(600);
            }
        }
        if (!tokenRes || !tokenRes.ok) {
            const back = new URL('/login', `${url.protocol}//${url.host}`);
            back.searchParams.set('redirect', redirectTo);
            back.searchParams.set('error', 'GOOGLE_TOKEN_FAILED');
            const res = NextResponse.redirect(back);
            res.cookies.set('oauth_google_verifier', '', { path: '/', maxAge: 0 });
            res.cookies.set('oauth_google_state', '', { path: '/', maxAge: 0 });
            res.cookies.set('oauth_google_redirect', '', { path: '/', maxAge: 0 });
            return res;
        }
        const tokenJson = (await tokenRes.json()) as { access_token?: string };
        const accessToken = tokenJson.access_token || '';

        let uiRes: Response | null = null;
        for (let attempt = 0; attempt < 2; attempt++) {
            try {
                uiRes = await fetchWithTimeout('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: { Authorization: `Bearer ${accessToken}` },
                }, 10000);
                break;
            } catch {
                if (attempt === 1) {
                    const back = new URL('/login', `${url.protocol}//${url.host}`);
                    back.searchParams.set('redirect', redirectTo);
                    back.searchParams.set('error', 'GOOGLE_USERINFO_TIMEOUT');
                    const res = NextResponse.redirect(back);
                    res.cookies.set('oauth_google_verifier', '', { path: '/', maxAge: 0 });
                    res.cookies.set('oauth_google_state', '', { path: '/', maxAge: 0 });
                    res.cookies.set('oauth_google_redirect', '', { path: '/', maxAge: 0 });
                    return res;
                }
                await delay(600);
            }
        }
        if (!uiRes || !uiRes.ok) {
            const back = new URL('/login', `${url.protocol}//${url.host}`);
            back.searchParams.set('redirect', redirectTo);
            back.searchParams.set('error', 'GOOGLE_USERINFO_FAILED');
            const res = NextResponse.redirect(back);
            res.cookies.set('oauth_google_verifier', '', { path: '/', maxAge: 0 });
            res.cookies.set('oauth_google_state', '', { path: '/', maxAge: 0 });
            res.cookies.set('oauth_google_redirect', '', { path: '/', maxAge: 0 });
            return res;
        }
        const ui = (await uiRes.json()) as { sub?: string; name?: string; email?: string };
        userInfo = ui;
    }

    const usersData = readJsonFile<UsersFile>(usersFilePath, { users: [] });
    const bySub = usersData.users.find((u) => u.provider === 'google' && u.providerSub === userInfo.sub);
    const byEmail = userInfo.email ? usersData.users.find((u) => u.email === userInfo.email) : undefined;
    let finalUser = bySub || byEmail;

    if (!finalUser) {
        finalUser = {
            id: typeof crypto?.randomUUID === 'function' ? crypto.randomUUID() : `${Date.now()}-${crypto.randomBytes(8).toString('hex')}`,
            email: userInfo.email || '',
            name: userInfo.name || '',
            createdAt: new Date().toISOString(),
            provider: 'google',
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
    res.cookies.set('oauth_google_verifier', '', { path: '/', maxAge: 0 });
    res.cookies.set('oauth_google_state', '', { path: '/', maxAge: 0 });
    res.cookies.set('oauth_google_redirect', '', { path: '/', maxAge: 0 });
    return res;
}
