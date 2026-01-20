import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '../_db';
import type { RowDataPacket } from 'mysql2/promise';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
    try {
        const province = req.nextUrl.searchParams.get('province') || '';
        const amphoe = req.nextUrl.searchParams.get('amphoe') || '';
        if (!province || !amphoe) return NextResponse.json([]);
        const pool = getPool();
        const sql = `
            SELECT t.name_th AS name, t.zip_code AS zip 
            FROM tambons t 
            JOIN amphoes a ON t.amphoe_id = a.id 
            JOIN provinces p ON a.province_id = p.id
            WHERE p.name_th = ? AND a.name_th = ?
            ORDER BY t.name_th
        `;
        interface TambonRow extends RowDataPacket { name: string; zip: string }
        const [rows] = await pool.query<TambonRow[]>(sql, [province, amphoe]);
        return NextResponse.json(rows);
    } catch {
        return NextResponse.json({ error: 'db_unavailable' }, { status: 500 });
    }
}
