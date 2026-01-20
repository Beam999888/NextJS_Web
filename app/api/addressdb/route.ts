import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

type Row = { province: string; amphoe: string; district: string; zipcode: string };

let cached: Array<Row> | null = null;
let cachedAt = 0;

async function fetchEarthchie(): Promise<Array<Row>> {
    const primary = 'https://raw.githubusercontent.com/earthchie/jquery.Thailand/master/jquery.Thailand.js/database/db.json';
    const fallback = 'https://cdn.jsdelivr.net/gh/earthchie/jquery.Thailand@master/jquery.Thailand.js/database/db.json';
    try {
        const res = await fetch(primary, { cache: 'no-store' });
        if (res.ok) return (await res.json()) as Array<Row>;
    } catch {}
    const res2 = await fetch(fallback, { cache: 'no-store' });
    if (res2.ok) return (await res2.json()) as Array<Row>;
    throw new Error('earthchie_failed');
}

async function fetchKongvut(): Promise<Array<Row>> {
    const url = 'https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_province_with_amphure_tambon.json';
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error('kongvut_failed');
    const j = (await res.json()) as unknown;
    if (!Array.isArray(j)) throw new Error('kongvut_invalid');
    const out: Array<Row> = [];
    for (const p of j as Array<Record<string, unknown>>) {
        const provNameRaw = p['name_th'] ?? p['name'] ?? p['province'];
        const amphuresRaw = p['amphure'] ?? p['amphures'];
        const provName = typeof provNameRaw === 'string' ? provNameRaw : '';
        const amphures = Array.isArray(amphuresRaw) ? (amphuresRaw as Array<Record<string, unknown>>) : [];
        if (!provName || amphures.length === 0) continue;
        for (const a of amphures) {
            const amphNameRaw = a['name_th'] ?? a['name'] ?? a['amphure'];
            const tambonsRaw = a['tambon'] ?? a['district'] ?? a['districts'];
            const amphName = typeof amphNameRaw === 'string' ? amphNameRaw : '';
            const tambons = Array.isArray(tambonsRaw) ? (tambonsRaw as Array<Record<string, unknown>>) : [];
            if (!amphName || tambons.length === 0) continue;
            for (const t of tambons) {
                const tamNameRaw = t['name_th'] ?? t['name'] ?? t['district'];
                const zipRaw = t['zip_code'] ?? t['zipcode'] ?? t['post_code'];
                const tamName = typeof tamNameRaw === 'string' ? tamNameRaw : '';
                const zip = typeof zipRaw === 'string' || typeof zipRaw === 'number' ? String(zipRaw) : '';
                if (!tamName) continue;
                out.push({ province: provName, amphoe: amphName, district: tamName, zipcode: zip });
            }
        }
    }
    if (out.length === 0) throw new Error('kongvut_empty');
    return out;
}

async function fetchRemote(): Promise<Array<Row>> {
    try {
        return await fetchEarthchie();
    } catch {}
    return await fetchKongvut();
}

export async function GET() {
    try {
        const now = Date.now();
        if (!cached || now - cachedAt > 12 * 60 * 60 * 1000) {
            cached = await fetchRemote();
            cachedAt = now;
        }
        return NextResponse.json(cached);
    } catch {
        return NextResponse.json({ error: 'address_db_unavailable' }, { status: 500 });
    }
}
