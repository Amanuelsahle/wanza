"use client";
import { useWanza } from "../context/wanza-context";
import { Sparkles, ArrowRight } from "lucide-react";

export default function Footer() {
    const { setActiveView, setSelectedCategory } = useWanza();

    return (
        <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-12 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="md:col-span-2">
                        <div className="flex items-center space-x-2 text-white mb-4">
                            <span className="bg-indigo-600 p-1.5 rounded-lg flex items-center justify-center">
                                <Sparkles className="w-4 h-4" />
                            </span>
                            <span className="text-xl font-bold tracking-tight">
                                WANZA Modern Goods
                            </span>
                        </div>
                        <p className="text-sm text-slate-400 max-w-sm">
                            Premium curated home decor, lifestyle accessories, and
                            productivity electronics.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold text-sm mb-4">Explore</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <button
                                    onClick={() => {
                                        setActiveView("store");
                                        setSelectedCategory("all");
                                    }}
                                    className="hover:text-white transition-colors duration-200 text-left"
                                >
                                    Store Catalog
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => {
                                        setActiveView("store");
                                        setSelectedCategory("Electronics");
                                    }}
                                    className="hover:text-white transition-colors duration-200 text-left"
                                >
                                    Electronics Collection
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => {
                                        setActiveView("store");
                                        setSelectedCategory("Lifestyle");
                                    }}
                                    className="hover:text-white transition-colors duration-200 text-left"
                                >
                                    Lifestyle Design
                                </button>
                            </li>
                        </ul>
                    </div>


                </div>
                <div className="border-t border-slate-800 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
                    <span>
                        &copy; 2026 WANZA Modern Goods. Built
                        with NEXT.JS
                    </span>
                    <div className="flex space-x-4">
                        <button className="hover:text-slate-300">Privacy Policy</button>
                        <button className="hover:text-slate-300">Terms of Service</button>
                    </div>
                </div>
            </div>
        </footer>
    );
}