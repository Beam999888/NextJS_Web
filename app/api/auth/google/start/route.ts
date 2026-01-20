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
 
  const clientId = process.env.GOOGLE_CLIENT_ID || '';
  const authUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
  const scope = 'openid profile email';
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${url.protocol}//${url.host}`;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${baseUrl}/api/auth/google/callback`;
 
  const state = base64url(crypto.randomBytes(16));
  const verifier = makeVerifier();
  const challenge = makeChallenge(verifier);
 
  if (!clientId) {
    const placeholder = `${redirectUri}?code=demo&state=${state}`;
    const res = NextResponse.json({ authorizationUrl: placeholder });
    res.cookies.set('oauth_google_state', state, { httpOnly: true, path: '/', sameSite: 'lax' });
    res.cookies.set('oauth_google_verifier', verifier, { httpOnly: true, path: '/', sameSite: 'lax' });
    res.cookies.set('oauth_google_redirect', redirect, { httpOnly: true, path: '/', sameSite: 'lax' });
    return res;
  }
 
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
    scope,
    state,
    code_challenge: challenge,
    code_challenge_method: 'S256',
    prompt: 'select_account consent',
    max_age: '0',
  });
  const authorizationUrl = `${authUrl}?${params.toString()}`;
 
  const res = NextResponse.json({ authorizationUrl });
  res.cookies.set('oauth_google_state', state, { httpOnly: true, path: '/', sameSite: 'lax' });
  res.cookies.set('oauth_google_verifier', verifier, { httpOnly: true, path: '/', sameSite: 'lax' });
  res.cookies.set('oauth_google_redirect', redirect, { httpOnly: true, path: '/', sameSite: 'lax' });
  return res;
}
