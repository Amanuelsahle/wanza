"use client";

import { useState } from "react";
import { useWanza } from "../../context/wanza-context";
import { createProduct } from "@/lib/api/client";
import { X, Sparkles } from "lucide-react";

export default function AddProductModal() {
  const {
    addProductOpen,
    setAddProductOpen,
    showToast,
    refreshProducts,
    IMAGE_PRESETS,
  } = useWanza();

  const [form, setForm] = useState({
    title: "",
    category: "Electronics",
    price: "",
    description: "",
    image: IMAGE_PRESETS[0],
    customImageUrl: "",
  });
  const [imageSource, setImageSource] = useState<"preset" | "custom">("preset");
  const [isDrafting, setIsDrafting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!addProductOpen) return null;

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalImage =
      imageSource === "custom" && form.customImageUrl.trim()
        ? form.customImageUrl.trim()
        : form.image;

    setIsSubmitting(true);
    try {
      const title = form.title;
      await createProduct({
        title,
        category: form.category,
        price: parseFloat(form.price) || 0,
        description: form.description,
        image: finalImage,
        stock: true,
      });

      await refreshProducts();
      setAddProductOpen(false);
      setForm({
        title: "",
        category: "Electronics",
        price: "",
        description: "",
        image: IMAGE_PRESETS[0],
        customImageUrl: "",
      });
      setImageSource("preset");
      showToast(`"${title}" successfully added!`, "success");
    } catch {
      showToast("Failed to add product to the database.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAIDraft = async () => {
    if (!form.title) {
      showToast("Please write a product title first!", "info");
      return;
    }

    setIsDrafting(true);
    try {
      showToast("AI drafting is not configured yet.", "info");
    } finally {
      setIsDrafting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={() => setAddProductOpen(false)}
      />

      <div className="bg-white rounded-2xl overflow-hidden shadow-2xl max-w-md w-full relative z-10 animate-scaleUp">
        <button
          onClick={() => setAddProductOpen(false)}
          className="absolute top-4 right-4 bg-slate-100 hover:bg-slate-200 p-2 rounded-full text-slate-500 transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="bg-white px-6 pt-6 pb-6 sm:p-8">
          <h3 className="text-lg font-bold text-slate-900 mb-1">
            Create Catalog Product
          </h3>
          <p className="text-slate-400 text-xs mb-6">
            Build a custom design item. It will immediately publish to the
            active storefront grid.
          </p>

          <form onSubmit={handleCreateProduct} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">
                Product Title
              </label>
              <input
                type="text"
                required
                placeholder="Walnut Office Tray"
                value={form.title}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, title: e.target.value }))
                }
                className="w-full text-black bg-slate-50 focus:bg-white p-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">
                  Category
                </label>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, category: e.target.value }))
                  }
                  className="w-full text-black bg-slate-50 focus:bg-white p-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none text-sm"
                >
                  <option value="Electronics">Electronics</option>
                  <option value="Lifestyle">Lifestyle</option>
                  <option value="Accessories">Accessories</option>
                  <option value="AI Custom">AI Custom</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">
                  Price ($ USD)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="24.99"
                  value={form.price}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, price: e.target.value }))
                  }
                  className="w-full text-black bg-slate-50 focus:bg-white p-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none text-sm"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase text-slate-400">
                  Product Image
                </label>
                <div className="flex rounded-lg border border-slate-200 p-0.5 bg-slate-50">
                  <button
                    type="button"
                    onClick={() => setImageSource("preset")}
                    className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide rounded-md transition-all ${imageSource === "preset" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                  >
                    Presets
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageSource("custom")}
                    className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide rounded-md transition-all ${imageSource === "custom" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                  >
                    Custom URL
                  </button>
                </div>
              </div>

              {imageSource === "preset" ? (
                <div className="grid grid-cols-4 gap-2">
                  {IMAGE_PRESETS.map((img: string, idx: number) => (
                    <div
                      key={idx}
                      onClick={() =>
                        setForm((prev) => ({ ...prev, image: img }))
                      }
                      className={`aspect-square rounded-lg overflow-hidden cursor-pointer border-2 hover:opacity-80 transition-all flex items-center justify-center ${form.image === img ? "border-indigo-600 ring-2 ring-indigo-100" : "border-transparent"}`}
                    >
                      <img
                        className="w-full h-full object-contain"
                        src={img}
                        alt="preset"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  <input
                    type="url"
                    required={imageSource === "custom"}
                    placeholder="https://example.com/your-product-image.jpg"
                    value={form.customImageUrl}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        customImageUrl: e.target.value,
                      }))
                    }
                    className="w-full text-black bg-slate-50 focus:bg-white p-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none text-sm"
                  />
                  {form.customImageUrl.trim() && (
                    <div className="aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center">
                      <img
                        className="w-full h-full object-contain"
                        src={form.customImageUrl.trim()}
                        alt="Custom preview"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </div>
                  )}
                  <p className="text-[10px] text-slate-400">
                    Paste a direct link to a JPG, PNG, or WebP image.
                  </p>
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase text-slate-400">
                  Description
                </label>
                <button
                  type="button"
                  disabled={isDrafting}
                  onClick={handleAIDraft}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 bg-indigo-50 px-2 py-0.5 rounded-lg transition-all border border-indigo-100"
                >
                  <Sparkles className="w-3 h-3 text-indigo-500" />{" "}
                  {isDrafting ? "Drafting..." : "AI Auto-Write"}
                </button>
              </div>
              <textarea
                rows={3}
                required
                placeholder="Describe materials, sizing, features..."
                value={form.description}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, description: e.target.value }))
                }
                className="w-full text-black bg-slate-50 focus:bg-white p-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl shadow-md transition-all mt-4"
            >
              {isSubmitting ? "Saving..." : "Add Product & Publish"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
