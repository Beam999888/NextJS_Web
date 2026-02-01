import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
    try {
        const provinceName = req.nextUrl.searchParams.get('province') || '';
        if (!provinceName) return NextResponse.json([], { status: 200 });

        const filePath = path.join(process.cwd(), 'data', 'api_province_with_amphure_tambon.json');
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const provinces = JSON.parse(fileContent);

        const province = provinces.find((p: any) => p.name_th === provinceName);
        if (!province || !province.amphure) return NextResponse.json([], { status: 200 });

        const list = province.amphure.map((a: any) => a.name_th).sort((a: string, b: string) => a.localeCompare(b, 'th'));
        return NextResponse.json(list);
    } catch (error) {
        console.error('Error reading amphoes:', error);
        return NextResponse.json({ error: 'failed_to_load_data' }, { status: 500 });
    }
}
