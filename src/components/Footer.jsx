import React from 'react';
import { Phone, MapPin, Mail, ShieldCheck, Heart, Sparkles, Clock } from 'lucide-react';

export default function Footer({ setCurrentView }) {
  return (
    <footer className="bg-night-4 border-t border-gold/25 pt-16 pb-10 text-paper-dim relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[200px] bg-gold/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 relative z-10">
        {/* Brand Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <img 
              src="/images/logo.png" 
              alt="SP Traders Sivakasi logo" 
              className="w-12 h-12 rounded-2xl object-contain border border-gold/40 bg-night-3 p-1 shadow-glow-gold" 
            />
            <div>
              <div className="font-display font-black text-xl text-white tracking-wider">SP TRADERS</div>
              <div className="text-[10px] text-gold font-extrabold tracking-widest uppercase">Sivakasi Fireworks Hub</div>
            </div>
          </div>
          <p className="text-xs leading-relaxed text-paper-dim">
            Direct Sivakasi factory manufacturing & wholesale distribution. Uncompromising safety, 100% legal green fireworks, and maximum festive value delivered pan-India.
          </p>
          <div className="inline-flex items-center gap-2 text-xs text-gold font-bold bg-gold/10 px-3 py-1.5 rounded-xl border border-gold/20">
            <ShieldCheck className="w-4 h-4 text-gold" /> Licensed Sivakasi Factory Partner
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-display font-bold text-white text-sm uppercase tracking-wider mb-4 border-b border-gold/20 pb-2 flex items-center gap-2">
            <span>✨ Navigation</span>
          </h4>
          <ul className="space-y-3 text-xs font-medium">
            <li>
              <button onClick={() => setCurrentView('home')} className="hover:text-gold transition-colors flex items-center gap-2">
                <span>🏠</span> Home Showcase
              </button>
            </li>
            <li>
              <button onClick={() => setCurrentView('products')} className="hover:text-gold transition-colors flex items-center gap-2">
                <span>🎆</span> Full Fireworks Catalog
              </button>
            </li>
            <li>
              <a 
                href="https://wa.me/919443594447?text=Hi%20SP%20Traders%20Sivakasi,%20I%20want%20to%20place%20a%20wholesale%20order." 
                target="_blank" 
                rel="noreferrer" 
                className="hover:text-emerald transition-colors flex items-center gap-2 text-emerald"
              >
                <span>💬</span> WhatsApp Direct Order Desk
              </a>
            </li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h4 className="font-display font-bold text-white text-sm uppercase tracking-wider mb-4 border-b border-gold/20 pb-2 flex items-center gap-2">
            <span>🎆 Featured Fireworks</span>
          </h4>
          <ul className="space-y-2.5 text-xs text-paper-dim">
            <li className="flex items-center gap-2">✨ Sparklers (10cm - 50cm Electric)</li>
            <li className="flex items-center gap-2">🌀 Giant Deluxe Ground Chakkars</li>
            <li className="flex items-center gap-2">🌸 Multi-Color Ashoka Flower Pots</li>
            <li className="flex items-center gap-2">🚀 Sky High Whistling Rockets</li>
            <li className="flex items-center gap-2">🎇 30, 60 & 120 Aerial Multi-Shots</li>
            <li className="flex items-center gap-2">🎁 VIP Diwali Family Gift Boxes</li>
          </ul>
        </div>

        {/* Contact info */}
        <div>
          <h4 className="font-display font-bold text-white text-sm uppercase tracking-wider mb-4 border-b border-gold/20 pb-2 flex items-center gap-2">
            <span>📍 Contact & Depot</span>
          </h4>
          <div className="space-y-3 text-xs">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" />
              <span>SP Traders Depot, Sivakasi Main Road, Sivakasi – 626123, Tamil Nadu</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-gold shrink-0" />
              <a href="tel:+919443594447" className="text-white hover:text-gold transition-colors font-bold">+91 94435 94447</a>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-gold shrink-0" />
              <span>sales@sptraderssivakasi.com</span>
            </div>
            <div className="p-3 bg-night-2/90 rounded-2xl border border-gold/20 mt-3">
              <div className="text-[11px] font-bold text-gold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Diwali Dispatch Desk:
              </div>
              <div className="text-[11px] text-paper-dim mt-0.5">Mon – Sun: 8:00 AM to 10:00 PM (IST)</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-paper-muted">
        <p>© 2026 SP Traders Sivakasi. All Rights Reserved. Sivakasi, Tamil Nadu.</p>
        <p className="flex items-center gap-1.5 text-gold/80">
          <span>✨ Made with festive pride in Sivakasi</span>
        </p>
      </div>
    </footer>
  );
}
