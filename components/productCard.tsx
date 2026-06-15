import { useWanza } from "../context/wanza-context";
import { Plus } from "lucide-react";
import type { Product } from "@/types/product";

export default function ProductCard({ product }: { product: Product }) {
    const { handleAddToCart, setDetailProduct } = useWanza();

    return (
        <div
            className={`group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden relative ${!product.stock ? "opacity-70" : ""}`}
        >
            {!product.stock && (
                <span className="absolute top-4 left-4 z-10 bg-slate-900/80 text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md backdrop-blur-sm">
                    Sold Out
                </span>
            )}

            <div
                className="aspect-square bg-slate-100 overflow-hidden relative cursor-pointer"
                onClick={() => setDetailProduct(product)}
            >
                <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    src={product.image}
                    alt={product.title}
                />
            </div>

            <div className="p-6">
                <div className="flex items-center justify-between">
                    <span className="text-indigo-600 text-[10px] font-extrabold tracking-widest uppercase">
                        {product.category}
                    </span>
                    <span className="text-slate-900 font-bold text-base">
                        ${product.price.toFixed(2)}
                    </span>
                </div>
                <h3
                    onClick={() => setDetailProduct(product)}
                    className="font-bold text-slate-800 text-lg mt-1.5 group-hover:text-indigo-600 transition-colors duration-200 cursor-pointer"
                >
                    {product.title}
                </h3>
                <p className="text-slate-400 font-light text-xs mt-1 line-clamp-2">
                    {product.description}
                </p>

                <div className="mt-6">
                    {!product.stock ? (
                        <button
                            disabled
                            className="w-full bg-slate-100 text-slate-400 font-bold py-3 rounded-xl text-xs cursor-not-allowed flex items-center justify-center gap-1.5"
                        >
                            Out of Stock
                        </button>
                    ) : (
                        <button
                            onClick={() => handleAddToCart(product)}
                            className="w-full bg-slate-900 hover:bg-indigo-600 group-hover:bg-indigo-600 text-white font-bold py-3 rounded-xl text-xs transition-all duration-200 shadow-sm flex items-center justify-center gap-1.5"
                        >
                            <Plus className="w-4 h-4" /> Add to Bag
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
