import React from 'react';
import { Star, Heart, ShoppingBag } from 'lucide-react';

export function salePrice(product) {
  return Math.round(product.price * (1 - (product.discountPercent || 0) / 100));
}

export default function ProductCard({
  product,
  onSelectProduct,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  compact = false
}) {
  const finalPrice = salePrice(product);
  const image = product.images?.[0];

  return (
    <article className="group bg-white rounded-2xl border border-stone-200/80 overflow-hidden flex flex-col h-full">
      <div className="relative">
        <button
          type="button"
          onClick={() => onSelectProduct(product)}
          className="block w-full aspect-[4/5] sm:aspect-[4/5] bg-stone-100"
        >
          {image ? (
            <img src={image} alt={product.name} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500" />
          ) : (
            <span className="grid place-items-center h-full text-xs text-stone-400">No image</span>
          )}
        </button>
        {product.discountPercent > 0 && (
          <span className="absolute top-2 left-2 bg-rose-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            {product.discountPercent}% off
          </span>
        )}
        <button
          type="button"
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
          onClick={() => onToggleWishlist(product)}
          className={`absolute top-2 right-2 w-8 h-8 rounded-full grid place-items-center shadow-sm ${
            isWishlisted ? 'bg-rose-50 text-rose-600' : 'bg-white/95 text-stone-500'
          }`}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-600' : ''}`} />
        </button>
      </div>

      <div className={`flex flex-col flex-1 gap-2 ${compact ? 'p-2.5' : 'p-3 sm:p-4'}`}>
        <div className="flex items-center justify-between gap-2 text-[11px] text-stone-500">
          <span className="truncate">{product.brand}</span>
          <span className="inline-flex items-center gap-0.5 text-amber-700 font-bold shrink-0">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            {product.rating}
          </span>
        </div>
        <button
          type="button"
          onClick={() => onSelectProduct(product)}
          className="text-left text-sm font-semibold text-stone-900 leading-snug line-clamp-2 min-h-10"
        >
          {product.name}
        </button>
        <div className="mt-auto flex items-end justify-between gap-2">
          <div>
            <p className="text-base font-black text-stone-900">₹{finalPrice.toLocaleString('en-IN')}</p>
            {product.discountPercent > 0 && (
              <p className="text-[11px] text-stone-400 line-through">₹{Number(product.price).toLocaleString('en-IN')}</p>
            )}
          </div>
          <button
            type="button"
            aria-label="Add to bag"
            onClick={() => onAddToCart(product)}
            className="h-9 px-2.5 rounded-xl bg-stone-900 text-white inline-flex items-center gap-1 text-xs font-bold"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="hidden xs:inline sm:inline">Add</span>
          </button>
        </div>
      </div>
    </article>
  );
}
