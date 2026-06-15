import { useWanza } from "@/context/wanza-context";
import { X, ShoppingCart } from "lucide-react";


export default function ProductDetailModal() {
    const { detailProduct, setDetailProduct, handleAddToCart } = useWanza();

    if (!detailProduct) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
            <div
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                onClick={() => setDetailProduct(null)}
            />

            <div className="bg-white rounded-2xl overflow-hidden shadow-2xl max-w-2xl w-full relative z-10 animate-scaleUp">
                <button
                    onClick={() => setDetailProduct(null)}
                    className="absolute top-4 right-4 bg-white/80 hover:bg-slate-100 p-2 rounded-full text-slate-500 transition-all shadow-md z-10"
                >
                    <X className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className="h-64 md:h-full min-h-[300px] relative bg-slate-100">
                        <img
                            className="w-full h-full object-cover"
                            src={detailProduct.image}
                            alt={detailProduct.title}
                        />
                    </div>
                    <div className="p-6 md:p-8 flex flex-col justify-between bg-white">
                        <div>
                            <span className="text-indigo-600 text-xs font-bold uppercase tracking-widest bg-indigo-50 px-2.5 py-1 rounded-full">
                                {detailProduct.category}
                            </span>
                            <h3 className="text-xl md:text-2xl font-extrabold text-slate-900 mt-3 leading-snug">
                                {detailProduct.title}
                            </h3>
                            <h4 className="text-lg md:text-xl font-black text-slate-900 mt-2">
                                ${detailProduct.price.toFixed(2)}
                            </h4>
                            <div className="border-t border-slate-100 mt-4 pt-4">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    Product Story
                                </p>
                                <p className="text-slate-500 text-sm mt-1.5 leading-relaxed font-light">
                                    {detailProduct.description}
                                </p>
                            </div>
                        </div>
                        <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                            {!detailProduct.stock ? (
                                <button
                                    disabled
                                    className="w-full bg-slate-100 text-slate-400 font-bold py-3 rounded-xl cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    Out of Stock
                                </button>
                            ) : (
                                <button
                                    onClick={() => {
                                        handleAddToCart(detailProduct);
                                        setDetailProduct(null);
                                    }}
                                    className="flex-grow bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                                >
                                    <ShoppingCart className="w-4 h-4" />
                                    <span>Add to Bag</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}