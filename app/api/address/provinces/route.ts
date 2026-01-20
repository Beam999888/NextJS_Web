import { NextResponse } from 'next/server';
import { getPool } from '../_db';
import type { RowDataPacket } from 'mysql2/promise';

export const runtime = 'nodejs';

export async function GET() {
    try {
        const pool = getPool();
        interface ProvinceRow extends RowDataPacket { name_th: string }
        const [rows] = await pool.query<ProvinceRow[]>('SELECT name_th FROM provinces ORDER BY name_th');
        const list = rows.map((r) => r.name_th);
        return NextResponse.json(list);
    } catch {
        return NextResponse.json({ error: 'db_unavailable' }, { status: 500 });
    }
}
