'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type MediaType = 'image' | 'video';
type BackgroundType = 'image' | 'video';

interface SlideContent {
    image: string;
    role: string;
    title: string;
    description: string;
    mediaType?: MediaType;
}

interface Slide {
    type: 'split' | 'pair';
    image?: string;
    role?: string;
    title?: string;
    description?: string;
    mediaType?: MediaType;
    left?: SlideContent;
    right?: SlideContent;
}

export default function HomeSliderAdmin() {
    const [slides, setSlides] = useState<Slide[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [backgroundType, setBackgroundType] = useState<BackgroundType>('video');
    const [backgroundUrl, setBackgroundUrl] = useState('');
    const [backgroundFile, setBackgroundFile] = useState<File | null>(null);
    const [backgroundPreviewUrl, setBackgroundPreviewUrl] = useState('');
    const [message, setMessage] = useState('');
    const maxUploadBytes = 50 * 1024 * 1024;

    const showMessage = (nextMessage: string) => {
        setMessage(nextMessage);
        window.setTimeout(() => setMessage(''), 4000);
    };

    const isVideoUrl = (url: string) => {
        return url.length > 0 && /\.(mp4|webm|ogg)$/i.test(url);
    };

    const validateBackgroundFile = (file: File, expectedType: BackgroundType) => {
        if (file.size > maxUploadBytes) return 'File too large (max 50MB)';
        const typeOk =
            expectedType === 'image'
                ? file.type.startsWith('image/')
                : file.type === 'video/mp4' || file.name.toLowerCase().endsWith('.mp4');
        if (!typeOk) return expectedType === 'image' ? 'Unsupported file type (allowed: images)' : 'Unsupported file type (allowed: mp4)';
        return null;
    };

    const getDefaultMediaType = (url?: string): MediaType => {
        if (!url) return 'image';
        return isVideoUrl(url) ? 'video' : 'image';
    };

    const normalizeSlide = (slide: Slide): Slide => {
        if (slide.type === 'split') {
            return { ...slide, mediaType: slide.mediaType ?? getDefaultMediaType(slide.image) };
        }

        const left = slide.left
            ? { ...slide.left, mediaType: slide.left.mediaType ?? getDefaultMediaType(slide.left.image) }
            : undefined;

        const right = slide.right
            ? { ...slide.right, mediaType: slide.right.mediaType ?? getDefaultMediaType(slide.right.image) }
            : undefined;

        return { ...slide, left, right };
    };

    const validateUploadFile = (file: File, expectedType: MediaType) => {
        if (file.size > maxUploadBytes) return 'File too large (max 50MB)';
        const typeOk =
            expectedType === 'image'
                ? file.type.startsWith('image/')
                : file.type === 'video/mp4' || file.name.toLowerCase().endsWith('.mp4');
        if (!typeOk) return expectedType === 'image' ? 'Unsupported file type (allowed: images)' : 'Unsupported file type (allowed: mp4)';
        return null;
    };

    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                const res = await fetch('/api/home');
                if (res.ok) {
                    const data = await res.json();
                    const bgUrl = typeof data?.background?.url === 'string' ? data.background.url : '';
                    const bgTypeRaw = data?.background?.type;
                    const bgType: BackgroundType =
                        bgTypeRaw === 'video' || bgTypeRaw === 'image'
                            ? bgTypeRaw
                            : bgUrl
                                ? (isVideoUrl(bgUrl) ? 'video' : 'image')
                                : 'video';

                    setBackgroundType(bgType);
                    setBackgroundUrl(bgUrl);
                    setSlides((data.slides || []).map(normalizeSlide));
                }
            } catch (error) {
                console.error('Failed to fetch slider data', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchHomeData();
    }, []);

    useEffect(() => {
        if (!backgroundFile) {
            setBackgroundPreviewUrl('');
            return;
        }

        const nextUrl = URL.createObjectURL(backgroundFile);
        setBackgroundPreviewUrl(nextUrl);
        return () => URL.revokeObjectURL(nextUrl);
    }, [backgroundFile]);

    const handleSaveBackground = async () => {
        try {
            const currentDataRes = await fetch('/api/home');
            const currentData = await currentDataRes.json();

            let nextUrl = backgroundUrl;
            if (backgroundFile) {
                const error = validateBackgroundFile(backgroundFile, backgroundType);
                if (error) {
                    showMessage(error);
                    return;
                }

                const formData = new FormData();
                formData.append('file', backgroundFile);
                const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
                const uploadData = await uploadRes.json().catch(() => ({}));
                if (!uploadRes.ok) {
                    showMessage(uploadData?.message || 'Upload failed');
                    return;
                }
                nextUrl = uploadData.url;
            }

            if (!nextUrl) {
                showMessage('Please choose a file');
                return;
            }

            const res = await fetch('/api/home', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...currentData,
                    background: { type: backgroundType, url: nextUrl },
                }),
            });

            if (res.ok) {
                setBackgroundUrl(nextUrl);
                setBackgroundFile(null);
                showMessage('Background updated successfully!');
            } else {
                showMessage('Failed to save background.');
            }
        } catch (error) {
            console.error('Save failed', error);
            showMessage('Failed to save background.');
        }
    };

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
                showMessage('Slider updated successfully!');
            }
        } catch (error) {
            console.error('Save failed', error);
            showMessage('Failed to save slider changes.');
        }
    };

    const handleFileUpload = async (index: number, side?: 'left' | 'right', expectedType?: MediaType) => {
        const mediaType: MediaType = expectedType || 'image';
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = mediaType === 'video' ? 'video/mp4' : 'image/*';
        input.onchange = async (e: Event) => {
            const target = e.target as HTMLInputElement | null;
            const file = target?.files?.[0];
            if (!file) return;
            const error = validateUploadFile(file, mediaType);
            if (error) {
                showMessage(error);
                return;
            }
            const formData = new FormData();
            formData.append('file', file);

            try {
                const res = await fetch('/api/upload', { method: 'POST', body: formData });
                const data = await res.json().catch(() => ({}));
                if (!res.ok) {
                    showMessage(data?.message || 'Upload failed');
                    return;
                }

                const newSlides = [...slides];
                if (newSlides[index].type === 'pair' && side) {
                    if (side === 'left') {
                        newSlides[index].left!.image = data.url;
                        newSlides[index].left!.mediaType = mediaType;
                    } else {
                        newSlides[index].right!.image = data.url;
                        newSlides[index].right!.mediaType = mediaType;
                    }
                } else {
                    newSlides[index].image = data.url;
                    newSlides[index].mediaType = mediaType;
                }
                setSlides(newSlides);
            } catch (err) {
                showMessage('Upload failed');
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
                left: { image: current.image || '', role: current.role || '', title: current.title || '', description: current.description || '', mediaType: current.mediaType ?? getDefaultMediaType(current.image) },
                right: { image: '', role: '', title: '', description: '', mediaType: 'image' }
            };
        } else {
            newSlides[index] = {
                type: 'split',
                image: current.left?.image || '',
                role: current.left?.role || '',
                title: current.left?.title || '',
                description: current.left?.description || '',
                mediaType: current.left?.mediaType ?? getDefaultMediaType(current.left?.image)
            };
        }
        setSlides(newSlides);
    };

    const handleDeleteSlide = async (index: number) => {
        if (slides.length <= 1) {
            showMessage('At least 1 slide is required');
            return;
        }
        if (!confirm('Delete this slide?')) return;
        const updatedSlides = slides.filter((_, i) => i !== index);
        await handleSave(updatedSlides);
    };

    if (isLoading) return <div className="p-20 text-center">Loading...</div>;

    return (
        <div className="container mx-auto px-6 py-24 max-w-6xl font-['Prompt',sans-serif]">
            <div className="mb-12 flex items-center justify-between">
                <div>
                    <Link href="/admin/home" className="text-sm text-black/40 hover:text-black transition-colors mb-4 inline-block uppercase tracking-widest font-bold">
                        ← Back to Home Admin
                    </Link>
                    <h1 className="text-4xl font-['Tenor_Sans',serif]">Background</h1>
                    <div className="mt-3 text-xs text-black/50 font-medium">
                        เปลี่ยนพื้นหลังได้ทุกหน้า รองรับทั้งวิดีโอ (.mp4) และรูปภาพ ไม่เกิน 50MB
                    </div>
                </div>
                <button
                    onClick={handleSaveBackground}
                    className="bg-gray-200 text-black px-10 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gray-300 transition-all shadow-xl border border-black/10"
                >
                    Save
                </button>
            </div>

            <div className="bg-white/60 backdrop-blur-sm p-10 rounded-[3rem] shadow-sm border border-black/5 mb-12">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-black/50">Type</label>
                        <select
                            value={backgroundType}
                            onChange={(e) => {
                                const nextType = e.target.value as BackgroundType;
                                setBackgroundType(nextType);
                                setBackgroundFile(null);
                            }}
                            className="w-full bg-transparent border border-black/10 rounded-2xl px-4 py-3 text-sm focus:border-black outline-none transition-colors"
                        >
                            <option value="video">Video</option>
                            <option value="image">Image</option>
                        </select>
                    </div>

                    <div className="w-full aspect-video bg-gray-100 rounded-2xl overflow-hidden border border-black/10">
                        {(backgroundPreviewUrl || backgroundUrl) ? (
                            backgroundType === 'video' ? (
                                <video
                                    key={backgroundPreviewUrl || backgroundUrl}
                                    src={backgroundPreviewUrl || backgroundUrl}
                                    className="w-full h-full object-cover"
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                />
                            ) : (
                                <img src={backgroundPreviewUrl || backgroundUrl} alt="" className="w-full h-full object-cover" />
                            )
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] font-bold uppercase tracking-widest text-black/30">
                                No background selected
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-black/50">Upload (Max 50MB)</label>
                        <input
                            type="file"
                            accept={backgroundType === 'video' ? 'video/mp4' : 'image/*'}
                            onChange={(e) => {
                                const file = e.target.files?.[0] || null;
                                if (!file) {
                                    setBackgroundFile(null);
                                    return;
                                }
                                const error = validateBackgroundFile(file, backgroundType);
                                if (error) {
                                    showMessage(error);
                                    e.target.value = '';
                                    setBackgroundFile(null);
                                    return;
                                }
                                setBackgroundFile(file);
                            }}
                            className="block w-full text-[10px] text-black/40 file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:uppercase file:bg-gray-800 file:text-white hover:file:bg-gray-900 file:cursor-pointer transition-all"
                        />
                    </div>
                </div>
            </div>

            {false && (
                <>
            <div className="space-y-12">
                {slides.map((slide, index) => (
                    <div key={index} className="bg-white/60 backdrop-blur-sm p-10 rounded-[3rem] shadow-sm border border-black/5 hover:shadow-xl transition-all duration-500">
                        <div className="flex items-center justify-between mb-8 pb-6 border-b border-black/5">
                            <span className="text-sm font-bold uppercase tracking-[0.2em] text-black/30">Slide {index + 1}</span>
                            <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => toggleSlideType(index)}
                                        className="text-[10px] font-bold uppercase tracking-widest border border-black/10 px-6 py-2 rounded-full hover:bg-gray-800 hover:text-white transition-all"
                                    >
                                        Change to {slide.type === 'split' ? 'Vertical Pair' : 'Horizontal Split'}
                                    </button>
                                <button
                                    onClick={() => handleDeleteSlide(index)}
                                    disabled={slides.length <= 1}
                                    className={`text-[10px] font-bold uppercase tracking-widest border px-6 py-2 rounded-full transition-all ${slides.length <= 1 ? 'border-black/10 text-black/30 cursor-not-allowed' : 'border-red-200 text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600'}`}
                                >
                                    Delete Slide
                                </button>
                            </div>
                        </div>

                        {slide.type === 'split' ? (
                            <div className="grid md:grid-cols-2 gap-12">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-black/40">Media</span>
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const ns = [...slides];
                                                    ns[index].mediaType = 'image';
                                                    setSlides(ns);
                                                }}
                                                className={`text-[10px] font-bold uppercase tracking-widest border px-4 py-2 rounded-full transition-all ${((slide.mediaType ?? getDefaultMediaType(slide.image)) === 'image') ? 'bg-gray-800 text-white border-gray-800' : 'border-black/10 hover:bg-gray-800 hover:text-white hover:border-gray-800'}`}
                                            >
                                                Image
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const ns = [...slides];
                                                    ns[index].mediaType = 'video';
                                                    setSlides(ns);
                                                }}
                                                className={`text-[10px] font-bold uppercase tracking-widest border px-4 py-2 rounded-full transition-all ${((slide.mediaType ?? getDefaultMediaType(slide.image)) === 'video') ? 'bg-gray-800 text-white border-gray-800' : 'border-black/10 hover:bg-gray-800 hover:text-white hover:border-gray-800'}`}
                                            >
                                                Video
                                            </button>
                                        </div>
                                    </div>
                                    <div
                                        onClick={() => handleFileUpload(index, undefined, slide.mediaType ?? getDefaultMediaType(slide.image))}
                                        className="aspect-video bg-gray-100 rounded-3xl overflow-hidden cursor-pointer relative group"
                                    >
                                        {slide.image ? (
                                            isVideoUrl(slide.image) ? (
                                                <video src={slide.image} className="w-full h-full object-cover" muted playsInline />
                                            ) : (
                                                <img src={slide.image} className="w-full h-full object-cover transition-transform group-hover:scale-105" alt="" />
                                            )
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold uppercase tracking-widest text-black/30">
                                                Click to Upload {(slide.mediaType ?? getDefaultMediaType(slide.image)) === 'video' ? 'Video (.mp4)' : 'Image'}
                                            </div>
                                        )}
                                    </div>
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
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-black/40">Left Media</span>
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                    onClick={() => {
                                                        const ns = [...slides];
                                                        ns[index].left!.mediaType = 'image';
                                                        setSlides(ns);
                                                    }}
                                                    className={`text-[10px] font-bold uppercase tracking-widest border px-4 py-2 rounded-full transition-all ${((slide.left?.mediaType ?? getDefaultMediaType(slide.left?.image)) === 'image') ? 'bg-gray-800 text-white border-gray-800' : 'border-black/10 hover:bg-gray-800 hover:text-white hover:border-gray-800'}`}
                                                >
                                                    Image
                                                </button>
                                                <button
                                                    type="button"
                                                onClick={() => {
                                                        const ns = [...slides];
                                                        ns[index].left!.mediaType = 'video';
                                                        setSlides(ns);
                                                    }}
                                                    className={`text-[10px] font-bold uppercase tracking-widest border px-4 py-2 rounded-full transition-all ${((slide.left?.mediaType ?? getDefaultMediaType(slide.left?.image)) === 'video') ? 'bg-gray-800 text-white border-gray-800' : 'border-black/10 hover:bg-gray-800 hover:text-white hover:border-gray-800'}`}
                                                >
                                                    Video
                                                </button>
                                            </div>
                                        </div>
                                    <div
                                        onClick={() => handleFileUpload(index, 'left', slide.left?.mediaType ?? getDefaultMediaType(slide.left?.image))}
                                        className="aspect-[3/4] bg-gray-100 rounded-3xl overflow-hidden cursor-pointer relative group"
                                    >
                                        {slide.left?.image ? (
                                            isVideoUrl(slide.left.image) ? (
                                                <video src={slide.left.image} className="w-full h-full object-cover" muted playsInline />
                                            ) : (
                                                <img src={slide.left.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt="" />
                                            )
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold uppercase tracking-widest text-black/30">
                                                Upload Left {((slide.left?.mediaType ?? getDefaultMediaType(slide.left?.image)) === 'video') ? 'Video (.mp4)' : 'Image'}
                                            </div>
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
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-black/40">Right Media</span>
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                    onClick={() => {
                                                        const ns = [...slides];
                                                        ns[index].right!.mediaType = 'image';
                                                        setSlides(ns);
                                                    }}
                                                    className={`text-[10px] font-bold uppercase tracking-widest border px-4 py-2 rounded-full transition-all ${((slide.right?.mediaType ?? getDefaultMediaType(slide.right?.image)) === 'image') ? 'bg-gray-800 text-white border-gray-800' : 'border-black/10 hover:bg-gray-800 hover:text-white hover:border-gray-800'}`}
                                                >
                                                    Image
                                                </button>
                                                <button
                                                    type="button"
                                                onClick={() => {
                                                        const ns = [...slides];
                                                        ns[index].right!.mediaType = 'video';
                                                        setSlides(ns);
                                                    }}
                                                    className={`text-[10px] font-bold uppercase tracking-widest border px-4 py-2 rounded-full transition-all ${((slide.right?.mediaType ?? getDefaultMediaType(slide.right?.image)) === 'video') ? 'bg-gray-800 text-white border-gray-800' : 'border-black/10 hover:bg-gray-800 hover:text-white hover:border-gray-800'}`}
                                                >
                                                    Video
                                                </button>
                                            </div>
                                        </div>
                                    <div
                                        onClick={() => handleFileUpload(index, 'right', slide.right?.mediaType ?? getDefaultMediaType(slide.right?.image))}
                                        className="aspect-[3/4] bg-gray-100 rounded-3xl overflow-hidden cursor-pointer relative group"
                                    >
                                        {slide.right?.image ? (
                                            isVideoUrl(slide.right.image) ? (
                                                <video src={slide.right.image} className="w-full h-full object-cover" muted playsInline />
                                            ) : (
                                                <img src={slide.right.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt="" />
                                            )
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold uppercase tracking-widest text-black/30">
                                                Upload Right {((slide.right?.mediaType ?? getDefaultMediaType(slide.right?.image)) === 'video') ? 'Video (.mp4)' : 'Image'}
                                            </div>
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
                    onClick={() => setSlides([...slides, { type: 'split', image: '', role: '', title: '', description: '', mediaType: 'image' }])}
                    className="group flex flex-col items-center gap-4 py-12 px-20 border-2 border-dashed border-black/5 rounded-[3rem] hover:border-black/20 hover:bg-gray-50 transition-all"
                >
                    <div className="w-12 h-12 bg-gray-800 text-white rounded-full flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">+</div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Add New Slide</span>
                </button>
            </div>
                </>
            )}

            {message && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 px-8 py-3 bg-gray-100 text-gray-800 text-xs font-bold rounded-full shadow-2xl z-50 animate-fade-in border border-gray-200">
                    {message}
                </div>
            )}
        </div>
    );
}
