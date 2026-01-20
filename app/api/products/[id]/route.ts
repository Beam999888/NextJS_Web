import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'products.json');

type ProductsFileData = unknown[] | { products?: unknown[] };

type ProductRecord = Record<string, unknown> & { id?: number };

function getProducts(): ProductRecord[] {
    if (!fs.existsSync(dataFilePath)) return [];
    const fileData = fs.readFileSync(dataFilePath, 'utf8');
    const parsed = JSON.parse(fileData) as ProductsFileData;
    const list = Array.isArray(parsed) ? parsed : (Array.isArray(parsed?.products) ? parsed.products : []);
    return list.filter((p): p is ProductRecord => !!p && typeof p === 'object');
}

function saveProducts(products: ProductRecord[]) {
    const existing = fs.existsSync(dataFilePath)
        ? (JSON.parse(fs.readFileSync(dataFilePath, 'utf8')) as ProductsFileData)
        : null;

    if (existing && !Array.isArray(existing)) {
        const nextData = { ...(existing as Record<string, unknown>), products };
        fs.writeFileSync(dataFilePath, JSON.stringify(nextData, null, 2));
        return;
    }

    fs.writeFileSync(dataFilePath, JSON.stringify(products, null, 2));
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> } // params is a Promise in Next.js 15+
) {
    try {
        const { id } = await params; // Await params
        const products = getProducts();
        const productId = parseInt(id);

        const filteredProducts = products.filter((p) => p.id !== productId);

        if (products.length === filteredProducts.length) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        saveProducts(filteredProducts);
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = (await request.json()) as Record<string, unknown>;
        const products = getProducts();
        const productId = parseInt(id);

        const index = products.findIndex((p) => p.id === productId);
        if (index === -1) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        // Update preserving createdAt and ID
        products[index] = {
            ...products[index],
            ...body,
            id: productId, // Maintain original ID
            updatedAt: new Date().toISOString()
        };

        saveProducts(products);
        return NextResponse.json(products[index]);
    } catch {
        return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
    }
}
