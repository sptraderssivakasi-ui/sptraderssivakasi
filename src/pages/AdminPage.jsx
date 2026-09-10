import React, { useState, useEffect } from 'react';
import { 
  Package, FolderTree, Database, Plus, Search, Edit3, Trash2, 
  ExternalLink, Check, AlertTriangle, RefreshCw, UploadCloud, DownloadCloud,
  CheckCircle, Key, Link2, Sparkles, TrendingUp
} from 'lucide-react';
import { 
  getSupabaseCredentials, saveSupabaseCredentials, testSupabaseConnection,
  upsertProduct, deleteProduct, upsertCategory, deleteCategory,
  fetchProducts, fetchCategories
} from '../services/supabase';

export default function AdminPage({ categories, products, setCategories, setProducts, showToast }) {
  const [activeTab, setActiveTab] = useState('products'); // 'products', 'categories', 'supabase'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCatFilter, setSelectedCatFilter] = useState('all');

  // Supabase connection state
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('checking'); // 'connected', 'local', 'error'
  const [isSyncing, setIsSyncing] = useState(false);

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
    saveSupabaseCredentials(supabaseUrl, supabaseKey);
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
        await upsertCategory(cat);
      }
      for (const prod of products) {
        await upsertProduct(prod);
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
    setIsProductModalOpen(true);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    const id = editingProduct ? editingProduct.id : `prod-${Date.now().toString(36)}`;
    const updatedProd = {
      ...prodForm,
      id,
      mrp: parseFloat(prodForm.mrp),
      price: parseFloat(prodForm.price)
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

    await upsertProduct(updatedProd);
    showToast('Product saved to database & store!', '✅');
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

    await upsertCategory(updatedCat);
    showToast('Category saved!', '✅');
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
    showToast('Category deleted.', '🗑️');
  };

  // Filtered table products
  const filteredProducts = products.filter(p => {
    const matchesCat = selectedCatFilter === 'all' || p.categoryId === selectedCatFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || p.name.toLowerCase().includes(q) || (p.shortDesc && p.shortDesc.toLowerCase().includes(q));
    return matchesCat && matchesSearch;
  });

  const avgPrice = products.length > 0 ? Math.round(products.reduce((s, p) => s + p.price, 0) / products.length) : 0;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
      {/* ── Top Bar & Stats ── */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-gold bg-gold/10 px-3 py-1 rounded-full border border-gold/20">
                Management Portal
              </span>
              {connectionStatus === 'connected' ? (
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Supabase Live
                </span>
              ) : (
                <span className="text-xs font-bold text-yellow-400 bg-yellow-950/80 px-2.5 py-0.5 rounded-full border border-yellow-500/30">
                  🟡 Local Mode
                </span>
              )}
            </div>
            <h1 className="font-display text-3xl font-extrabold text-paper mt-2">
              Catalog & Cloud Admin
            </h1>
            <p className="text-xs text-paper/60 mt-1">
              Live management for Sivakasi products, wholesale pricing, categories, and database sync.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={openAddCategory}
              className="bg-night-3 hover:bg-night-2 border border-gold/30 hover:border-gold text-gold font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Category</span>
            </button>

            <button
              onClick={openAddProduct}
              className="bg-gradient-to-r from-gold to-gold-soft hover:brightness-110 text-night font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all shadow-lg active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-night-2 border border-gold/15 rounded-2xl p-5">
            <div className="text-[11px] font-bold text-paper/40 uppercase">Total Products</div>
            <div className="text-3xl font-black text-paper mt-1">{products.length}</div>
            <div className="text-xs text-gold mt-0.5">Active items</div>
          </div>

          <div className="bg-night-2 border border-gold/15 rounded-2xl p-5">
            <div className="text-[11px] font-bold text-paper/40 uppercase">Categories</div>
            <div className="text-3xl font-black text-paper mt-1">{categories.length}</div>
            <div className="text-xs text-gold mt-0.5">Product groups</div>
          </div>

          <div className="bg-night-2 border border-gold/15 rounded-2xl p-5">
            <div className="text-[11px] font-bold text-paper/40 uppercase">Average Wholesale Price</div>
            <div className="text-3xl font-black text-gold mt-1">₹{avgPrice}</div>
            <div className="text-xs text-paper/40 mt-0.5">Per item average</div>
          </div>

          <div className="bg-night-2 border border-gold/15 rounded-2xl p-5">
            <div className="text-[11px] font-bold text-paper/40 uppercase">WhatsApp Helpline</div>
            <div className="text-lg font-bold text-emerald-400 font-mono mt-2">+91 94435 94447</div>
            <div className="text-xs text-paper/40 mt-0.5">Enquiry channel</div>
          </div>
        </div>
      </div>

      {/* ── Tabs Navigation ── */}
      <div className="flex border-b border-gold/20 gap-2">
        <button
          onClick={() => setActiveTab('products')}
          className={`px-5 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${activeTab === 'products' ? 'text-gold border-gold' : 'text-paper/60 border-transparent hover:text-paper'}`}
        >
          <Package className="w-4 h-4" />
          <span>Products ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`px-5 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${activeTab === 'categories' ? 'text-gold border-gold' : 'text-paper/60 border-transparent hover:text-paper'}`}
        >
          <FolderTree className="w-4 h-4" />
          <span>Categories ({categories.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('supabase')}
          className={`px-5 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${activeTab === 'supabase' ? 'text-gold border-gold' : 'text-paper/60 border-transparent hover:text-paper'}`}
        >
          <Database className="w-4 h-4" />
          <span>⚡ Supabase DB Settings</span>
        </button>
      </div>

      {/* ── TAB 1: PRODUCTS ── */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          {/* Table Toolbar */}
          <div className="bg-night-2 border border-gold/15 rounded-2xl p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="relative w-full md:w-80">
              <input
                type="text"
                placeholder="Search products by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-night-3 border border-gold/15 rounded-xl pl-9 pr-4 py-2 text-xs text-paper placeholder-paper/30 focus:outline-none focus:border-gold"
              />
              <Search className="w-4 h-4 text-paper/40 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            <div className="w-full md:w-auto">
              <select
                value={selectedCatFilter}
                onChange={(e) => setSelectedCatFilter(e.target.value)}
                className="w-full md:w-auto bg-night-3 border border-gold/15 rounded-xl px-4 py-2 text-xs text-paper focus:outline-none focus:border-gold"
              >
                <option value="all">All Categories ({products.length})</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Products Table */}
          <div className="bg-night-2 border border-gold/15 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-night-3/80 text-paper/50 uppercase tracking-wider font-bold border-b border-white/5">
                  <tr>
                    <th className="py-3.5 px-4">Item & Description</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Pack Spec</th>
                    <th className="py-3.5 px-4">Pricing (MRP / Wholesale)</th>
                    <th className="py-3.5 px-4">Discount</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-12 text-center text-paper/40">
                        No fireworks found matching current search.
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map(p => {
                      const cat = categories.find(c => c.id === p.categoryId);
                      const discount = Math.max(0, Math.round((1 - p.price / p.mrp) * 100));
                      return (
                        <tr key={p.id} className="hover:bg-night-3/40 transition-colors">
                          <td className="py-3 px-4">
                            <div className="font-bold text-paper text-sm">{p.name}</div>
                            <div className="text-[11px] text-paper/40 line-clamp-1">{p.shortDesc}</div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="bg-night-3 text-gold text-[11px] px-2.5 py-1 rounded-md border border-white/5 whitespace-nowrap">
                              {cat ? cat.name : 'Unknown'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-paper/70 font-mono text-[11px]">
                            {p.meta || '1 Box'}
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <span className="font-bold text-gold text-sm">₹{p.price}</span>
                            <span className="text-paper/40 line-through text-xs ml-1.5">₹{p.mrp}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
                              {discount}% OFF
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => openEditProduct(p)}
                                className="p-1.5 text-paper/60 hover:text-gold transition-colors rounded hover:bg-white/5"
                                title="Edit Product"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(p.id)}
                                className="p-1.5 text-paper/60 hover:text-red-400 transition-colors rounded hover:bg-white/5"
                                title="Delete Product"
                              >
                                <Trash2 className="w-4 h-4" />
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

      {/* ── TAB 2: CATEGORIES ── */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map(cat => {
            const count = products.filter(p => p.categoryId === cat.id).length;
            return (
              <div key={cat.id} className="bg-night-2 border border-gold/15 rounded-2xl p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 rounded-xl bg-night-3 border border-gold/20 flex items-center justify-center text-2xl">
                      {cat.icon || '📑'}
                    </div>
                    <span className="text-xs font-bold bg-gold/10 text-gold px-2.5 py-1 rounded-full border border-gold/20">
                      {count} Products
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-paper text-base">{cat.name}</h3>
                  <div className="text-[11px] font-mono text-paper/40 mt-1">Slug: {cat.slug}</div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-end gap-2">
                  <button
                    onClick={() => openEditCategory(cat)}
                    className="text-xs text-paper/70 hover:text-gold px-3 py-1.5 rounded-lg bg-night-3 border border-white/5 flex items-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(cat.id)}
                    className="text-xs text-maroon hover:text-red-400 px-3 py-1.5 rounded-lg bg-maroon/10 border border-maroon/20 flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── TAB 3: SUPABASE DB SETTINGS ── */}
      {activeTab === 'supabase' && (
        <div className="bg-night-2 border border-gold/20 rounded-3xl p-6 lg:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="font-display text-2xl font-bold text-paper">Supabase Cloud Database Settings</h2>
                {connectionStatus === 'connected' ? (
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400">
                    🟢 Connected
                  </span>
                ) : (
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-yellow-950/80 border border-yellow-500/30 text-yellow-400">
                    🟡 Local Mode
                  </span>
                )}
              </div>
              <p className="text-xs text-paper/60 mt-1">
                Configure your Supabase database credentials to synchronize categories, fireworks, and WhatsApp enquiry records.
              </p>
            </div>

            <button
              onClick={checkConnection}
              className="self-start md:self-auto bg-night-3 hover:bg-night-4 border border-gold/30 text-gold text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Test Connection
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gold mb-2">
                Supabase Project URL
              </label>
              <input
                type="text"
                placeholder="https://xyz.supabase.co"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
                className="w-full bg-night-4 border border-gold/20 rounded-xl px-4 py-3 text-paper font-mono text-xs placeholder-paper/30 focus:outline-none focus:border-gold"
              />
              <p className="text-[11px] text-paper/40 mt-1.5">From Supabase Dashboard → Settings → API → Project URL</p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gold mb-2">
                Supabase Publishable / Anon Key
              </label>
              <input
                type="text"
                placeholder="sb_publishable_... or eyJhbGci..."
                value={supabaseKey}
                onChange={(e) => setSupabaseKey(e.target.value)}
                className="w-full bg-night-4 border border-gold/20 rounded-xl px-4 py-3 text-paper font-mono text-xs placeholder-paper/30 focus:outline-none focus:border-gold"
              />
              <p className="text-[11px] text-paper/40 mt-1.5">From Supabase Dashboard → Settings → API → Project API Keys</p>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
            <button
              onClick={handleSaveCredentials}
              className="bg-gold hover:bg-gold-soft text-night font-bold px-6 py-3 rounded-xl text-xs flex items-center gap-2 shadow-lg"
            >
              <Key className="w-4 h-4" />
              <span>Save & Connect Database</span>
            </button>

            <div className="flex gap-3">
              <button
                onClick={handlePushToCloud}
                disabled={isSyncing}
                className="bg-night-3 hover:bg-night-4 border border-emerald-500/30 text-emerald-400 text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Upload Local Catalog to Supabase</span>
              </button>

              <button
                onClick={handlePullFromCloud}
                disabled={isSyncing}
                className="bg-night-3 hover:bg-night-4 border border-sky-500/30 text-sky-400 text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2"
              >
                <DownloadCloud className="w-4 h-4" />
                <span>Pull Latest from Supabase</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: PRODUCT ── */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-night-2 border border-gold/30 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="px-6 py-4 bg-night-3 border-b border-gold/15 flex justify-between items-center">
              <h3 className="font-display text-lg font-bold text-paper">
                {editingProduct ? 'Edit Product' : 'Add New Sivakasi Product'}
              </h3>
              <button onClick={() => setIsProductModalOpen(false)} className="text-paper/60 hover:text-paper">✕</button>
            </div>

            <form onSubmit={handleProductSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-gold uppercase mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 15cm Deluxe Sparklers"
                    value={prodForm.name}
                    onChange={(e) => setProdForm({ ...prodForm, name: e.target.value })}
                    className="w-full bg-night-4 border border-gold/20 rounded-xl px-4 py-2.5 text-paper focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gold uppercase mb-1">Category *</label>
                  <select
                    value={prodForm.categoryId}
                    onChange={(e) => setProdForm({ ...prodForm, categoryId: e.target.value })}
                    className="w-full bg-night-4 border border-gold/20 rounded-xl px-4 py-2.5 text-paper focus:outline-none focus:border-gold"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gold uppercase mb-1">Packing Spec *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Box of 10, Pack of 5"
                    value={prodForm.meta}
                    onChange={(e) => setProdForm({ ...prodForm, meta: e.target.value })}
                    className="w-full bg-night-4 border border-gold/20 rounded-xl px-4 py-2.5 text-paper focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gold uppercase mb-1">Original MRP (₹) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="100"
                    value={prodForm.mrp}
                    onChange={(e) => setProdForm({ ...prodForm, mrp: e.target.value })}
                    className="w-full bg-night-4 border border-gold/20 rounded-xl px-4 py-2.5 text-paper focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gold uppercase mb-1">Discounted Wholesale Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="70"
                    value={prodForm.price}
                    onChange={(e) => setProdForm({ ...prodForm, price: e.target.value })}
                    className="w-full bg-night-4 border border-gold/20 rounded-xl px-4 py-2.5 text-paper focus:outline-none focus:border-gold"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-gold uppercase mb-1">Short Description *</label>
                  <input
                    type="text"
                    required
                    placeholder="One-line summary for product cards"
                    value={prodForm.shortDesc}
                    onChange={(e) => setProdForm({ ...prodForm, shortDesc: e.target.value })}
                    className="w-full bg-night-4 border border-gold/20 rounded-xl px-4 py-2.5 text-paper focus:outline-none focus:border-gold"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-gold uppercase mb-1">Detailed Description</label>
                  <textarea
                    rows="3"
                    placeholder="Full product details, safety specifications, and Sivakasi certification..."
                    value={prodForm.description}
                    onChange={(e) => setProdForm({ ...prodForm, description: e.target.value })}
                    className="w-full bg-night-4 border border-gold/20 rounded-xl px-4 py-2.5 text-paper focus:outline-none focus:border-gold"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-gold uppercase mb-1">Image URL (Optional)</label>
                  <input
                    type="text"
                    placeholder="images/products/sparklers.jpg or https://..."
                    value={prodForm.image}
                    onChange={(e) => setProdForm({ ...prodForm, image: e.target.value })}
                    className="w-full bg-night-4 border border-gold/20 rounded-xl px-4 py-2.5 text-paper focus:outline-none focus:border-gold"
                  />
                </div>

                <div className="sm:col-span-2 flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="featuredCheckbox"
                    checked={prodForm.isFeatured}
                    onChange={(e) => setProdForm({ ...prodForm, isFeatured: e.target.checked })}
                    className="w-4 h-4 rounded text-gold focus:ring-gold bg-night-4 border-gold/30"
                  />
                  <label htmlFor="featuredCheckbox" className="text-paper/80 font-semibold cursor-pointer">
                    Show as Featured Diwali Highlight on Homepage
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-white/10 text-paper/60 hover:text-paper"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gold text-night font-bold px-6 py-2 rounded-xl hover:bg-gold-soft transition-colors"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: CATEGORY ── */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-night-2 border border-gold/30 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="px-6 py-4 bg-night-3 border-b border-gold/15 flex justify-between items-center">
              <h3 className="font-display text-lg font-bold text-paper">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h3>
              <button onClick={() => setIsCategoryModalOpen(false)} className="text-paper/60 hover:text-paper">✕</button>
            </div>

            <form onSubmit={handleCategorySubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gold uppercase mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Multi-Colour Sparklers"
                  value={catForm.name}
                  onChange={(e) => setCatForm({ ...catForm, name: e.target.value })}
                  className="w-full bg-night-4 border border-gold/20 rounded-xl px-4 py-2.5 text-paper focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block font-bold text-gold uppercase mb-1">Slug (URL friendly)</label>
                <input
                  type="text"
                  placeholder="e.g. multi-colour-sparklers"
                  value={catForm.slug}
                  onChange={(e) => setCatForm({ ...catForm, slug: e.target.value })}
                  className="w-full bg-night-4 border border-gold/20 rounded-xl px-4 py-2.5 text-paper focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block font-bold text-gold uppercase mb-1">Icon Emoji</label>
                <input
                  type="text"
                  placeholder="✨ or 🎆 or 🌸"
                  value={catForm.icon}
                  onChange={(e) => setCatForm({ ...catForm, icon: e.target.value })}
                  className="w-full bg-night-4 border border-gold/20 rounded-xl px-4 py-2.5 text-paper focus:outline-none focus:border-gold"
                />
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-white/10 text-paper/60 hover:text-paper"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gold text-night font-bold px-6 py-2 rounded-xl hover:bg-gold-soft transition-colors"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
