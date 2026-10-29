import React from 'react';
import { PhoneCall, Mail, MapPin } from 'lucide-react';

export default function Footer({ onSelectCategory }) {
  const links = [
    { id: 'women', label: "Women's kurtis" },
    { id: 'sarees', label: 'Sarees & lehengas' },
    { id: 'men', label: "Men's shirts & kurtas" },
    { id: 'kids', label: 'Kids festive wear' }
  ];

  return (
    <footer className="bg-stone-950 text-stone-400 text-sm mt-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-white font-black text-lg">
            <span className="w-8 h-8 rounded-lg gradient-banner grid place-items-center text-sm">LG</span>
            Local Guru
          </div>
          <p className="text-sm leading-relaxed">
            Regional fashion, sold direct. Kurtis, sarees, linen, and kids wear with clear prices and tracked delivery.
          </p>
        </div>

        <div>
          <h4 className="text-white font-bold mb-3">Shop</h4>
          <ul className="space-y-2">
            {links.map((link) => (
              <li key={link.id}>
                <button
                  type="button"
                  onClick={() => onSelectCategory?.(link.id)}
                  className="hover:text-white text-left"
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-2">
          <h4 className="text-white font-bold mb-3">Help</h4>
          <p className="flex items-center gap-2"><PhoneCall className="w-4 h-4" /> +91 98765 43210</p>
          <p className="flex items-center gap-2"><Mail className="w-4 h-4" /> support@localgurumall.in</p>
          <p className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Bengaluru, India</p>
        </div>

        <div>
          <h4 className="text-white font-bold mb-3">Pay with</h4>
          <div className="flex flex-wrap gap-2 text-xs">
            {['UPI', 'GPay', 'PhonePe', 'Cards', 'Net banking'].map((pay) => (
              <span key={pay} className="px-2.5 py-1 rounded-full border border-stone-700 text-stone-300">
                {pay}
              </span>
            ))}
          </div>
          <p className="mt-4 text-xs leading-relaxed">Coupons: LOCALGURU20, WELCOME100, FESTIVE500. Apply them in the bag.</p>
        </div>
      </div>
      <div className="border-t border-stone-800 py-4 text-center text-xs text-stone-500">
        © 2026 Local Guru Shopping Mall
      </div>
    </footer>
  );
}
