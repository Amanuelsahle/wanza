import Link from "next/link";
import { XCircle } from "lucide-react";

export default function CancelPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <XCircle className="w-16 h-16 text-slate-400 mb-4" />
      <h1 className="text-2xl font-bold text-slate-900">Checkout Cancelled</h1>
      <p className="text-slate-500 mt-2 max-w-md">
        Your payment was not completed. Your cart items are still saved — you
        can try again whenever you&apos;re ready.
      </p>
      <Link
        href="/"
        className="mt-8 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg transition-all"
      >
        Return to Store
      </Link>
    </div>
  );
}
