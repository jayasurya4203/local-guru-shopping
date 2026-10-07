import React from 'react';
import { ShieldCheck, Truck, Lock, PhoneCall, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 text-xs mt-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand Info */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg gradient-banner flex items-center justify-center text-white font-extrabold text-sm">
              LG
            </div>
            <span className="text-white font-black text-lg tracking-tight">LOCAL GURU MALL</span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            India's premier e-commerce destination connecting regional artisans, fashion designers, and local sellers directly with customers nationwide.
          </p>
          <div className="flex items-center space-x-2 text-[10px] text-amber-400 font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>256-Bit SSL Encrypted & Razorpay Verified</span>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-extrabold uppercase text-xs tracking-wider mb-3">Shop Categories</h4>
          <ul className="space-y-2 text-[11px]">
            <li className="hover:text-white cursor-pointer transition-colors">Women's Designer Kurtis</li>
            <li className="hover:text-white cursor-pointer transition-colors">Banarasi & Silk Sarees</li>
            <li className="hover:text-white cursor-pointer transition-colors">Men's Linen Shirts & Kurtas</li>
            <li className="hover:text-white cursor-pointer transition-colors">Kids Ethnic Festive Wear</li>
            <li className="hover:text-white cursor-pointer transition-colors">Trending New Arrivals</li>
          </ul>
        </div>

        {/* Customer Support */}
        <div>
          <h4 className="text-white font-extrabold uppercase text-xs tracking-wider mb-3">Customer Service</h4>
          <ul className="space-y-2 text-[11px]">
            <li className="flex items-center space-x-2">
              <PhoneCall className="w-3.5 h-3.5 text-indigo-400" />
              <span>Helpline: +91 98765 43210</span>
            </li>
            <li className="flex items-center space-x-2">
              <Mail className="w-3.5 h-3.5 text-pink-400" />
              <span>support@localgurumall.in</span>
            </li>
            <li className="flex items-center space-x-2">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>Local Guru Hub, Bengaluru, India</span>
            </li>
          </ul>
        </div>

        {/* Verified Payment Badges */}
        <div className="space-y-3">
          <h4 className="text-white font-extrabold uppercase text-xs tracking-wider">Accepted Payments</h4>
          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
            <p className="text-[10px] text-slate-400">Razorpay Gateway Integration</p>
            <div className="flex flex-wrap gap-1.5 text-[10px] font-bold text-slate-300">
              <span className="bg-slate-800 px-2 py-0.5 rounded border border-slate-700">BHIM UPI</span>
              <span className="bg-slate-800 px-2 py-0.5 rounded border border-slate-700">Google Pay</span>
              <span className="bg-slate-800 px-2 py-0.5 rounded border border-slate-700">PhonePe</span>
              <span className="bg-slate-800 px-2 py-0.5 rounded border border-slate-700">Visa / Mastercard</span>
              <span className="bg-slate-800 px-2 py-0.5 rounded border border-slate-700">Net Banking</span>
            </div>
          </div>
        </div>

      </div>

      <div className="border-t border-slate-900 py-4 text-center text-[10px] text-slate-500">
        © 2026 Local Guru Shopping Mall. All Rights Reserved. Built with React.js, Tailwind CSS, Python Flask & MySQL.
      </div>
    </footer>
  );
}
