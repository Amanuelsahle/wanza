"use client";

import {
  createContext,
  useState,
  useEffect,
  useRef,
  useContext,
  useCallback,
} from "react";
import { useUser } from "@clerk/nextjs";
import {
  addProductToCart,
  fetchCart,
  fetchProducts,
  removeCartItem,
  updateCartItemQuantity,
} from "@/lib/api/client";
import type { CartItem, Product } from "@/types/product";

const WanzaContext = createContext<any>(null);

const IMAGE_PRESETS = [
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1627124118123-24d1858973b7?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=80&w=600",
];

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

export function WanzaProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState([]);
  const [activeView, setActiveView] = useState("store");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [addProductOpen, setAddProductOpen] = useState(false);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [aiStudioOpen, setAiStudioOpen] = useState(false);
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [ordersOpen, setOrdersOpen] = useState(false);

  const productsSectionRef = useRef<HTMLDivElement>(null);
  const { isSignedIn, isLoaded } = useUser();

  const showToast = useCallback((message: string, type: ToastType = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const loadProducts = useCallback(async () => {
    try {
      setProductsLoading(true);
      const nextProducts = await fetchProducts();
      setProducts(nextProducts);
    } catch {
      showToast("Failed to load products from the database.", "error");
    } finally {
      setProductsLoading(false);
    }
  }, [showToast]);

  const loadCart = useCallback(async () => {
    try {
      const nextCart = await fetchCart();
      setCart(nextCart);
    } catch {
      setCart([]);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn) {
      loadCart();
      return;
    }

    setCart([]);
  }, [isLoaded, isSignedIn, loadCart]);

  const handleAddToCart = async (product: Product) => {
    if (!isSignedIn || !isLoaded) {
      showToast("You must be logged in to add items to your cart", "error");
      return;
    }

    if (!product.stock) return;

    try {
      const nextCart = await addProductToCart(product.id);
      setCart(nextCart);
      showToast(
        `"${product.title}" has been added to your shopping bag!`,
        "success",
      );
    } catch {
      showToast("Could not add item to your cart.", "error");
    }
  };

  const handleUpdateCartQuantity = async (productId: string, amount: number) => {
    try {
      const nextCart = await updateCartItemQuantity(productId, amount);
      setCart(nextCart);
    } catch {
      showToast("Could not update cart quantity.", "error");
    }
  };

  const handleRemoveCartItem = async (productId: string) => {
    try {
      const nextCart = await removeCartItem(productId);
      setCart(nextCart);
      showToast("Item removed from your bag.", "info");
    } catch {
      showToast("Could not remove item from cart.", "error");
    }
  };

  return (
    <WanzaContext.Provider
      value={{
        products,
        setProducts,
        productsLoading,
        refreshProducts: loadProducts,
        cart,
        setCart,
        orders,
        setOrders,
        activeView,
        setActiveView,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        toasts,
        showToast,
        showApiKeyModal,
        setShowApiKeyModal,
        cartOpen,
        setCartOpen,
        checkoutOpen,
        setCheckoutOpen,
        checkoutStep,
        setCheckoutStep,
        ordersOpen,
        setOrdersOpen,
        addProductOpen,
        setAddProductOpen,
        detailProduct,
        setDetailProduct,
        aiStudioOpen,
        setAiStudioOpen,
        aiChatOpen,
        setAiChatOpen,
        productsSectionRef,
        handleAddToCart,
        handleUpdateCartQuantity,
        handleRemoveCartItem,
        refreshCart: loadCart,
        IMAGE_PRESETS,
      }}
    >
      {children}
    </WanzaContext.Provider>
  );
}

export function useWanza() {
  return useContext(WanzaContext);
}
