'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface SlideContent {
    image: string;
    role: string;
    title: string;
    description: string;
}

interface Slide {
    type: 'split' | 'pair';
    image?: string;
    role?: string;
    title?: string;
    description?: string;
    left?: SlideContent;
    right?: SlideContent;
}

export default function HomeSliderAdmin() {
    const router = useRouter();
    const [slides, setSlides] = useState<Slide[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                const res = await fetch('/api/home');
                if (res.ok) {
                    const data = await res.json();
                    setSlides(data.slides || []);
                }
            } catch (error) {
                console.error('Failed to fetch slider data', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchHomeData();
    }, []);

    const handleSave = async (updatedSlides: Slide[]) => {
        try {
            const currentDataRes = await fetch('/api/home');
            const currentData = await currentDataRes.json();

            const res = await fetch('/api/home', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...currentData, slides: updatedSlides }),
            });

            if (res.ok) {
                setSlides(updatedSlides);
                alert('Slider updated successfully!');
            }
        } catch (error) {
            console.error('Save failed', error);
            alert('Failed to save slider changes.');
        }
    };

    const handleFileUpload = async (index: number, side?: 'left' | 'right') => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = async (e: any) => {
            const file = e.target.files[0];
            const formData = new FormData();
            formData.append('file', file);

            try {
                const res = await fetch('/api/upload', { method: 'POST', body: formData });
                const data = await res.json();

                const newSlides = [...slides];
                if (newSlides[index].type === 'pair' && side) {
                    if (side === 'left') newSlides[index].left!.image = data.url;
                    else newSlides[index].right!.image = data.url;
                } else {
                    newSlides[index].image = data.url;
                }
                setSlides(newSlides);
            } catch (err) {
                alert('Upload failed');
            }
        };
        input.click();
    };

    const toggleSlideType = (index: number) => {
        const newSlides = [...slides];
        const current = newSlides[index];
        if (current.type === 'split') {
            newSlides[index] = {
                type: 'pair',
                left: { image: current.image || '', role: current.role || '', title: current.title || '', description: current.description || '' },
                right: { image: '', role: '', title: '', description: '' }
            };
        } else {
            newSlides[index] = {
                type: 'split',
                image: current.left?.image || '',
                role: current.left?.role || '',
                title: current.left?.title || '',
                description: current.left?.description || ''
            };
        }
        setSlides(newSlides);
    };

    if (isLoading) return <div className="p-20 text-center">Loading...</div>;

    return (
        <div className="container mx-auto px-6 py-24 max-w-6xl font-['Prompt',sans-serif]">
            <div className="mb-12 flex items-center justify-between">
                <div>
                    <Link href="/admin/home" className="text-sm text-black/40 hover:text-black transition-colors mb-4 inline-block uppercase tracking-widest font-bold">
                        ← Back to Home Admin
                    </Link>
                    <h1 className="text-4xl font-['Tenor_Sans',serif]">Banner Slider Settings</h1>
                </div>
                <button
                    onClick={() => handleSave(slides)}
                    className="bg-black text-white px-10 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-all shadow-xl"
                >
                    Save All Changes
                </button>
            </div>

            <div className="space-y-12">
                {slides.map((slide, index) => (
                    <div key={index} className="bg-white/60 backdrop-blur-sm p-10 rounded-[3rem] shadow-sm border border-black/5 hover:shadow-xl transition-all duration-500">
                        <div className="flex items-center justify-between mb-8 pb-6 border-b border-black/5">
                            <span className="text-sm font-bold uppercase tracking-[0.2em] text-black/30">Slide {index + 1}</span>
                            <button
                                onClick={() => toggleSlideType(index)}
                                className="text-[10px] font-bold uppercase tracking-widest border border-black/10 px-6 py-2 rounded-full hover:bg-black hover:text-white transition-all"
                            >
                                Change to {slide.type === 'split' ? 'Vertical Pair' : 'Horizontal Split'}
                            </button>
                        </div>

                        {slide.type === 'split' ? (
                            <div className="grid md:grid-cols-2 gap-12">
                                <div
                                    onClick={() => handleFileUpload(index)}
                                    className="aspect-video bg-gray-100 rounded-3xl overflow-hidden cursor-pointer relative group"
                                >
                                    {slide.image ? (
                                        <img src={slide.image} className="w-full h-full object-cover transition-transform group-hover:scale-105" alt="" />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold uppercase tracking-widest text-black/30">Click to Upload Image</div>
                                    )}
                                </div>
                                <div className="space-y-6">
                                    <input
                                        placeholder="Role"
                                        value={slide.role}
                                        onChange={(e) => {
                                            const ns = [...slides];
                                            ns[index].role = e.target.value;
                                            setSlides(ns);
                                        }}
                                        className="w-full bg-transparent border-b border-black/10 py-3 text-sm focus:border-black transition-colors outline-none font-bold uppercase tracking-widest"
                                    />
                                    <input
                                        placeholder="Title"
                                        value={slide.title}
                                        onChange={(e) => {
                                            const ns = [...slides];
                                            ns[index].title = e.target.value;
                                            setSlides(ns);
                                        }}
                                        className="w-full bg-transparent border-b border-black/10 py-3 text-2xl font-['Tenor_Sans',serif] focus:border-black outline-none"
                                    />
                                    <textarea
                                        placeholder="Description"
                                        value={slide.description}
                                        onChange={(e) => {
                                            const ns = [...slides];
                                            ns[index].description = e.target.value;
                                            setSlides(ns);
                                        }}
                                        rows={3}
                                        className="w-full bg-transparent border-b border-black/10 py-3 text-sm focus:border-black outline-none resize-none leading-relaxed"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-2 gap-16">
                                {/* Left side */}
                                <div className="space-y-6">
                                    <div
                                        onClick={() => handleFileUpload(index, 'left')}
                                        className="aspect-[3/4] bg-gray-100 rounded-3xl overflow-hidden cursor-pointer relative group"
                                    >
                                        {slide.left?.image ? (
                                            <img src={slide.left.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt="" />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold uppercase tracking-widest text-black/30">Upload Left Image</div>
                                        )}
                                    </div>
                                    <input
                                        placeholder="Left Role"
                                        value={slide.left?.role}
                                        onChange={(e) => {
                                            const ns = [...slides];
                                            ns[index].left!.role = e.target.value;
                                            setSlides(ns);
                                        }}
                                        className="w-full bg-transparent border-b border-black/10 py-2 text-[10px] font-bold uppercase tracking-widest"
                                    />
                                    <input
                                        placeholder="Left Title"
                                        value={slide.left?.title}
                                        onChange={(e) => {
                                            const ns = [...slides];
                                            ns[index].left!.title = e.target.value;
                                            setSlides(ns);
                                        }}
                                        className="w-full bg-transparent border-b border-black/10 py-2 text-xl font-['Tenor_Sans',serif]"
                                    />
                                </div>
                                {/* Right side */}
                                <div className="space-y-6">
                                    <div
                                        onClick={() => handleFileUpload(index, 'right')}
                                        className="aspect-[3/4] bg-gray-100 rounded-3xl overflow-hidden cursor-pointer relative group"
                                    >
                                        {slide.right?.image ? (
                                            <img src={slide.right.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt="" />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold uppercase tracking-widest text-black/30">Upload Right Image</div>
                                        )}
                                    </div>
                                    <input
                                        placeholder="Right Role"
                                        value={slide.right?.role}
                                        onChange={(e) => {
                                            const ns = [...slides];
                                            ns[index].right!.role = e.target.value;
                                            setSlides(ns);
                                        }}
                                        className="w-full bg-transparent border-b border-black/10 py-2 text-[10px] font-bold uppercase tracking-widest"
                                    />
                                    <input
                                        placeholder="Right Title"
                                        value={slide.right?.title}
                                        onChange={(e) => {
                                            const ns = [...slides];
                                            ns[index].right!.title = e.target.value;
                                            setSlides(ns);
                                        }}
                                        className="w-full bg-transparent border-b border-black/10 py-2 text-xl font-['Tenor_Sans',serif]"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-12 flex justify-center">
                <button
                    onClick={() => setSlides([...slides, { type: 'split', image: '', role: '', title: '', description: '' }])}
                    className="group flex flex-col items-center gap-4 py-12 px-20 border-2 border-dashed border-black/5 rounded-[3rem] hover:border-black/20 hover:bg-black/5 transition-all"
                >
                    <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">+</div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Add New Slide</span>
                </button>
            </div>
        </div>
    );
}
