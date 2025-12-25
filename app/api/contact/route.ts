import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'contact.json');

export async function GET() {
    try {
        if (!fs.existsSync(filePath)) {
            return NextResponse.json({
                title: "Get in Touch",
                intro: "I'm Anukun Boontha. Feel free to reach out for collaborations or just a friendly hello.",
                email: "anukun25499@gmail.com",
                university: "Suan Dusit University",
                location: "Bangkok, Thailand",
                image: "/profile-contact.png",
                footerLogo: "",
                footerBg: "",
                socials: { facebook: "", instagram: "", tiktok: "" }
            });
        }
        const fileData = fs.readFileSync(filePath, 'utf8');
        return NextResponse.json(JSON.parse(fileData));
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch contact data' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        fs.writeFileSync(filePath, JSON.stringify(body, null, 2));
        return NextResponse.json({ message: 'Success' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update contact data' }, { status: 500 });
    }
}
