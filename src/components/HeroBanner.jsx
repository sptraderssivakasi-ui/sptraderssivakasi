import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Truck, Percent, Gift } from 'lucide-react';

export default function HeroBanner({ onExplore }) {
  return (
    <section className="relative overflow-hidden py-16 lg:py-24 border-b border-gold/20">
      {/* Dynamic Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gold/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 right-10 w-[400px] h-[300px] bg-maroon/20 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-night-3 border border-gold/30 text-gold text-xs font-extrabold uppercase tracking-widest mb-6 shadow-md animate-bounce">
            <Sparkles className="w-3.5 h-3.5" /> Diwali 2026 Wholesale Fireworks Bookings Open
          </div>

          {/* Main Title */}
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-paper leading-[1.15] tracking-tight">
            Original Sivakasi Fireworks <br />
            <span className="text-gold-gradient">Direct Factory Wholesale Rates</span>
          </h1>

          <p className="mt-5 text-sm sm:text-base text-paper/70 leading-relaxed max-w-2xl mx-auto">
            Experience unmatched festive brilliance with genuine Sivakasi sparklers, flower pots, aerial multi-shots, and family celebration gift boxes. Safe, tested & delivered pan-India.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onExplore}
              className="bg-gradient-to-r from-gold to-gold-soft hover:brightness-110 text-night font-extrabold px-8 py-4 rounded-2xl text-sm transition-all flex items-center gap-2.5 shadow-xl shadow-gold/20 hover:scale-105 active:scale-95"
            >
              <span>Explore 2026 Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="https://wa.me/919443594447"
              target="_blank"
              rel="noreferrer"
              className="bg-night-3 hover:bg-night-2 border border-gold/30 hover:border-gold text-paper font-bold px-7 py-4 rounded-2xl text-sm transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
            >
              <span>💬 WhatsApp Quick Price List</span>
            </a>
          </div>

          {/* Value Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-14 pt-8 border-t border-white/10 text-left">
            <div className="p-4 rounded-2xl bg-night-2/80 border border-white/5 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-gold/10 text-gold flex items-center justify-center text-xl shrink-0">
                <Percent className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-paper">Wholesale Rates</div>
                <div className="text-[11px] text-paper/50">Up to 70% off MRP</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-night-2/80 border border-white/5 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-gold/10 text-gold flex items-center justify-center text-xl shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-paper">Pan-India Courier</div>
                <div className="text-[11px] text-paper/50">Safe transport dispatch</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-night-2/80 border border-white/5 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-gold/10 text-gold flex items-center justify-center text-xl shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-paper">100% Tested</div>
                <div className="text-[11px] text-paper/50">Safe Sivakasi quality</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-night-2/80 border border-white/5 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-gold/10 text-gold flex items-center justify-center text-xl shrink-0">
                <Gift className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-paper">Assorted Gift Packs</div>
                <div className="text-[11px] text-paper/50">Perfect for gifting</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
