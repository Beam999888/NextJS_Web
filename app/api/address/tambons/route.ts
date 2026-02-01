import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
    try {
        const provinceName = req.nextUrl.searchParams.get('province') || '';
        const amphoeName = req.nextUrl.searchParams.get('amphoe') || '';
        
        if (!provinceName || !amphoeName) return NextResponse.json([]);

        const filePath = path.join(process.cwd(), 'data', 'api_province_with_amphure_tambon.json');
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const provinces = JSON.parse(fileContent);

        const province = provinces.find((p: any) => p.name_th === provinceName);
        if (!province || !province.amphure) return NextResponse.json([]);

        const amphoe = province.amphure.find((a: any) => a.name_th === amphoeName);
        if (!amphoe || !amphoe.tambon) return NextResponse.json([]);

        const list = amphoe.tambon
            .map((t: any) => ({ name: t.name_th, zip: t.zip_code }))
            .sort((a: any, b: any) => a.name.localeCompare(b.name, 'th'));
            
        return NextResponse.json(list);
    } catch (error) {
        console.error('Error reading tambons:', error);
        return NextResponse.json({ error: 'failed_to_load_data' }, { status: 500 });
    }
}
