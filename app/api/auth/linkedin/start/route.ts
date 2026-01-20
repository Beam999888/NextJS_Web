import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
    const url = req.nextUrl.clone();
    const redirect = url.searchParams.get('redirect') || '/';

    const clientId = process.env.LINKEDIN_CLIENT_ID || '';
    const authUrl = 'https://www.linkedin.com/oauth/v2/authorization';
    const scope = 'openid profile email';
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${url.protocol}//${url.host}`;
    const redirectUri = process.env.LINKEDIN_REDIRECT_URI || `${baseUrl}/api/auth/linkedin/callback`;

    const state = crypto.randomBytes(16).toString('hex');

    if (!clientId) {
        return NextResponse.json({ error: 'provider_not_configured' }, { status: 400 });
    }

    const params = new URLSearchParams({
        response_type: 'code',
        client_id: clientId,
        redirect_uri: redirectUri,
        state,
        scope,
        response_mode: 'form_post',
    });
    const authorizationUrl = `${authUrl}?${params.toString()}`;

    const res = NextResponse.json({ authorizationUrl });
    res.cookies.set('oauth_linkedin_state', state, { httpOnly: true, path: '/', sameSite: 'lax' });
    res.cookies.set('oauth_linkedin_redirect', redirect, { httpOnly: true, path: '/', sameSite: 'lax' });
    return res;
}
