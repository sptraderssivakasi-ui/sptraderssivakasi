import React, { useState } from 'react';
import { Sparkles, ShoppingBag, Phone, MapPin, Menu, X, Shield } from 'lucide-react';

export default function Header({ currentView, setCurrentView, cartCount, openCart }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-night/95 backdrop-blur-xl border-b border-gold/20 shadow-2xl">
      {/* ── Festive Top Marquee Strip ── */}
      <div className="bg-gradient-to-r from-maroon via-crimson to-maroon overflow-hidden py-1.5 border-b border-gold/20 text-xs font-bold text-gold-light shadow-inner">
        <div className="ticker-track flex items-center gap-8">
          <span className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-gold-light animate-pulse" /> Diwali 2026 Direct Sivakasi Wholesale Bookings Open!</span>
          <span className="bg-gradient-to-r from-gold via-gold-soft to-gold text-night px-2.5 py-0.5 rounded-full font-black text-[10px] tracking-wider uppercase shadow-md animate-bounce">80% DISCOUNT</span>
          <span>🚚 Safe Pan-India Factory Courier & Transport Dispatch</span>
          <span className="bg-white/20 text-white px-2 py-0.5 rounded-md font-extrabold text-[10px]">100% ORIGINAL</span>
          <span>✅ Authentic Certified Sivakasi Green Crackers</span>
          <span>•</span>
          <span className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-gold-light animate-pulse" /> Direct Sivakasi Wholesale Hub</span>
          <span className="bg-gradient-to-r from-gold via-gold-soft to-gold text-night px-2.5 py-0.5 rounded-full font-black text-[10px] tracking-wider uppercase shadow-md">80% DISCOUNT</span>
          <span>🚚 Safe Pan-India Transport</span>
        </div>
      </div>

      {/* ── Contact Info Strip ── */}
      <div className="bg-night-2/90 border-b border-white/5 py-1.5 px-6 hidden sm:block text-xs text-paper-dim font-medium">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex gap-6 items-center">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-gold shrink-0" />
              <span className="font-semibold">SP Traders- PKN Road, Iyyangar Bakery Backside, Sivakasi- 626189</span>
            </span>
            <a href="tel:+919443594447" className="flex items-center gap-1.5 text-paper hover:text-gold transition-colors font-bold">
              <Phone className="w-3.5 h-3.5 text-gold" />
              <span>+91 94435 94447</span>
            </a>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-gold font-bold text-[11px]">
              <Shield className="w-3.5 h-3.5" /> Licensed Sivakasi Wholesale Distributor
            </span>
          </div>
        </div>
      </div>

      {/* ── Main Navigation Bar ── */}
      <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => { setCurrentView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="flex items-center gap-3.5 group text-left"
        >
          <div className="relative">
            <img
              src="/images/logo.png"
              alt="SP Traders Sivakasi"
              onError={(e) => {
                if (!e.target.dataset.tried) {
                  e.target.dataset.tried = 'true';
                  e.target.src = 'images/logo.png';
                }
              }}
              className="w-11 h-11 rounded-2xl object-contain border border-gold/40 bg-night-3 p-0.5 group-hover:scale-105 transition-transform shadow-glow-gold"
            />
          </div>
          <div>
            <div className="font-display font-black text-xl sm:text-2xl text-white tracking-wider group-hover:text-gold transition-colors flex items-center gap-2">
              SP TRADERS
              <span className="text-[10px] bg-gradient-to-r from-gold to-gold-soft text-night font-black px-2 py-0.5 rounded-full uppercase tracking-widest shadow-sm">
                Sivakasi
              </span>
            </div>
            <div className="text-[10px] text-paper-dim tracking-widest uppercase font-semibold">Wholesale & Retail Fireworks</div>
          </div>
        </button>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-1.5 bg-night-3/80 backdrop-blur-md p-1.5 rounded-full border border-gold/20 shadow-inner">
          <button
            onClick={() => setCurrentView('home')}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${currentView === 'home'
                ? 'bg-gradient-to-r from-gold to-gold-soft text-night shadow-glow-gold'
                : 'text-paper-dim hover:text-white hover:bg-white/5'
              }`}
          >
            Home
          </button>
          <button
            onClick={() => setCurrentView('products')}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${currentView === 'products'
                ? 'bg-gradient-to-r from-gold to-gold-soft text-night shadow-glow-gold'
                : 'text-paper-dim hover:text-white hover:bg-white/5'
              }`}
          >
            Fireworks Catalog
          </button>
        </nav>

        {/* Actions (Cart & Mobile Toggle) */}
        <div className="flex items-center gap-3">
          <button
            onClick={openCart}
            className="relative bg-gradient-to-r from-gold via-gold-soft to-gold text-night font-black px-4 sm:px-5 py-2.5 rounded-2xl text-xs flex items-center gap-2 hover:brightness-110 transition-all shadow-glow-gold active:scale-95 group"
          >
            <ShoppingBag className="w-4 h-4 text-night group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline font-extrabold">Enquiry Cart</span>
            {cartCount > 0 && (
              <span className="bg-crimson text-white text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center animate-bounce shadow-md">
                {cartCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-night-3 border border-gold/20 text-paper hover:text-gold"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu Dropdown ── */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-night-2/98 backdrop-blur-xl border-b border-gold/30 px-6 py-5 space-y-3 animate-fadeIn">
          <button
            onClick={() => { setCurrentView('home'); setMobileMenuOpen(false); }}
            className={`w-full text-left py-3 px-4 rounded-xl text-sm font-bold flex items-center gap-3 transition-colors ${currentView === 'home' ? 'bg-gold text-night' : 'text-paper hover:bg-white/5'
              }`}
          >
            <span>🏠</span>
            <span>Home</span>
          </button>
          <button
            onClick={() => { setCurrentView('products'); setMobileMenuOpen(false); }}
            className={`w-full text-left py-3 px-4 rounded-xl text-sm font-bold flex items-center gap-3 transition-colors ${currentView === 'products' ? 'bg-gold text-night' : 'text-paper hover:bg-white/5'
              }`}
          >
            <span>🎆</span>
            <span>Fireworks Catalog</span>
          </button>
          <div className="pt-2 border-t border-white/10">
            <a
              href="https://wa.me/919443594447"
              target="_blank"
              rel="noreferrer"
              className="w-full py-3 px-4 rounded-xl text-xs font-extrabold bg-emerald/20 text-emerald border border-emerald/30 flex items-center justify-center gap-2"
            >
              <span>💬</span> WhatsApp Inquiry: +91 94435 94447
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
