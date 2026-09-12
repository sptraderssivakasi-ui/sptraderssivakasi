import React, { useState } from 'react';
import { ArrowLeft, ShoppingBag, MessageSquare, ShieldCheck, Sparkles, Check, Truck, AlertCircle, Flame } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { WA_PHONE } from '../data/seedData';

export default function ProductDetailPage({ product, categories, allProducts, onBack, onAddToCart, onSelectProduct }) {
  const [qty, setQty] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  if (!product) return null;

  const category = categories.find(c => c.id === product.categoryId);
  const discount = Math.max(0, Math.round((1 - product.price / product.mrp) * 100));
  const relatedProducts = allProducts
    .filter(p => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 4);

  const handleDirectWhatsApp = () => {
    const total = product.price * qty;
    const msg = encodeURIComponent(
      `🎆 *SP Traders Sivakasi — Product Enquiry*\n\n` +
      `Product: *${product.name}*\n` +
      `Quantity: *${qty}* (${product.meta || '1 Box'})\n` +
      `Wholesale Rate: *₹${product.price}*\n` +
      `Estimated Total: *₹${total}*\n\n` +
      `Please confirm dispatch availability and delivery timeline.`
    );
    window.open(`https://wa.me/${WA_PHONE}?text=${msg}`, '_blank');
  };

  const handleAddWithQty = () => {
    for (let i = 0; i < qty; i++) {
      onAddToCart(product);
    }
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-12">
      {/* Back link */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-black text-paper-dim hover:text-gold transition-colors bg-night-2 border border-gold/20 px-4 py-2.5 rounded-xl hover:border-gold shadow-md"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Fireworks Catalog</span>
      </button>

      {/* Main Details Card */}
      <div className="bg-gradient-to-br from-night-2 to-night-3 border border-gold/30 rounded-3xl p-6 lg:p-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-start shadow-2xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-72 h-72 bg-gold/5 blur-[100px] rounded-full pointer-events-none"></div>

        {/* Visual Showcase */}
        <div className="relative bg-night-4/80 rounded-2xl h-80 lg:h-[450px] flex items-center justify-center overflow-hidden border border-gold/20 shadow-xl group">
          {product.image ? (
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
            />
          ) : (
            <div className="flex flex-col items-center justify-center">
              <span className="text-8xl drop-shadow-lg">🎆</span>
              <span className="text-xs text-gold font-bold uppercase mt-3 tracking-wider">Sivakasi Original</span>
            </div>
          )}

          {discount > 0 && (
            <span className="absolute top-4 left-4 bg-gradient-to-r from-crimson to-crimson-dark text-white text-xs font-black px-3 py-1.5 rounded-xl shadow-lg border border-white/10 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-gold-light" />
              <span>{discount}% OFF FACTORY RATE</span>
            </span>
          )}

          <div className="absolute bottom-4 right-4 bg-night/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-gold/30 text-xs font-bold text-gold flex items-center gap-1.5 shadow-lg">
            <ShieldCheck className="w-4 h-4 text-gold" /> Sivakasi Certified Green
          </div>
        </div>

        {/* Info & Purchase Area */}
        <div className="space-y-6 relative z-10">
          <div>
            <span className="text-xs font-black text-gold uppercase tracking-widest bg-gold/15 px-3 py-1 rounded-full border border-gold/30">
              {category ? category.name : 'Sivakasi Fireworks'}
            </span>
            <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-black text-white mt-3 leading-tight">
              {product.name}
            </h1>
            <div className="text-xs text-paper-dim mt-2 font-mono flex items-center gap-2">
              <span>Packing Specification:</span>
              <span className="text-white font-bold bg-night-4 px-2.5 py-0.5 rounded-md border border-white/10">
                {product.meta || 'Standard Box'}
              </span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-5 rounded-2xl bg-night-4/90 border border-gold/25 flex items-baseline justify-between shadow-lg">
            <div>
              <div className="text-[10px] text-paper-dim uppercase font-bold tracking-wider">Wholesale Unit Price</div>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="font-display text-3xl font-black text-gold">₹{product.price}</span>
                <span className="text-sm text-paper-muted line-through">₹{product.mrp}</span>
              </div>
            </div>
            {discount > 0 && (
              <div className="text-right">
                <span className="text-xs font-black text-emerald bg-emerald/15 px-3 py-1 rounded-xl border border-emerald/30 inline-block">
                  Save ₹{Math.round(product.mrp - product.price)} / pack
                </span>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-gold uppercase tracking-wider">Product Overview & Specs</h3>
            <p className="text-xs sm:text-sm text-paper-dim leading-relaxed">
              {product.description || product.shortDesc || 'Premium quality Sivakasi firework made from standard high-grade pyrotechnic components ensuring safe, vibrant and steady festive performance.'}
            </p>
          </div>

          {/* Quantity & CTA */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-white">Quantity:</span>
              <div className="flex items-center bg-night-4 border border-gold/20 rounded-xl p-1">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-8 h-8 rounded-lg text-paper hover:text-gold hover:bg-white/10 font-black flex items-center justify-center text-sm"
                >
                  -
                </button>
                <span className="w-10 text-center font-black text-sm text-white">{qty}</span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="w-8 h-8 rounded-lg text-paper hover:text-gold hover:bg-white/10 font-black flex items-center justify-center text-sm"
                >
                  +
                </button>
              </div>

              <span className="text-xs text-paper-dim font-mono">
                Subtotal: <strong className="text-gold font-black text-base">₹{product.price * qty}</strong>
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handleAddWithQty}
                className="flex-1 bg-gradient-to-r from-gold via-gold-soft to-gold hover:brightness-110 text-night font-black py-4 px-6 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-glow-gold active:scale-95 transition-all"
              >
                {addedAnimation ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added {qty} to Enquiry Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add {qty} to Enquiry List</span>
                  </>
                )}
              </button>

              <button
                onClick={handleDirectWhatsApp}
                className="bg-gradient-to-r from-[#25D366] to-[#1eb857] hover:brightness-110 text-white font-black py-4 px-6 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Instant WhatsApp Booking</span>
              </button>
            </div>
          </div>

          {/* Safety & Sivakasi specs */}
          <div className="grid grid-cols-2 gap-3 pt-2 text-[11px] text-paper-dim">
            <div className="flex items-center gap-2 p-3 rounded-xl bg-night-4/60 border border-white/5">
              <ShieldCheck className="w-4 h-4 text-gold shrink-0" />
              <span>Adult supervision recommended</span>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-night-4/60 border border-white/5">
              <Truck className="w-4 h-4 text-emerald shrink-0" />
              <span>Pan-India secure dispatch</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related items */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-xl font-bold text-white">
              More from {category ? category.name : 'this category'}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(rel => (
              <ProductCard
                key={rel.id}
                product={rel}
                categoryName={category ? category.name : ''}
                onAddToCart={onAddToCart}
                onSelectProduct={onSelectProduct}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
