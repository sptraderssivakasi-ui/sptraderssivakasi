import React from 'react';
import HeroBanner from '../components/HeroBanner';
import ProductCard from '../components/ProductCard';
import { ArrowRight, Sparkles, Shield, CheckCircle, Package, Truck, PhoneCall, Star, Award, Zap, Flame } from 'lucide-react';

export default function HomePage({ categories, products, onAddToCart, onSelectProduct, setCurrentView, setSelectedCategoryFilter }) {
  const featuredProducts = products.filter(p => p.isFeatured).slice(0, 8);
  const displayProducts = featuredProducts.length > 0 ? featuredProducts : products.slice(0, 8);

  const handleCategoryClick = (catId) => {
    setSelectedCategoryFilter(catId);
    setCurrentView('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-16 lg:space-y-24 pb-12">
      {/* ── Hero Banner ── */}
      <HeroBanner onExplore={() => { setCurrentView('products'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />

      {/* ── Horizontal Category Icon Strip ── */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-black text-gold uppercase tracking-widest bg-gold/10 px-3 py-1 rounded-full border border-gold/20">
              <Sparkles className="w-3.5 h-3.5" /> Product Categories
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-black text-white mt-2">
              Explore by Firework Collection
            </h2>
          </div>
          <button
            onClick={() => { setSelectedCategoryFilter('all'); setCurrentView('products'); }}
            className="text-xs text-gold font-extrabold hover:text-gold-light transition-colors flex items-center gap-1.5 self-start sm:self-auto bg-night-3/80 px-4 py-2 rounded-xl border border-gold/20 hover:border-gold"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map(cat => {
            const count = products.filter(p => p.categoryId === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className="glass-card p-4 rounded-2xl flex flex-col items-center text-center group hover:border-gold/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-glow-gold"
              >
                <div className="w-14 h-14 rounded-2xl bg-night-3 border border-gold/20 flex items-center justify-center text-2xl mb-3 group-hover:scale-110 group-hover:bg-gold/20 transition-all shadow-md">
                  {cat.icon || '🎆'}
                </div>
                <div className="font-extrabold text-xs text-white group-hover:text-gold transition-colors">
                  {cat.name}
                </div>
                <div className="text-[10px] text-paper-muted mt-1 font-semibold">
                  {count} items
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Featured Diwali Crackers Grid ── */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-black text-crimson uppercase tracking-widest bg-crimson/10 px-3 py-1 rounded-full border border-crimson/20">
              <Flame className="w-3.5 h-3.5 text-crimson" /> Bestsellers & Top Rated
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-black text-white mt-2">
              Featured Wholesale Highlights
            </h2>
            <p className="text-xs text-paper-dim mt-1">Direct Sivakasi factory wholesale rates for family celebrations and community bulk orders.</p>
          </div>

          <button
            onClick={() => { setSelectedCategoryFilter('all'); setCurrentView('products'); }}
            className="self-start sm:self-auto bg-gradient-to-r from-night-3 to-night-4 hover:from-gold hover:to-gold-soft hover:text-night text-gold border border-gold/30 hover:border-transparent px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 shadow-md"
          >
            <span>See All {products.length} Fireworks</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayProducts.map(prod => {
            const cat = categories.find(c => c.id === prod.categoryId);
            return (
              <ProductCard
                key={prod.id}
                product={prod}
                categoryName={cat ? cat.name : ''}
                onAddToCart={onAddToCart}
                onSelectProduct={onSelectProduct}
              />
            );
          })}
        </div>
      </section>

      {/* ── How Wholesale Ordering Works ── */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="bg-gradient-to-br from-night-2 via-night-3 to-night-2 border border-gold/30 rounded-3xl p-8 lg:p-12 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gold/5 blur-[100px] rounded-full pointer-events-none"></div>

          <div className="max-w-2xl mb-10 relative z-10">
            <span className="text-xs font-black text-gold uppercase tracking-widest bg-gold/10 px-3 py-1 rounded-full border border-gold/20 inline-block mb-3">
              Direct Sivakasi Supply Chain
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-black text-white">
              How Direct Factory Booking Works
            </h2>
            <p className="text-xs text-paper-dim mt-2">Zero middlemen markups. Seamless online selection with transparent WhatsApp confirmation.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
            <div className="p-6 rounded-2xl bg-night-4/80 border border-gold/15 space-y-3 shadow-lg hover:border-gold/40 transition-colors">
              <div className="w-11 h-11 rounded-xl bg-gold/15 border border-gold/40 text-gold font-black flex items-center justify-center text-sm shadow-glow-gold">
                01
              </div>
              <h4 className="font-bold text-sm text-white">Select Fireworks</h4>
              <p className="text-xs text-paper-dim leading-relaxed">
                Add sparklers, ground wheels, multi-shot cakes, and gift boxes to your online enquiry list.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-night-4/80 border border-gold/15 space-y-3 shadow-lg hover:border-gold/40 transition-colors">
              <div className="w-11 h-11 rounded-xl bg-gold/15 border border-gold/40 text-gold font-black flex items-center justify-center text-sm shadow-glow-gold">
                02
              </div>
              <h4 className="font-bold text-sm text-white">WhatsApp Transmit</h4>
              <p className="text-xs text-paper-dim leading-relaxed">
                Click "Send WhatsApp Order Request" to instantly transmit your itemized quotation to our Sivakasi desk.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-night-4/80 border border-gold/15 space-y-3 shadow-lg hover:border-gold/40 transition-colors">
              <div className="w-11 h-11 rounded-xl bg-gold/15 border border-gold/40 text-gold font-black flex items-center justify-center text-sm shadow-glow-gold">
                03
              </div>
              <h4 className="font-bold text-sm text-white">80% Wholesale Discount</h4>
              <p className="text-xs text-paper-dim leading-relaxed">
                Our managers review your order, confirm your 80% direct factory discount, and provide freight details for your city.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-night-4/80 border border-gold/15 space-y-3 shadow-lg hover:border-gold/40 transition-colors">
              <div className="w-11 h-11 rounded-xl bg-gold/15 border border-gold/40 text-gold font-black flex items-center justify-center text-sm shadow-glow-gold">
                04
              </div>
              <h4 className="font-bold text-sm text-white">Doorstep Dispatch</h4>
              <p className="text-xs text-paper-dim leading-relaxed">
                Securely packed in licensed heavy-duty weatherproof cartons and dispatched via certified transport.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Wholesale Trust Highlights ── */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-7 rounded-3xl bg-gradient-to-br from-night-2 to-night-3 border border-gold/20 flex flex-col justify-between shadow-xl">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-gold/15 border border-gold/30 flex items-center justify-center text-2xl mb-4 text-gold">
                🏭
              </div>
              <h3 className="font-display font-black text-lg text-white">Authentic Sivakasi Direct</h3>
              <p className="text-xs text-paper-dim mt-2.5 leading-relaxed">
                We manufacture and source directly inside Sivakasi, cutting out all agents, wholesalers, and retail markups for maximum value.
              </p>
            </div>
            <div className="mt-6 text-xs text-gold font-bold flex items-center gap-1.5">
              <span>Direct Factory Advantage</span>
              <span>→</span>
            </div>
          </div>

          <div className="p-7 rounded-3xl bg-gradient-to-br from-night-2 to-night-3 border border-gold/20 flex flex-col justify-between shadow-xl">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald/15 border border-emerald/30 flex items-center justify-center text-2xl mb-4 text-emerald">
                🛡️
              </div>
              <h3 className="font-display font-black text-lg text-white">Licensed Green Fireworks</h3>
              <p className="text-xs text-paper-dim mt-2.5 leading-relaxed">
                Manufactured with tested eco-compliant formulas, lower smoke emissions, and stringent safety standards for festive peace of mind.
              </p>
            </div>
            <div className="mt-6 text-xs text-emerald font-bold flex items-center gap-1.5">
              <span>Certified Safety Standard</span>
              <span>→</span>
            </div>
          </div>

          <div className="p-7 rounded-3xl bg-gradient-to-br from-night-2 to-night-3 border border-gold/20 flex flex-col justify-between shadow-xl">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-crimson/15 border border-crimson/30 flex items-center justify-center text-2xl mb-4 text-crimson">
                🚚
              </div>
              <h3 className="font-display font-black text-lg text-white">Pan-India Transport Network</h3>
              <p className="text-xs text-paper-dim mt-2.5 leading-relaxed">
                Strong logistics partnerships ensure insured, timely, and safe road-transport parcel delivery across Tamil Nadu, Karnataka, AP, Telangana, Maharashtra and North India.
              </p>
            </div>
            <div className="mt-6 text-xs text-crimson-light font-bold flex items-center gap-1.5">
              <span>Safe Logistics Route</span>
              <span>→</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
