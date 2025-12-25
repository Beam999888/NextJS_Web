import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'home.json');

function getHomeData() {
    if (!fs.existsSync(dataFilePath)) {
        return { sliderImages: [] };
    }
    const fileData = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(fileData);
}

function saveHomeData(data: any) {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
}

export async function GET() {
    return NextResponse.json(getHomeData());
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const currentData = getHomeData();
        const updatedData = { ...currentData, ...body };
        saveHomeData(updatedData);
        return NextResponse.json(updatedData);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update home data' }, { status: 500 });
    }
}
