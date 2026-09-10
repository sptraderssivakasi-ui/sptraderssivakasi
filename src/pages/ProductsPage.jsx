import React, { useState } from 'react';
import ProductCard from '../components/ProductCard';
import { Search, SlidersHorizontal, Sparkles, X, Grid, List } from 'lucide-react';

export default function ProductsPage({ categories, products, onAddToCart, onSelectProduct, selectedCategoryFilter, setSelectedCategoryFilter }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('default'); // 'default', 'price-low', 'price-high', 'discount'
  const [isCompactView, setIsCompactView] = useState(false);

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
        <div className="text-xs font-bold text-gold uppercase tracking-widest">Complete 2026 Collection</div>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-paper mt-1">
          Wholesale Fireworks Catalog
        </h1>
        <p className="text-xs sm:text-sm text-paper/60 mt-1 max-w-2xl">
          Browse all authentic Sivakasi sparklers, ground displays, flower pots, aerial multi-shots, and festival gift packs.
        </p>
      </div>

      {/* ── Search & Filter Toolbar ── */}
      <div className="bg-night-2 border border-gold/15 rounded-2xl p-4 flex flex-col lg:flex-row gap-4 justify-between items-center">
        {/* Search Bar */}
        <div className="relative w-full lg:w-96">
          <input
            type="text"
            placeholder="Search crackers by name, category, or box size..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-night-3 border border-gold/15 rounded-xl pl-10 pr-10 py-2.5 text-xs text-paper placeholder-paper/30 focus:outline-none focus:border-gold"
          />
          <Search className="w-4 h-4 text-paper/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-paper/40 hover:text-paper"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort & View toggles */}
        <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-paper/50 font-medium hidden sm:inline">Sort:</span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="bg-night-3 border border-gold/15 rounded-xl px-3 py-2 text-xs text-paper focus:outline-none focus:border-gold"
            >
              <option value="default">Default Order</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="discount">Biggest Discount (%)</option>
            </select>
          </div>

          <div className="text-xs text-paper/50 font-mono">
            Showing <span className="font-bold text-gold">{sortedProducts.length}</span> items
          </div>
        </div>
      </div>

      {/* ── Category Filter Pills ── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedCategoryFilter('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${selectedCategoryFilter === 'all' ? 'bg-gold text-night shadow-md' : 'bg-night-2 border border-white/5 text-paper/70 hover:text-paper hover:border-gold/30'}`}
        >
          All Categories ({products.length})
        </button>

        {categories.map(cat => {
          const count = products.filter(p => p.categoryId === cat.id).length;
          const isSelected = selectedCategoryFilter === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategoryFilter(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${isSelected ? 'bg-gold text-night shadow-md' : 'bg-night-2 border border-white/5 text-paper/70 hover:text-paper hover:border-gold/30'}`}
            >
              <span>{cat.icon || '🎆'}</span>
              <span>{cat.name}</span>
              <span className={`text-[10px] ml-1 px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-night/20 text-night' : 'bg-night-3 text-paper/40'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Product Grid ── */}
      {sortedProducts.length === 0 ? (
        <div className="text-center py-20 bg-night-2/50 rounded-3xl border border-white/5 space-y-4">
          <div className="text-5xl">🔍</div>
          <h3 className="font-display text-lg font-bold text-paper">No fireworks match your search</h3>
          <p className="text-xs text-paper/50 max-w-sm mx-auto">
            Try adjusting your search terms or switch to another product category.
          </p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategoryFilter('all'); }}
            className="bg-gold text-night text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-gold-soft transition-all"
          >
            Clear Filters
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
