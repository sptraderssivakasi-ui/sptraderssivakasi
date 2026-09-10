import React from 'react';
import { Phone, MapPin, Mail, ShieldCheck, Heart, Sparkles } from 'lucide-react';

export default function Footer({ setCurrentView }) {
  return (
    <footer className="bg-night-4 border-t border-gold/20 pt-16 pb-8 text-paper/70">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center text-xl">
              🎆
            </div>
            <div>
              <div className="font-display font-black text-lg text-paper tracking-wider">SP TRADERS</div>
              <div className="text-[10px] text-gold tracking-widest uppercase font-bold">SIVAKASI CRACKERS</div>
            </div>
          </div>
          <p className="text-xs leading-relaxed text-paper/60">
            Premium quality Sivakasi-manufactured fireworks direct from the fireworks capital of India. Safe, vibrant, and wholesale-priced celebrations.
          </p>
          <div className="flex items-center gap-2 text-xs text-gold font-semibold">
            <ShieldCheck className="w-4 h-4" /> 100% Genuine Sivakasi Brand
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-display font-bold text-paper text-sm uppercase tracking-wider mb-4 border-b border-gold/20 pb-2">
            Quick Navigation
          </h4>
          <ul className="space-y-2.5 text-xs">
            <li>
              <button onClick={() => setCurrentView('home')} className="hover:text-gold transition-colors">
                🏠 Home Page
              </button>
            </li>
            <li>
              <button onClick={() => setCurrentView('products')} className="hover:text-gold transition-colors">
                🎆 All Fireworks Catalog
              </button>
            </li>
            <li>
              <button onClick={() => setCurrentView('admin')} className="hover:text-gold transition-colors">
                ⚡ Admin Dashboard & Sync
              </button>
            </li>
            <li>
              <a href="https://wa.me/919443594447" target="_blank" rel="noreferrer" className="hover:text-gold transition-colors flex items-center gap-1">
                💬 Direct WhatsApp Support
              </a>
            </li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h4 className="font-display font-bold text-paper text-sm uppercase tracking-wider mb-4 border-b border-gold/20 pb-2">
            Popular Categories
          </h4>
          <ul className="space-y-2.5 text-xs">
            <li>✨ Electric & Colour Sparklers</li>
            <li>🌀 Deluxe Ground Chakkars</li>
            <li>🌸 Giant Flower Pots</li>
            <li>🎆 30 & 60 Shot Aerial Cakes</li>
            <li>🚀 High Flying Whistle Rockets</li>
            <li>🎁 Family Celebration Gift Boxes</li>
          </ul>
        </div>

        {/* Contact info */}
        <div>
          <h4 className="font-display font-bold text-paper text-sm uppercase tracking-wider mb-4 border-b border-gold/20 pb-2">
            Contact & Location
          </h4>
          <div className="space-y-3 text-xs">
            <p className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" />
              <span>SP Traders, Sivakasi Main Road, Sivakasi – 626123, Tamil Nadu, India</span>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gold shrink-0" />
              <a href="tel:+919443594447" className="hover:text-gold transition-colors">+91 94435 94447</a>
            </p>
            <p className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gold shrink-0" />
              <span>sales@sptraderssivakasi.com</span>
            </p>
            <div className="p-3 bg-night-3 rounded-xl border border-white/5 mt-3">
              <div className="text-[11px] font-bold text-gold">Diwali Ordering Hours:</div>
              <div className="text-[11px] text-paper/60">Mon - Sun: 8:00 AM - 10:00 PM</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-paper/40">
        <p>© 2026 SP Traders Sivakasi. All Rights Reserved.</p>
        <p className="flex items-center gap-1.5">
          Celebrate Safe & Joyful Diwali with Sivakasi Fireworks <Sparkles className="w-3.5 h-3.5 text-gold" />
        </p>
      </div>
    </footer>
  );
}
