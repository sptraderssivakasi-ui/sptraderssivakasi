import React from 'react';
import { ShoppingBag, Eye, Sparkles } from 'lucide-react';

export default function ProductCard({ product, categoryName, onAddToCart, onSelectProduct }) {
  const discount = Math.max(0, Math.round((1 - product.price / product.mrp) * 100));

  return (
    <div className="glass-card rounded-2xl overflow-hidden group hover:border-gold/40 transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Product Visual Area */}
        <div className="relative bg-night-3 h-48 flex items-center justify-center overflow-hidden border-b border-white/5">
          {product.image ? (
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
            />
          ) : (
            <span className="text-6xl group-hover:scale-110 transition-transform duration-500">
              🎆
            </span>
          )}

          {/* Discount Badge */}
          {discount > 0 && (
            <span className="absolute top-3 left-3 bg-gradient-to-r from-gold to-gold-soft text-night text-xs font-black px-2.5 py-1 rounded-lg shadow-md">
              {discount}% OFF
            </span>
          )}

          {/* Sivakasi Seal */}
          <span className="absolute top-3 right-3 bg-night/80 backdrop-blur-sm border border-gold/30 text-gold text-[10px] font-bold px-2 py-0.5 rounded-md">
            Sivakasi Made
          </span>
        </div>

        {/* Content Details */}
        <div className="p-5">
          <div className="text-[11px] font-bold text-gold/80 uppercase tracking-wider">
            {categoryName || 'Firework item'}
          </div>
          <h3 className="font-display text-base font-bold text-paper mt-1 group-hover:text-gold transition-colors line-clamp-1">
            {product.name}
          </h3>
          <p className="text-xs text-paper/60 mt-1 line-clamp-2 leading-relaxed">
            {product.shortDesc || product.description || 'Premium festive crackers.'}
          </p>

          <div className="mt-3 text-[11px] text-paper/40 font-mono">
            Pack: {product.meta || '1 Box'}
          </div>

          <div className="flex items-baseline gap-2 mt-2">
            <span className="font-display text-xl font-black text-gold">₹{product.price}</span>
            <span className="text-xs text-paper/40 line-through">₹{product.mrp}</span>
            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/20">
              Save ₹{product.mrp - product.price}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-5 pt-0 flex gap-2">
        <button
          onClick={() => onAddToCart(product)}
          className="flex-1 bg-night-3 hover:bg-gold hover:text-night text-paper text-xs font-bold py-2.5 px-3 rounded-xl border border-gold/25 hover:border-gold transition-all flex items-center justify-center gap-1.5 active:scale-95 shadow-sm"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>+ Add to Enquiry</span>
        </button>

        <button
          onClick={() => onSelectProduct(product)}
          className="px-3 py-2.5 bg-night-3 hover:bg-night-2 rounded-xl border border-white/10 text-paper/70 hover:text-gold transition-colors text-xs flex items-center justify-center active:scale-95"
          title="View Details"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
