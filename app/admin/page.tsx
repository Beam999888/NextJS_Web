'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Product {
    id: number;
    title: string;
    imageUrls: string[];
}

export default function AdminPage() {
    // Product State
    const [products, setProducts] = useState<Product[]>([]);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [files, setFiles] = useState<FileList | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    // Metadata State (Grid Header)
    const [metaTitle, setMetaTitle] = useState('');
    const [metaDescription, setMetaDescription] = useState('');
    const [metaProcessing, setMetaProcessing] = useState(false);

    // Fetch products on load
    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/products');
            const data = await res.json();
            setProducts(data.products || []);
            setMetaTitle(data.title || '');
            setMetaDescription(data.description || '');
        } catch (error) {
            console.error('Failed to fetch products', error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(e.target.files);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchProducts(); // Refresh list
            } else {
                alert('Failed to delete');
            }
        } catch (error) {
            alert('Error deleting product');
        }
    };

    const handleEdit = (product: Product & { description: string }) => {
        setEditingProduct(product);
        setTitle(product.title);
        setDescription(product.description);
        // Clear files since we might not want to re-upload if not changed
        setFiles(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setEditingProduct(null);
        setTitle('');
        setDescription('');
        setFiles(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // If adding new, files are required. If editing, files are optional unless changing images.
        if (!title || !description || (!editingProduct && (!files || files.length === 0))) {
            setMessage('Please fill in all fields and select at least one image/video');
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            let imageUrls: string[] = editingProduct ? (editingProduct as any).imageUrls : [];

            // 1. Upload Images if new files are selected
            if (files && files.length > 0) {
                const uploadPromises = Array.from(files).map(async (file) => {
                    const formData = new FormData();
                    formData.append('file', file);
                    const res = await fetch('/api/upload', { method: 'POST', body: formData });
                    const data = await res.json();
                    return data.url;
                });

                const uploadedUrls = await Promise.all(uploadPromises);

                if (editingProduct) {
                    // If editing, we append or replace? Let's replace for simplicity or keep original and append.
                    // User probably wants to ADD images or replace. Let's replace if files are uploaded for now.
                    imageUrls = uploadedUrls;
                } else {
                    imageUrls = uploadedUrls;
                }
            }

            // 2. Save/Update Product Info
            const method = editingProduct ? 'PATCH' : 'POST';
            const endpoint = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';

            const productRes = await fetch(endpoint, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    description,
                    imageUrls,
                }),
            });

            if (!productRes.ok) {
                throw new Error('Failed to save product');
            }

            setMessage(editingProduct ? 'Success! Product updated.' : 'Success! Product added.');
            setTitle('');
            setDescription('');
            setFiles(null);
            setEditingProduct(null);

            // Reset file input manually
            const fileInput = document.getElementById('fileInput') as HTMLInputElement;
            if (fileInput) fileInput.value = '';

            fetchProducts(); // Refresh list

        } catch (error) {
            console.error(error);
            setMessage('Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateMeta = async (e: React.FormEvent) => {
        e.preventDefault();
        setMetaProcessing(true);
        try {
            const res = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    updateMeta: true,
                    title: metaTitle,
                    description: metaDescription
                }),
            });
            if (res.ok) setMessage('Header updated!');
        } catch (error) {
            setMessage('Failed to update header');
        } finally {
            setMetaProcessing(false);
        }
    };

    const isVideo = (url: string) => {
        return url.match(/\.(mp4|webm|ogg)$/i);
    };

    return (
        <div className="container mx-auto px-6 py-24 max-w-5xl font-['Prompt',sans-serif]">
            {/* Premium Header with Dropdown */}
            <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between mb-16 relative">
                <h1 className="text-5xl font-['Tenor_Sans',serif] tracking-tight">Admin</h1>
            </div>

            <div className="grid lg:grid-cols-2 gap-16 animate-fade-in items-start">

                {/* Left Side: Forms */}
                <div className="space-y-12">
                    {/* Grid Header Form */}
                    <section className="bg-white/40 p-10 rounded-[2.5rem] border border-black/5">
                        <h2 className="text-2xl font-bold mb-8">Grid Header Settings</h2>
                        <form onSubmit={handleUpdateMeta} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Grid Title</label>
                                <input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} placeholder="e.g., Selected Works" className="w-full border-b border-gray-200 py-3 bg-transparent focus:border-black outline-none transition-all placeholder:text-gray-300" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Grid Description</label>
                                <textarea value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} placeholder="Subtitle for the grid..." rows={3} className="w-full border-b border-gray-200 py-3 bg-transparent focus:border-black outline-none transition-all placeholder:text-gray-300 resize-none" />
                            </div>
                            <button type="submit" disabled={metaProcessing} className="w-full bg-black text-white py-4 rounded-2xl text-[10px] font-bold uppercase tracking-[0.25em] hover:bg-gray-800 transition-all shadow-xl">
                                {metaProcessing ? 'Saving...' : 'Save Header Settings'}
                            </button>
                        </form>
                    </section>
                    <h2 className="text-2xl font-bold mb-8">{editingProduct ? 'Edit Details' : 'Add New Product'}</h2>
                    <form onSubmit={handleSubmit} className="space-y-8 bg-white/80 backdrop-blur-md p-10 rounded-[2.5rem] shadow-2xl border border-white/20">
                        <div className="space-y-3">
                            <label className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-500 ml-1">Product Title</label>
                            <input
                                type="text"
                                placeholder="Enter title..."
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full border-b border-gray-200 py-3 bg-transparent focus:border-black focus:outline-none transition-all text-base font-medium placeholder:text-gray-300"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-500 ml-1">Description</label>
                            <textarea
                                rows={4}
                                placeholder="Tell more about this product..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full border-b border-gray-200 py-3 bg-transparent focus:border-black focus:outline-none transition-all text-base font-medium placeholder:text-gray-300 resize-none"
                            ></textarea>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-500 ml-1">Media (Images/Videos)</label>
                            <div className="relative group">
                                <input
                                    id="fileInput"
                                    type="file"
                                    accept="image/*,video/*"
                                    multiple
                                    onChange={handleFileChange}
                                    className="w-full text-sm text-gray-500 file:mr-6 file:py-3 file:px-8 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:uppercase file:tracking-widest file:bg-gray-900 file:text-white hover:file:bg-black transition-all cursor-pointer"
                                />
                            </div>
                            {editingProduct && !files && (
                                <p className="text-[10px] text-gray-400 mt-2 ml-1 italic">* Leave empty to keep existing media</p>
                            )}
                        </div>

                        {message && (
                            <div className={`p-4 rounded-2xl text-xs font-bold text-center ${message.includes('Success') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                {message}
                            </div>
                        )}

                        <div className="flex gap-3 pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-black text-white py-5 rounded-2xl text-[10px] font-bold uppercase tracking-[0.25em] hover:bg-gray-800 hover:scale-[1.02] transition-all disabled:opacity-50 shadow-xl"
                            >
                                {loading ? 'Processing...' : (editingProduct ? 'Save Changes' : 'Publish Product')}
                            </button>
                            {editingProduct && (
                                <button
                                    type="button"
                                    onClick={cancelEdit}
                                    className="px-6 bg-gray-100 text-black py-5 rounded-2xl text-[10px] font-bold uppercase tracking-[0.25em] hover:bg-gray-200 transition-all shadow-sm"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Right Side: Manage Products List */}
                <div className="space-y-10">
                    <h2 className="text-3xl font-bold mb-10 text-gray-900">Manage Products</h2>
                    <div className="grid gap-6">
                        {products.length === 0 && (
                            <div className="text-center py-20 bg-white/40 rounded-[2.5rem] border border-dashed border-gray-200">
                                <p className="text-gray-400 font-medium">No products listed yet.</p>
                            </div>
                        )}

                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="group bg-white p-6 rounded-[2rem] shadow-sm hover:shadow-2xl transition-all duration-500 flex items-center gap-6 border border-transparent hover:border-gray-50"
                            >
                                {/* Media Preview */}
                                <div className="w-24 h-24 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0 relative shadow-inner">
                                    {product.imageUrls && product.imageUrls[0] ? (
                                        isVideo(product.imageUrls[0]) ? (
                                            <video src={product.imageUrls[0]} className="w-full h-full object-cover" />
                                        ) : (
                                            <img src={product.imageUrls[0]} alt={product.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        )
                                    ) : (
                                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                            <svg className="w-8 h-8 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-xl font-bold text-gray-900 mb-1 truncate">{product.title}</h3>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
                                            {product.imageUrls?.length || 0} items
                                        </span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                                    <button
                                        onClick={() => handleEdit(product as any)}
                                        className="p-4 bg-gray-50 text-gray-600 hover:bg-black hover:text-white rounded-2xl transition-all shadow-sm"
                                        title="Edit"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product.id)}
                                        className="p-4 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl transition-all shadow-sm"
                                        title="Delete"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                </div>

                                {/* Static Trash Icon for Mobile/Default (Like in screenshot) */}
                                <div className="md:hidden">
                                    <button
                                        onClick={() => handleDelete(product.id)}
                                        className="p-2 text-red-500"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
