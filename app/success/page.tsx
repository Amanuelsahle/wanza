import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { CheckCircle } from "lucide-react";
import { stripe } from "@/lib/stripe";
import { clearCart } from "@/lib/db/carts";
import RefreshCartOnSuccess from "@/components/refreshCartOnSuccess";

interface SuccessPageProps {
  searchParams: Promise<{ session_id?: string }>;
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const { session_id } = await searchParams;
  const { userId } = await auth();

  if (!session_id || !userId) {
    redirect("/");
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (
      session.payment_status === "paid" &&
      session.metadata?.userId === userId
    ) {
      await clearCart(userId);
    }
  } catch (error) {
    console.error("Failed to verify checkout session:", error);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <RefreshCartOnSuccess />
      <CheckCircle className="w-16 h-16 text-emerald-500 mb-4" />
      <h1 className="text-2xl font-bold text-slate-900">Payment Successful</h1>
      <p className="text-slate-500 mt-2 max-w-md">
        Thank you for your order. Your payment was processed securely through
        Stripe and your cart has been cleared.
      </p>
      <Link
        href="/"
        className="mt-8 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg transition-all"
      >
        Continue Shopping
      </Link>
    </div>
  );
}
