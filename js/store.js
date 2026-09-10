/**
 * SP Traders — Data Store
 * Manages categories & products via localStorage.
 * Admin panel writes here; public pages read from here.
 */

const SP_STORE = (() => {
  const CATS_KEY = 'sp_categories';
  const PRODS_KEY = 'sp_products';
  const WA_NUMBER = '919443594447';

  /* ── seed data (from original site) ── */
  const seedCategories = [
    { id: 'cat-1', name: 'Sparklers', slug: 'sparklers', image: 'images/categories/sparklers.jpg' },
    { id: 'cat-2', name: 'Ground Chakkars', slug: 'ground', image: 'images/categories/ground.jpg' },
    { id: 'cat-3', name: 'Flower Pots', slug: 'flowerpots', image: 'images/categories/flowerpots.jpg' },
    { id: 'cat-4', name: 'Aerial Shots', slug: 'aerial', image: 'images/categories/aerial.jpg' },
    { id: 'cat-5', name: 'Rockets', slug: 'rockets', image: 'images/categories/rockets.jpg' },
    { id: 'cat-6', name: 'Sound Crackers', slug: 'sound', image: 'images/categories/sound.jpg' },
    { id: 'cat-7', name: 'Kids Special', slug: 'kids', image: 'images/categories/kids.jpg' },
    { id: 'cat-8', name: 'Gift Boxes', slug: 'giftbox', image: 'images/categories/giftbox.jpg' },
  ];

  const seedProducts = [
    { id: 'sp1', categoryId: 'cat-1', name: '7cm Electric Sparklers (Box of 10)', shortDesc: 'Classic electric sparklers safe for all ages.', description: 'Premium quality 7cm electric sparklers from Sivakasi. Each box contains 10 sparklers that burn bright with a clean, steady flame. Ideal for children under adult supervision. Made from high-quality raw materials ensuring safe and vibrant sparks.', meta: 'Box · 10 pieces', mrp: 60, price: 42, image: '' },
    { id: 'sp2', categoryId: 'cat-1', name: '12cm Colour Sparklers (Box of 10)', shortDesc: 'Multi-colour sparklers with vibrant effects.', description: 'Stunning 12cm colour sparklers that produce mesmerizing multi-coloured sparks. Perfect for Diwali celebrations, these sparklers create beautiful patterns in the air. Each box contains 10 pieces of premium Sivakasi-made sparklers.', meta: 'Box · 10 pieces', mrp: 90, price: 63, image: '' },
    { id: 'gc1', categoryId: 'cat-2', name: 'Ground Chakkar – Deluxe', shortDesc: 'Spinning ground display with multi-colour effects.', description: 'The Deluxe Ground Chakkar spins rapidly on the ground producing stunning multi-colour sparks in concentric circles. A classic Diwali favourite, this chakkar is made from premium materials for consistent performance. Place on flat ground, light the fuse, and enjoy the spinning display.', meta: 'Pack of 5', mrp: 150, price: 105, image: '' },
    { id: 'gc2', categoryId: 'cat-2', name: 'Twin Colour Chakkar', shortDesc: 'Dual-colour spinning ground chakkar.', description: 'Experience the magic of two colours spinning simultaneously with our Twin Colour Chakkar. This premium ground spinner alternates between golden and silver sparks creating a mesmerizing visual treat. Each pack contains 4 pieces.', meta: 'Pack of 4', mrp: 180, price: 126, image: '' },
    { id: 'fp1', categoryId: 'cat-3', name: 'Flower Pot – Small', shortDesc: 'Compact fountain with golden sparks.', description: 'A compact yet powerful flower pot that shoots golden sparks upward like a fountain. Perfect for small celebrations and safe to use in open areas. The small flower pot produces a steady stream of beautiful golden sparks lasting about 30 seconds.', meta: 'Pack of 5', mrp: 200, price: 140, image: '' },
    { id: 'fp2', categoryId: 'cat-3', name: 'Flower Pot – Deluxe Fountain', shortDesc: 'Premium fountain with multi-stage effects.', description: 'Our Deluxe Fountain Flower Pot is a showstopper. It features multiple stages of colourful sparks — starting with silver, transitioning to gold, and finishing with a spectacular colour burst. Each pot lasts approximately 45 seconds.', meta: 'Pack of 3', mrp: 350, price: 245, image: '' },
    { id: 'ar1', categoryId: 'cat-4', name: '30-Shot Colour Cake', shortDesc: '30 consecutive aerial colour shots.', description: 'Light up the sky with our 30-Shot Colour Cake! This spectacular aerial firework launches 30 consecutive shots of vibrant colours into the night sky. Each shot bursts into beautiful patterns at height. Perfect for creating a grand celebration atmosphere.', meta: '1 piece', mrp: 900, price: 630, image: '' },
    { id: 'ar2', categoryId: 'cat-4', name: '60-Shot Sky Shot', shortDesc: 'Premium 60-shot aerial display.', description: 'The ultimate celebration centrepiece — our 60-Shot Sky Shot delivers a breathtaking aerial display with 60 consecutive colourful bursts. Features multiple colour combinations including red, green, blue, gold, and silver. Best used in open grounds with clear sky visibility.', meta: '1 piece', mrp: 1800, price: 1260, image: '' },
    { id: 'rk1', categoryId: 'cat-5', name: 'Whistling Rocket', shortDesc: 'Classic whistling rockets with trail.', description: 'Traditional Sivakasi whistling rockets that soar high with a distinctive whistling sound before bursting into colourful sparks. Each rocket is fitted with a stabilizing stick for straight flight. Light the fuse from a secure bottle launcher.', meta: 'Pack of 10', mrp: 250, price: 175, image: '' },
    { id: 'rk2', categoryId: 'cat-5', name: 'Colour Burst Rocket', shortDesc: 'Rockets with colourful sky burst.', description: 'These premium colour burst rockets fly high and explode into a spectacular display of multiple colours. Each rocket delivers a powerful burst visible from a great distance. Ideal for open ground celebrations.', meta: 'Pack of 10', mrp: 320, price: 224, image: '' },
    { id: 'sc1', categoryId: 'cat-6', name: 'Bijili Crackers (2-sound)', shortDesc: 'Classic double-bang crackers.', description: 'The quintessential Diwali cracker — Bijili Crackers produce two sharp, satisfying bangs. Made from premium materials in Sivakasi, these crackers are reliable and consistent. Each bundle contains 10 individual crackers.', meta: 'Bundle of 10', mrp: 80, price: 56, image: '' },
    { id: 'sc2', categoryId: 'cat-6', name: 'Chorsa Crackers', shortDesc: 'Powerful single-bang crackers.', description: 'Chorsa Crackers are known for their powerful single bang. These classic crackers from Sivakasi are a Diwali tradition. Each bundle contains 5 premium-quality crackers made from carefully selected materials.', meta: 'Bundle of 5', mrp: 150, price: 105, image: '' },
    { id: 'ks1', categoryId: 'cat-7', name: 'Kids Novelty Pack', shortDesc: 'Safe, low-noise fun for young ones.', description: 'A carefully curated assortment of low-noise, child-friendly fireworks. Includes mini sparklers, snake tablets, colour smoke, and ground flowers. All items are designed with child safety in mind — low noise and gentle effects.', meta: 'Assorted, low-noise', mrp: 220, price: 154, image: '' },
    { id: 'ks2', categoryId: 'cat-7', name: 'Ground Spinner – Junior', shortDesc: 'Small spinning ground display for kids.', description: 'Miniature ground spinners designed specifically for children. These junior spinners produce gentle, colourful sparks with minimal noise. Perfect for young celebrants to enjoy under adult supervision.', meta: 'Pack of 6', mrp: 120, price: 84, image: '' },
    { id: 'gb1', categoryId: 'cat-8', name: 'Family Gift Box – Silver', shortDesc: '42-item assorted family celebration pack.', description: 'The Silver Family Gift Box is the perfect all-in-one Diwali pack. Contains 42 assorted items including sparklers, flower pots, ground chakkars, and small aerial shots. Beautifully packaged and ready to gift. Ideal for a complete family celebration.', meta: '42 items assorted', mrp: 2000, price: 1400, image: '' },
    { id: 'gb2', categoryId: 'cat-8', name: 'Family Gift Box – Gold', shortDesc: '65-item premium assorted celebration pack.', description: 'Our premium Gold Family Gift Box features 65 carefully selected items covering every category — from kid-safe sparklers to grand aerial shots. Premium packaging makes it perfect for gifting. The ultimate Diwali celebration in a single box.', meta: '65 items assorted', mrp: 3500, price: 2450, image: '' },
  ];

  /* ── helpers ── */
  function uid() {
    return 'id-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 7);
  }

  function read(key, seed) {
    try {
      const raw = localStorage.getItem(key);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* ignore */ }
    return JSON.parse(JSON.stringify(seed)); // deep clone seed
  }

  function write(key, data) {
    try { localStorage.setItem(key, JSON.stringify(data)); } catch (e) { /* ignore */ }
  }

  /* ── Categories ── */
  function getCategories() { return read(CATS_KEY, seedCategories); }
  function saveCategories(list) { write(CATS_KEY, list); }

  function addCategory(cat) {
    const list = getCategories();
    cat.id = uid();
    list.push(cat);
    saveCategories(list);
    return cat;
  }
  function updateCategory(id, data) {
    const list = getCategories();
    const idx = list.findIndex(c => c.id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...data, id };
    saveCategories(list);
    return list[idx];
  }
  function deleteCategory(id) {
    let list = getCategories();
    list = list.filter(c => c.id !== id);
    saveCategories(list);
    // also remove products under this category
    let prods = getProducts();
    prods = prods.filter(p => p.categoryId !== id);
    saveProducts(prods);
  }

  /* ── Products ── */
  function getProducts() { return read(PRODS_KEY, seedProducts); }
  function saveProducts(list) { write(PRODS_KEY, list); }

  function getProduct(id) { return getProducts().find(p => p.id === id) || null; }
  function getProductsByCategory(catId) { return getProducts().filter(p => p.categoryId === catId); }

  function addProduct(prod) {
    const list = getProducts();
    prod.id = uid();
    list.push(prod);
    saveProducts(list);
    return prod;
  }
  function updateProduct(id, data) {
    const list = getProducts();
    const idx = list.findIndex(p => p.id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...data, id };
    saveProducts(list);
    return list[idx];
  }
  function deleteProduct(id) {
    let list = getProducts();
    list = list.filter(p => p.id !== id);
    saveProducts(list);
  }

  /* ── WhatsApp ── */
  function enquireProduct(product) {
    const msg = encodeURIComponent(
      `Hi SP Traders, I would like to enquire about:\n\n• ${product.name} (${product.meta}) — ₹${product.price}\n\nPlease confirm availability and final price.`
    );
    window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, '_blank');
  }

  function enquireMultiple(items) {
    let lines = items.map(i => `• ${i.name} (${i.meta}) x${i.qty}`).join('\n');
    const total = items.reduce((s, i) => s + i.price * i.qty, 0);
    const msg = encodeURIComponent(
      `Hi SP Traders, I would like to enquire about:\n\n${lines}\n\nEstimated total: ₹${total}\n\nPlease confirm availability and final price.`
    );
    window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, '_blank');
  }

  function getCategoryName(catId) {
    const cat = getCategories().find(c => c.id === catId);
    return cat ? cat.name : 'Uncategorized';
  }

  function discountPct(mrp, price) {
    return Math.round((1 - price / mrp) * 100);
  }

  /* ── Enquiry Cart (localStorage) ── */
  const CART_KEY = 'sp_enquiry_cart';
  function getCart() {
    try { const r = localStorage.getItem(CART_KEY); return r ? JSON.parse(r) : []; } catch (e) { return []; }
  }
  function saveCart(cart) { try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (e) {} }
  function addToCart(product) {
    const cart = getCart();
    const existing = cart.find(i => i.id === product.id);
    if (existing) { existing.qty += 1; } else {
      cart.push({ id: product.id, name: product.name, meta: product.meta, price: product.price, qty: 1 });
    }
    saveCart(cart);
    return cart;
  }
  function removeFromCart(id) {
    let cart = getCart();
    cart = cart.filter(i => i.id !== id);
    saveCart(cart);
    return cart;
  }
  function updateCartQty(id, qty) {
    const cart = getCart();
    const item = cart.find(i => i.id === id);
    if (item) { item.qty = Math.max(1, qty); }
    saveCart(cart);
    return cart;
  }
  function clearCart() { saveCart([]); return []; }

  function resetToDefaults() {
    localStorage.removeItem(CATS_KEY);
    localStorage.removeItem(PRODS_KEY);
    localStorage.removeItem(CART_KEY);
  }

  return {
    getCategories, saveCategories, addCategory, updateCategory, deleteCategory,
    getProducts, saveProducts, getProduct, getProductsByCategory,
    addProduct, updateProduct, deleteProduct,
    enquireProduct, enquireMultiple, getCategoryName, discountPct,
    getCart, saveCart, addToCart, removeFromCart, updateCartQty, clearCart,
    resetToDefaults, WA_NUMBER
  };
})();
