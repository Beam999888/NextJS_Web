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

const usersFilePath = path.join(process.cwd(), 'data', 'users.json');

function normalizeEmail(email: string) {
    return email.trim().toLowerCase();
}

function isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function readUsers(): UsersFile {
    try {
        if (!fs.existsSync(usersFilePath)) return { users: [] };
        const raw = fs.readFileSync(usersFilePath, 'utf8');
        const parsed = JSON.parse(raw) as UsersFile;
        if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.users)) return { users: [] };
        return { users: parsed.users.filter((u) => !!u && typeof u === 'object') as StoredUser[] };
    } catch {
        return { users: [] };
    }
}

function writeUsers(data: UsersFile) {
    fs.writeFileSync(usersFilePath, JSON.stringify(data, null, 2));
}

function hashPassword(password: string) {
    const salt = crypto.randomBytes(16);
    const iterations = 100_000;
    const digest = 'sha256' as const;
    const derived = crypto.pbkdf2Sync(password, salt, iterations, 32, digest);
    return { salt: salt.toString('hex'), iterations, digest, hash: derived.toString('hex') };
}

export async function POST(req: Request) {
    const body = (await req.json().catch(() => null)) as { name?: unknown; email?: unknown; password?: unknown } | null;

    const name = typeof body?.name === 'string' ? body.name.trim() : '';
    const email = typeof body?.email === 'string' ? normalizeEmail(body.email) : '';
    const password = typeof body?.password === 'string' ? body.password : '';

    if (!name || !email || !isValidEmail(email) || password.length < 6) {
        return NextResponse.json({ errorCode: 'GENERIC' }, { status: 400 });
    }

    const usersData = readUsers();
    const exists = usersData.users.some((u) => normalizeEmail(u.email) === email);
    if (exists) {
        return NextResponse.json({ errorCode: 'USER_EXISTS' }, { status: 409 });
    }

    const id = typeof crypto?.randomUUID === 'function' ? crypto.randomUUID() : `${Date.now()}-${crypto.randomBytes(8).toString('hex')}`;
    const createdAt = new Date().toISOString();
    const passwordData = hashPassword(password);

    const user: StoredUser = {
        id,
        email,
        name,
        password: passwordData,
        createdAt,
    };

    writeUsers({ users: [user, ...usersData.users] });
    return NextResponse.json({ ok: true });
}
