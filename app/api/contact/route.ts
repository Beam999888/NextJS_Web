import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'contact.json');

function getDefaultContact() {
    return {
        title: "Get in Touch",
        intro: "I'm Anukun Boontha. Feel free to reach out for collaborations or just a friendly hello.",
        email: "anukun25499@gmail.com",
        university: "Suan Dusit University",
        location: "Bangkok, Thailand",
        image: "/profile-contact.png",
        footerLogo: "/logo.png",
        footerBg: "/forest.png",
        footerOverlayOpacity: 20,
        footerName: "Anukun Boontha",
        footerRole: "",
        footerRights: "© 2025 All Rights Reserved.",
        footerDesignedBy: "Designed by Anukun",
        socials: { facebook: "", instagram: "", tiktok: "", github: "", linkedin: "" }
    };
}

export async function GET() {
    try {
        if (!fs.existsSync(filePath)) {
            return NextResponse.json(getDefaultContact());
        }
        const fileData = fs.readFileSync(filePath, 'utf8');
        const parsed = JSON.parse(fileData) as Record<string, unknown>;
        const defaults = getDefaultContact();
        const merged = { ...defaults, ...parsed } as Record<string, unknown>;
        const mergedSocials = { ...(defaults.socials || {}), ...((parsed?.socials as Record<string, unknown>) || {}) };
        merged.socials = mergedSocials;
        return NextResponse.json(merged);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch contact data' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const defaults = getDefaultContact();
        let current: Record<string, unknown> = {};
        try {
            if (fs.existsSync(filePath)) {
                current = JSON.parse(fs.readFileSync(filePath, 'utf8')) as Record<string, unknown>;
            }
        } catch {
            current = {};
        }

        const merged = { ...defaults, ...current, ...body } as Record<string, unknown>;
        const currentSocials =
            typeof current.socials === 'object' && current.socials !== null ? (current.socials as Record<string, unknown>) : {};
        const bodySocials =
            typeof (body as Record<string, unknown>).socials === 'object' && (body as Record<string, unknown>).socials !== null
                ? ((body as Record<string, unknown>).socials as Record<string, unknown>)
                : {};
        const mergedSocials = {
            ...(defaults.socials || {}),
            ...currentSocials,
            ...bodySocials
        };
        merged.socials = mergedSocials;

        fs.writeFileSync(filePath, JSON.stringify(merged, null, 2));
        return NextResponse.json(merged);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update contact data' }, { status: 500 });
    }
}
