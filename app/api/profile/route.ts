import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'profile.json');

// Helper to read data
function getProfile() {
    if (!fs.existsSync(dataFilePath)) {
        // Return default structure if file doesn't exist
        return {
            name: "Anukun Boontha (Daniel)",
            bio: "",
            education: {},
            contact: {},
            learning: [],
            tools: []
        };
    }
    const fileData = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(fileData);
}

// Helper to write data
function saveProfile(data: any) {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
}

export async function GET() {
    const profile = getProfile();
    return NextResponse.json(profile);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const currentProfile = getProfile();

        // Merge updates
        const updatedProfile = { ...currentProfile, ...body };

        saveProfile(updatedProfile);

        return NextResponse.json(updatedProfile);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save profile' }, { status: 500 });
    }
}
