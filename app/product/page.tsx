'use client';
import { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../utils/translations';

type ImageSize = 'small' | 'large';

const normalizeImageSize = (value: unknown): ImageSize => (value === 'large' ? 'large' : 'small');

interface Product {
  id: number;
  title: string;
  description: string;
  imageUrls: string[];
  imageSize?: ImageSize;
}

function isVideo(url: string) {
  return url.match(/\.(mp4|webm|ogg)$/i);
}

type T = (typeof translations)['en'];

function ProductCard({ product, t }: { product: Product; t: T }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const imageSize = normalizeImageSize(product.imageSize);

  useEffect(() => {
    if (!product.imageUrls || product.imageUrls.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % product.imageUrls.length);
    }, 4000); // 4 seconds

    return () => clearInterval(interval);
  }, [product.imageUrls]);

  const nextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product.imageUrls) return;
    setCurrentImageIndex((prev) => (prev + 1) % product.imageUrls.length);
  };

  const prevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product.imageUrls) return;
    setCurrentImageIndex((prev) => (prev - 1 + product.imageUrls.length) % product.imageUrls.length);
  };

  return (
    <div className={`group cursor-pointer ${imageSize === 'large' ? 'md:col-span-2' : ''}`}>
      {/* Media Slider */}
      <div className={`w-full ${imageSize === 'large' ? 'h-[360px] md:h-[560px]' : 'aspect-[4/3]'} bg-gray-50 mb-6 relative overflow-hidden group-hover:shadow-xl transition-all duration-500 rounded-3xl`}>
        {product.imageUrls && product.imageUrls.length > 0 ? (
          <>
            {product.imageUrls.map((url, index) => (
              <div
                key={index}
                className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
              >
                {isVideo(url) ? (
                  <video src={url} className="w-full h-full object-cover" autoPlay muted loop playsInline />
                ) : (
                  <img src={url} alt={`${product.title} - ${index}`} className="w-full h-full object-cover" />
                )}
              </div>
            ))}

            {/* Controls */}
            {product.imageUrls.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
              </>
            )}

            {/* Dots */}
            {product.imageUrls.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                {product.imageUrls.map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${idx === currentImageIndex ? 'bg-white' : 'bg-white/50'}`}
                  ></div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-black uppercase tracking-widest text-xs font-bold">
            {t.products.noImage}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="bg-white/55 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/20">
        <h3 className="text-xl font-['Tenor_Sans',serif] mb-2 text-black">{product.title}</h3>
        <p className="text-sm text-black/70 font-light line-clamp-2">{product.description}</p>
      </div>
    </div>
  );
}

export default function Products() {
  const [data, setData] = useState<{ title?: string; description?: string; products?: Product[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products');
        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const products = data?.products || [];

  return (
    <div className="container mx-auto px-6 py-20 pb-40">
      <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-lg">
        {/* Header */}
        <div className="mb-24 text-center animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl font-['Tenor_Sans',serif] mb-6">{data?.title || t.products.title}</h1>
          <div className="w-12 h-[2px] bg-black mx-auto mb-8"></div>
          <p className="text-black/60 font-light max-w-xl mx-auto whitespace-pre-line">
            {data?.description || t.products.subtitle}
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-black animate-pulse">{t.products.loading}</div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-black">{t.products.empty}</div>
        ) : (
          /* Grid */
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-20">
            {products.map((product: Product) => (
              <ProductCard key={product.id} product={product} t={t} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
