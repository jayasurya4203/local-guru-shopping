import React from 'react';
import { ArrowRight, Tag, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

export default function HeroBanner({ onShopNow }) {
  return (
    <div className="relative overflow-hidden bg-slate-900 text-white py-12 px-4 sm:px-6 rounded-3xl my-6 mx-4 sm:mx-6 shadow-2xl">
      {/* Background Glows */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-pink-600/30 rounded-full blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-center">
        {/* Left Column: Text Content */}
        <div className="space-y-4">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 text-xs font-semibold text-amber-300">
            <Tag className="w-3.5 h-3.5" />
            <span>FESTIVE FASHION COLLECTION 2026</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Discover Exceptional <span className="gradient-text">Local Styles</span> & Quality
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-lg">
            Shop directly from top verified regional weavers, boutiques & fashion masters. Enjoy up to <strong className="text-amber-400">40% OFF</strong> on Kurtis, Sarees, Men's Linen & Kids collections.
          </p>

          <div className="pt-2 flex flex-wrap gap-4 items-center">
            <button
              onClick={onShopNow}
              className="bg-white text-slate-900 hover:bg-slate-100 px-6 py-3 rounded-full font-bold text-sm flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>EXPLORE NOW</span>
              <ArrowRight className="w-4 h-4 text-indigo-600" />
            </button>

            <span className="text-xs text-slate-400">
              ⚡ Guaranteed Authentic • Express Local Delivery
            </span>
          </div>

          {/* Quick Value Badges */}
          <div className="pt-6 grid grid-cols-3 gap-2 border-t border-slate-800 text-xs text-slate-300">
            <div className="flex items-center space-x-2">
              <Truck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Free Delivery &gt; ₹499</span>
            </div>
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0" />
              <span>Razorpay Verified</span>
            </div>
            <div className="flex items-center space-x-2">
              <RefreshCw className="w-4 h-4 text-purple-400 shrink-0" />
              <span>7-Day Easy Return</span>
            </div>
          </div>
        </div>

        {/* Right Column: Hero Collage Preview */}
        <div className="relative flex justify-center">
          <div className="relative w-full max-w-md aspect-4/3 rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
            <img
              src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1000"
              alt="Local Guru Fashion Banner"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
            <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-slate-900/80 backdrop-blur-md border border-white/10 flex items-center justify-between">
              <div>
                <p className="text-xs text-amber-400 font-bold uppercase tracking-wider">TRENDING SELLER</p>
                <p className="text-sm font-bold text-white">Designer Handloom Silk Kurti</p>
              </div>
              <span className="bg-emerald-500 text-white text-xs font-extrabold px-3 py-1 rounded-full">
                ₹1,199
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
