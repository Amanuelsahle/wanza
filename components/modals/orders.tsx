"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { useWanza } from "@/context/wanza-context";

interface OrderItem {
  title: string;
  price: number;
  image: string;

  quantity: number;
}

interface Order {
  _id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  createdAt: string;
  paymentSessionId?: string;
}

export default function OrdersModal() {
  const { ordersOpen, setOrdersOpen } = useWanza();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!ordersOpen) return;
    setLoading(true);
    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => {
        setOrders(data.orders ?? []);
      })
      .catch((err) => console.error("Failed to fetch orders", err))
      .finally(() => setLoading(false));
  }, [ordersOpen]);

  if (!ordersOpen) return null;
  console.log(orders);
  return createPortal(
    <div
      className="fixed inset-0 z-50 overflow-hidden flex"
      aria-modal="true"
      role="dialog"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={() => setOrdersOpen(false)}
      ></div>
      {/* Drawer */}
      <div className="ml-auto max-w-md w-full h-full bg-white dark:bg-gray-800 rounded-xl shadow-2xl flex flex-col relative z-10 animate-slideLeft">
        <button
          onClick={() => setOrdersOpen(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100 p-6">
          My Orders
        </h2>
        {loading ? (
          <p className="text-gray-600 dark:text-gray-300 p-6">Loading...</p>
        ) : orders.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300 p-6">
            You have no orders yet.
          </p>
        ) : (
          <ul className="space-y-4 overflow-y-auto flex-grow p-6">
            {orders.map((order) => (
              <li
                key={order._id}
                className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-700"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    Order #{order._id.slice(-6)}
                  </span>
                  <span className="text-gray-600 dark:text-gray-300">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <ul className="space-y-2">
                  {order.items.map((item, idx) => (
                    <li key={idx} className="flex items-center">
                      <img
                        src={item.image ?? "https://via.placeholder.com/150"}
                        alt={item.title ?? "Product image"}
                        className="w-12 h-12 object-cover rounded mr-3"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                          {item.title ?? "Unnamed product"}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-300">
                          Qty: {item.quantity} • ${(item.price ?? 0).toFixed(2)}{" "}
                          each
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 text-right font-semibold text-gray-800 dark:text-gray-200">
                  Total: ${order.total.toFixed(2)}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>,
    document.body,
  );
}
