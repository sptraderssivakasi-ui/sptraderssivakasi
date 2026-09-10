import React from 'react';
import HeroBanner from '../components/HeroBanner';
import ProductCard from '../components/ProductCard';
import { ArrowRight, Sparkles, Shield, CheckCircle, Package, Truck, PhoneCall, Star } from 'lucide-react';

export default function HomePage({ categories, products, onAddToCart, onSelectProduct, setCurrentView, setSelectedCategoryFilter }) {
  const featuredProducts = products.filter(p => p.isFeatured).slice(0, 8);
  const displayProducts = featuredProducts.length > 0 ? featuredProducts : products.slice(0, 8);

  const handleCategoryClick = (catId) => {
    setSelectedCategoryFilter(catId);
    setCurrentView('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-16 lg:space-y-24">
      {/* ── Hero Banner ── */}
      <HeroBanner onExplore={() => { setCurrentView('products'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />

      {/* ── Horizontal Category Icon Strip ── */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="text-xs font-bold text-gold uppercase tracking-wider">Product Categories</div>
            <h2 className="font-display text-2xl font-bold text-paper mt-1">Explore by Firework Type</h2>
          </div>
          <button
            onClick={() => { setSelectedCategoryFilter('all'); setCurrentView('products'); }}
            className="text-xs text-gold font-bold hover:underline flex items-center gap-1"
          >
            View All Categories →
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map(cat => {
            const count = products.filter(p => p.categoryId === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className="glass-card p-4 rounded-2xl flex flex-col items-center text-center group hover:border-gold transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-14 h-14 rounded-2xl bg-night-3 border border-gold/20 flex items-center justify-center text-2xl mb-3 group-hover:scale-110 group-hover:bg-gold/15 transition-all shadow-md">
                  {cat.icon || '🎆'}
                </div>
                <div className="font-bold text-xs text-paper group-hover:text-gold transition-colors">
                  {cat.name}
                </div>
                <div className="text-[10px] text-paper/40 mt-1">
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
            <div className="text-xs font-bold text-gold uppercase tracking-wider">Bestsellers</div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-paper mt-1">
              Top Featured Diwali Highlights
            </h2>
            <p className="text-xs text-paper/60 mt-1">Handpicked wholesale deals on Sivakasi's most requested fireworks.</p>
          </div>

          <button
            onClick={() => { setSelectedCategoryFilter('all'); setCurrentView('products'); }}
            className="self-start sm:self-auto bg-night-3 hover:bg-night-2 text-gold border border-gold/30 px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
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
        <div className="bg-night-2 border border-gold/20 rounded-3xl p-8 lg:p-12 relative overflow-hidden">
          <div className="max-w-2xl mb-10">
            <span className="text-xs font-bold text-gold uppercase tracking-widest">Simple 4-Step Process</span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-paper mt-1">
              How Direct Sivakasi Booking Works
            </h2>
            <p className="text-xs text-paper/60 mt-2">Direct from factory town to your doorstep with guaranteed savings.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
            <div className="p-5 rounded-2xl bg-night-3/60 border border-white/5 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/30 text-gold font-bold flex items-center justify-center text-sm">
                01
              </div>
              <h4 className="font-bold text-sm text-paper">Select Crackers</h4>
              <p className="text-xs text-paper/60 leading-relaxed">
                Add sparklers, aerial cakes, and gift boxes to your online Enquiry Cart.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-night-3/60 border border-white/5 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/30 text-gold font-bold flex items-center justify-center text-sm">
                02
              </div>
              <h4 className="font-bold text-sm text-paper">WhatsApp Connect</h4>
              <p className="text-xs text-paper/60 leading-relaxed">
                Click "Send Enquiry" to transmit your custom item list directly to our Sivakasi staff.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-night-3/60 border border-white/5 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/30 text-gold font-bold flex items-center justify-center text-sm">
                03
              </div>
              <h4 className="font-bold text-sm text-paper">Final Price Lock</h4>
              <p className="text-xs text-paper/60 leading-relaxed">
                We calculate wholesale bulk discounts and provide courier delivery timelines.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-night-3/60 border border-white/5 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/30 text-gold font-bold flex items-center justify-center text-sm">
                04
              </div>
              <h4 className="font-bold text-sm text-paper">Safe Dispatch</h4>
              <p className="text-xs text-paper/60 leading-relaxed">
                Licensed packaging and pan-India safe courier transport dispatch directly from Sivakasi.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Wholesale Trust Section ── */}
      <section className="max-w-7xl mx-auto px-6 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-gradient-to-br from-night-2 to-night-3 border border-gold/20 flex flex-col justify-between">
            <div>
              <div className="text-3xl mb-3">🏭</div>
              <h3 className="font-display font-bold text-lg text-paper">Direct Sivakasi Source</h3>
              <p className="text-xs text-paper/60 mt-2 leading-relaxed">
                No middle agents or high retail markups. Enjoy authentic Sivakasi fireworks at genuine factory-direct wholesale pricing.
              </p>
            </div>
            <div className="mt-6 text-xs text-gold font-bold">100% Genuine Sivakasi →</div>
          </div>

          <div className="p-6 rounded-3xl bg-gradient-to-br from-night-2 to-night-3 border border-gold/20 flex flex-col justify-between">
            <div>
              <div className="text-3xl mb-3">🛡️</div>
              <h3 className="font-display font-bold text-lg text-paper">Licensed Green Crackers</h3>
              <p className="text-xs text-paper/60 mt-2 leading-relaxed">
                Manufactured following all safety regulations and testing protocols for vibrant, safe, and memorable Diwali festivities.
              </p>
            </div>
            <div className="mt-6 text-xs text-gold font-bold">Government Certified →</div>
          </div>

          <div className="p-6 rounded-3xl bg-gradient-to-br from-night-2 to-night-3 border border-gold/20 flex flex-col justify-between">
            <div>
              <div className="text-3xl mb-3">🚚</div>
              <h3 className="font-display font-bold text-lg text-paper">Prompt Courier Delivery</h3>
              <p className="text-xs text-paper/60 mt-2 leading-relaxed">
                Orders carefully packed in robust weatherproof packaging and dispatched via trusted surface transport networks across India.
              </p>
            </div>
            <div className="mt-6 text-xs text-gold font-bold">Tracked Transport →</div>
          </div>
        </div>
      </section>
    </div>
  );
}
