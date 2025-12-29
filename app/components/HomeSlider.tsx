'use client';

import { useState, useEffect, useCallback } from 'react';

export interface Slide {
    type: 'split' | 'pair';
    // For 'split' type
    image?: string;
    role?: string;
    title?: string;
    description?: string;
    // For 'pair' type
    left?: {
        image: string;
        role: string;
        title: string;
        description: string;
    };
    right?: {
        image: string;
        role: string;
        title: string;
        description: string;
    };
}

interface HomeSliderProps {
    slides: Slide[];
}

export default function HomeSlider({ slides }: HomeSliderProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const isVideoUrl = (url: string) => url.length > 0 && /\.(mp4|webm|ogg)$/i.test(url);

    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, [slides.length]);

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    };

    useEffect(() => {
        if (slides.length <= 1) return;

        const interval = setInterval(() => {
            nextSlide();
        }, 4000); // 4 seconds auto-slide

        return () => clearInterval(interval);
    }, [nextSlide, slides.length]);

    if (slides.length === 0) return null;

    return (
        <div className="relative w-full max-w-6xl mx-auto min-h-[500px] mb-12 rounded-[2.5rem] overflow-hidden group shadow-2xl bg-white/40 backdrop-blur-md border border-white/20">
            {/* Slides Container */}
            <div
                className="flex transition-transform duration-700 ease-in-out h-full"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {slides.map((slide, index) => (
                    <div key={index} className="min-w-full h-full">
                        {slide.type === 'split' ? (
                            /* Split Layout: Image Left, Text Right */
                            <div className="flex flex-col md:flex-row h-full">
                                <div className="w-full md:w-1/2 h-[300px] md:h-[500px]">
                                    {slide.image ? (
                                        isVideoUrl(slide.image) ? (
                                            <video src={slide.image} className="w-full h-full object-cover" autoPlay muted loop playsInline />
                                        ) : (
                                            <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                                        )
                                    ) : null}
                                </div>
                                <div className="w-full md:w-1/2 p-10 md:p-16 flex flex-col justify-center text-left">
                                    <p className="text-xs md:text-sm font-bold uppercase tracking-[0.3em] text-black/60 mb-4 animate-fade-in">
                                        {slide.role}
                                    </p>
                                    <h2 className="text-3xl md:text-5xl font-['Tenor_Sans',serif] leading-tight mb-6 text-black animate-fade-in-up">
                                        {slide.title}
                                    </h2>
                                    <p className="text-sm md:text-base font-light leading-relaxed text-black/80 mb-8 max-w-md animate-fade-in-up delay-100">
                                        {slide.description}
                                    </p>
                                    <div className="mt-auto">
                                        <a href="/profile" className="group relative inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] border-b border-black/30 pb-1 hover:border-black transition-all">
                                            Learn More
                                            <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* Pair Layout: Two Vertical Images side-by-side */
                            <div className="flex flex-row h-full gap-4 p-6 md:p-10">
                                <div className="flex-1 flex flex-col items-center justify-center p-4 bg-white/30 rounded-3xl border border-white/20 shadow-sm animate-fade-in">
                                    <div className="w-full aspect-[3/4] rounded-2xl overflow-hidden mb-4 shadow-md">
                                        {slide.left?.image ? (
                                            isVideoUrl(slide.left?.image) ? (
                                                <video src={slide.left?.image} className="w-full h-full object-cover" autoPlay muted loop playsInline />
                                            ) : (
                                                <img src={slide.left?.image} alt={slide.left?.title || ''} className="w-full h-full object-cover" />
                                            )
                                        ) : null}
                                    </div>
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-black/40 mb-1">{slide.left?.role}</p>
                                    <h3 className="text-lg md:text-xl font-['Tenor_Sans',serif] text-black mb-2 text-center">{slide.left?.title}</h3>
                                    <p className="text-xs text-black/60 text-center line-clamp-2">{slide.left?.description}</p>
                                </div>

                                <div className="flex-1 flex flex-col items-center justify-center p-4 bg-white/30 rounded-3xl border border-white/20 shadow-sm animate-fade-in delay-100">
                                    <div className="w-full aspect-[3/4] rounded-2xl overflow-hidden mb-4 shadow-md">
                                        {slide.right?.image ? (
                                            isVideoUrl(slide.right?.image) ? (
                                                <video src={slide.right?.image} className="w-full h-full object-cover" autoPlay muted loop playsInline />
                                            ) : (
                                                <img src={slide.right?.image} alt={slide.right?.title || ''} className="w-full h-full object-cover" />
                                            )
                                        ) : null}
                                    </div>
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-black/40 mb-1">{slide.right?.role}</p>
                                    <h3 className="text-lg md:text-xl font-['Tenor_Sans',serif] text-black mb-2 text-center">{slide.right?.title}</h3>
                                    <p className="text-xs text-black/60 text-center line-clamp-2">{slide.right?.description}</p>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Navigation Arrows */}
            {slides.length > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        className="absolute left-6 top-1/2 -translate-y-1/2 bg-black/5 hover:bg-black/10 backdrop-blur-md p-3 rounded-full text-black transition-all opacity-0 group-hover:opacity-100 cursor-pointer border border-black/10 z-10"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-6 top-1/2 -translate-y-1/2 bg-black/5 hover:bg-black/10 backdrop-blur-md p-3 rounded-full text-black transition-all opacity-0 group-hover:opacity-100 cursor-pointer border border-black/10 z-10"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </>
            )}

            {/* Dots Indicator */}
            {slides.length > 1 && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-10">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${currentIndex === index ? 'bg-black w-8' : 'bg-black/20 hover:bg-black/40'
                                }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
