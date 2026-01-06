import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type VisitorStatsFile = {
    totalViews: number;
    online?: Record<string, number>;
    sessions?: Record<string, number>;
};

const repoDataFilePath = path.join(process.cwd(), 'data', 'stats.json');
const tmpDir = process.env.TMPDIR || process.env.TEMP || process.env.TMP || '/tmp';
const tmpDataFilePath = path.join(tmpDir, 'stats.json');
const onlineTtlMs = 45_000;
const sessionTtlMs = 30 * 60 * 1000;
const sessionRetentionMs = 7 * 24 * 60 * 60 * 1000;
let activeDataFilePath: string | null = null;
let memoryData: VisitorStatsFile | null = null;

function getDefaultData(): VisitorStatsFile {
    return { totalViews: 0, online: {} };
}

function normalizeData(parsed: Partial<VisitorStatsFile>): VisitorStatsFile {
    return {
        totalViews: typeof parsed.totalViews === 'number' ? parsed.totalViews : 0,
        online: parsed.online && typeof parsed.online === 'object' ? (parsed.online as Record<string, number>) : {},
        sessions: parsed.sessions && typeof parsed.sessions === 'object' ? (parsed.sessions as Record<string, number>) : {},
    };
}

function readFromPath(filePath: string): VisitorStatsFile | null {
    try {
        if (!fs.existsSync(filePath)) return null;
        const raw = fs.readFileSync(filePath, 'utf8');
        const parsed = JSON.parse(raw) as Partial<VisitorStatsFile>;
        return normalizeData(parsed);
    } catch {
        return null;
    }
}

function readData(): VisitorStatsFile {
    const activePath = activeDataFilePath;
    if (activePath) {
        const activeData = readFromPath(activePath);
        if (activeData) return activeData;
    }

    const tmpData = readFromPath(tmpDataFilePath);
    if (tmpData) {
        activeDataFilePath = tmpDataFilePath;
        return tmpData;
    }

    const repoData = readFromPath(repoDataFilePath);
    if (repoData) {
        activeDataFilePath = tmpDataFilePath;
        memoryData = repoData;
        return repoData;
    }

    return memoryData ?? getDefaultData();
}

function writeData(data: VisitorStatsFile) {
    const payload = JSON.stringify(data, null, 2);
    const primary = tmpDataFilePath;

    try {
        fs.writeFileSync(primary, payload);
        activeDataFilePath = primary;
        memoryData = null;
        return;
    } catch {
    }

    memoryData = data;
}

function cleanOnline(online: Record<string, number>, now: number) {
    for (const [id, lastSeen] of Object.entries(online)) {
        if (typeof lastSeen !== 'number' || now - lastSeen > onlineTtlMs) {
            delete online[id];
        }
    }
}

function cleanSessions(sessions: Record<string, number>, now: number) {
    for (const [id, lastCounted] of Object.entries(sessions)) {
        if (typeof lastCounted !== 'number' || now - lastCounted > sessionRetentionMs) {
            delete sessions[id];
        }
    }
}

function getOrCreateVisitorId(req: NextRequest) {
    const fromHeader = req.headers.get('x-visitor-id');
    if (fromHeader && fromHeader.length > 0 && fromHeader.length <= 128) return fromHeader;
    const existing = req.cookies.get('visitor_id')?.value;
    if (existing && existing.length > 0) return existing;
    if (typeof crypto?.randomUUID === 'function') return crypto.randomUUID();
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export async function GET() {
    const data = readData();
    const online = data.online ?? {};
    const now = Date.now();
    const beforeCount = Object.keys(online).length;
    cleanOnline(online, now);
    const afterCount = Object.keys(online).length;
    if (afterCount !== beforeCount) writeData({ ...data, online });
    return NextResponse.json({ totalViews: data.totalViews, onlineCount: Object.keys(online).length });
}

export async function POST(req: NextRequest) {
    const now = Date.now();
    const visitorId = getOrCreateVisitorId(req);
    const body = (await req.json().catch(() => ({}))) as { type?: 'hit' | 'heartbeat' };
    const type = body?.type === 'heartbeat' ? 'heartbeat' : 'hit';

    const data = readData();
    const online = data.online ?? {};
    const sessions = data.sessions ?? {};
    cleanOnline(online, now);
    cleanSessions(sessions, now);
    online[visitorId] = now;
    data.online = online;
    data.sessions = sessions;

    if (type === 'hit') {
        const lastCountedAt = sessions[visitorId];
        const shouldCount = typeof lastCountedAt !== 'number' || now - lastCountedAt > sessionTtlMs;
        if (shouldCount) {
            data.totalViews = (data.totalViews ?? 0) + 1;
            sessions[visitorId] = now;
        }
    }

    writeData(data);

    const res = NextResponse.json({ totalViews: data.totalViews, onlineCount: Object.keys(online).length });
    if (!req.cookies.get('visitor_id')?.value) {
        res.cookies.set('visitor_id', visitorId, {
            path: '/',
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 365,
        });
    }
    return res;
}
