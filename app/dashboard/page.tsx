"use client";
import { useWanza } from "@/context/wanza-context";
import {
    LayoutDashboard,
    Activity,
    Grid,
    Calculator,
    TrendingUp,
    ShoppingCart,
    ShoppingBag,
    Plus,
    Trash2,

} from "lucide-react";

import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import AddProductModal from "@/components/modals/addProduct";
import { deleteProduct, toggleProductStock } from "@/lib/api/client";
import type { Product } from "@/types/product";

export default function AdminDashboard() {
    const { products, orders, showToast, setAddProductOpen, refreshProducts } =
        useWanza();

    const totalRevenue = orders.reduce((acc: number, order: any) => acc + order.total, 0);
    const baselineChartData = [
        { name: "Mon", revenue: 120 },
        { name: "Tue", revenue: 190 },
        { name: "Wed", revenue: 150 },
        { name: "Thu", revenue: 480 },
        { name: "Fri", revenue: 320 },
        { name: "Sat", revenue: 610 },
        { name: "Sun", revenue: 540 + totalRevenue },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-6 mb-8 gap-4">
                <div>
                    <span className="bg-indigo-100 text-indigo-700 text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-md">
                        Management
                    </span>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1.5">
                        Operational Dashboard
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Configure stock, update your inventory, and view real-time sales
                        metrics.
                    </p>
                </div>

                <button
                    onClick={() => setAddProductOpen(true)}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-3 rounded-xl shadow-lg shadow-indigo-200 text-sm self-start md:self-auto transition-all duration-200"
                >
                    <Plus className="w-5 h-5" />
                    <span>Add New Product</span>
                </button>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs uppercase font-extrabold tracking-widest text-slate-400">
                            Total Revenue
                        </p>
                        <h3 className="text-2xl font-extrabold text-slate-900 mt-2">
                            ${totalRevenue.toFixed(2)}
                        </h3>
                        <p className="text-xs text-emerald-500 font-semibold mt-1.5 flex items-center gap-1">
                            <TrendingUp className="w-3.5 h-3.5" /> Live sales
                        </p>
                    </div>
                    <span className="bg-emerald-50 text-emerald-600 p-3.5 rounded-2xl">
                        <Calculator className="w-6 h-6" />
                    </span>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs uppercase font-extrabold tracking-widest text-slate-400">
                            Orders Processed
                        </p>
                        <h3 className="text-2xl font-extrabold text-slate-900 mt-2">
                            {orders.length}
                        </h3>
                        <p className="text-xs text-indigo-500 font-semibold mt-1.5 flex items-center gap-1">
                            <Activity className="w-3.5 h-3.5" /> Live feed updating
                        </p>
                    </div>
                    <span className="bg-indigo-50 text-indigo-600 p-3.5 rounded-2xl">
                        <ShoppingBag className="w-6 h-6" />
                    </span>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs uppercase font-extrabold tracking-widest text-slate-400">
                            Catalog Count
                        </p>
                        <h3 className="text-2xl font-extrabold text-slate-900 mt-2">
                            {products.length} Products
                        </h3>
                        <p className="text-xs text-slate-500 font-semibold mt-1.5">
                            Active items
                        </p>
                    </div>
                    <span className="bg-violet-50 text-violet-600 p-3.5 rounded-2xl">
                        <Grid className="w-6 h-6" />
                    </span>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs uppercase font-extrabold tracking-widest text-slate-400">
                            Avg Order Value
                        </p>
                        <h3 className="text-2xl font-extrabold text-slate-900 mt-2">
                            $
                            {orders.length > 0
                                ? (totalRevenue / orders.length).toFixed(2)
                                : "0.00"}
                        </h3>
                        <p className="text-xs text-slate-500 font-semibold mt-1.5">
                            Average ticket size
                        </p>
                    </div>
                    <span className="bg-amber-50 text-amber-600 p-3.5 rounded-2xl">
                        <Calculator className="w-6 h-6" />
                    </span>
                </div>
            </div>

            {/* Recharts Analytics Panel & Live Orders */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-slate-800 text-base">
                            Weekly Sales Trend
                        </h3>
                        <span className="text-xs text-indigo-600 font-semibold flex items-center gap-1 bg-indigo-50 px-2.5 py-1 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />{" "}
                            Live Metrics
                        </span>
                    </div>
                    <div className="h-64 relative w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={baselineChartData}>
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                                <YAxis
                                    stroke="#94a3b8"
                                    fontSize={12}
                                    tickFormatter={(val) => `$${val}`}
                                />
                                <Tooltip formatter={(value) => [`$${value}`, "Gross Profit"]} />
                                <Line
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#4f46e5"
                                    strokeWidth={3}
                                    activeDot={{ r: 8 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Live Orders Feed */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
                    <h3 className="font-bold text-slate-800 text-base mb-4 flex items-center justify-between">
                        <span>Live Transaction Feed</span>
                        <span className="text-xs bg-rose-100 text-rose-700 px-2.5 py-0.5 rounded-full font-bold">
                            {orders.length} Active
                        </span>
                    </h3>
                    <div className="overflow-y-auto flex-grow max-h-64 space-y-3.5 pr-2">
                        {orders.length === 0 ? (
                            <div className="flex flex-col items-center justify-center text-center py-12 text-slate-400">
                                <ShoppingCart className="w-8 h-8 mb-2 opacity-60" />
                                <p className="text-xs font-semibold">No orders received yet.</p>
                                <p className="text-[10px] text-slate-400 mt-0.5">
                                    Place an order from the shop and check back!
                                </p>
                            </div>
                        ) : (
                            orders.map((order: any) => (
                                <div
                                    key={order.orderId}
                                    className="border-b border-slate-100 pb-3.5 flex items-center justify-between gap-3 text-xs"
                                >
                                    <div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="font-extrabold text-slate-900">
                                                {order.orderId}
                                            </span>
                                            <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[9px] uppercase tracking-wide">
                                                Paid
                                            </span>
                                        </div>
                                        <p className="text-slate-500 font-medium mt-1">
                                            Customer: {order.customerName}
                                        </p>
                                        <p className="text-[10px] text-slate-400">
                                            {order.date} •{" "}
                                            {order.items.reduce(
                                                (sum: number, item: any) => sum + item.quantity,
                                                0,
                                            )}{" "}
                                            Items
                                        </p>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <span className="font-bold text-slate-900 text-sm">
                                            ${order.total.toFixed(2)}
                                        </span>
                                        <p className="text-[9px] text-slate-400 mt-0.5">
                                            {order.status}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Inventory Table */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm mt-8 overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h3 className="font-bold text-slate-800 text-base">
                        Active Product Inventory
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs font-bold uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-3.5">Product Detail</th>
                                <th className="px-6 py-3.5">Category</th>
                                <th className="px-6 py-3.5">Price</th>
                                <th className="px-6 py-3.5">Availability</th>
                                <th className="px-6 py-3.5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {products.map((p: Product) => (
                                <tr
                                    key={p.id}
                                    className="hover:bg-slate-50/70 transition-colors"
                                >
                                    <td className="px-6 py-4 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200">
                                            <img
                                                className="w-full h-full object-cover"
                                                src={p.image}
                                                alt={p.title}
                                            />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-800 text-xs">
                                                {p.title}
                                            </h4>
                                            <p className="text-[10px] text-slate-400 truncate max-w-xs">
                                                {p.description}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-xs font-semibold text-slate-500">
                                        {p.category}
                                    </td>
                                    <td className="px-6 py-4 text-xs font-bold text-slate-800">
                                        ${p.price.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={async () => {
                                                try {
                                                    await toggleProductStock(p.id, !p.stock);
                                                    await refreshProducts();
                                                    showToast("Product availability toggled.", "success");
                                                } catch {
                                                    showToast("Failed to update product stock.", "error");
                                                }
                                            }}
                                            className={`px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wide uppercase transition-all duration-150 ${p.stock ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200" : "bg-rose-100 text-rose-800 hover:bg-rose-200"}`}
                                        >
                                            {p.stock ? "Active Store" : "Out of Stock"}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={async () => {
                                                try {
                                                    await deleteProduct(p.id);
                                                    await refreshProducts();
                                                    showToast("Product removed from catalog.", "info");
                                                } catch {
                                                    showToast("Failed to delete product.", "error");
                                                }
                                            }}
                                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                            title="Delete Product"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <AddProductModal />
        </div>
    );
}
