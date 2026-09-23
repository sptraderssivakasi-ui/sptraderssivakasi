import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Truck, Percent, Gift, Flame, CheckCircle2 } from 'lucide-react';
import bannerImage from '../assets/banner.js';

export default function HeroBanner({ onExplore }) {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:py-20 border-b border-gold/20">
      {/* Background Multi-Layer Glow Effects */}
      <div className="absolute top-10 left-1/4 -translate-x-1/2 w-[500px] h-[350px] bg-gold/15 blur-[130px] rounded-full pointer-events-none"></div>
      <div className="absolute top-1/3 right-10 w-[450px] h-[350px] bg-crimson/15 blur-[140px] rounded-full pointer-events-none"></div>
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-night-3 blur-[80px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* ── Left Column: Headline & Call to Actions ── */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Top Festive Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-gradient-to-r from-night-3 to-night-2 border border-gold/40 text-gold text-xs font-extrabold uppercase tracking-widest shadow-glow-gold">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-gold"></span>
              </span>
              <Sparkles className="w-3.5 h-3.5 text-gold-light" />
              <span>Diwali 2026 Wholesale Fireworks Bookings Open</span>
            </div>

            {/* Main Hero Title */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.12] tracking-tight">
              Original Sivakasi <br />
              <span className="text-gold-gradient">Direct Factory Wholesale</span>
            </h1>

            {/* Hero Subtitle */}
            <p className="text-paper-dim text-sm sm:text-base leading-relaxed max-w-xl mx-auto lg:mx-0">
              Celebrate with unmatched brilliance and guaranteed savings. Get authentic Sivakasi sparklers, ground chakkars, majestic flower pots, sky shots, and VIP family gift boxes dispatched direct from the factory town.
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <button
                onClick={onExplore}
                className="bg-gradient-to-r from-gold via-gold-soft to-gold hover:brightness-110 text-night font-extrabold px-8 py-4 rounded-2xl text-sm transition-all flex items-center gap-2.5 shadow-glow-gold hover:scale-105 active:scale-95 group"
              >
                <span>Explore 2026 Catalog</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href="https://wa.me/919443594447?text=Hi%20SP%20Traders%20Sivakasi,%20I%20would%20like%20to%20get%20the%20Wholesale%20Fireworks%20Price%20List%20for%20Diwali%202026."
                target="_blank"
                rel="noreferrer"
                className="bg-night-3/90 hover:bg-night-2 border border-gold/30 hover:border-gold text-paper font-bold px-7 py-4 rounded-2xl text-sm transition-all flex items-center gap-2.5 shadow-lg hover:scale-105 active:scale-95"
              >
                <span className="text-lg">💬</span>
                <span>WhatsApp Price List</span>
              </a>
            </div>

            {/* Highlights Mini Row */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-paper-dim font-bold">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4.5 h-4.5 text-emerald" />
                <span className="text-white font-extrabold">80% Discount Off MRP</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4.5 h-4.5 text-emerald" />
                <span>Minimum Order ₹2,000</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4.5 h-4.5 text-emerald" />
                <span>Pan-India Safe Transport</span>
              </div>
            </div>
          </div>

          {/* ── Right Column: Featured Banner Visual Showcase ── */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none group">
              {/* Outer Golden Glow Border Frame */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-gold via-crimson to-gold rounded-3xl blur-lg opacity-60 group-hover:opacity-100 transition duration-1000 group-hover:duration-300"></div>

              <div className="relative rounded-2xl overflow-hidden bg-night-2 border border-gold/30 shadow-card-elevated">
                {/* Banner Image from src */}
                <div className="relative aspect-[16/11] overflow-hidden">
                  <img
                    src={bannerImage}
                    alt="SP Traders Sivakasi Fireworks Festive Banner"
                    onError={(e) => {
                      if (!e.target.dataset.tried) {
                        e.target.dataset.tried = 'true';
                        e.target.src = 'images/banner.jpg';
                      }
                    }}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-night via-night/30 to-transparent"></div>

                  {/* Floating Tag */}
                  <div className="absolute top-4 left-4 bg-night/85 backdrop-blur-md border border-gold/40 text-gold font-extrabold text-[11px] px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                    <Flame className="w-3.5 h-3.5 text-crimson animate-pulse" />
                    <span>Sivakasi Factory Direct</span>
                  </div>

                  <div className="absolute top-4 right-4 bg-gradient-to-r from-crimson to-maroon backdrop-blur-md text-gold-light font-black text-[11px] px-3.5 py-1.5 rounded-full shadow-lg border border-gold/30 animate-pulse">
                    80% DISCOUNT
                  </div>

                  {/* Banner Bottom Overlay Content */}
                  <div className="absolute bottom-4 left-4 right-4 bg-night-3/90 backdrop-blur-md border border-white/10 p-3.5 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="text-white font-bold text-xs flex items-center gap-1.5">
                        <span>🎆 2026 Mega Family Boxes</span>
                      </div>
                      <div className="text-[11px] text-gold font-medium">Starting from ₹1,299 wholesale</div>
                    </div>
                    <button
                      onClick={onExplore}
                      className="bg-gold hover:bg-gold-soft text-night text-xs font-extrabold px-3 py-1.5 rounded-lg transition-colors"
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>

              {/* Floating Stat Pill Left */}
              <div className="absolute -bottom-5 -left-4 sm:-left-6 bg-night-3/95 backdrop-blur-md border border-gold/30 px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-3 hidden sm:flex">
                <div className="w-9 h-9 rounded-xl bg-gold/15 text-gold flex items-center justify-center font-bold text-base">
                  ⭐
                </div>
                <div>
                  <div className="text-xs font-bold text-white">50,000+ Families</div>
                  <div className="text-[10px] text-paper-dim">Trusted Every Diwali</div>
                </div>
              </div>

              {/* Floating Stat Pill Right */}
              <div className="absolute -top-5 -right-4 sm:-right-6 bg-night-3/95 backdrop-blur-md border border-emerald/30 px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-3 hidden sm:flex">
                <div className="w-9 h-9 rounded-xl bg-emerald/15 text-emerald flex items-center justify-center font-bold text-base">
                  🚚
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Pan-India Transport</div>
                  <div className="text-[10px] text-emerald">Tracked Dispatch</div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* ── Value Propositions Strip ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-16 pt-8 border-t border-gold/15">
          <div className="p-4 rounded-2xl bg-night-2/90 border border-gold/15 flex items-center gap-3.5 hover:border-gold/40 transition-colors">
            <div className="w-11 h-11 rounded-xl bg-gold/10 text-gold flex items-center justify-center text-xl shrink-0 shadow-sm">
              <Percent className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Direct Wholesale</div>
              <div className="text-[11px] text-paper-dim">Direct Sivakasi factory rate</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-night-2/90 border border-gold/15 flex items-center gap-3.5 hover:border-gold/40 transition-colors">
            <div className="w-11 h-11 rounded-xl bg-crimson/10 text-crimson flex items-center justify-center text-xl shrink-0 shadow-sm">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Pan-India Courier</div>
              <div className="text-[11px] text-paper-dim">Safe certified dispatch</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-night-2/90 border border-gold/15 flex items-center gap-3.5 hover:border-gold/40 transition-colors">
            <div className="w-11 h-11 rounded-xl bg-emerald/10 text-emerald flex items-center justify-center text-xl shrink-0 shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">100% Quality Tested</div>
              <div className="text-[11px] text-paper-dim">Safe licensed crackers</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-night-2/90 border border-gold/15 flex items-center gap-3.5 hover:border-gold/40 transition-colors">
            <div className="w-11 h-11 rounded-xl bg-gold/10 text-gold flex items-center justify-center text-xl shrink-0 shadow-sm">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Celebration Packs</div>
              <div className="text-[11px] text-paper-dim">Wholesale gift combos</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
