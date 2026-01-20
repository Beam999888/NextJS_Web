import fs from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';

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

function readJsonFile<T>(filePath: string, fallback: T): T {
    try {
        if (!fs.existsSync(filePath)) return fallback;
        const raw = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(raw) as T;
    } catch {
        return fallback;
    }
}

function normalizeEmail(email: string) {
    return email.trim().toLowerCase();
}

function getSessionUserId(token: string | undefined) {
    if (!token) return null;
    const sessions = readJsonFile<SessionsFile>(sessionsFilePath, { sessions: [] }).sessions;
    const now = Date.now();
    const match = sessions.find((s) => s.token === token);
    if (!match) return null;
    const exp = Date.parse(match.expiresAt);
    if (!Number.isFinite(exp) || exp <= now) return null;
    return match.userId;
}

export async function GET(req: NextRequest) {
    const token = req.cookies.get('site_session')?.value;
    const userId = getSessionUserId(token);
    if (!userId) return NextResponse.json({ authenticated: false });

    const users = readJsonFile<UsersFile>(usersFilePath, { users: [] }).users;
    const user = users.find((u) => u.id === userId);
    if (!user) return NextResponse.json({ authenticated: false });

    return NextResponse.json({ authenticated: true, user: { id: user.id, email: normalizeEmail(user.email), name: user.name ?? '' } });
}

