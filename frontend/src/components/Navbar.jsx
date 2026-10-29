import React from 'react';
import { ShoppingBag, Heart, Search, User, ShieldCheck, Home, Store } from 'lucide-react';

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
  setSelectedCategory,
  onShop,
  user
}) {
  const openAccount = () => (user ? onOpenProfile() : onOpenAuth());

  return (
    <header className="sticky top-0 z-40 glass-panel border-b border-stone-200/80">
      <div className="bg-stone-900 text-stone-100 text-[11px] sm:text-xs py-1.5 px-4 text-center">
        Free delivery above ₹499 · Easy 7-day returns · Pan-India in 3–5 days
      </div>

      <div className="max-w-6xl mx-auto px-3 sm:px-6 py-2.5 flex items-center gap-2 sm:gap-4">
        <button
          type="button"
          onClick={() => {
            setSelectedCategory('all');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2 shrink-0 text-left"
        >
          <span className="w-9 h-9 rounded-xl gradient-banner text-white grid place-items-center font-black text-sm shadow-sm">
            LG
          </span>
          <span className="leading-none">
            <span className="block font-black tracking-tight text-stone-900 text-base sm:text-lg">
              Local Guru
            </span>
            <span className="hidden sm:block text-[10px] uppercase tracking-[0.18em] text-stone-500 font-semibold mt-0.5">
              Shopping mall
            </span>
          </span>
        </button>

        <form
          className="flex-1 min-w-0"
          onSubmit={(e) => {
            e.preventDefault();
            onShop?.();
          }}
        >
          <label className="relative block">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="search"
              placeholder="Search kurtis, sarees, shirts…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-3 bg-white text-sm border border-stone-200 rounded-full outline-none focus:border-amber-700"
            />
          </label>
        </form>

        <div className="hidden md:flex items-center gap-1">
          {user?.role === 'admin' && (
            <button
              type="button"
              onClick={onOpenAdmin}
              className="h-10 px-3 rounded-full bg-amber-700 text-white text-xs font-bold inline-flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              Admin
            </button>
          )}
          <button
            type="button"
            onClick={openAccount}
            className="h-10 px-3 rounded-full bg-white border border-stone-200 text-sm font-semibold text-stone-800 inline-flex items-center gap-1.5 max-w-[160px]"
          >
            <User className="w-4 h-4 shrink-0" />
            <span className="truncate">{user ? user.full_name.split(' ')[0] : 'Sign in'}</span>
          </button>
          <IconButton label="Wishlist" count={wishlistCount} tone="rose" onClick={onOpenWishlist}>
            <Heart className="w-5 h-5" />
          </IconButton>
          <IconButton label="Cart" count={cartCount} tone="amber" onClick={onOpenCart}>
            <ShoppingBag className="w-5 h-5" />
          </IconButton>
        </div>
      </div>
    </header>
  );
}

function IconButton({ children, label, count, onClick, tone }) {
  const badge = tone === 'rose' ? 'bg-rose-600' : 'bg-amber-800';
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="relative w-10 h-10 rounded-full text-stone-800 hover:bg-stone-100 grid place-items-center"
    >
      {children}
      {count > 0 && (
        <span className={`absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full text-[10px] font-bold text-white grid place-items-center ${badge}`}>
          {count}
        </span>
      )}
    </button>
  );
}

export function MobileDock({
  cartCount,
  wishlistCount,
  user,
  onHome,
  onShop,
  onOpenCart,
  onOpenWishlist,
  onOpenAuth,
  onOpenProfile,
  onOpenAdmin
}) {
  const items = [
    { label: 'Home', icon: Home, onClick: onHome },
    { label: 'Shop', icon: Store, onClick: onShop },
    { label: 'Saved', icon: Heart, count: wishlistCount, onClick: onOpenWishlist },
    { label: 'Bag', icon: ShoppingBag, count: cartCount, onClick: onOpenCart },
    {
      label: user ? 'Account' : 'Sign in',
      icon: user?.role === 'admin' ? ShieldCheck : User,
      onClick: () => {
        if (user?.role === 'admin') onOpenAdmin();
        else if (user) onOpenProfile();
        else onOpenAuth();
      }
    }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 glass-panel border-t border-stone-200 pb-[env(safe-area-inset-bottom)]">
      <div className="grid grid-cols-5">
        {items.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={item.onClick}
            className="relative h-14 flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold text-stone-600"
          >
            <item.icon className="w-5 h-5" />
            {item.label}
            {item.count > 0 && (
              <span className="absolute top-1.5 right-[22%] min-w-4 h-4 px-1 rounded-full bg-amber-800 text-white text-[9px] font-bold grid place-items-center">
                {item.count}
              </span>
            )}
          </button>
        ))}
      </div>
    </nav>
  );
}
