import React, { useState, useEffect } from 'react';
import { 
  Package, FolderTree, Database, Plus, Search, Edit3, Trash2, 
  ExternalLink, Check, AlertTriangle, RefreshCw, UploadCloud, DownloadCloud,
  CheckCircle, Key, Link2, Sparkles, TrendingUp, ShieldCheck, Flame, Star,
  Eye, X, Image as ImageIcon, CheckCircle2, ArrowUpDown, Filter, ChevronRight
} from 'lucide-react';
import { 
  getSupabaseCredentials, saveSupabaseCredentials, testSupabaseConnection,
  upsertProduct, deleteProduct, upsertCategory, deleteCategory,
  fetchProducts, fetchCategories, uploadProductImage, deleteProductImage
} from '../services/supabase';

export default function AdminPage({ categories, products, setCategories, setProducts, showToast, onBackToStore }) {
  const [activeTab, setActiveTab] = useState('products'); // 'products', 'categories', 'supabase'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCatFilter, setSelectedCatFilter] = useState('all');

  // Supabase connection state
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('checking'); // 'connected', 'local', 'error'
  const [isSyncing, setIsSyncing] = useState(false);
  const [showKey, setShowKey] = useState(false);

  // Product Modal
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [prodForm, setProdForm] = useState({
    name: '',
    categoryId: '',
    meta: '1 Box',
    mrp: '',
    price: '',
    shortDesc: '',
    description: '',
    image: '',
    isFeatured: false
  });
  const [productImageFile, setProductImageFile] = useState(null);

  // Category Modal
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [catForm, setCatForm] = useState({
    name: '',
    slug: '',
    image: '',
    icon: '🎆'
  });

  // Load Supabase credentials on mount
  useEffect(() => {
    const creds = getSupabaseCredentials();
    setSupabaseUrl(creds.url || '');
    setSupabaseKey(creds.anonKey || '');
    checkConnection();
  }, []);

  const checkConnection = async () => {
    const res = await testSupabaseConnection();
    if (res.success) {
      setConnectionStatus('connected');
    } else {
      setConnectionStatus('local');
    }
  };

  const handleSaveCredentials = async () => {
    if (!supabaseUrl || !supabaseKey) {
      alert('Please fill in both Project URL and Anon/Publishable Key');
      return;
    }
    try {
      saveSupabaseCredentials(supabaseUrl, supabaseKey);
    } catch (error) {
      setConnectionStatus('error');
      showToast(`Invalid Supabase settings: ${error.message}`, '❌');
      return;
    }
    showToast('Credentials saved! Verifying connection...', '⏳');
    const res = await testSupabaseConnection();
    if (res.success) {
      setConnectionStatus('connected');
      showToast('Connected to Supabase DB successfully!', '✅');
      handlePullFromCloud();
    } else {
      setConnectionStatus('error');
      showToast(`Connection failed: ${res.message}`, '❌');
    }
  };

  // ── Push Local Catalog to Supabase ──
  const handlePushToCloud = async () => {
    if (!confirm('This will upload all current local products & categories to your Supabase database. Continue?')) return;
    setIsSyncing(true);
    showToast('Uploading catalog to Supabase Cloud...', '⏳');
    try {
      for (const cat of categories) {
        const result = await upsertCategory(cat);
        if (!result?.success) throw result?.error || new Error('Category write failed');
      }
      for (const prod of products) {
        const result = await upsertProduct(prod);
        if (!result?.success) throw result?.error || new Error('Product write failed');
      }
      showToast(`Uploaded ${categories.length} categories & ${products.length} products to Supabase!`, '🎉');
    } catch (e) {
      showToast(`Sync error: ${e.message}`, '❌');
    } finally {
      setIsSyncing(false);
    }
  };

  // ── Pull Fresh from Supabase ──
  const handlePullFromCloud = async () => {
    setIsSyncing(true);
    showToast('Fetching latest records from Supabase...', '⏳');
    try {
      const freshCats = await fetchCategories();
      const freshProds = await fetchProducts();
      if (!freshCats || !freshProds) throw new Error('Supabase returned no catalog data. Check the API key and RLS policies.');
      setCategories(freshCats);
      setProducts(freshProds);
      showToast('Local state updated from Supabase DB!', '✅');
    } catch (e) {
      showToast(`Fetch error: ${e.message}`, '❌');
    } finally {
      setIsSyncing(false);
    }
  };

  // ── Open Product Modal ──
  const openAddProduct = () => {
    setEditingProduct(null);
    setProdForm({
      name: '',
      categoryId: categories[0]?.id || 'cat-1',
      meta: '1 Box',
      mrp: '',
      price: '',
      shortDesc: '',
      description: '',
      image: '',
      isFeatured: false
    });
    setProductImageFile(null);
    setIsProductModalOpen(true);
  };

  const openEditProduct = (prod) => {
    setEditingProduct(prod);
    setProdForm({
      name: prod.name,
      categoryId: prod.categoryId,
      meta: prod.meta || '1 Box',
      mrp: prod.mrp,
      price: prod.price,
      shortDesc: prod.shortDesc || '',
      description: prod.description || '',
      image: prod.image || '',
      isFeatured: prod.isFeatured || false
    });
    setProductImageFile(null);
    setIsProductModalOpen(true);
  };

  const handleProductImage = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('Please select an image file.', '❌');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      showToast('Image must be smaller than 10 MB.', '❌');
      return;
    }
    setProductImageFile(file);
    setProdForm(previous => ({ ...previous, image: URL.createObjectURL(file) }));
  };

  const removeProductImage = async () => {
    try {
      await deleteProductImage(prodForm.image);
      setProdForm(previous => ({ ...previous, image: '' }));
      setProductImageFile(null);
      showToast('Product image removed.', '✅');
    } catch (error) {
      showToast(`Image removal failed: ${error.message}`, '❌');
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    const id = editingProduct ? editingProduct.id : `prod-${Date.now().toString(36)}`;
    let imageUrl = prodForm.image;
    if (productImageFile) {
      try {
        showToast('Uploading product image...', '⏳');
        imageUrl = await uploadProductImage(productImageFile, id);
      } catch (error) {
        showToast(`Image upload failed: ${error.message}`, '❌');
        return;
      }
    }
    const updatedProd = {
      ...prodForm,
      id,
      image: imageUrl,
      mrp: parseFloat(prodForm.mrp) || 0,
      price: parseFloat(prodForm.price) || 0
    };

    setIsProductModalOpen(false);

    let nextProducts;
    if (editingProduct) {
      nextProducts = products.map(p => p.id === id ? updatedProd : p);
      showToast('Updating product...', '⏳');
    } else {
      nextProducts = [updatedProd, ...products];
      showToast('Adding new product...', '⏳');
    }

    setProducts(nextProducts);
    localStorage.setItem('sp_products', JSON.stringify(nextProducts));

    const res = await upsertProduct(updatedProd);
    if (res && !res.success) {
      alert(`Supabase Database Warning: ${res.error?.message || 'Could not write to Supabase'}. Please verify RLS policies and API keys.`);
      showToast('Saved locally (Supabase warning)', '⚠️');
    } else {
      showToast('Product saved successfully!', '✅');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    const nextProducts = products.filter(p => p.id !== id);
    setProducts(nextProducts);
    localStorage.setItem('sp_products', JSON.stringify(nextProducts));

    await deleteProduct(id);
    showToast('Product deleted.', '🗑️');
  };

  // ── Open Category Modal ──
  const openAddCategory = () => {
    setEditingCategory(null);
    setCatForm({ name: '', slug: '', image: '', icon: '✨' });
    setIsCategoryModalOpen(true);
  };

  const openEditCategory = (cat) => {
    setEditingCategory(cat);
    setCatForm({
      name: cat.name,
      slug: cat.slug,
      image: cat.image || '',
      icon: cat.icon || '✨'
    });
    setIsCategoryModalOpen(true);
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    const id = editingCategory ? editingCategory.id : `cat-${Date.now().toString(36)}`;
    const slug = catForm.slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-') || catForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const updatedCat = { ...catForm, id, slug };

    setIsCategoryModalOpen(false);

    let nextCategories;
    if (editingCategory) {
      nextCategories = categories.map(c => c.id === id ? updatedCat : c);
    } else {
      nextCategories = [...categories, updatedCat];
    }

    setCategories(nextCategories);
    localStorage.setItem('sp_categories', JSON.stringify(nextCategories));

    const res = await upsertCategory(updatedCat);
    if (res && !res.success) {
      alert(`Supabase Database Warning: ${res.error?.message || 'Could not write to Supabase'}. Please check RLS policies and API keys.`);
      showToast('Saved locally (Supabase warning)', '⚠️');
    } else {
      showToast('Category saved to database!', '✅');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!confirm('Warning: Deleting a category will also delete its products. Proceed?')) return;
    const nextCategories = categories.filter(c => c.id !== id);
    const nextProducts = products.filter(p => p.categoryId !== id);

    setCategories(nextCategories);
    setProducts(nextProducts);
    localStorage.setItem('sp_categories', JSON.stringify(nextCategories));
    localStorage.setItem('sp_products', JSON.stringify(nextProducts));

    await deleteCategory(id);
    showToast('Category and associated products removed.', '🗑️');
  };

  // Filtered product listing
  const filteredProducts = products.filter(p => {
    const matchesCat = selectedCatFilter === 'all' || p.categoryId === selectedCatFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || p.name.toLowerCase().includes(q) || (p.meta && p.meta.toLowerCase().includes(q));
    return matchesCat && matchesSearch;
  });

  const featuredCount = products.filter(p => p.isFeatured).length;
  const avgPrice = products.length > 0 ? Math.round(products.reduce((s, p) => s + (p.price || 0), 0) / products.length) : 0;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      
      {/* ── Admin Top Bar & Header ── */}
      <div className="bg-gradient-to-r from-night-2 via-night-3 to-night-2 border border-gold/30 rounded-3xl p-6 lg:p-8 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gold/15 border border-gold/40 flex items-center justify-center text-gold font-bold text-lg shadow-glow-gold">
              ⚡
            </div>
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-black text-white tracking-tight">
                SP Traders Admin Portal
              </h1>
              <p className="text-xs text-paper-dim">Inventory Control, Wholesale Price Manager & Supabase Cloud Sync</p>
            </div>
          </div>
        </div>

        {/* Cloud Status Pill & Quick Action */}
        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <div className={`px-3.5 py-2 rounded-2xl border text-xs font-bold flex items-center gap-2 shadow-sm ${
            connectionStatus === 'connected' 
              ? 'bg-emerald/15 border-emerald/40 text-emerald' 
              : connectionStatus === 'checking'
              ? 'bg-gold/15 border-gold/40 text-gold'
              : 'bg-crimson/15 border-crimson/40 text-crimson-light'
          }`}>
            <span className={`w-2.5 h-2.5 rounded-full ${
              connectionStatus === 'connected' ? 'bg-emerald animate-ping' : 'bg-gold'
            }`}></span>
            <span>{connectionStatus === 'connected' ? 'Supabase Live' : connectionStatus === 'checking' ? 'Checking DB' : 'Local Storage Mode'}</span>
          </div>

          <button
            onClick={handlePullFromCloud}
            disabled={isSyncing}
            className="bg-night-4 hover:bg-night-3 border border-gold/30 hover:border-gold text-paper text-xs font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
            title="Sync Latest From Supabase"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-gold ${isSyncing ? 'animate-spin' : ''}`} />
            <span>Pull Sync</span>
          </button>

          <button
            onClick={handlePushToCloud}
            disabled={isSyncing}
            className="bg-gradient-to-r from-gold to-gold-soft hover:brightness-110 text-night text-xs font-black px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-glow-gold active:scale-95"
            title="Upload Local State to Supabase"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Push to Cloud</span>
          </button>

          {onBackToStore && (
            <button
              onClick={onBackToStore}
              className="bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 active:scale-95 ml-auto md:ml-0"
              title="Return to Customer Storefront"
            >
              <ExternalLink className="w-3.5 h-3.5 text-gold-light" />
              <span>Exit Admin</span>
            </button>
          )}
        </div>
      </div>

      {/* ── KPI Summary Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-night-2/90 border border-gold/20 shadow-lg flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-paper-dim uppercase tracking-wider">Total Fireworks</div>
            <div className="font-display text-3xl font-black text-white mt-1">{products.length}</div>
            <div className="text-[11px] text-gold mt-1 font-semibold">Active in Catalog</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gold/15 border border-gold/30 flex items-center justify-center text-gold text-xl shadow-glow-gold">
            <Package className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-night-2/90 border border-gold/20 shadow-lg flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-paper-dim uppercase tracking-wider">Categories</div>
            <div className="font-display text-3xl font-black text-white mt-1">{categories.length}</div>
            <div className="text-[11px] text-emerald mt-1 font-semibold">Firework Classes</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald/15 border border-emerald/30 flex items-center justify-center text-emerald text-xl">
            <FolderTree className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-night-2/90 border border-gold/20 shadow-lg flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-paper-dim uppercase tracking-wider">Featured Items</div>
            <div className="font-display text-3xl font-black text-white mt-1">{featuredCount}</div>
            <div className="text-[11px] text-gold mt-1 font-semibold">Home Highlights</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gold/15 border border-gold/30 flex items-center justify-center text-gold text-xl">
            <Star className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-night-2/90 border border-gold/20 shadow-lg flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-paper-dim uppercase tracking-wider">Average Rate</div>
            <div className="font-display text-3xl font-black text-gold mt-1">₹{avgPrice}</div>
            <div className="text-[11px] text-paper-dim mt-1 font-semibold">Wholesale Price</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-crimson/15 border border-crimson/30 flex items-center justify-center text-crimson text-xl">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* ── Navigation Tabs ── */}
      <div className="flex border-b border-gold/20 gap-2">
        <button
          onClick={() => setActiveTab('products')}
          className={`px-6 py-3.5 text-xs font-black rounded-t-2xl transition-all flex items-center gap-2 border-t border-x ${
            activeTab === 'products'
              ? 'bg-night-2 text-gold border-gold/30 shadow-lg'
              : 'border-transparent text-paper-dim hover:text-white hover:bg-night-3/40'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Products Management ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`px-6 py-3.5 text-xs font-black rounded-t-2xl transition-all flex items-center gap-2 border-t border-x ${
            activeTab === 'categories'
              ? 'bg-night-2 text-gold border-gold/30 shadow-lg'
              : 'border-transparent text-paper-dim hover:text-white hover:bg-night-3/40'
          }`}
        >
          <FolderTree className="w-4 h-4" />
          <span>Categories ({categories.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('supabase')}
          className={`px-6 py-3.5 text-xs font-black rounded-t-2xl transition-all flex items-center gap-2 border-t border-x ${
            activeTab === 'supabase'
              ? 'bg-night-2 text-gold border-gold/30 shadow-lg'
              : 'border-transparent text-paper-dim hover:text-white hover:bg-night-3/40'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Supabase Cloud Settings</span>
        </button>
      </div>

      {/* ════════ TAB 1: PRODUCTS INVENTORY ════════ */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="bg-night-2/95 border border-gold/20 rounded-2xl p-4 sm:p-5 flex flex-col lg:flex-row gap-4 justify-between items-center shadow-xl">
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
              <div className="relative w-full sm:w-80">
                <input
                  type="text"
                  placeholder="Search products by name or pack..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-night-3 border border-gold/25 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-paper-muted focus:outline-none focus:border-gold"
                />
                <Search className="w-4 h-4 text-paper-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-paper-muted hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <select
                value={selectedCatFilter}
                onChange={(e) => setSelectedCatFilter(e.target.value)}
                className="w-full sm:w-auto bg-night-3 border border-gold/25 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-gold font-medium cursor-pointer"
              >
                <option value="all">All Categories ({products.length})</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <button
              onClick={openAddProduct}
              className="w-full lg:w-auto bg-gradient-to-r from-gold via-gold-soft to-gold text-night text-xs font-black px-6 py-3 rounded-xl shadow-glow-gold hover:brightness-110 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add New Product</span>
            </button>
          </div>

          {/* Product Data Table */}
          <div className="bg-night-2 rounded-2xl border border-gold/20 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-night-3 text-paper-dim uppercase font-extrabold border-b border-gold/20 text-[11px]">
                  <tr>
                    <th className="py-4 px-6">Product Details</th>
                    <th className="py-4 px-4">Category</th>
                    <th className="py-4 px-4">Pack Size</th>
                    <th className="py-4 px-4">MRP (₹)</th>
                    <th className="py-4 px-4">Wholesale Price (₹)</th>
                    <th className="py-4 px-4 text-center">Featured</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-paper">
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="py-12 text-center text-paper-muted">
                        <div className="text-3xl mb-2">📦</div>
                        No products found matching your search.
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map(p => {
                      const cat = categories.find(c => c.id === p.categoryId);
                      const discount = Math.max(0, Math.round((1 - p.price / p.mrp) * 100));
                      return (
                        <tr key={p.id} className="hover:bg-night-3/60 transition-colors group">
                          {/* Details & Image */}
                          <td className="py-3.5 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-xl bg-night-4 border border-gold/20 overflow-hidden shrink-0 flex items-center justify-center">
                                {p.image ? (
                                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                                ) : (
                                  <span className="text-xl">🎆</span>
                                )}
                              </div>
                              <div>
                                <div className="font-extrabold text-white group-hover:text-gold transition-colors">{p.name}</div>
                                <div className="text-[11px] text-paper-muted line-clamp-1 max-w-xs mt-0.5">{p.shortDesc || p.description || 'Sivakasi product'}</div>
                              </div>
                            </div>
                          </td>

                          {/* Category */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className="bg-night-4 px-2.5 py-1 rounded-lg border border-gold/15 text-gold font-semibold text-[11px]">
                              {cat ? cat.name : 'Unknown'}
                            </span>
                          </td>

                          {/* Pack */}
                          <td className="py-3.5 px-4 font-mono text-paper-dim whitespace-nowrap">
                            {p.meta || '1 Box'}
                          </td>

                          {/* MRP */}
                          <td className="py-3.5 px-4 font-mono text-paper-muted line-through whitespace-nowrap">
                            ₹{p.mrp}
                          </td>

                          {/* Price & Discount */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <span className="font-black text-gold font-mono text-sm">₹{p.price}</span>
                              {discount > 0 && (
                                <span className="bg-emerald/15 border border-emerald/30 text-emerald text-[10px] font-bold px-1.5 py-0.2 rounded">
                                  {discount}% OFF
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Featured */}
                          <td className="py-3.5 px-4 text-center">
                            {p.isFeatured ? (
                              <span className="text-gold font-bold bg-gold/10 px-2 py-0.5 rounded-full border border-gold/30 text-[10px] inline-flex items-center gap-1">
                                <Star className="w-3 h-3 fill-gold" /> Featured
                              </span>
                            ) : (
                              <span className="text-paper-muted text-[11px]">—</span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-6 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => openEditProduct(p)}
                                className="p-2 rounded-xl bg-night-4 hover:bg-gold hover:text-night text-paper-dim hover:border-gold border border-white/10 transition-all active:scale-95"
                                title="Edit Product"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(p.id)}
                                className="p-2 rounded-xl bg-night-4 hover:bg-crimson text-crimson-light hover:text-white border border-crimson/20 transition-all active:scale-95"
                                title="Delete Product"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ════════ TAB 2: CATEGORIES ════════ */}
      {activeTab === 'categories' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-display text-lg font-bold text-white">Product Categories</h3>
              <p className="text-xs text-paper-dim">Manage your firework classifications & catalog navigation pills</p>
            </div>
            <button
              onClick={openAddCategory}
              className="bg-gradient-to-r from-gold to-gold-soft text-night text-xs font-black px-5 py-2.5 rounded-xl shadow-glow-gold hover:brightness-110 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Category</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map(cat => {
              const count = products.filter(p => p.categoryId === cat.id).length;
              return (
                <div key={cat.id} className="glass-card rounded-2xl p-5 flex items-center justify-between gap-4 border border-gold/20 shadow-lg">
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-14 rounded-2xl bg-night-3 border border-gold/30 flex items-center justify-center text-3xl shadow-glow-gold">
                      {cat.icon || '🎆'}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">{cat.name}</h4>
                      <div className="text-[11px] text-gold font-mono mt-0.5">slug: {cat.slug || cat.id}</div>
                      <div className="text-[10px] text-paper-muted mt-1">{count} products assigned</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditCategory(cat)}
                      className="p-2 rounded-xl bg-night-4 hover:bg-gold hover:text-night text-paper-dim border border-white/10 transition-colors"
                      title="Edit Category"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(cat.id)}
                      className="p-2 rounded-xl bg-night-4 hover:bg-crimson text-crimson-light hover:text-white border border-crimson/20 transition-colors"
                      title="Delete Category"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ════════ TAB 3: SUPABASE SETTINGS ════════ */}
      {activeTab === 'supabase' && (
        <div className="max-w-3xl space-y-6">
          <div className="bg-night-2 border border-gold/25 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-black text-gold uppercase tracking-widest bg-gold/10 px-3 py-1 rounded-full border border-gold/20 mb-2">
                <Database className="w-3.5 h-3.5" /> Cloud Storage & Database
              </div>
              <h3 className="font-display text-2xl font-black text-white">Supabase Connection Settings</h3>
              <p className="text-xs text-paper-dim mt-1">Configure your remote PostgreSQL database credentials for seamless multi-device catalog syncing.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1.5 flex items-center gap-2">
                  <Link2 className="w-3.5 h-3.5 text-gold" /> Supabase Project URL
                </label>
                <input
                  type="text"
                  placeholder="https://xyzcompany.supabase.co"
                  value={supabaseUrl}
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                  className="w-full bg-night-3 border border-gold/20 rounded-xl px-4 py-3 text-xs text-white placeholder-paper-muted focus:outline-none focus:border-gold font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1.5 flex items-center gap-2">
                  <Key className="w-3.5 h-3.5 text-gold" /> Supabase Anon / Publishable Key
                </label>
                <div className="relative">
                  <input
                    type={showKey ? 'text' : 'password'}
                    placeholder="eyJhbGciOiJIUzI1NiIsIn..."
                    value={supabaseKey}
                    onChange={(e) => setSupabaseKey(e.target.value)}
                    className="w-full bg-night-3 border border-gold/20 rounded-xl px-4 py-3 pr-16 text-xs text-white placeholder-paper-muted focus:outline-none focus:border-gold font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gold font-bold hover:underline"
                  >
                    {showKey ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-4 items-center">
                <button
                  onClick={handleSaveCredentials}
                  className="bg-gradient-to-r from-gold to-gold-soft text-night font-black px-6 py-3 rounded-xl text-xs shadow-glow-gold hover:brightness-110 transition-all flex items-center gap-2 active:scale-95"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Save & Test Connection</span>
                </button>

                <button
                  onClick={checkConnection}
                  className="bg-night-4 hover:bg-night-3 border border-gold/20 text-paper font-bold px-5 py-3 rounded-xl text-xs transition-colors flex items-center gap-2"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-gold" />
                  <span>Check Status</span>
                </button>
              </div>
            </div>

            {/* Cloud Sync Manual Triggers */}
            <div className="pt-6 border-t border-white/10 space-y-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Direct Catalog Sync Actions</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-night-3/70 border border-gold/15 space-y-3">
                  <div className="font-bold text-xs text-white flex items-center gap-2">
                    <UploadCloud className="w-4 h-4 text-gold" /> Upload Local → Supabase
                  </div>
                  <p className="text-[11px] text-paper-dim">Overwrites Supabase DB tables with your current local {products.length} products & {categories.length} categories.</p>
                  <button
                    onClick={handlePushToCloud}
                    disabled={isSyncing}
                    className="w-full bg-gold/15 hover:bg-gold text-gold hover:text-night border border-gold/30 font-extrabold py-2 rounded-xl text-xs transition-all"
                  >
                    Push All to Cloud
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-night-3/70 border border-gold/15 space-y-3">
                  <div className="font-bold text-xs text-white flex items-center gap-2">
                    <DownloadCloud className="w-4 h-4 text-emerald" /> Pull Supabase → Local
                  </div>
                  <p className="text-[11px] text-paper-dim">Fetches the latest catalog from Supabase DB and updates this browser's state.</p>
                  <button
                    onClick={handlePullFromCloud}
                    disabled={isSyncing}
                    className="w-full bg-emerald/15 hover:bg-emerald text-emerald hover:text-night border border-emerald/30 font-extrabold py-2 rounded-xl text-xs transition-all"
                  >
                    Pull Fresh Records
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ════════ PRODUCT ADD/EDIT MODAL ════════ */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6">
          <div className="bg-night-2 border border-gold/30 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative animate-scaleUp max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gold/20 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gold/15 border border-gold/40 flex items-center justify-center text-gold font-bold">
                  {editingProduct ? '✏️' : '✨'}
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-white">
                    {editingProduct ? 'Edit Fireworks Item' : 'Add New Fireworks Item'}
                  </h3>
                  <p className="text-xs text-paper-dim">Fill in product specifications and wholesale pricing details.</p>
                </div>
              </div>

              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-2 rounded-xl text-paper-dim hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleProductSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Product Name */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 10cm Electric Sparklers Deluxe"
                    value={prodForm.name}
                    onChange={(e) => setProdForm({ ...prodForm, name: e.target.value })}
                    className="w-full bg-night-3 border border-gold/20 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold"
                  />
                </div>

                {/* Category Selection */}
                <div>
                  <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
                    Category *
                  </label>
                  <select
                    required
                    value={prodForm.categoryId}
                    onChange={(e) => setProdForm({ ...prodForm, categoryId: e.target.value })}
                    className="w-full bg-night-3 border border-gold/20 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {/* Packing Specification */}
                <div>
                  <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
                    Pack Specification
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 1 Box (10 Pcs), 1 Bundle"
                    value={prodForm.meta}
                    onChange={(e) => setProdForm({ ...prodForm, meta: e.target.value })}
                    className="w-full bg-night-3 border border-gold/20 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold"
                  />
                </div>

                {/* MRP */}
                <div>
                  <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
                    MRP / Retail Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    placeholder="e.g. 450"
                    value={prodForm.mrp}
                    onChange={(e) => setProdForm({ ...prodForm, mrp: e.target.value })}
                    className="w-full bg-night-3 border border-gold/20 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold font-mono"
                  />
                </div>

                {/* Wholesale Price */}
                <div>
                  <label className="block text-xs font-bold text-gold uppercase tracking-wider mb-1 flex items-center justify-between">
                    <span>Wholesale Price (₹) *</span>
                    {prodForm.mrp && prodForm.price && (
                      <span className="text-emerald text-[11px] font-bold">
                        {Math.max(0, Math.round((1 - parseFloat(prodForm.price) / parseFloat(prodForm.mrp)) * 100))}% OFF
                      </span>
                    )}
                  </label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    placeholder="e.g. 135"
                    value={prodForm.price}
                    onChange={(e) => setProdForm({ ...prodForm, price: e.target.value })}
                    className="w-full bg-night-3 border border-gold/40 rounded-xl px-4 py-2.5 text-xs text-gold font-bold focus:outline-none focus:border-gold font-mono"
                  />
                </div>

                {/* Product Image Dropzone / Preview */}
                <div className="sm:col-span-2 space-y-2">
                  <label className="block text-xs font-bold text-white uppercase tracking-wider">
                    Product Image (File Upload or URL)
                  </label>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-night-4 border border-gold/20 flex items-center justify-center overflow-hidden shrink-0">
                      {prodForm.image ? (
                        <img src={prodForm.image} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-6 h-6 text-paper-muted" />
                      )}
                    </div>

                    <div className="flex-1 space-y-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProductImage}
                        className="text-xs text-paper-dim file:mr-3 file:py-1.5 file:px-3.5 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-gold file:text-night hover:file:bg-gold-soft cursor-pointer"
                      />
                      {prodForm.image && (
                        <button
                          type="button"
                          onClick={removeProductImage}
                          className="text-[11px] text-crimson-light hover:underline block"
                        >
                          Remove Image
                        </button>
                      )}
                    </div>
                  </div>

                  <input
                    type="text"
                    placeholder="Or paste direct image URL (https://...)"
                    value={prodForm.image}
                    onChange={(e) => setProdForm({ ...prodForm, image: e.target.value })}
                    className="w-full bg-night-3 border border-gold/20 rounded-xl px-4 py-2 text-xs text-paper-dim placeholder-paper-muted focus:outline-none focus:border-gold font-mono"
                  />
                </div>

                {/* Featured Toggle */}
                <div className="sm:col-span-2 flex items-center gap-3 p-3 bg-night-3/60 rounded-xl border border-white/5">
                  <input
                    type="checkbox"
                    id="isFeaturedToggle"
                    checked={prodForm.isFeatured}
                    onChange={(e) => setProdForm({ ...prodForm, isFeatured: e.target.checked })}
                    className="w-4 h-4 accent-gold rounded cursor-pointer"
                  />
                  <label htmlFor="isFeaturedToggle" className="text-xs font-bold text-white cursor-pointer select-none">
                    Feature on Homepage Highlights Grid ⭐
                  </label>
                </div>

                {/* Short Description */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
                    Short Description
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Dazzling golden sparklers with long burn time."
                    value={prodForm.shortDesc}
                    onChange={(e) => setProdForm({ ...prodForm, shortDesc: e.target.value })}
                    className="w-full bg-night-3 border border-gold/20 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold"
                  />
                </div>

                {/* Detailed Description */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
                    Detailed Product Description
                  </label>
                  <textarea
                    rows="3"
                    placeholder="Full safety guidelines and product details..."
                    value={prodForm.description}
                    onChange={(e) => setProdForm({ ...prodForm, description: e.target.value })}
                    className="w-full bg-night-3 border border-gold/20 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold"
                  ></textarea>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-night-4 text-paper-dim hover:text-white text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-gold to-gold-soft hover:brightness-110 text-night font-black px-6 py-2.5 rounded-xl text-xs shadow-glow-gold transition-all"
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ════════ CATEGORY ADD/EDIT MODAL ════════ */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-night-2 border border-gold/30 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative animate-scaleUp">
            <div className="flex items-center justify-between pb-4 border-b border-gold/20 mb-5">
              <h3 className="font-display text-lg font-bold text-white">
                {editingCategory ? 'Edit Category' : 'Add Category'}
              </h3>
              <button onClick={() => setIsCategoryModalOpen(false)} className="text-paper-dim hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCategorySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ground Chakkars"
                  value={catForm.name}
                  onChange={(e) => setCatForm({ ...catForm, name: e.target.value })}
                  className="w-full bg-night-3 border border-gold/20 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
                  Icon / Emoji
                </label>
                <input
                  type="text"
                  placeholder="e.g. 🌀 or 🎆 or 🌸"
                  value={catForm.icon}
                  onChange={(e) => setCatForm({ ...catForm, icon: e.target.value })}
                  className="w-full bg-night-3 border border-gold/20 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white uppercase tracking-wider mb-1">
                  URL Slug
                </label>
                <input
                  type="text"
                  placeholder="e.g. ground-chakkars"
                  value={catForm.slug}
                  onChange={(e) => setCatForm({ ...catForm, slug: e.target.value })}
                  className="w-full bg-night-3 border border-gold/20 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold font-mono"
                />
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-night-4 text-paper-dim text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-gold to-gold-soft text-night font-black px-6 py-2.5 rounded-xl text-xs shadow-glow-gold"
                >
                  {editingCategory ? 'Save Category' : 'Add Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
