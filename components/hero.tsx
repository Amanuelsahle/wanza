"use client";
import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useWanza } from "@/context/wanza-context";
import type { Product } from "@/types/product";

export default function HeroBanner() {
  const { setDetailProduct } = useWanza();
  const [slides, setSlides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        const products: Product[] = data.products || [];

        // Get latest 4 products and format as slides
        const latestProducts = products.slice(0, 4);
        const formattedSlides = latestProducts.map((product, idx) => ({
          id: product.id,
          title: product.title,
          subtitle: product.category,
          description: product.description,
          price: `$${product.price.toFixed(2)}`,
          badge:
            idx === 0
              ? "New Arrival"
              : idx === 1
                ? "Featured"
                : idx === 2
                  ? "Popular"
                  : "Trending",
          img: product.image,
          alt: product.title,
          accent: ["#c8a97e", "#a89070", "#b0a090", "#d4b896"][idx % 4],
          product: product,
        }));

        setSlides(formattedSlides);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestProducts();
  }, []);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: true }),
  ]);
  const [selected, setSelected] = useState(0);
  const [prevSelected, setPrevSelected] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevSelected(selected);
    setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi, selected]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  const prev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const next = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-background">
      {loading || slides.length === 0 ? (
        <div className="w-full h-full flex items-center justify-center bg-slate-100">
          <div className="text-center">
            <div className="inline-block w-8 h-8 border-4 border-slate-300 border-t-slate-700 rounded-full animate-spin"></div>
            <p className="mt-4 text-slate-600">Loading products...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Carousel viewport */}
          <div className="overflow-hidden h-full" ref={emblaRef}>
            <div className="flex h-full">
              {slides.map((slide) => (
                <div key={slide.id} className="relative flex-[0_0_100%] h-full">
                  {/* Background image */}
                  <div className="absolute inset-0">
                    <img
                      src={slide.img}
                      alt={slide.alt}
                      className="w-full h-full object-cover"
                    />
                    {/* Dark overlay — left side heavier for text legibility */}
                    <div className="absolute inset-0 bg-linear-to-r from-black/85 via-black/50 to-black/10" />
                  </div>

                  {/* Slide content — positioned over image */}
                  <div className="relative z-10 flex h-full items-center">
                    <div className="px-12 md:px-24 max-w-2xl">
                      <span
                        className="inline-block px-3 py-1 text-xs tracking-widest uppercase mb-6"
                        style={{
                          color: slide.accent,
                          border: `1px solid ${slide.accent}40`,
                        }}
                      >
                        {slide.badge}
                      </span>
                      <h1
                        className="mb-1 tracking-tight"
                        style={{
                          fontSize: "clamp(2.5rem, 6vw, 5rem)",
                          fontWeight: 300,
                          lineHeight: 1.1,
                          color: "#f5f0eb",
                          fontFamily: "Georgia, 'Times New Roman', serif",
                        }}
                      >
                        {slide.title}
                      </h1>
                      <p
                        className="mb-6 tracking-widest uppercase text-sm"
                        style={{ color: slide.accent }}
                      >
                        {slide.subtitle}
                      </p>
                      <p
                        className="mb-10 max-w-md leading-relaxed"
                        style={{ color: "#c0b8b0", fontSize: "1rem" }}
                      >
                        {slide.description}
                      </p>
                      <div className="flex items-center gap-6">
                        <button
                          onClick={() => setDetailProduct(slide.product)}
                          className="flex items-center gap-2 px-8 py-4 transition-all duration-300 hover:gap-3"
                          style={{
                            background: slide.accent,
                            color: "#0a0a0a",
                            fontWeight: 500,
                            letterSpacing: "0.08em",
                            fontSize: "0.85rem",
                            textTransform: "uppercase",
                          }}
                        >
                          <ShoppingBag size={16} />
                          Shop Now
                        </button>
                        <span
                          style={{
                            color: slide.accent,
                            fontSize: "1.5rem",
                            fontFamily: "Georgia, serif",
                            fontWeight: 300,
                          }}
                        >
                          {slide.price}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation arrows */}
          <button
            onClick={prev}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center border border-white/20 text-white/70 hover:text-white hover:border-white/50 transition-all duration-200 backdrop-blur-sm"
            aria-label="Previous slide"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={next}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center border border-white/20 text-white/70 hover:text-white hover:border-white/50 transition-all duration-200 backdrop-blur-sm"
            aria-label="Next slide"
          >
            <ChevronRight size={20} />
          </button>

          {/* Dot indicators */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => emblaApi?.scrollTo(i)}
                className="transition-all duration-400"
                aria-label={`Go to slide ${i + 1}`}
                style={{
                  width: selected === i ? "2rem" : "0.5rem",
                  height: "0.5rem",
                  background:
                    selected === i
                      ? slides[selected].accent
                      : "rgba(255,255,255,0.3)",
                }}
              />
            ))}
          </div>

          {/* Slide counter */}
          <div className="absolute bottom-8 right-8 z-20 text-white/40 text-xs tracking-widest font-mono">
            {String(selected + 1).padStart(2, "0")} /{" "}
            {String(slides.length).padStart(2, "0")}
          </div>
        </>
      )}
    </div>
  );
}
