import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

export const runtime = 'nodejs';

export async function GET() {
    try {
        const filePath = path.join(process.cwd(), 'data', 'api_province_with_amphure_tambon.json');
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const provinces = JSON.parse(fileContent);
        
        const list = provinces.map((p: any) => p.name_th).sort((a: string, b: string) => a.localeCompare(b, 'th'));
        return NextResponse.json(list);
    } catch (error) {
        console.error('Error reading provinces:', error);
        return NextResponse.json({ error: 'failed_to_load_data' }, { status: 500 });
    }
}
