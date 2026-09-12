import React, { useState } from 'react';
import ProductCard from '../components/ProductCard';
import { Search, SlidersHorizontal, Sparkles, X, Grid, List, Flame } from 'lucide-react';

export default function ProductsPage({ categories, products, onAddToCart, onSelectProduct, selectedCategoryFilter, setSelectedCategoryFilter }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('default'); // 'default', 'price-low', 'price-high', 'discount'

  // Filter logic
  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategoryFilter === 'all' || p.categoryId === selectedCategoryFilter;
    const cat = categories.find(c => c.id === p.categoryId);
    const catName = cat ? cat.name.toLowerCase() : '';
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      p.name.toLowerCase().includes(q) || 
      (p.shortDesc && p.shortDesc.toLowerCase().includes(q)) ||
      (p.meta && p.meta.toLowerCase().includes(q)) ||
      catName.includes(q);

    return matchesCategory && matchesSearch;
  });

  // Sort logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === 'price-low') return a.price - b.price;
    if (sortOption === 'price-high') return b.price - a.price;
    if (sortOption === 'discount') {
      const discA = (1 - a.price / a.mrp);
      const discB = (1 - b.price / b.mrp);
      return discB - discA;
    }
    return 0;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
      {/* ── Page Header ── */}
      <div>
        <div className="inline-flex items-center gap-2 text-xs font-black text-gold uppercase tracking-widest bg-gold/10 px-3.5 py-1.5 rounded-full border border-gold/20">
          <Sparkles className="w-3.5 h-3.5 text-gold" />
          <span>Direct Sivakasi Factory 2026 Collection</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-white mt-3 tracking-tight">
          Wholesale Fireworks Catalog
        </h1>
        <p className="text-xs sm:text-sm text-paper-dim mt-2 max-w-2xl leading-relaxed">
          Browse authentic Sivakasi sparklers, ground chakkars, flower pots, sky shots, and festive gift boxes at direct wholesale pricing.
        </p>
      </div>

      {/* ── Search & Filter Toolbar ── */}
      <div className="bg-night-2/95 border border-gold/20 rounded-2xl p-4 sm:p-5 flex flex-col lg:flex-row gap-4 justify-between items-center shadow-xl">
        {/* Search Bar */}
        <div className="relative w-full lg:w-96">
          <input
            type="text"
            placeholder="Search crackers by name, category, or box size..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-night-3 border border-gold/25 rounded-xl pl-10 pr-10 py-3 text-xs text-white placeholder-paper-muted focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
          />
          <Search className="w-4 h-4 text-paper-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-paper-muted hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort & Count */}
        <div className="flex items-center gap-4 w-full lg:w-auto justify-between lg:justify-end">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-paper-dim font-bold hidden sm:inline">Sort By:</span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="bg-night-3 border border-gold/25 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-gold font-medium cursor-pointer"
            >
              <option value="default">Default Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="discount">Biggest Savings (%)</option>
            </select>
          </div>

          <div className="text-xs text-paper-dim font-mono bg-night-3 px-3 py-2 rounded-xl border border-gold/15">
            Showing <strong className="text-gold font-bold">{sortedProducts.length}</strong> items
          </div>
        </div>
      </div>

      {/* ── Category Filter Pills ── */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedCategoryFilter('all')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black whitespace-nowrap transition-all ${
            selectedCategoryFilter === 'all' 
              ? 'bg-gradient-to-r from-gold to-gold-soft text-night shadow-glow-gold' 
              : 'bg-night-2 border border-gold/15 text-paper-dim hover:text-white hover:border-gold/40'
          }`}
        >
          🎆 All Fireworks ({products.length})
        </button>
        {categories.map(cat => {
          const count = products.filter(p => p.categoryId === cat.id).length;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategoryFilter(cat.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-black whitespace-nowrap transition-all flex items-center gap-2 ${
                selectedCategoryFilter === cat.id 
                  ? 'bg-gradient-to-r from-gold to-gold-soft text-night shadow-glow-gold' 
                  : 'bg-night-2 border border-gold/15 text-paper-dim hover:text-white hover:border-gold/40'
              }`}
            >
              <span>{cat.icon || '🎆'}</span>
              <span>{cat.name}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${selectedCategoryFilter === cat.id ? 'bg-night/20 text-night' : 'bg-white/10 text-paper-muted'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Product Grid ── */}
      {sortedProducts.length === 0 ? (
        <div className="bg-night-2 rounded-3xl border border-gold/20 p-16 text-center space-y-4">
          <div className="text-5xl">🔍</div>
          <h3 className="font-display font-bold text-xl text-white">No fireworks matched your search</h3>
          <p className="text-xs text-paper-dim max-w-sm mx-auto">
            Try adjusting your search terms or selecting a different firework category filter.
          </p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategoryFilter('all'); }}
            className="bg-gold text-night font-black px-6 py-2.5 rounded-xl text-xs hover:bg-gold-soft transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sortedProducts.map(prod => {
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
      )}
    </div>
  );
}
