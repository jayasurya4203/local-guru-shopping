import React, { useState } from 'react';
import { X, Star, ShoppingBag, Zap, Heart, ShieldCheck, Truck, RefreshCw, Check } from 'lucide-react';

export default function ProductDetailModal({
  product,
  onClose,
  onAddToCart,
  onBuyNow,
  onToggleWishlist,
  isWishlisted,
  reviews,
  onAddReview
}) {
  if (!product) return null;

  const [selectedSize, setSelectedSize] = useState(product.sizes ? product.sizes[0] : 'M');
  const [selectedColor, setSelectedColor] = useState(product.colors ? product.colors[0].name : 'Default');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('details'); // 'details' | 'reviews'
  
  // Review state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewerName, setReviewerName] = useState('');

  const finalPrice = Math.round(product.price * (1 - (product.discountPercent || 0) / 100));
  const productReviews = reviews.filter(r => r.productId === product.id);

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewerName || !reviewComment) return;
    onAddReview({
      id: Date.now(),
      productId: product.id,
      userName: reviewerName,
      rating: reviewRating,
      date: "Just now",
      comment: reviewComment
    });
    setReviewComment('');
    setReviewerName('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 relative my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid md:grid-cols-2 gap-8 p-6 sm:p-8">
          {/* Left Column: Image & Badges */}
          <div className="space-y-4">
            <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.discountPercent > 0 && (
                <span className="absolute top-4 left-4 bg-rose-600 text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-md">
                  SAVE {product.discountPercent}%
                </span>
              )}
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200/60 text-[11px] text-slate-600">
              <div className="flex flex-col items-center text-center space-y-1">
                <Truck className="w-4 h-4 text-indigo-600" />
                <span>Express Shipping</span>
              </div>
              <div className="flex flex-col items-center text-center space-y-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Original Quality</span>
              </div>
              <div className="flex flex-col items-center text-center space-y-1">
                <RefreshCw className="w-4 h-4 text-pink-600" />
                <span>7-Day Return</span>
              </div>
            </div>
          </div>

          {/* Right Column: Details & Actions */}
          <div className="space-y-5">
            <div>
              <div className="flex items-center space-x-2 text-xs text-indigo-600 font-bold uppercase tracking-wider mb-1">
                <span>{product.brand}</span>
                <span>•</span>
                <span className="text-slate-400 font-normal">{product.category}</span>
              </div>

              <h2 className="text-2xl font-extrabold text-slate-900 leading-tight">
                {product.name}
              </h2>

              {/* Rating */}
              <div className="flex items-center space-x-2 mt-2">
                <div className="flex items-center space-x-1 bg-amber-50 text-amber-700 px-2.5 py-0.5 rounded-full text-xs font-bold border border-amber-200">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{product.rating}</span>
                </div>
                <span className="text-xs text-slate-500 font-medium">
                  ({productReviews.length || product.reviewsCount} customer reviews)
                </span>
                <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full ml-auto">
                  In Stock ({product.stock} items)
                </span>
              </div>
            </div>

            {/* Price Box */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between">
              <div>
                <div className="flex items-baseline space-x-3">
                  <span className="text-3xl font-black text-slate-900">₹{finalPrice.toLocaleString('en-IN')}</span>
                  {product.discountPercent > 0 && (
                    <span className="text-sm text-slate-400 line-through">₹{product.price.toLocaleString('en-IN')}</span>
                  )}
                </div>
                <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">Inclusive of all taxes</p>
              </div>

              {product.discountPercent > 0 && (
                <span className="text-xs font-bold bg-rose-100 text-rose-700 px-3 py-1 rounded-lg">
                  You Save ₹{(product.price - finalPrice).toLocaleString('en-IN')}
                </span>
              )}
            </div>

            {/* Select Size */}
            {product.sizes && (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Select Size
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        selectedSize === sz
                          ? 'bg-slate-900 text-white shadow-md'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Select Color */}
            {product.colors && (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Select Color: <span className="text-indigo-600">{selectedColor}</span>
                </label>
                <div className="flex items-center space-x-3">
                  {product.colors.map((clr) => (
                    <button
                      key={clr.name}
                      onClick={() => setSelectedColor(clr.name)}
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                        selectedColor === clr.name ? 'border-indigo-600 scale-110 shadow-md' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: clr.hex }}
                      title={clr.name}
                    >
                      {selectedColor === clr.name && <Check className="w-4 h-4 text-white drop-shadow-md" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Quantity
              </label>
              <div className="inline-flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-lg bg-white font-bold text-slate-700 hover:bg-slate-200 transition-colors"
                >
                  -
                </button>
                <span className="w-12 text-center text-sm font-extrabold text-slate-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-lg bg-white font-bold text-slate-700 hover:bg-slate-200 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex items-center space-x-3">
              <button
                onClick={() => onAddToCart(product, selectedSize, selectedColor, quantity)}
                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-6 rounded-2xl flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transition-all"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>ADD TO CART</span>
              </button>

              <button
                onClick={() => onBuyNow(product, selectedSize, selectedColor, quantity)}
                className="flex-1 gradient-banner text-white font-extrabold py-3.5 px-6 rounded-2xl flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transition-all"
              >
                <Zap className="w-5 h-5 fill-amber-300 text-amber-300" />
                <span>BUY NOW</span>
              </button>

              <button
                onClick={() => onToggleWishlist(product)}
                className={`p-3.5 rounded-2xl border transition-all ${
                  isWishlisted ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-slate-100 border-slate-200 text-slate-500 hover:text-rose-600'
                }`}
                title="Wishlist"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-600' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Tabs: Description & Reviews */}
        <div className="border-t border-slate-200 px-6 sm:px-8 py-6 bg-slate-50/50">
          <div className="flex space-x-6 border-b border-slate-200 mb-4">
            <button
              onClick={() => setActiveTab('details')}
              className={`pb-3 text-sm font-bold border-b-2 transition-colors ${
                activeTab === 'details'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Description & Details
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-3 text-sm font-bold border-b-2 transition-colors ${
                activeTab === 'reviews'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Customer Reviews ({productReviews.length})
            </button>
          </div>

          {activeTab === 'details' ? (
            <div className="text-sm text-slate-600 leading-relaxed space-y-3">
              <p>{product.description}</p>
              <ul className="list-disc pl-5 space-y-1 text-xs text-slate-500">
                <li>Material: 100% Premium Fabric</li>
                <li>Care Instructions: Gentle Hand Wash or Dry Clean recommended</li>
                <li>Origin: Crafted by Local Guru Certified Indian Weavers</li>
                <li>Includes: Brand Tag & Hologram of Authenticity</li>
              </ul>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Existing Reviews */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                {productReviews.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No reviews yet for this item. Be the first to share your feedback!</p>
                ) : (
                  productReviews.map((rev) => (
                    <div key={rev.id} className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800">{rev.userName}</span>
                        <span className="text-[10px] text-slate-400">{rev.date}</span>
                      </div>
                      <div className="flex text-amber-400">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400" />
                        ))}
                      </div>
                      <p className="text-slate-600">{rev.comment}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Submit Review Form */}
              <form onSubmit={handleReviewSubmit} className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Write a Product Review</h4>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    required
                    className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-hidden"
                  />
                  <div className="flex items-center space-x-1">
                    <span className="text-xs text-slate-500 font-semibold mr-1">Rating:</span>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className="p-0.5"
                      >
                        <Star className={`w-4 h-4 ${star <= reviewRating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  placeholder="Share your experience with this product..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  required
                  rows="2"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-hidden"
                ></textarea>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors"
                >
                  Submit Review
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
