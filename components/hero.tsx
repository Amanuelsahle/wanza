"use client";
import { useWanza } from "@/context/wanza-context";
import { Sparkles, ArrowDown } from "lucide-react";

export default function HeroBanner() {
    const { productsSectionRef, setAiStudioOpen } = useWanza();

    return (
        <div className="relative bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white py-16 md:py-24 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(99,102,241,0.15),transparent_45%)]" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="max-w-2xl">

                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mt-4 mb-6 leading-tight">
                        Elevate Your Everyday <br />
                        <span className="bg-gradient-to-r from-indigo-300 to-violet-300 bg-clip-text text-transparent">
                            Living Space
                        </span>
                    </h1>
                    <p className="text-base md:text-lg text-slate-300 mb-8 max-w-lg font-light leading-relaxed">
                        A curated selection of minimalist design essentials.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <button
                            onClick={() =>
                                productsSectionRef.current?.scrollIntoView({
                                    behavior: "smooth",
                                })
                            }
                            className="bg-white hover:bg-slate-100 text-slate-900 font-bold px-6 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-sm flex items-center gap-2"
                        >
                            Browse Collection <ArrowDown className="w-4 h-4" />
                        </button>

                    </div>
                </div>
            </div>
        </div>
    );
}