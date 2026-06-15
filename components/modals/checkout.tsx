"use client";

import { useWanza } from "@/context/wanza-context";
import { calculateCartTotals } from "@/lib/cart-totals";
import { handleCheckout } from "@/app/actions/stripe";
import type { CartItem } from "@/types/product";
import { X, CreditCard, ArrowLeft, Lock } from "lucide-react";
import { useFormStatus } from "react-dom";

function PayButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-200 transition-all duration-200 flex items-center justify-center gap-2"
    >
      <CreditCard className="w-4 h-4" />
      <span>{pending ? "Redirecting to Stripe..." : "Pay with Stripe"}</span>
    </button>
  );
}

export default function CheckoutModal() {
  const { cart, checkoutOpen, setCheckoutOpen, setCheckoutStep, checkoutStep } =
    useWanza();

  if (!checkoutOpen || cart.length === 0) return null;

  const { subtotal, shipping, tax, total } = calculateCartTotals(cart);

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
    >
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={() => {
          setCheckoutOpen(false);
          setCheckoutStep(1);
        }}
      />

      <div className="bg-white rounded-2xl overflow-hidden shadow-2xl max-w-lg w-full relative z-10 animate-scaleUp">
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Checkout</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Step {checkoutStep} of 2 —{" "}
              {checkoutStep === 1 ? "Review order" : "Payment"}
            </p>
          </div>
          <button
            onClick={() => {
              setCheckoutOpen(false);
              setCheckoutStep(1);
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-4 max-h-[50vh] overflow-y-auto divide-y divide-slate-100">
          {cart.map((item: CartItem) => (
            <div
              key={item.product.id}
              className="flex py-3 items-center gap-3"
            >
              <div className="w-14 h-14 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0">
                <img
                  className="w-full h-full object-cover"
                  src={item.product.image}
                  alt={item.product.title}
                />
              </div>
              <div className="flex-grow min-w-0">
                <h4 className="font-bold text-slate-800 text-sm line-clamp-1">
                  {item.product.title}
                </h4>
                <p className="text-xs text-slate-500">
                  Qty {item.quantity} × ${item.product.price.toFixed(2)}
                </p>
              </div>
              <span className="text-sm font-bold text-slate-900">
                ${(item.product.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 space-y-2">
          <div className="flex justify-between text-sm text-slate-500">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-slate-500">
            <span>Shipping</span>
            <span>{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
          </div>
          <div className="flex justify-between text-sm text-slate-500">
            <span>Tax (8.25%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-200">
            <span>Total</span>
            <span className="text-indigo-600">${total.toFixed(2)}</span>
          </div>
        </div>

        <div className="px-6 py-5 border-t border-slate-200">
          {checkoutStep === 1 ? (
            <button
              onClick={() => setCheckoutStep(2)}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-200 transition-all duration-200"
            >
              Continue to Payment
            </button>
          ) : (
            <>
              <form action={handleCheckout}>
                <PayButton />
              </form>
              <p className="flex items-center justify-center gap-1.5 text-xs text-slate-400 mt-3">
                <Lock className="w-3 h-3" />
                Secure payment powered by Stripe
              </p>
              <button
                type="button"
                onClick={() => setCheckoutStep(1)}
                className="w-full mt-3 text-sm text-slate-500 hover:text-slate-700 font-medium flex items-center justify-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to review
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
