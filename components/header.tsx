"use client";
import { LayoutDashboard, ShoppingBag, Search, Key, Sparkles, ShoppingCart } from "lucide-react";
import { useWanza } from "@/context/wanza-context";
import Link from "next/link";
import { SignInButton, SignOutButton, SignUpButton, Show, useUser, useClerk } from "@clerk/nextjs";


export type Roles = "admin" | null;


export default function Header() {

  const {
    activeView,
    setActiveView,
    searchQuery,
    setSearchQuery,
    setShowApiKeyModal,
    setCartOpen,
    cart,
  } = useWanza();

  const { isSignedIn, isLoaded, user } = useUser();
  const role = user?.publicMetadata?.role as Roles;

  const { openSignIn } = useClerk();

  const handleAddToCart = () => {
    if (!isSignedIn || !isLoaded) {
      openSignIn();
    } else { setCartOpen(true) }

  };

  const totalCartCount = cart.reduce((sum: number, item: any) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Brand Logo */}
          <Link href="/">
            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => setActiveView("store")}
            >
              <span className="bg-indigo-600 text-white p-2 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </span>
              <span className="text-xl md:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 to-violet-700 bg-clip-text text-transparent">
                WANZA
              </span>
              <span className="hidden sm:inline text-[10px] uppercase font-bold text-slate-400 tracking-widest pt-1">
                Essentials
              </span>
            </div>
          </Link>


          {/* Catalog Search Input */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, styles, categories..."
                className="w-full bg-slate-100 hover:bg-slate-200/70 focus:bg-white text-slate-800 placeholder-slate-400 pl-10 pr-4 py-2 rounded-xl text-sm border border-transparent focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all duration-200"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>

          {/* Action Panels Triggers */}
          <div className="flex items-center space-x-3">
            {role === "admin" && (
              activeView === "store" ? (
                <Link href="/dashboard">
                  <button
                    onClick={() => setActiveView("admin")}
                    className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 hover:bg-slate-100 border border-slate-200 text-slate-700"
                  >
                    <LayoutDashboard className="w-4 h-4 text-indigo-600" />
                    <span className="hidden sm:inline">Admin Panel</span>
                  </button>
                </Link>
              ) : (
                <Link href="/">
                  <button
                    onClick={() => setActiveView("store")}
                    className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-all duration-200 shadow-md"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Shop</span>
                  </button>
                </Link>
              )
            )}


            <button
              onClick={handleAddToCart}
              className="relative p-2.5 rounded-xl hover:bg-slate-100 text-slate-700 transition-all border border-transparent hover:border-slate-200"
            >
              <ShoppingCart className="w-5.5 h-5.5" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center shadow-md animate-bounce">
                  {totalCartCount}
                </span>
              )}
            </button>
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button className="px-3 bg-slate-900 hover:bg-indigo-600 group-hover:bg-indigo-600 text-white font-bold py-3 rounded-xl text-xs transition-all duration-200 shadow-sm flex items-center justify-center ">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="px-3 bg-slate-900 hover:bg-indigo-600 group-hover:bg-indigo-600 text-white font-bold py-3 rounded-xl text-xs transition-all duration-200 shadow-sm flex items-center justify-center ">
                  Sign Up
                </button>
              </SignUpButton>
            </Show>
            <Show when="signed-in">
              <SignOutButton>
                <button className="px-2 bg-slate-900 hover:bg-indigo-600 group-hover:bg-indigo-600 text-white font-bold py-3 rounded-xl text-xs transition-all duration-200 shadow-sm flex items-center justify-center ">
                  Sign Out
                </button>
              </SignOutButton>
            </Show>
          </div>
        </div>
      </div>

    </header>
  );
}
