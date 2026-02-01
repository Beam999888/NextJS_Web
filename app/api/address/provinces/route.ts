import { NextResponse } from 'next/server';
import provincesData from '@/data/api_province_with_amphure_tambon.json';

export const runtime = 'nodejs';

export async function GET() {
    try {
        const list = (provincesData as any[]).map((p: any) => p.name_th).sort((a: string, b: string) => a.localeCompare(b, 'th'));
        return NextResponse.json(list);
    } catch (error) {
        console.error('Error reading provinces:', error);
        return NextResponse.json({ error: 'failed_to_load_data' }, { status: 500 });
    }
}
