import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getPool } from '../address/_db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type VisitorStatsFile = {
    totalViews: number;
    online?: Record<string, number>;
};

const repoDataFilePath = path.join(process.cwd(), 'data', 'stats.json');
const tmpDir = process.env.TMPDIR || process.env.TEMP || process.env.TMP || '/tmp';
const tmpDataFilePath = path.join(tmpDir, 'stats.json');
const onlineTtlMs = 45_000;
let activeDataFilePath: string | null = null;
let memoryData: VisitorStatsFile | null = null;

// Database Helper
async function getDBStats(): Promise<number | null> {
    try {
        const pool = getPool();
        // Create table if not exists
        await pool.query(`
            CREATE TABLE IF NOT EXISTS site_stats (
                id INT PRIMARY KEY,
                total_views INT DEFAULT 0
            )
        `);
        // Ensure initial row exists
        await pool.query(`INSERT IGNORE INTO site_stats (id, total_views) VALUES (1, 0)`);
        
        const [rows] = await pool.query('SELECT total_views FROM site_stats WHERE id = 1');
        const result = rows as any[];
        if (result.length > 0) {
            return result[0].total_views;
        }
        return 0;
    } catch (error) {
        // console.error('DB Read Error:', error);
        return null;
    }
}

async function updateDBStats(totalViews: number): Promise<void> {
    try {
        const pool = getPool();
        await pool.query('UPDATE site_stats SET total_views = ? WHERE id = 1', [totalViews]);
    } catch (error) {
        // console.error('DB Write Error:', error);
    }
}

function getDefaultData(): VisitorStatsFile {
    return { totalViews: 0, online: {} };
}

function normalizeData(parsed: Partial<VisitorStatsFile>): VisitorStatsFile {
    return {
        totalViews: typeof parsed.totalViews === 'number' ? parsed.totalViews : 0,
        online: parsed.online && typeof parsed.online === 'object' ? (parsed.online as Record<string, number>) : {},
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

async function readData(): Promise<VisitorStatsFile> {
    // Try DB first for totalViews
    const dbViews = await getDBStats();
    
    // Read local/tmp file for online users and fallback views
    let localData: VisitorStatsFile = memoryData ?? getDefaultData();
    
    const activePath = activeDataFilePath;
    if (activePath) {
        const activeData = readFromPath(activePath);
        if (activeData) localData = activeData;
    } else {
        const tmpData = readFromPath(tmpDataFilePath);
        if (tmpData) {
            activeDataFilePath = tmpDataFilePath;
            localData = tmpData;
        } else {
            const repoData = readFromPath(repoDataFilePath);
            if (repoData) {
                activeDataFilePath = tmpDataFilePath;
                localData = repoData;
            }
        }
    }
    
    memoryData = localData;

    // Merge DB views if available
    if (dbViews !== null) {
        localData.totalViews = dbViews;
    }

    return localData;
}

async function writeData(data: VisitorStatsFile) {
    // Write to DB
    await updateDBStats(data.totalViews);

    // Write to File (for online users and fallback)
    const payload = JSON.stringify(data, null, 2);
    const primary = tmpDataFilePath;

    try {
        fs.writeFileSync(primary, payload);
        activeDataFilePath = primary;
        memoryData = data;
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

function getOrCreateVisitorId(req: NextRequest) {
    const fromHeader = req.headers.get('x-visitor-id');
    if (fromHeader && fromHeader.length > 0 && fromHeader.length <= 128) return fromHeader;
    const existing = req.cookies.get('visitor_id')?.value;
    if (existing && existing.length > 0) return existing;
    if (typeof crypto?.randomUUID === 'function') return crypto.randomUUID();
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export async function GET() {
    const data = await readData();
    const online = data.online ?? {};
    const now = Date.now();
    const beforeCount = Object.keys(online).length;
    cleanOnline(online, now);
    const afterCount = Object.keys(online).length;
    if (afterCount !== beforeCount) await writeData({ ...data, online });
    return NextResponse.json({ totalViews: data.totalViews, onlineCount: Object.keys(online).length });
}

export async function POST(req: NextRequest) {
    const now = Date.now();
    const visitorId = getOrCreateVisitorId(req);
    const body = (await req.json().catch(() => ({}))) as { type?: 'hit' | 'heartbeat' };
    const type = body?.type === 'heartbeat' ? 'heartbeat' : 'hit';

    const data = await readData();
    const online = data.online ?? {};
    cleanOnline(online, now);
    online[visitorId] = now;
    data.online = online;

    if (type === 'hit') data.totalViews = (data.totalViews ?? 0) + 1;

    await writeData(data);

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
