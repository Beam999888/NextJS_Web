'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type ImageSize = 'small' | 'large';

const normalizeImageSize = (value: unknown): ImageSize => (value === 'large' ? 'large' : 'small');

interface HomeItem {
    id: number;
    title: string;
    description: string;
    imageUrls: string[];
    imageSize?: ImageSize;
}

interface Slide {
    type: 'split' | 'pair';
    image?: string;
    role?: string;
    title?: string;
    description?: string;
    left?: { image: string; role: string; title: string; description: string; };
    right?: { image: string; role: string; title: string; description: string; };
}

export default function AdminHomePage() {
    // Global Home Content
    const [role, setRole] = useState('');
    const [title, setTitle] = useState('');
    const [bio, setBio] = useState('');
    const [itemsTitle, setItemsTitle] = useState('');
    const [itemsDescription, setItemsDescription] = useState('');

    // Home Items (Dynamic Sections)
    const [homeItems, setHomeItems] = useState<HomeItem[]>([]);
    const [editingItem, setEditingItem] = useState<HomeItem | null>(null);
    const [itemTitle, setItemTitle] = useState('');
    const [itemDescription, setItemDescription] = useState('');
    const [itemFiles, setItemFiles] = useState<FileList | null>(null);
    const [itemImageSize, setItemImageSize] = useState<ImageSize>('small');

    // Slides (Existing)
    const [slides, setSlides] = useState<Slide[]>([]);

    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [message, setMessage] = useState('');
    const maxUploadBytes = 40 * 1024 * 1024;

    const isVideoUrl = (url: string) => {
        return url.match(/\.(mp4|webm|ogg)$/i);
    };

    const validateUploadFile = (file: File) => {
        if (file.size > maxUploadBytes) return 'File too large (max 40MB)';
        const typeOk =
            file.type.startsWith('image/') ||
            file.type === 'video/mp4' ||
            file.name.toLowerCase().endsWith('.mp4');
        if (!typeOk) return 'Unsupported file type (allowed: images, mp4)';
        return null;
    };

    const fetchData = async () => {
        try {
            const res = await fetch('/api/home');
            const data = await res.json();
            setSlides(data.slides || []);
            setRole(data.role || '');
            setTitle(data.title || '');
            setBio(data.bio || '');
            setItemsTitle(data.itemsTitle || '');
            setItemsDescription(data.itemsDescription || '');
            setHomeItems(data.homeItems || []);
        } catch (error) {
            console.error('Failed to fetch home data', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSaveGlobal = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        setMessage('Saving global content...');
        try {
            const res = await fetch('/api/home', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ slides, role, title, bio, itemsTitle, itemsDescription, homeItems }),
            });
            if (res.ok) setMessage('Global content updated!');
        } catch (error) {
            setMessage('Failed to update.');
        } finally {
            setProcessing(false);
        }
    };

    const handleItemSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!itemTitle || !itemDescription || (!editingItem && (!itemFiles || itemFiles.length === 0))) {
            setMessage('Please fill in item details and select media');
            return;
        }

        setProcessing(true);
        setMessage('Processing item...');

        try {
            let imageUrls: string[] = editingItem ? editingItem.imageUrls : [];

            if (itemFiles && itemFiles.length > 0) {
                const filesArray = Array.from(itemFiles);
                const invalid = filesArray.map(validateUploadFile).find(Boolean);
                if (invalid) {
                    setMessage(invalid);
                    setProcessing(false);
                    return;
                }
                const uploadPromises = Array.from(itemFiles).map(async (file) => {
                    const formData = new FormData();
                    formData.append('file', file);
                    const res = await fetch('/api/upload', { method: 'POST', body: formData });
                    const data = await res.json().catch(() => ({}));
                    if (!res.ok) throw new Error(data?.message || 'Upload failed');
                    return data.url;
                });
                imageUrls = await Promise.all(uploadPromises);
            }

            let updatedItems: HomeItem[];
            if (editingItem) {
                updatedItems = homeItems.map(item =>
                    item.id === editingItem.id ? { ...item, title: itemTitle, description: itemDescription, imageUrls, imageSize: itemImageSize } : item
                );
            } else {
                const newItem: HomeItem = {
                    id: Date.now(),
                    title: itemTitle,
                    description: itemDescription,
                    imageUrls,
                    imageSize: itemImageSize
                };
                updatedItems = [...homeItems, newItem];
            }

            const res = await fetch('/api/home', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ slides, role, title, bio, itemsTitle, itemsDescription, homeItems: updatedItems }),
            });

            if (res.ok) {
                setMessage(editingItem ? 'Item updated!' : 'Item added!');
                setHomeItems(updatedItems);
                setItemTitle('');
                setItemDescription('');
                setItemFiles(null);
                setEditingItem(null);
                setItemImageSize('small');
                const input = document.getElementById('itemFiles') as HTMLInputElement;
                if (input) input.value = '';
            }
        } catch (error) {
            setMessage('Error saving item');
        } finally {
            setProcessing(false);
        }
    };

    const handleDeleteItem = async (id: number) => {
        if (!confirm('Delete this item?')) return;
        const updatedItems = homeItems.filter(item => item.id !== id);
        try {
            const res = await fetch('/api/home', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ slides, role, title, bio, itemsTitle, itemsDescription, homeItems: updatedItems }),
            });
            if (res.ok) {
                setHomeItems(updatedItems);
                setMessage('Item deleted');
            }
        } catch (error) {
            setMessage('Failed to delete');
        }
    };

    const handleEditItem = (item: HomeItem) => {
        setEditingItem(item);
        setItemTitle(item.title);
        setItemDescription(item.description);
        setItemFiles(null);
        setItemImageSize(normalizeImageSize(item.imageSize));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const getFormGridClassName = (size: ImageSize) => {
        if (size === 'small') return 'grid-cols-2 md:grid-cols-3';
        return 'grid-cols-1';
    };

    const getMosaicClassName = (size: ImageSize) => {
        if (size === 'small') return 'grid-cols-3 grid-rows-3';
        return 'grid-cols-1 grid-rows-1';
    };

    const getMosaicMax = (size: ImageSize) => {
        if (size === 'small') return 9;
        return 1;
    };

    if (loading) return <div className="p-10 text-center text-black">Loading...</div>;

    return (
        <div className="container mx-auto px-6 py-24 max-w-6xl font-['Prompt',sans-serif]">
            {/* Premium Header with Dropdown */}
            <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between mb-16 relative">
                <h1 className="text-5xl font-['Tenor_Sans',serif] tracking-tight">Admin</h1>
            </div>

            <div className="grid lg:grid-cols-2 gap-16 items-start">
                {/* Left Side: Form */}
                <div className="space-y-12">
                    <section>
                        <h2 className="text-2xl font-bold mb-8">{editingItem ? 'Edit Home Item' : 'Add New Home Item'}</h2>
                        <form onSubmit={handleItemSubmit} className="space-y-6 bg-white/80 backdrop-blur-md p-8 rounded-[2.5rem] shadow-2xl border border-white/20">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Item Title</label>
                                <input
                                    value={itemTitle}
                                    onChange={(e) => setItemTitle(e.target.value)}
                                    placeholder="Enter title..."
                                    className="w-full border-b border-gray-200 py-2 focus:border-black outline-none bg-transparent transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Description</label>
                                <textarea
                                    rows={3}
                                    value={itemDescription}
                                    onChange={(e) => setItemDescription(e.target.value)}
                                    placeholder="Tell more..."
                                    className="w-full border-b border-gray-200 py-2 focus:border-black outline-none bg-transparent transition-all resize-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Media</label>
                                <input
                                    id="itemFiles"
                                    type="file"
                                    multiple
                                    accept="image/*,video/mp4"
                                    onChange={(e) => {
                                        const selected = e.target.files;
                                        if (!selected || selected.length === 0) {
                                            setItemFiles(null);
                                            return;
                                        }
                                        const filesArray = Array.from(selected);
                                        const invalid = filesArray.map(validateUploadFile).find(Boolean);
                                        if (invalid) {
                                            setMessage(invalid);
                                            e.target.value = '';
                                            setItemFiles(null);
                                            return;
                                        }
                                        setItemFiles(selected);
                                    }}
                                    className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:uppercase file:bg-gray-800 file:text-white hover:file:bg-gray-900 transition-all cursor-pointer"
                                />
                                {editingItem && <p className="text-[10px] text-gray-400 italic">* Empty keeps current media</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Image Size</label>
                                <select
                                    value={itemImageSize}
                                    onChange={(e) => setItemImageSize(e.target.value as ImageSize)}
                                    className="w-full border-b border-gray-200 py-2 bg-transparent focus:border-black outline-none transition-all text-sm"
                                >
                                    <option value="small">Small (3 per row)</option>
                                    <option value="large">Large (new line)</option>
                                </select>
                            </div>

                            {editingItem?.imageUrls?.length ? (
                                <div className="space-y-3 pt-2">
                                    <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Current Media Preview</div>
                                    <div className={`grid gap-3 ${getFormGridClassName(itemImageSize)}`}>
                                        {editingItem.imageUrls.map((url, idx) => (
                                            <div
                                                key={`${url}-${idx}`}
                                                className={`${itemImageSize === 'large' ? 'h-[260px] md:h-[420px]' : 'aspect-square'} bg-gray-100 rounded-2xl overflow-hidden shadow-inner`}
                                            >
                                                {isVideoUrl(url) ? (
                                                    <video src={url} className="w-full h-full object-cover" muted playsInline />
                                                ) : (
                                                    <img src={url} className="w-full h-full object-cover" alt="" />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : null}
                            <div className="flex gap-3 pt-4">
                                <button type="submit" disabled={processing} className="flex-1 bg-gray-200 text-black py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-gray-300 transition-all disabled:opacity-50 shadow-xl border border-black/10">
                                    {processing ? 'Processing...' : (editingItem ? 'Update Item' : 'Add Item')}
                                </button>
                                {editingItem && (
                                    <button type="button" onClick={() => { setEditingItem(null); setItemTitle(''); setItemDescription(''); setItemFiles(null); setItemImageSize('small'); }} className="px-6 bg-gray-100 text-black py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest">
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    </section>

                    <section className="bg-white/40 p-8 rounded-[2rem] border border-black/5">
                        <h2 className="text-xl font-bold mb-6">Grid Header Settings</h2>
                        <form onSubmit={handleSaveGlobal} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Grid Title</label>
                                <input value={itemsTitle} onChange={(e) => setItemsTitle(e.target.value)} placeholder="e.g., Selected Works" className="w-full border-b border-gray-200 py-2 bg-transparent focus:border-black outline-none" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Grid Description</label>
                                <textarea value={itemsDescription} onChange={(e) => setItemsDescription(e.target.value)} placeholder="Subtitle for the grid..." rows={2} className="w-full border-b border-gray-200 py-2 bg-transparent focus:border-black outline-none resize-none" />
                            </div>
                            <button type="submit" disabled={processing} className="w-full bg-gray-200 text-black py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-gray-300 transition-all shadow-xl border border-black/10">
                                Save Header
                            </button>
                        </form>
                    </section>

                    <section className="bg-white/40 p-8 rounded-[2rem] border border-black/5">
                        <h2 className="text-xl font-bold mb-6">Hero Section Data</h2>
                        <form onSubmit={handleSaveGlobal} className="space-y-4">
                            <input value={role} onChange={(e) => setRole(e.target.value)} placeholder="Role" className="w-full border-b border-gray-200 py-2 bg-transparent focus:border-black outline-none" />
                            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="w-full border-b border-gray-200 py-2 bg-transparent focus:border-black outline-none" />
                            <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Bio" rows={2} className="w-full border-b border-gray-200 py-2 bg-transparent focus:border-black outline-none resize-none" />
                            <button type="submit" disabled={processing} className="w-full border-2 border-black py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-gray-800 hover:text-white transition-all">
                                Update Hero
                            </button>
                        </form>
                    </section>
                </div>

                {/* Right Side: List */}
                <div className="space-y-8">
                    <h2 className="text-2xl font-bold mb-8">Manage Home Items</h2>
                    <div className="space-y-4">
                        {homeItems.length === 0 && (
                            <div className="text-center py-20 bg-gray-50 rounded-[2.5rem] border border-dashed border-black/10 text-gray-400">
                                No items added yet.
                            </div>
                        )}
                        {homeItems.map((item) => (
                            <div key={item.id} className="group bg-white p-5 rounded-[2rem] shadow-sm hover:shadow-xl transition-all flex items-center gap-5 border border-transparent hover:border-gray-50">
                                <div className="w-20 h-20 bg-gray-100 rounded-2xl overflow-hidden shadow-inner">
                                    {item.imageUrls?.[0] ? (
                                        <div className={`grid w-full h-full gap-[2px] ${getMosaicClassName(normalizeImageSize(item.imageSize))}`}>
                                            {item.imageUrls.slice(0, getMosaicMax(normalizeImageSize(item.imageSize))).map((url, idx) => {
                                                const isLast = idx === getMosaicMax(normalizeImageSize(item.imageSize)) - 1;
                                                const remaining = item.imageUrls.length - getMosaicMax(normalizeImageSize(item.imageSize));
                                                return (
                                                    <div key={`${url}-${idx}`} className="w-full h-full overflow-hidden bg-gray-200 relative">
                                                        {isVideoUrl(url) ? (
                                                            <video src={url} className="w-full h-full object-cover" muted playsInline />
                                                        ) : (
                                                            <img src={url} className="w-full h-full object-cover" alt="" />
                                                        )}
                                                        {isLast && remaining > 0 ? (
                                                            <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center text-white text-[10px] font-bold">
                                                                +{remaining}
                                                            </div>
                                                        ) : null}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : null}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold truncate">{item.title}</h3>
                                    <span className="text-[10px] text-gray-400 uppercase tracking-widest">{item.imageUrls.length} items</span>
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                    <button onClick={() => handleEditItem(item)} className="p-3 bg-gray-50 hover:bg-gray-800 hover:text-white rounded-xl transition-all">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                    </button>
                                    <button onClick={() => handleDeleteItem(item.id)} className="p-3 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <hr className="border-black/5" />
                    <Link href="/admin/home/slider" className="block p-8 bg-gray-200 text-black rounded-[2rem] text-center hover:bg-gray-300 transition-all shadow-xl group border border-black/10">
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Advanced Settings</span>
                        <h3 className="text-xl font-['Tenor_Sans',serif] mt-2 group-hover:translate-x-1 transition-transform inline-flex items-center gap-2">
                            Manage Banner Slider →
                        </h3>
                    </Link>
                </div>
            </div>

            {message && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 px-8 py-3 bg-gray-100 text-gray-800 text-xs font-bold rounded-full shadow-2xl z-50 animate-fade-in border border-gray-200">
                    {message}
                </div>
            )}
        </div>
    );
}
