import fs from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

type SessionRecord = {
    token: string;
    userId: string;
    createdAt: string;
    expiresAt: string;
};

type SessionsFile = { sessions: SessionRecord[] };

const sessionsFilePath = path.join(process.cwd(), 'data', 'sessions.json');

function readSessions(): SessionsFile {
    try {
        if (!fs.existsSync(sessionsFilePath)) return { sessions: [] };
        const raw = fs.readFileSync(sessionsFilePath, 'utf8');
        const parsed = JSON.parse(raw) as SessionsFile;
        if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.sessions)) return { sessions: [] };
        return { sessions: parsed.sessions.filter((s) => !!s && typeof s === 'object') as SessionRecord[] };
    } catch {
        return { sessions: [] };
    }
}

function writeSessions(data: SessionsFile) {
    fs.writeFileSync(sessionsFilePath, JSON.stringify(data, null, 2));
}

export async function POST(req: NextRequest) {
    const token = req.cookies.get('site_session')?.value;
    if (token) {
        const data = readSessions();
        const next = data.sessions.filter((s) => s.token !== token);
        if (next.length !== data.sessions.length) {
            writeSessions({ sessions: next });
        }
    }

    const res = NextResponse.json({ ok: true });
    res.cookies.set('site_session', '', { path: '/', maxAge: 0 });
    return res;
}

