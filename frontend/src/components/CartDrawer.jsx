import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, Ticket, ShoppingBag, ArrowRight, Check } from 'lucide-react';

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  coupons
}) {
  if (!isOpen) return null;

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  const subtotal = cartItems.reduce((acc, item) => {
    const finalPrice = Math.round(item.product.price * (1 - (item.product.discountPercent || 0) / 100));
    return acc + finalPrice * item.quantity;
  }, 0);

  const deliveryFee = subtotal > 499 || cartItems.length === 0 ? 0 : 50;

  let couponDiscount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      couponDiscount = Math.round((subtotal * appliedCoupon.value) / 100);
    } else {
      couponDiscount = appliedCoupon.value;
    }
  }

  const grandTotal = Math.max(0, subtotal + deliveryFee - couponDiscount);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const found = coupons.find(c => c.code.toUpperCase() === couponCode.trim().toUpperCase());
    if (!found) {
      setCouponError('Invalid coupon code. Try LOCALGURU20 or WELCOME100.');
      return;
    }
    if (subtotal < found.minAmount) {
      setCouponError(`Minimum order amount for ${found.code} is ₹${found.minAmount}`);
      return;
    }
    setAppliedCoupon(found);
    setCouponError('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between border-l border-slate-200 animate-in slide-in-from-right duration-300">
        
        {/* Cart Header */}
        <div className="p-4 sm:p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5 text-indigo-600" />
            <h3 className="font-extrabold text-slate-900 text-lg">My Shopping Cart</h3>
            <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
              {cartItems.reduce((sum, item) => sum + item.quantity, 0)} items
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-slate-800 text-base">Your Cart is Empty</h4>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Explore our festive Kurtis, Sarees, Men's Shirts, and Kids collections to add items!
              </p>
            </div>
          ) : (
            cartItems.map((item) => {
              const itemPrice = Math.round(item.product.price * (1 - (item.product.discountPercent || 0) / 100));
              return (
                <div key={`${item.product.id}-${item.size}-${item.color}`} className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 flex space-x-3 relative group">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-xl border border-slate-200 shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{item.product.name}</h4>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                        Size: <strong className="text-slate-700">{item.size}</strong> | Color: <strong className="text-slate-700">{item.color}</strong>
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="font-extrabold text-sm text-slate-900">
                        ₹{(itemPrice * item.quantity).toLocaleString('en-IN')}
                      </span>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-1.5 bg-white rounded-lg border border-slate-200 px-1.5 py-0.5">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.size, item.color, item.quantity - 1)}
                          className="p-1 hover:text-indigo-600 text-slate-500"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-slate-900 w-5 text-center">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.size, item.color, item.quantity + 1)}
                          className="p-1 hover:text-indigo-600 text-slate-500"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onRemoveItem(item.product.id, item.size, item.color)}
                    className="absolute top-2 right-2 text-slate-400 hover:text-rose-600 p-1 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Summary & Checkout */}
        {cartItems.length > 0 && (
          <div className="p-4 sm:p-6 border-t border-slate-200 bg-slate-50/80 space-y-4">
            {/* Coupon Code Section */}
            <div>
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Enter Coupon (e.g. LOCALGURU20)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="w-full uppercase tracking-wider pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-hidden focus:border-indigo-500"
                  />
                  <Ticket className="w-3.5 h-3.5 text-indigo-500 absolute left-2.5 top-2.5" />
                </div>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-3.5 rounded-xl transition-colors shrink-0"
                >
                  APPLY
                </button>
              </form>

              {appliedCoupon && (
                <div className="mt-2 p-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] rounded-lg flex items-center justify-between font-medium">
                  <span className="flex items-center space-x-1">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Coupon <strong>{appliedCoupon.code}</strong> Applied</span>
                  </span>
                  <span className="font-bold text-emerald-700">-₹{couponDiscount}</span>
                </div>
              )}
              {couponError && (
                <p className="mt-1 text-[11px] text-rose-600 font-semibold">{couponError}</p>
              )}
            </div>

            {/* Bill Summary */}
            <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-200 pt-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-slate-800">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className={`font-bold ${deliveryFee === 0 ? 'text-emerald-600' : 'text-slate-800'}`}>
                  {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                </span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Coupon Discount</span>
                  <span>-₹{couponDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-black text-slate-900 border-t border-slate-200 pt-2">
                <span>TOTAL</span>
                <span className="text-indigo-600">₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onProceedToCheckout({ subtotal, deliveryFee, couponDiscount, grandTotal });
              }}
              className="w-full gradient-banner text-white font-extrabold py-3.5 rounded-2xl shadow-xl hover:shadow-2xl transition-all flex items-center justify-center space-x-2 text-xs tracking-wider uppercase cursor-pointer"
            >
              <span>PROCEED TO CHECKOUT</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
