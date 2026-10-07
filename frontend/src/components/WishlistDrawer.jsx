import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';

export default function WishlistDrawer({
  isOpen,
  onClose,
  wishlistItems,
  onMoveToCart,
  onRemoveFromWishlist
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between border-l border-slate-200 animate-in slide-in-from-right duration-300">
        
        {/* Wishlist Header */}
        <div className="p-4 sm:p-6 border-b border-slate-200 flex items-center justify-between bg-rose-50/50">
          <div className="flex items-center space-x-2">
            <Heart className="w-5 h-5 text-rose-600 fill-rose-600" />
            <h3 className="font-extrabold text-slate-900 text-lg">My Saved Wishlist</h3>
            <span className="bg-rose-100 text-rose-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
              {wishlistItems.length} items
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Wishlist List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {wishlistItems.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
                <Heart className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-slate-800 text-base">Your Wishlist is Empty</h4>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Click the heart icon on any product to save it here for quick access later!
              </p>
            </div>
          ) : (
            wishlistItems.map((product) => {
              const finalPrice = Math.round(product.price * (1 - (product.discountPercent || 0) / 100));
              return (
                <div key={product.id} className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 flex space-x-3 relative">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-20 h-20 object-cover rounded-xl border border-slate-200 shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{product.name}</h4>
                      <p className="text-[11px] text-slate-500">{product.brand}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="font-extrabold text-sm text-slate-900">
                        ₹{finalPrice.toLocaleString('en-IN')}
                      </span>

                      <button
                        onClick={() => {
                          onMoveToCart(product);
                        }}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-3 py-1.5 rounded-xl shadow-xs flex items-center space-x-1.5 transition-colors"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Move to Cart</span>
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => onRemoveFromWishlist(product.id)}
                    className="absolute top-2 right-2 text-slate-400 hover:text-rose-600 p-1 transition-colors"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
