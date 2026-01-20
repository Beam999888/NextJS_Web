import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '../_db';
import type { RowDataPacket } from 'mysql2/promise';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
    try {
        const province = req.nextUrl.searchParams.get('province') || '';
        if (!province) return NextResponse.json([], { status: 200 });
        const pool = getPool();
        const sql = `
            SELECT a.name_th 
            FROM amphoes a 
            JOIN provinces p ON a.province_id = p.id 
            WHERE p.name_th = ? 
            ORDER BY a.name_th
        `;
        interface AmphoeRow extends RowDataPacket { name_th: string }
        const [rows] = await pool.query<AmphoeRow[]>(sql, [province]);
        const list = rows.map((r) => r.name_th);
        return NextResponse.json(list);
    } catch {
        return NextResponse.json({ error: 'db_unavailable' }, { status: 500 });
    }
}
