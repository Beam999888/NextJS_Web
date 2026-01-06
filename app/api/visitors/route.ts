import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

type VisitorStatsFile = {
    totalViews: number;
    online?: Record<string, number>;
};

const dataFilePath = path.join(process.cwd(), 'data', 'stats.json');
const onlineTtlMs = 45_000;

function getDefaultData(): VisitorStatsFile {
    return { totalViews: 0, online: {} };
}

function readData(): VisitorStatsFile {
    try {
        if (!fs.existsSync(dataFilePath)) return getDefaultData();
        const raw = fs.readFileSync(dataFilePath, 'utf8');
        const parsed = JSON.parse(raw) as Partial<VisitorStatsFile>;
        return {
            totalViews: typeof parsed.totalViews === 'number' ? parsed.totalViews : 0,
            online: parsed.online && typeof parsed.online === 'object' ? (parsed.online as Record<string, number>) : {},
        };
    } catch {
        return getDefaultData();
    }
}

function writeData(data: VisitorStatsFile) {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
}

function cleanOnline(online: Record<string, number>, now: number) {
    for (const [id, lastSeen] of Object.entries(online)) {
        if (typeof lastSeen !== 'number' || now - lastSeen > onlineTtlMs) {
            delete online[id];
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
    cleanOnline(online, now);
    online[visitorId] = now;
    data.online = online;

    if (type === 'hit') data.totalViews = (data.totalViews ?? 0) + 1;

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
