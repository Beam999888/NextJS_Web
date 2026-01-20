import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

type StoredUser = {
    id: string;
    email: string;
    name?: string;
    password: {
        salt: string;
        iterations: number;
        hash: string;
        digest: 'sha256';
    };
    createdAt: string;
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

function normalizeEmail(email: string) {
    return email.trim().toLowerCase();
}

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

function verifyPassword(inputPassword: string, user: StoredUser) {
    const salt = Buffer.from(user.password.salt, 'hex');
    const derived = crypto.pbkdf2Sync(inputPassword, salt, user.password.iterations, 32, user.password.digest);
    const expected = Buffer.from(user.password.hash, 'hex');
    if (expected.length !== derived.length) return false;
    return crypto.timingSafeEqual(expected, derived);
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

function pruneSessions(sessions: SessionRecord[]) {
    const now = Date.now();
    return sessions.filter((s) => {
        const exp = Date.parse(s.expiresAt);
        return Number.isFinite(exp) && exp > now;
    });
}

export async function POST(req: Request) {
    const body = (await req.json().catch(() => null)) as { email?: unknown; password?: unknown } | null;

    const email = typeof body?.email === 'string' ? normalizeEmail(body.email) : '';
    const password = typeof body?.password === 'string' ? body.password : '';

    if (!email || !password) {
        return NextResponse.json({ errorCode: 'INVALID_CREDENTIALS' }, { status: 401 });
    }

    const usersData = readJsonFile<UsersFile>(usersFilePath, { users: [] });
    const user = usersData.users.find((u) => normalizeEmail(u.email) === email);

    if (!user || !verifyPassword(password, user)) {
        return NextResponse.json({ errorCode: 'INVALID_CREDENTIALS' }, { status: 401 });
    }

    const sessionsData = readJsonFile<SessionsFile>(sessionsFilePath, { sessions: [] });
    const pruned = pruneSessions(sessionsData.sessions);
    const session = createSession(user.id);

    writeJsonFile(sessionsFilePath, { sessions: [{ token: session.token, userId: session.userId, createdAt: session.createdAt, expiresAt: session.expiresAt }, ...pruned] });

    const res = NextResponse.json({ ok: true, user: { id: user.id, email: user.email, name: user.name ?? '' } });
    res.cookies.set('site_session', session.token, {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        maxAge: session.maxAgeSeconds,
        secure: process.env.NODE_ENV === 'production',
    });
    return res;
}

