import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export const runtime = 'nodejs';

function base64url(input: Buffer) {
    return input.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function makeVerifier() {
    return base64url(crypto.randomBytes(32));
}

function makeChallenge(verifier: string) {
    const hash = crypto.createHash('sha256').update(verifier).digest();
    return base64url(hash);
}

export async function GET(req: NextRequest) {
    const url = req.nextUrl.clone();
    const redirect = url.searchParams.get('redirect') || '/';

    const verifier = makeVerifier();
    const challenge = makeChallenge(verifier);
    const state = base64url(crypto.randomBytes(16));
    const nonce = base64url(crypto.randomBytes(16));

    const clientId = process.env.THAID_CLIENT_ID || '';
    const authUrl = process.env.THAID_AUTH_URL || '';
    const tokenUrl = process.env.THAID_TOKEN_URL || '';
    const userinfoUrl = process.env.THAID_USERINFO_URL || '';
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${url.protocol}//${url.host}`;
    const redirectUri = process.env.THAID_REDIRECT_URI || `${baseUrl}/api/auth/thaid/callback`;
    const scope = process.env.THAID_SCOPE || 'openid profile';

    if (!clientId || !authUrl) {
        const placeholder = `${baseUrl}/api/auth/thaid/callback?code=demo&state=${state}`;
        const qrUrl = `https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=${encodeURIComponent(placeholder)}`;
        const res = NextResponse.json({ authorizationUrl: placeholder, qrUrl });
        res.cookies.set('thaid_verifier', verifier, { httpOnly: true, path: '/', sameSite: 'lax' });
        res.cookies.set('thaid_state', state, { httpOnly: true, path: '/', sameSite: 'lax' });
        res.cookies.set('thaid_redirect', redirect, { httpOnly: true, path: '/', sameSite: 'lax' });
        res.cookies.set('thaid_nonce', nonce, { httpOnly: true, path: '/', sameSite: 'lax' });
        return res;
    }

    const params = new URLSearchParams({
        response_type: 'code',
        client_id: clientId,
        redirect_uri: redirectUri,
        scope,
        state,
        nonce,
        code_challenge: challenge,
        code_challenge_method: 'S256',
        prompt: 'login',
    });
    const authorizationUrl = `${authUrl}?${params.toString()}`;
    const qrUrl = `https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=${encodeURIComponent(authorizationUrl)}`;

    const res = NextResponse.json({ authorizationUrl, qrUrl });
    res.cookies.set('thaid_verifier', verifier, { httpOnly: true, path: '/', sameSite: 'lax' });
    res.cookies.set('thaid_state', state, { httpOnly: true, path: '/', sameSite: 'lax' });
    res.cookies.set('thaid_redirect', redirect, { httpOnly: true, path: '/', sameSite: 'lax' });
    res.cookies.set('thaid_nonce', nonce, { httpOnly: true, path: '/', sameSite: 'lax' });
    return res;
}

