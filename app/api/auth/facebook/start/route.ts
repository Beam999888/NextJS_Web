import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
    const url = req.nextUrl.clone();
    const redirect = url.searchParams.get('redirect') || '/';

    const clientId = process.env.FACEBOOK_CLIENT_ID || '';
    const authUrl = 'https://www.facebook.com/v18.0/dialog/oauth';
    const scope = 'email,public_profile';
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${url.protocol}//${url.host}`;
    const redirectUri = process.env.FACEBOOK_REDIRECT_URI || `${baseUrl}/api/auth/facebook/callback`;

    const state = crypto.randomBytes(16).toString('hex');

    if (!clientId) {
        const placeholder = `${redirectUri}?code=demo&state=${state}`;
        const res = NextResponse.json({ authorizationUrl: placeholder });
        res.cookies.set('oauth_facebook_state', state, { httpOnly: true, path: '/', sameSite: 'lax' });
        res.cookies.set('oauth_facebook_redirect', redirect, { httpOnly: true, path: '/', sameSite: 'lax' });
        return res;
    }

    const params = new URLSearchParams({
        response_type: 'code',
        client_id: clientId,
        redirect_uri: redirectUri,
        state,
        scope,
    });
    const authorizationUrl = `${authUrl}?${params.toString()}`;

    const res = NextResponse.json({ authorizationUrl });
    res.cookies.set('oauth_facebook_state', state, { httpOnly: true, path: '/', sameSite: 'lax' });
    res.cookies.set('oauth_facebook_redirect', redirect, { httpOnly: true, path: '/', sameSite: 'lax' });
    return res;
}
