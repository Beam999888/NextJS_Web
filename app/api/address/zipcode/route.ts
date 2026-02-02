import { NextRequest, NextResponse } from 'next/server';
import provincesData from '@/data/api_province_with_amphure_tambon.json';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
    try {
        const zip = req.nextUrl.searchParams.get('zip');
        
        if (!zip) return NextResponse.json([]);

        const matches: any[] = [];

        (provincesData as any[]).forEach((p: any) => {
            if (p.amphure) {
                p.amphure.forEach((a: any) => {
                    if (a.tambon) {
                        a.tambon.forEach((t: any) => {
                            if (String(t.zip_code) === zip) {
                                matches.push({
                                    province: p.name_th,
                                    amphoe: a.name_th,
                                    tambon: t.name_th,
                                    zip: String(t.zip_code)
                                });
                            }
                        });
                    }
                });
            }
        });

        // Remove duplicates
        const uniqueMatches = Array.from(new Set(matches.map(m => JSON.stringify(m)))).map(s => JSON.parse(s));

        return NextResponse.json(uniqueMatches);
    } catch (error) {
        console.error('Error searching zipcode:', error);
        return NextResponse.json({ error: 'failed_to_search_zipcode' }, { status: 500 });
    }
}
