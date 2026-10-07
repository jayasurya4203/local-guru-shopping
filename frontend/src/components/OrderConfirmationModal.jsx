import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, Package, Truck, Clock, MapPin, X, ArrowRight } from 'lucide-react';

export default function OrderConfirmationModal({ orderDetails, onClose, onViewOrders }) {
  if (!orderDetails) return null;

  useEffect(() => {
    // Launch celebratory confetti burst
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative text-center space-y-6 animate-in zoom-in-95 duration-200">
        
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Success Icon */}
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <span className="text-xs text-emerald-600 font-extrabold uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">
            PAYMENT SUCCESSFUL VIA RAZORPAY
          </span>
          <h3 className="text-2xl font-black text-slate-900 mt-2">ORDER CONFIRMED!</h3>
          <p className="text-xs text-slate-500 mt-1">
            Thank you for shopping with Local Guru Mall. Your order is being packed!
          </p>
        </div>

        {/* Order Details Pill */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-left space-y-2">
          <div className="flex justify-between items-center border-b border-slate-200 pb-2">
            <span className="text-slate-500">Order ID:</span>
            <span className="font-extrabold text-indigo-600">{orderDetails.orderNumber}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-500">Razorpay Payment ID:</span>
            <span className="font-mono text-slate-700 text-[11px]">{orderDetails.razorpayPaymentId}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-500">Total Paid:</span>
            <span className="font-extrabold text-slate-900 text-sm">₹{orderDetails.totals.grandTotal.toLocaleString('en-IN')}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-500">Deliver To:</span>
            <span className="font-medium text-slate-800">{orderDetails.address.city}, {orderDetails.address.pincode}</span>
          </div>
        </div>

        {/* Status Tracker */}
        <div className="space-y-2">
          <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider text-left">Live Order Status</h4>
          <div className="grid grid-cols-4 gap-1 text-[10px] text-center">
            <div className="p-2 bg-emerald-100 text-emerald-800 font-bold rounded-xl border border-emerald-300">
              <CheckCircle2 className="w-3.5 h-3.5 mx-auto mb-1 text-emerald-600" />
              <span>Confirmed</span>
            </div>
            <div className="p-2 bg-indigo-50 text-indigo-700 font-bold rounded-xl border border-indigo-200">
              <Package className="w-3.5 h-3.5 mx-auto mb-1 text-indigo-600" />
              <span>Packed</span>
            </div>
            <div className="p-2 bg-slate-100 text-slate-400 font-medium rounded-xl">
              <Truck className="w-3.5 h-3.5 mx-auto mb-1" />
              <span>Shipped</span>
            </div>
            <div className="p-2 bg-slate-100 text-slate-400 font-medium rounded-xl">
              <MapPin className="w-3.5 h-3.5 mx-auto mb-1" />
              <span>Delivered</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3 rounded-xl text-xs transition-colors"
          >
            Continue Shopping
          </button>
          <button
            onClick={() => {
              onClose();
              onViewOrders();
            }}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl text-xs shadow-md transition-colors flex items-center justify-center space-x-1"
          >
            <span>View My Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
