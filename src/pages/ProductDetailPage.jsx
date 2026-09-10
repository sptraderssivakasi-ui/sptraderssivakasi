import React, { useState } from 'react';
import { ArrowLeft, ShoppingBag, MessageSquare, ShieldCheck, Sparkles, Check, Truck, AlertCircle } from 'lucide-react';
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
      `Estimated Amount: *₹${total}*\n\n` +
      `Please confirm stock availability and dispatch time.`
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
        className="inline-flex items-center gap-2 text-xs font-bold text-paper/70 hover:text-gold transition-colors bg-night-2 border border-white/10 px-4 py-2 rounded-xl"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Fireworks Catalog</span>
      </button>

      {/* Main Details Card */}
      <div className="bg-night-2 border border-gold/20 rounded-3xl p-6 lg:p-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        {/* Visual Showcase */}
        <div className="relative bg-night-3 rounded-2xl h-80 lg:h-[450px] flex items-center justify-center overflow-hidden border border-white/5">
          {product.image ? (
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover" 
            />
          ) : (
            <span className="text-8xl">🎆</span>
          )}

          {discount > 0 && (
            <span className="absolute top-4 left-4 bg-gradient-to-r from-gold to-gold-soft text-night text-sm font-black px-3 py-1.5 rounded-xl shadow-lg">
              {discount}% OFF WHOLESALE
            </span>
          )}

          <div className="absolute bottom-4 right-4 bg-night/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-gold/30 text-xs font-bold text-gold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> Sivakasi Certified
          </div>
        </div>

        {/* Info & Purchase Area */}
        <div className="space-y-6">
          <div>
            <span className="text-xs font-bold text-gold uppercase tracking-widest bg-gold/10 px-3 py-1 rounded-full border border-gold/20">
              {category ? category.name : 'Sivakasi Cracker'}
            </span>
            <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-paper mt-3 leading-tight">
              {product.name}
            </h1>
            <div className="text-xs font-mono text-paper/50 mt-1">
              Packing Specification: <span className="text-paper font-semibold">{product.meta || 'Standard Box'}</span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-4 rounded-2xl bg-night-3/70 border border-white/5 flex items-baseline justify-between">
            <div>
              <div className="text-[11px] text-paper/50 uppercase font-semibold">Wholesale Price</div>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="font-display text-3xl font-black text-gold">₹{product.price}</span>
                <span className="text-sm text-paper/40 line-through">₹{product.mrp}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                Save ₹{product.mrp - product.price} / box
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-paper uppercase tracking-wider">Product Overview</h3>
            <p className="text-xs sm:text-sm text-paper/70 leading-relaxed">
              {product.description || product.shortDesc || 'Premium quality Sivakasi firework made from standard components ensuring safe, vibrant and steady festive performance.'}
            </p>
          </div>

          {/* Quantity & CTA */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-paper/70">Quantity:</span>
              <div className="flex items-center bg-night-4 border border-white/10 rounded-xl p-1">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-8 h-8 rounded-lg text-paper/70 hover:text-gold hover:bg-white/5 font-bold flex items-center justify-center text-sm"
                >
                  -
                </button>
                <span className="w-10 text-center font-bold text-xs">{qty}</span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="w-8 h-8 rounded-lg text-paper/70 hover:text-gold hover:bg-white/5 font-bold flex items-center justify-center text-sm"
                >
                  +
                </button>
              </div>

              <span className="text-xs text-paper/50 font-mono">
                Total: <span className="font-bold text-gold">₹{product.price * qty}</span>
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddWithQty}
                className="flex-1 bg-gradient-to-r from-gold to-gold-soft hover:brightness-110 text-night font-bold py-3.5 px-6 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
              >
                {addedAnimation ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added {qty} to Enquiry!</span>
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
                className="bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-3.5 px-6 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Instant WhatsApp Quote</span>
              </button>
            </div>
          </div>

          {/* Safety & Sivakasi specs */}
          <div className="grid grid-cols-2 gap-3 pt-2 text-[11px] text-paper/60">
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-night-3/40 border border-white/5">
              <ShieldCheck className="w-4 h-4 text-gold shrink-0" />
              <span>Adult supervision recommended</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-night-3/40 border border-white/5">
              <Truck className="w-4 h-4 text-gold shrink-0" />
              <span>Pan-India secure dispatch</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related items */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-xl font-bold text-paper">
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
