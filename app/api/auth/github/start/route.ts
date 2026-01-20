import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
    const url = req.nextUrl.clone();
    const redirect = url.searchParams.get('redirect') || '/';

    const clientId = process.env.GITHUB_CLIENT_ID || '';
    const authUrl = 'https://github.com/login/oauth/authorize';
    const scope = 'read:user user:email';
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${url.protocol}//${url.host}`;
    const redirectUri = process.env.GITHUB_REDIRECT_URI || `${baseUrl}/api/auth/github/callback`;

    const state = crypto.randomBytes(16).toString('hex');

    if (!clientId) {
        const placeholder = `${redirectUri}?code=demo&state=${state}`;
        const res = NextResponse.json({ authorizationUrl: placeholder });
        res.cookies.set('oauth_github_state', state, { httpOnly: true, path: '/', sameSite: 'lax' });
        res.cookies.set('oauth_github_redirect', redirect, { httpOnly: true, path: '/', sameSite: 'lax' });
        return res;
    }

    const params = new URLSearchParams({
        response_type: 'code',
        client_id: clientId,
        state,
        scope,
        prompt: 'select_account',
    });
    const authorizationUrl = `${authUrl}?${params.toString()}`;

    const res = NextResponse.json({ authorizationUrl });
    res.cookies.set('oauth_github_state', state, { httpOnly: true, path: '/', sameSite: 'lax' });
    res.cookies.set('oauth_github_redirect', redirect, { httpOnly: true, path: '/', sameSite: 'lax' });
    return res;
}
