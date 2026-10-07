import React from 'react';
import { Star, Heart, ShoppingBag, Eye } from 'lucide-react';

export default function ProductCard({
  product,
  onSelectProduct,
  onAddToCart,
  onToggleWishlist,
  isWishlisted
}) {
  const finalPrice = Math.round(product.price * (1 - (product.discountPercent || 0) / 100));

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 hover:border-indigo-300 hover:shadow-xl transition-all duration-300 flex flex-col h-full relative">
      {/* Discount & Badge */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
        {product.discountPercent > 0 && (
          <span className="bg-rose-600 text-white text-[11px] font-extrabold px-2.5 py-0.5 rounded-full shadow-xs">
            {product.discountPercent}% OFF
          </span>
        )}
        {product.isTrending && (
          <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
            TRENDING
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleWishlist(product);
        }}
        className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all ${
          isWishlisted
            ? 'bg-rose-50 text-rose-600 shadow-md'
            : 'bg-white/80 hover:bg-white text-slate-400 hover:text-rose-500 shadow-xs'
        }`}
        title="Save to Wishlist"
      >
        <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-600' : ''}`} />
      </button>

      {/* Product Image */}
      <div
        className="relative aspect-4/3 overflow-hidden bg-slate-100 cursor-pointer"
        onClick={() => onSelectProduct(product)}
      >
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button className="bg-white/90 text-slate-900 px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center space-x-1 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all">
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-1">
            <span>{product.brand}</span>
            <div className="flex items-center space-x-1 text-amber-500 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{product.rating}</span>
              <span className="text-slate-400 font-normal">({product.reviewsCount})</span>
            </div>
          </div>

          <h3
            onClick={() => onSelectProduct(product)}
            className="font-bold text-slate-900 text-sm line-clamp-2 hover:text-indigo-600 transition-colors cursor-pointer"
          >
            {product.name}
          </h3>
        </div>

        {/* Sizes Quick Preview */}
        {product.sizes && (
          <div className="flex items-center space-x-1">
            <span className="text-[11px] text-slate-400 font-medium">Sizes:</span>
            <div className="flex flex-wrap gap-1">
              {product.sizes.map((sz) => (
                <span key={sz} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-md font-semibold">
                  {sz}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Price & Action Row */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <div>
            <div className="flex items-baseline space-x-2">
              <span className="text-lg font-black text-slate-900">₹{finalPrice.toLocaleString('en-IN')}</span>
              {product.discountPercent > 0 && (
                <span className="text-xs text-slate-400 line-through">₹{product.price.toLocaleString('en-IN')}</span>
              )}
            </div>
          </div>

          <button
            onClick={() => onAddToCart(product)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-xl shadow-md transition-colors flex items-center justify-center cursor-pointer"
            title="Add to Cart"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
