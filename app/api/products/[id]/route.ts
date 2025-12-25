import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'products.json');

function getProducts() {
    if (!fs.existsSync(dataFilePath)) return [];
    const fileData = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(fileData);
}

function saveProducts(products: any[]) {
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

        const filteredProducts = products.filter((p: any) => p.id !== productId);

        if (products.length === filteredProducts.length) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        saveProducts(filteredProducts);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const products = getProducts();
        const productId = parseInt(id);

        const index = products.findIndex((p: any) => p.id === productId);
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
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
    }
}
