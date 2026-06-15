"use client";
import { useWanza } from "../../context/wanza-context";
import { calculateCartTotals } from "@/lib/cart-totals";
import { Trash2, ShoppingCart, X, ArrowRight, ShoppingBag } from "lucide-react";

export default function CartDrawer() {
    const {
        cart,
        cartOpen,
        setCartOpen,
        handleUpdateCartQuantity,
        handleRemoveCartItem,
        setCheckoutOpen,
        setCheckoutStep,
    } = useWanza();

    if (!cartOpen) return null;

    const {
        subtotal: cartSubtotal,
        shipping: cartShipping,
        tax: cartTax,
        total: cartTotal,
    } = calculateCartTotals(cart);

    return (
        <div
            className="fixed inset-0 z-50 overflow-hidden flex"
            aria-modal="true"
            role="dialog"
        >
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                onClick={() => setCartOpen(false)}
            />

            <div className="ml-auto max-w-md w-full h-full bg-white shadow-2xl flex flex-col relative z-10 animate-slideLeft">
                <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <ShoppingCart className="w-5 h-5 text-indigo-600" />
                        <h2 className="text-lg font-bold text-slate-900">
                            Your Shopping Cart
                        </h2>
                    </div>
                    <button
                        onClick={() => setCartOpen(false)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-grow overflow-y-auto px-6 py-4 divide-y divide-slate-100">
                    {cart.length === 0 ? (
                        <div className="flex flex-col items-center justify-center text-center py-24 text-slate-400">
                            <ShoppingBag className="w-12 h-12 mb-3 text-slate-300" />
                            <h4 className="font-bold text-slate-800 text-base">
                                Your Bag is Empty
                            </h4>
                            <p className="text-xs text-slate-500 mt-1 max-w-xs">
                                Explore our catalog of modern design assets to complete your
                                setups.
                            </p>
                            <button
                                onClick={() => setCartOpen(false)}
                                className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md"
                            >
                                Start Shopping
                            </button>
                        </div>
                    ) : (
                        cart.map((item: any) => (
                            <div
                                key={item.product.id}
                                className="flex py-4 items-center justify-between gap-4"
                            >
                                <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0">
                                    <img
                                        className="w-full h-full object-cover"
                                        src={item.product.image}
                                        alt={item.product.title}
                                    />
                                </div>
                                <div className="flex-grow">
                                    <h4 className="font-bold text-slate-800 text-sm line-clamp-1">
                                        {item.product.title}
                                    </h4>
                                    <p className="text-xs text-indigo-600 font-semibold mt-0.5">
                                        ${item.product.price.toFixed(2)} each
                                    </p>
                                    <div className="flex items-center space-x-2 mt-2">
                                        <button
                                            onClick={() =>
                                                handleUpdateCartQuantity(item.product.id, -1)
                                            }
                                            className="w-6 h-6 rounded-md border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-all text-sm"
                                        >
                                            -
                                        </button>
                                        <span className="text-xs font-semibold text-slate-800">
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() =>
                                                handleUpdateCartQuantity(item.product.id, 1)
                                            }
                                            className="w-6 h-6 rounded-md border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-all text-sm"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleRemoveCartItem(item.product.id)}
                                    className="text-slate-400 hover:text-rose-500 p-1 rounded-lg transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {cart.length > 0 && (
                    <div className="border-t border-slate-200 px-6 py-6 bg-slate-50">
                        <div className="space-y-2 mb-4">
                            <div className="flex justify-between text-sm text-slate-500">
                                <span>Subtotal</span>
                                <span>${cartSubtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-slate-500">
                                <span>Estimated Shipping</span>
                                <span>
                                    {cartShipping === 0 ? "FREE" : `$${cartShipping.toFixed(2)}`}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm text-slate-500">
                                <span>Estimated Tax (8.25%)</span>
                                <span>${cartTax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-200">
                                <span>Order Total</span>
                                <span className="text-indigo-600">${cartTotal.toFixed(2)}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                setCartOpen(false);
                                setCheckoutOpen(true);
                                setCheckoutStep(1);
                            }}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-200 transition-all duration-200 flex items-center justify-center gap-2"
                        >
                            <span>Proceed to Checkout</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
