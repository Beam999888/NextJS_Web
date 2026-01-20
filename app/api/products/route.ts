import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'products.json');

const FALLBACK_DATA = {
    title: "Selected Works",
    description: "A collection of projects exploring security vulnerabilities and defensive strategies.",
    products: []
};

// Helper to read data
function getProductsData() {
    if (!fs.existsSync(dataFilePath)) {
        return FALLBACK_DATA;
    }
    const fileData = fs.readFileSync(dataFilePath, 'utf8');
    try {
        const parsed = JSON.parse(fileData);
        // If it's still an array (old format), convert it
        if (Array.isArray(parsed)) {
            return { ...FALLBACK_DATA, products: parsed };
        }
        return parsed;
    } catch {
        return FALLBACK_DATA;
    }
}

interface Product {
    id: number;
    title?: string;
    description?: string;
    imageUrls?: string[];
    createdAt?: string;
    updatedAt?: string;
    [key: string]: unknown;
}

interface ProductsData {
    title: string;
    description: string;
    products: Product[];
}

// Helper to write data
function saveProductsData(data: unknown) {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
}

export async function GET() {
    return NextResponse.json(getProductsData());
}

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as Partial<Product> & { updateMeta?: boolean; title?: string; description?: string };
        const data = getProductsData() as ProductsData;

        // Check if it's a metadata update (has title/description but not a single product structure)
        if (body.updateMeta) {
            data.title = body.title || data.title;
            data.description = body.description || data.description;
            saveProductsData(data);
            return NextResponse.json(data);
        }

        // Otherwise, it's a new product
        const newProduct: Product = {
            id: Date.now(),
            ...body,
            updateMeta: undefined,
            createdAt: new Date().toISOString(),
        };

        data.products.unshift(newProduct);
        saveProductsData(data);

        return NextResponse.json(newProduct, { status: 201 });
    } catch {
        return NextResponse.json({ error: 'Failed to save product/metadata' }, { status: 500 });
    }
}
