import React from 'react';
import { ArrowRight, Truck, ShieldCheck, RefreshCw } from 'lucide-react';

const PERKS = [
  { icon: Truck, label: 'Free delivery over ₹499' },
  { icon: ShieldCheck, label: 'Secure checkout' },
  { icon: RefreshCw, label: '7-day easy returns' }
];

export default function HeroBanner({ onShopNow }) {
  return (
    <section className="mt-4 rounded-3xl overflow-hidden bg-stone-900 text-white">
      <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
        <div className="p-5 sm:p-8 lg:p-10 space-y-4">
          <p className="inline-flex text-[11px] font-bold tracking-[0.16em] uppercase text-amber-200 bg-white/10 px-3 py-1 rounded-full">
            Festive edit 2026
          </p>
          <h2 className="text-[1.7rem] sm:text-5xl font-black tracking-tight leading-[1.05]">
            Local fashion, priced clearly.
          </h2>
          <p className="text-stone-300 text-sm sm:text-base max-w-md leading-relaxed">
            Kurtis, sarees, linen shirts, and kids festive wear from regional makers. Up to 30% off this week.
          </p>
          <button
            type="button"
            onClick={onShopNow}
            className="inline-flex items-center gap-2 bg-white text-stone-900 font-bold text-sm px-5 py-3 rounded-full"
          >
            Shop the collection
            <ArrowRight className="w-4 h-4" />
          </button>
          <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
            {PERKS.map((perk) => (
              <li key={perk.label} className="flex items-center gap-2 text-xs text-stone-300 bg-white/5 rounded-xl px-3 py-2">
                <perk.icon className="w-4 h-4 text-amber-300 shrink-0" />
                {perk.label}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative min-h-52 sm:min-h-72">
          <img
            src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1200"
            alt="Handloom silk kurti"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 bg-white/95 text-stone-900 rounded-2xl px-4 py-3 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-amber-800">Best seller</p>
              <p className="text-sm font-bold truncate">Designer handloom silk kurti</p>
            </div>
            <span className="shrink-0 text-sm font-black">₹1,199</span>
          </div>
        </div>
      </div>
    </section>
  );
}
