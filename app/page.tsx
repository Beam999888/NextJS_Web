'use client';
import { useState, useEffect } from 'react';
import { useLanguage } from "./context/LanguageContext";
import HomeSlider from "./components/HomeSlider";

interface HomeItem {
  id: number;
  title: string;
  description: string;
  imageUrls: string[];
}

function isVideo(url: string) {
  return url.match(/\.(mp4|webm|ogg)$/i);
}

function HomeItemCard({ item }: { item: HomeItem }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (!item.imageUrls || item.imageUrls.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % item.imageUrls.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [item.imageUrls]);

  const nextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!item.imageUrls) return;
    setCurrentImageIndex((prev) => (prev + 1) % item.imageUrls.length);
  };

  const prevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!item.imageUrls) return;
    setCurrentImageIndex((prev) => (prev - 1 + item.imageUrls.length) % item.imageUrls.length);
  };

  return (
    <div className="group cursor-pointer">
      <div className="w-full aspect-[4/3] bg-gray-50 mb-6 relative overflow-hidden group-hover:shadow-xl transition-all duration-500 rounded-3xl">
        {item.imageUrls && item.imageUrls.length > 0 ? (
          <>
            {item.imageUrls.map((url, index) => (
              <div
                key={index}
                className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
              >
                {isVideo(url) ? (
                  <video src={url} className="w-full h-full object-cover" autoPlay muted loop playsInline />
                ) : (
                  <img src={url} alt={`${item.title} - ${index}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                )}
              </div>
            ))}

            {/* Controls */}
            {item.imageUrls.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center hover:bg-white transition-colors opacity-0 group-hover:opacity-100 shadow-md"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center hover:bg-white transition-colors opacity-0 group-hover:opacity-100 shadow-md"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
              </>
            )}

            {/* Dots */}
            {item.imageUrls.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                {item.imageUrls.map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${idx === currentImageIndex ? 'bg-white' : 'bg-white/50'}`}
                  ></div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-100 uppercase tracking-widest text-[10px] font-bold">
            No Media
          </div>
        )}
      </div>
      <div className="border-b border-black/5 pb-6 group-hover:border-black/20 transition-colors">
        <h3 className="text-2xl font-['Tenor_Sans',serif] mb-3">{item.title}</h3>
        <p className="text-sm text-black/60 font-light leading-relaxed line-clamp-2">{item.description}</p>
      </div>
    </div>
  );
}

export default function Home() {
  const { t } = useLanguage();
  const [slides, setSlides] = useState<any[]>([]);
  const [homeItems, setHomeItems] = useState<HomeItem[]>([]);
  const [content, setContent] = useState({ role: '', title: '', bio: '', itemsTitle: '', itemsDescription: '' });

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const res = await fetch('/api/home');
        if (res.ok) {
          const data = await res.json();
          setSlides(data.slides || []);
          setHomeItems(data.homeItems || []);
          setContent({
            role: data.role || '',
            title: data.title || '',
            bio: data.bio || '',
            itemsTitle: data.itemsTitle || '',
            itemsDescription: data.itemsDescription || ''
          });
        }
      } catch (error) {
        console.error('Failed to fetch home data', error);
      }
    };
    fetchHomeData();
  }, []);

  return (
    <div className="w-full">
      {/* Home Slider at the top */}
      {slides.length > 0 && (
        <div className="container mx-auto px-6 pt-10">
          <HomeSlider slides={slides} />
        </div>
      )}

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 py-12 text-center animate-fade-in-up">
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-12 shadow-lg max-w-4xl mx-auto">
          <p className="text-sm md:text-base font-bold uppercase tracking-[0.3em] text-black mb-6">
            {content.role || t.home.role}
          </p>
          <h1 className="text-5xl md:text-7xl lg:text-9xl font-['Tenor_Sans',serif] leading-none mb-8 text-black whitespace-pre-line">
            {content.title || 'ANUKUN\nBOONTHA'}
          </h1>
          <p className="max-w-xl text-black font-light leading-relaxed mb-12 mx-auto">
            {content.bio || t.home.bio}
          </p>
          <a href="/profile" className="group relative inline-flex items-center gap-3 text-sm font-bold uppercase tracking-[0.2em] border-b border-black pb-1 hover:text-black hover:border-black transition-all">
            {t.home.discover}
            <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>

      {/* Dynamic Home Items Grid */}
      {homeItems.length > 0 && (
        <div className="container mx-auto px-6 py-20 pb-40">
          {/* Section Header */}
          <div className="mb-20 text-center animate-fade-in-up">
            <h2 className="text-4xl md:text-6xl font-['Tenor_Sans',serif] mb-6 text-black uppercase tracking-wider">
              {content.itemsTitle || "Selected Works"}
            </h2>
            <div className="h-0.5 w-20 bg-black/10 mx-auto mb-8"></div>
            <p className="max-w-xl mx-auto text-black/60 font-light leading-relaxed whitespace-pre-line">
              {content.itemsDescription || "A collection of projects exploring security vulnerabilities and defensive strategies."}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-x-12 gap-y-20">
            {homeItems.map((item) => (
              <HomeItemCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}