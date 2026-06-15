"use client";
import { useWanza } from "../context/wanza-context";
import { CheckCircle, AlertCircle } from "lucide-react";

export default function ToastStack() {
    const { toasts } = useWanza();
    return (
        <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2 pointer-events-none">
            {toasts.map((toast: any) => (
                <div
                    key={toast.id}
                    className={`pointer-events-auto bg-white border-l-4 p-4 rounded-xl shadow-lg flex items-center space-x-3 transition-all duration-300 transform translate-x-0 ${toast.type === "success" ? "border-emerald-500 text-emerald-800" : "border-indigo-500 text-indigo-800"}`}
                >
                    {toast.type === "success" ? (
                        <CheckCircle className="w-4.5 h-4.5 text-emerald-500 flex-shrink-0" />
                    ) : (
                        <AlertCircle className="w-4.5 h-4.5 text-indigo-500 flex-shrink-0" />
                    )}
                    <span className="text-xs font-semibold">{toast.message}</span>
                </div>
            ))}
        </div>
    );
}