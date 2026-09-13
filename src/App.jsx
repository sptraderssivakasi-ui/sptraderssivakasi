import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import Toast from './components/Toast';

import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import AdminPage from './pages/AdminPage';

import { fetchCategories, fetchProducts } from './services/supabase';
import { DEFAULT_CATEGORIES, DEFAULT_PRODUCTS } from './data/seedData';

export default function App() {
  const checkIsAdminRoute = () => {
    const p = window.location.pathname.toLowerCase();
    const h = window.location.hash.toLowerCase();
    const s = window.location.search.toLowerCase();
    return p === '/admin' || p.startsWith('/admin') || h === '#admin' || h.startsWith('#admin') || s.includes('admin');
  };

  const [currentView, setCurrentView] = useState(() => checkIsAdminRoute() ? 'admin' : 'home'); // 'home', 'products', 'detail', 'admin'
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');

  // React to hash / URL changes (e.g. typing #admin in URL bar)
  useEffect(() => {
    const handleLocationChange = () => {
      if (checkIsAdminRoute()) {
        setCurrentView('admin');
      } else if (window.location.hash === '' || window.location.hash === '#') {
        // If hash was cleared and we were in admin
        setCurrentView(prev => prev === 'admin' ? 'home' : prev);
      }
    };

    window.addEventListener('hashchange', handleLocationChange);
    window.addEventListener('popstate', handleLocationChange);
    return () => {
      window.removeEventListener('hashchange', handleLocationChange);
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  // Categories & Products state
  const [categories, setCategories] = useState(() => {
    const local = localStorage.getItem('sp_categories');
    return local ? JSON.parse(local) : DEFAULT_CATEGORIES;
  });

  const [products, setProducts] = useState(() => {
    const local = localStorage.getItem('sp_products');
    return local ? JSON.parse(local) : DEFAULT_PRODUCTS;
  });

  // Cart state
  const [cart, setCart] = useState(() => {
    const local = localStorage.getItem('sp_cart');
    return local ? JSON.parse(local) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Toast notification state
  const [toast, setToast] = useState({ show: false, message: '', icon: '✅' });

  const showToast = (message, icon = '✅') => {
    setToast({ show: true, message, icon });
    setTimeout(() => {
      setToast({ show: false, message: '', icon: '✅' });
    }, 3500);
  };

  // Sync from Supabase on mount
  useEffect(() => {
    async function loadData() {
      try {
        const [remoteCats, remoteProds] = await Promise.all([
          fetchCategories(),
          fetchProducts()
        ]);
        if (remoteCats && remoteCats.length > 0) setCategories(remoteCats);
        if (remoteProds && remoteProds.length > 0) setProducts(remoteProds);
      } catch (err) {
        console.warn('Initial data load notice:', err);
      }
    }
    loadData();
  }, []);

  // Save Cart to local storage
  useEffect(() => {
    localStorage.setItem('sp_cart', JSON.stringify(cart));
  }, [cart]);

  // Cart Handlers
  const handleAddToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      } else {
        return [...prev, { id: product.id, name: product.name, meta: product.meta, price: product.price, qty: 1 }];
      }
    });
    showToast(`Added "${product.name}" to Enquiry List!`, '🛍️');
  };

  const updateCartQty = (id, qty) => {
    if (qty <= 0) {
      setCart(prev => prev.filter(item => item.id !== id));
    } else {
      setCart(prev => prev.map(item => item.id === id ? { ...item, qty } : item));
    }
  };

  const removeCartItem = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => setCart([]);

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setCurrentView('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalCartCount = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <div className="min-h-screen flex flex-col bg-night text-paper selection:bg-gold selection:text-night relative">
      {/* ── Header ── */}
      <Header
        currentView={currentView}
        setCurrentView={(view) => { setCurrentView(view); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        cartCount={totalCartCount}
        openCart={() => setIsCartOpen(true)}
      />

      {/* ── Main View Switcher ── */}
      <main className="flex-grow">
        {currentView === 'home' && (
          <HomePage
            categories={categories}
            products={products}
            onAddToCart={handleAddToCart}
            onSelectProduct={handleSelectProduct}
            setCurrentView={setCurrentView}
            setSelectedCategoryFilter={setSelectedCategoryFilter}
          />
        )}

        {currentView === 'products' && (
          <ProductsPage
            categories={categories}
            products={products}
            onAddToCart={handleAddToCart}
            onSelectProduct={handleSelectProduct}
            selectedCategoryFilter={selectedCategoryFilter}
            setSelectedCategoryFilter={setSelectedCategoryFilter}
          />
        )}

        {currentView === 'detail' && (
          <ProductDetailPage
            product={selectedProduct}
            categories={categories}
            allProducts={products}
            onBack={() => setCurrentView('products')}
            onAddToCart={handleAddToCart}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentView === 'admin' && (
          <AdminPage
            categories={categories}
            products={products}
            setCategories={setCategories}
            setProducts={setProducts}
            showToast={showToast}
            onBackToStore={() => {
              if (window.location.hash.toLowerCase().includes('admin')) {
                window.history.replaceState(null, '', window.location.pathname);
              }
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </main>

      {/* ── Cart Drawer ── */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        updateQty={updateCartQty}
        removeItem={removeCartItem}
        clearCart={clearCart}
        showToast={showToast}
      />

      {/* ── Toast Notifications ── */}
      <Toast toast={toast} />

      {/* ── Footer ── */}
      <Footer setCurrentView={(view) => { setCurrentView(view); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
    </div>
  );
}
