"use client";
import { useWanza } from "../context/wanza-context";
import { AlertCircle, Search } from "lucide-react";
import ProductCard from "./productCard";
import ProductDetailModal from "./modals/productDetail";
import type { Product } from "@/types/product";

export default function ProductGrid() {
  const {
    products,
    productsLoading,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    productsSectionRef,
  } = useWanza();

  const filteredProducts = products.filter((p: Product) => {
    const matchesCat =
      selectedCategory === "all" ||
      p.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesQuery =
      !searchQuery ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div
      ref={productsSectionRef}
      className="max-w-7xl mx-auto bg-white/90 dark:bg-slate-800 px-4 sm:px-6 lg:px-8 py-8 mt-4"
    >
      {/* Mobile Search */}
      <div className="block md:hidden mb-6">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full bg-slate-100 focus:bg-white text-slate-800 placeholder-slate-400 pl-10 pr-4 py-3 rounded-xl text-sm border border-slate-200 focus:border-indigo-500 outline-none"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-slate-400" />
          </div>
        </div>
      </div>

      {/* Filter Categories */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h2 className="text-2xl bg-linear-to-r from-indigo-600 to-violet-700 bg-clip-text text-transparent font-extrabold  tracking-tight">
            Our Curated Products
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Discover items handpicked for quality and form.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {["all", "Electronics", "Lifestyle", "Accessories"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${selectedCategory === cat ? "bg-indigo-600 text-white shadow-sm" : "bg-white border border-slate-200 hover:bg-slate-50 text-slate-600"}`}
            >
              {cat === "all" ? "All Essentials" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Rendering */}
      {productsLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-slate-500 text-sm">Loading products...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <span className="bg-slate-100 p-4 rounded-full mb-4">
            <AlertCircle className="w-10 h-10 text-slate-400" />
          </span>
          <h3 className="text-lg font-bold text-slate-800">
            No products found
          </h3>
          <p className="text-slate-500 text-sm max-w-md mt-1">
            Adjust search parameters or clear filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
            }}
            className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10 animate-fadeIn">
          {filteredProducts.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
      <ProductDetailModal />
    </div>
  );
}
