import React from 'react';
import { ShoppingBag, Eye, Sparkles, Check } from 'lucide-react';

export default function ProductCard({ product, categoryName, onAddToCart, onSelectProduct }) {
  const discount = Math.max(0, Math.round((1 - product.price / product.mrp) * 100));

  return (
    <div className="glass-card rounded-2xl overflow-hidden group hover:border-gold/60 transition-all duration-300 flex flex-col justify-between hover:shadow-glow-gold relative bg-gradient-to-b from-night-2 to-night-3/90">
      <div>
        {/* Product Visual Area */}
        <div 
          onClick={() => onSelectProduct(product)}
          className="relative bg-night-3/70 h-52 flex items-center justify-center overflow-hidden border-b border-gold/15 cursor-pointer"
        >
          {product.image ? (
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" 
              loading="lazy"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-paper-muted group-hover:scale-110 transition-transform duration-500">
              <span className="text-6xl drop-shadow-md">🎆</span>
              <span className="text-[10px] uppercase font-bold tracking-wider mt-2 text-gold/60">Sivakasi Cracker</span>
            </div>
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-night-2/90 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity"></div>

          {/* Discount Badge */}
          {discount > 0 && (
            <span className="absolute top-3 left-3 bg-gradient-to-r from-crimson to-crimson-dark text-white text-[11px] font-black px-2.5 py-1 rounded-xl shadow-md border border-white/10 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-gold-light" />
              <span>{discount}% OFF</span>
            </span>
          )}

          {/* Sivakasi Seal */}
          <span className="absolute top-3 right-3 bg-night/90 backdrop-blur-md border border-gold/30 text-gold text-[10px] font-black px-2.5 py-1 rounded-xl shadow-lg">
            ⭐ Sivakasi Made
          </span>

          {/* Quick View Hover Pill */}
          <div className="absolute inset-0 bg-night/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
            <span className="bg-gold text-night text-xs font-black px-4 py-2 rounded-xl shadow-xl flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
              <Eye className="w-3.5 h-3.5" /> View Details
            </span>
          </div>
        </div>

        {/* Content Details */}
        <div className="p-5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-extrabold text-gold uppercase tracking-wider bg-gold/10 px-2 py-0.5 rounded-md border border-gold/20">
              {categoryName || 'Fireworks'}
            </span>
            <span className="text-[11px] text-paper-dim font-medium">
              Pack: <strong className="text-paper">{product.meta || '1 Box'}</strong>
            </span>
          </div>

          <h3 
            onClick={() => onSelectProduct(product)}
            className="font-display text-base font-extrabold text-white mt-2 group-hover:text-gold transition-colors line-clamp-1 cursor-pointer"
          >
            {product.name}
          </h3>

          <p className="text-xs text-paper-dim mt-1.5 line-clamp-2 leading-relaxed">
            {product.shortDesc || product.description || 'Authentic Sivakasi festive fireworks direct from factory.'}
          </p>

          {/* Pricing Grid */}
          <div className="mt-4 pt-3 border-t border-white/5 flex items-baseline justify-between">
            <div>
              <div className="text-[10px] text-paper-muted uppercase font-bold tracking-wider">Wholesale Price</div>
              <div className="flex items-baseline gap-2">
                <span className="font-display text-2xl font-black text-gold">₹{product.price}</span>
                <span className="text-xs text-paper-muted line-through">₹{product.mrp}</span>
              </div>
            </div>

            {discount > 0 && (
              <div className="text-right">
                <span className="text-[10px] text-emerald font-extrabold bg-emerald/10 border border-emerald/30 px-2 py-1 rounded-lg inline-block">
                  Save ₹{Math.round(product.mrp - product.price)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-5 pt-0 flex gap-2">
        <button
          onClick={() => onAddToCart(product)}
          className="flex-1 bg-gradient-to-r from-night-3 to-night-4 hover:from-gold hover:to-gold-soft hover:text-night text-paper text-xs font-black py-3 px-3 rounded-xl border border-gold/30 hover:border-transparent transition-all flex items-center justify-center gap-2 active:scale-95 shadow-md group/btn"
        >
          <ShoppingBag className="w-4 h-4 text-gold group-hover/btn:text-night transition-colors" />
          <span>+ Add to Enquiry</span>
        </button>

        <button
          onClick={() => onSelectProduct(product)}
          className="px-3 py-3 bg-night-3 hover:bg-night-2 rounded-xl border border-gold/20 text-paper-dim hover:text-gold transition-colors text-xs flex items-center justify-center active:scale-95"
          title="View Details"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
