import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { writeFile } from 'fs/promises';

export const runtime = 'nodejs';

export async function POST(request: Request) {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
        return NextResponse.json({ success: false, message: 'No file uploaded' }, { status: 400 });
    }

    const maxBytes = 50 * 1024 * 1024;
    if (typeof file.size === 'number' && file.size > maxBytes) {
        return NextResponse.json(
            { success: false, message: 'File too large (max 50MB)', maxBytes },
            { status: 413 }
        );
    }

    const originalName = typeof file.name === 'string' && file.name.length > 0 ? file.name : 'upload';
    const baseName = path.basename(originalName);
    const safeBaseName = baseName
        .replace(/\s+/g, '-')
        .replace(/[^a-zA-Z0-9._-]/g, '');
    const ext = path.extname(safeBaseName).toLowerCase();

    const isImage = typeof file.type === 'string' && file.type.startsWith('image/');
    const isMp4 = typeof file.type === 'string' && file.type === 'video/mp4';
    const isAllowedByExtension =
        file.type === '' && (ext === '.mp4' || ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg'].includes(ext));

    if (!isImage && !isMp4 && !isAllowedByExtension) {
        return NextResponse.json(
            { success: false, message: 'Unsupported file type (allowed: images, mp4)' },
            { status: 415 }
        );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure uploads directory exists
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Create unique filename
    const filename = `${Date.now()}-${safeBaseName || 'upload'}`;
    const filepath = path.join(uploadDir, filename);

    await writeFile(filepath, buffer);

    const publicUrl = `/uploads/${filename}`;

    return NextResponse.json({ success: true, url: publicUrl });
}
