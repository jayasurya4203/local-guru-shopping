import React from 'react';
import { ShoppingBag, Heart, Search, User, ShieldCheck, PhoneCall, Sparkles, MapPin } from 'lucide-react';

export default function Navbar({
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenAuth,
  onOpenProfile,
  onOpenAdmin,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  user
}) {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md shadow-xs border-b border-slate-200">
      {/* Top Banner Bar */}
      <div className="gradient-banner text-white text-xs py-1.5 px-4 text-center font-medium flex items-center justify-between">
        <div className="hidden sm:flex items-center space-x-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Local Guru Shopping Mall — Direct Local Fashion & Savings</span>
        </div>
        <div className="mx-auto sm:mx-0 flex items-center space-x-4">
          <span className="flex items-center space-x-1">
            <PhoneCall className="w-3 h-3 text-emerald-300" />
            <span>Support: +91 98765 43210</span>
          </span>
          <span className="hidden md:inline">|</span>
          <span className="hidden md:flex items-center space-x-1">
            <MapPin className="w-3 h-3 text-pink-300" />
            <span>Pan-India Delivery in 3-5 Days</span>
          </span>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setSelectedCategory('all')}>
          <div className="w-10 h-10 rounded-xl gradient-banner flex items-center justify-center text-white shadow-md font-black text-xl tracking-wider">
            LG
          </div>
          <div>
            <h1 className="font-extrabold text-xl sm:text-2xl tracking-tight text-slate-900 leading-none">
              LOCAL <span className="gradient-text">GURU</span>
            </h1>
            <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase mt-0.5">SHOPPING MALL</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-lg hidden md:block">
          <div className="relative">
            <input
              type="text"
              placeholder="Search Kurti, Saree, Shirt, Kids wear..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-100 focus:bg-white text-sm border border-slate-200 focus:border-indigo-500 rounded-full outline-hidden transition-all shadow-inner"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Admin Switcher: ONLY VISIBLE TO AUTHENTICATED ADMINS */}
          {user && user.role === 'admin' && (
            <button
              onClick={onOpenAdmin}
              className="flex items-center space-x-1.5 text-xs font-extrabold px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white shadow-xs transition-colors animate-in fade-in"
              title="Store Admin Dashboard"
            >
              <ShieldCheck className="w-4 h-4 text-white" />
              <span className="hidden sm:inline">Admin Dashboard</span>
            </button>
          )}

          {/* User Auth & Profile Button */}
          {user ? (
            <button
              onClick={onOpenProfile}
              className="flex items-center space-x-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-colors border border-indigo-200/60"
              title="My Profile, Addresses & Orders"
            >
              <User className="w-4 h-4 text-indigo-600" />
              <span className="max-w-[120px] truncate">{user.full_name}</span>
              {(user.is_mobile_verified || user.is_email_verified) && (
                <span className="w-2 h-2 rounded-full bg-emerald-500" title="Verified Account"></span>
              )}
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center space-x-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
            >
              <User className="w-4 h-4 text-slate-500" />
              <span>Login / OTP</span>
            </button>
          )}

          {/* Wishlist Icon */}
          <button
            onClick={onOpenWishlist}
            className="relative p-2 text-slate-700 hover:text-rose-600 transition-colors"
            title="Wishlist"
          >
            <Heart className="w-6 h-6" />
            {wishlistCount > 0 && (
              <span className="absolute top-0 right-0 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Shopping Cart Icon */}
          <button
            onClick={onOpenCart}
            className="relative p-2 text-slate-700 hover:text-indigo-600 transition-colors"
            title="Cart"
          >
            <ShoppingBag className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="px-4 pb-3 md:hidden">
        <div className="relative">
          <input
            type="text"
            placeholder="Search Kurti, Saree, Shirt..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-100 text-sm border border-slate-200 rounded-full outline-hidden"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>
    </header>
  );
}
