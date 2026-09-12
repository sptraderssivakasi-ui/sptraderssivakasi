import React, { useState } from 'react';
import { Sparkles, ShoppingBag, Phone, MapPin, Menu, X, Shield, Clock } from 'lucide-react';

export default function Header({ currentView, setCurrentView, cartCount, openCart }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-night/90 backdrop-blur-md border-b border-gold/15">
      {/* ── Festive Top Marquee Strip ── */}
      <div className="bg-maroon-deep overflow-hidden py-2 border-b border-gold/20 text-xs font-semibold text-gold-soft">
        <div className="ticker-track flex items-center gap-8">
          <span>🎆 Diwali 2026 Special Wholesale Discounts</span>
          <span className="bg-gold text-night px-2 py-0.5 rounded font-extrabold text-[10px]">HOT</span>
          <span>🚚 Direct Sivakasi Factory Courier Dispatch Across India</span>
          <span className="bg-maroon text-paper px-2 py-0.5 rounded font-extrabold text-[10px]">100% GENUINE</span>
          <span>✅ Licensed Sivakasi Green Fireworks</span>
          <span>•</span>
          <span>🎆 Diwali 2026 Special Wholesale Discounts</span>
          <span className="bg-gold text-night px-2 py-0.5 rounded font-extrabold text-[10px]">HOT</span>
          <span>🚚 Direct Sivakasi Factory Courier Dispatch Across India</span>
        </div>
      </div>

      {/* ── Contact Info Strip ── */}
      <div className="bg-night-2 border-b border-white/5 py-1.5 px-6 hidden sm:block text-xs text-paper/70">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex gap-6 items-center">
            <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-gold" /> Sivakasi, Tamil Nadu</span>
            <a href="tel:+919443594447" className="flex items-center gap-1.5 hover:text-gold transition-colors">
              <Phone className="w-3.5 h-3.5 text-gold" /> +91 94435 94447
            </a>
          </div>
          <div className="flex items-center gap-2 text-gold">
            <Shield className="w-3.5 h-3.5" /> Sivakasi Authentic Direct Pricing
          </div>
        </div>
      </div>

      {/* ── Main Navigation Bar ── */}
      <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
        {/* Brand Logo */}
        <button 
          onClick={() => { setCurrentView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="flex items-center gap-3 group text-left"
        >
          <img src="/images/logo.png" alt="SP Traders logo" className="w-10 h-10 rounded-xl object-contain border border-gold/30 bg-white/5" />
          <div style={{ display: 'none' }} className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center text-xl group-hover:scale-105 transition-transform shadow-md">
            🎆
          </div>
          <div>
            <div className="font-display font-black text-xl text-paper tracking-wider group-hover:text-gold transition-colors flex items-center gap-1.5">
              SP TRADERS <span className="text-xs bg-gold text-night font-bold px-1.5 py-0.2 rounded">SIVAKASI</span>
            </div>
            <div className="text-[10px] text-paper/50 tracking-widest uppercase font-semibold">Wholesale & Retail Fireworks</div>
          </div>
        </button>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-1 bg-night-3/60 p-1.5 rounded-full border border-white/10">
          <button 
            onClick={() => setCurrentView('home')}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${currentView === 'home' ? 'bg-gold text-night shadow-md' : 'text-paper/70 hover:text-paper hover:bg-white/5'}`}
          >
            Home
          </button>
          <button 
            onClick={() => setCurrentView('products')}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${currentView === 'products' ? 'bg-gold text-night shadow-md' : 'text-paper/70 hover:text-paper hover:bg-white/5'}`}
          >
            Products Catalog
          </button>
          <button 
            onClick={() => setCurrentView('admin')}
            style={{ display: 'none' }}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${currentView === 'admin' ? 'bg-gold text-night shadow-md' : 'text-paper/70 hover:text-gold hover:bg-white/5'}`}
          >
            <span>⚡</span> Admin Portal
          </button>
        </nav>

        {/* Actions (Cart & Mobile Toggle) */}
        <div className="flex items-center gap-3">
          <button 
            onClick={openCart}
            className="relative bg-gradient-to-r from-gold to-gold-soft text-night font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 hover:brightness-110 transition-all shadow-lg active:scale-95"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Enquiry List</span>
            {cartCount > 0 && (
              <span className="bg-maroon text-paper text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                {cartCount}
              </span>
            )}
          </button>

          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-night-3 border border-white/10 text-paper/80 hover:text-gold"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu Dropdown ── */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-night-2 border-b border-gold/20 px-6 py-4 space-y-3">
          <button 
            onClick={() => { setCurrentView('home'); setMobileMenuOpen(false); }}
            className={`w-full text-left py-2.5 px-4 rounded-xl text-sm font-bold ${currentView === 'home' ? 'bg-gold text-night' : 'text-paper/80'}`}
          >
            🏠 Home
          </button>
          <button 
            onClick={() => { setCurrentView('products'); setMobileMenuOpen(false); }}
            className={`w-full text-left py-2.5 px-4 rounded-xl text-sm font-bold ${currentView === 'products' ? 'bg-gold text-night' : 'text-paper/80'}`}
          >
            🎆 Products Catalog
          </button>
          <button 
            onClick={() => { setCurrentView('admin'); setMobileMenuOpen(false); }}
            style={{ display: 'none' }}
            className={`w-full text-left py-2.5 px-4 rounded-xl text-sm font-bold ${currentView === 'admin' ? 'bg-gold text-night' : 'text-gold'}`}
          >
            ⚡ Admin Portal
          </button>
        </div>
      )}
    </header>
  );
}
