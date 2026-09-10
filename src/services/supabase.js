import { supabase } from '../utils/supabase';
import { DEFAULT_CATEGORIES, DEFAULT_PRODUCTS, WA_PHONE } from '../data/seedData';

export function getSupabaseCredentials() {
  const url = import.meta.env.VITE_SUPABASE_URL || 'https://websuabugmjknzmaqzfi.supabase.co';
  const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_pioEQydt_VajxlN8J2Nqaw_W5ctH95S';
  return { url, anonKey, isConfigured: true };
}

export function saveSupabaseCredentials(url, anonKey) {
  if (url) localStorage.setItem('sp_supabase_url', url.trim());
  if (anonKey) localStorage.setItem('sp_supabase_anon_key', anonKey.trim());
}

export function getSupabaseClient() {
  return supabase;
}

// ── Test Connection ──
export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase.from('categories').select('*').limit(1);
    if (error) throw error;
    return { success: true, message: 'Connected to Supabase DB successfully!' };
  } catch (err) {
    return { success: false, message: err.message || 'Connection failed' };
  }
}

// ── Categories CRUD ──
export async function fetchCategories() {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });
    if (!error && data && data.length > 0) {
      const mapped = data.map(c => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        image: c.image_url || '',
        icon: c.slug === 'sparklers' ? '✨' : c.slug === 'ground' ? '🌀' : c.slug === 'flowerpots' ? '🌸' : c.slug === 'aerial' ? '🎆' : c.slug === 'rockets' ? '🚀' : c.slug === 'sound' ? '💥' : c.slug === 'kids' ? '🎉' : '🎁'
      }));
      localStorage.setItem('sp_categories', JSON.stringify(mapped));
      return mapped;
    }
  } catch (e) {
    console.warn('Supabase fetchCategories notice:', e);
  }

  // Local fallback
  const local = localStorage.getItem('sp_categories');
  return local ? JSON.parse(local) : DEFAULT_CATEGORIES;
}

export async function upsertCategory(cat) {
  try {
    const row = {
      id: cat.id,
      name: cat.name,
      slug: cat.slug || cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      image_url: cat.image || '',
      is_active: true
    };
    await supabase.from('categories').upsert(row);
  } catch (e) {
    console.warn('Upsert category cloud error:', e);
  }
}

export async function deleteCategory(id) {
  try {
    await supabase.from('categories').delete().eq('id', id);
  } catch (e) {
    console.warn('Delete category cloud error:', e);
  }
}

// ── Products CRUD ──
export async function fetchProducts() {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    if (!error && data && data.length > 0) {
      const mapped = data.map(p => ({
        id: p.id,
        categoryId: p.category_id,
        name: p.name,
        slug: p.slug,
        shortDesc: p.short_desc || '',
        description: p.description || '',
        meta: p.meta || '1 Box',
        mrp: parseFloat(p.mrp),
        price: parseFloat(p.price),
        image: p.image_url || '',
        isFeatured: Boolean(p.is_featured)
      }));
      localStorage.setItem('sp_products', JSON.stringify(mapped));
      return mapped;
    }
  } catch (e) {
    console.warn('Supabase fetchProducts notice:', e);
  }

  // Local fallback
  const local = localStorage.getItem('sp_products');
  return local ? JSON.parse(local) : DEFAULT_PRODUCTS;
}

export async function upsertProduct(prod) {
  try {
    const row = {
      id: prod.id,
      category_id: prod.categoryId,
      name: prod.name,
      slug: prod.slug || prod.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      short_desc: prod.shortDesc || '',
      description: prod.description || '',
      meta: prod.meta || '1 Box',
      mrp: prod.mrp,
      price: prod.price,
      image_url: prod.image || '',
      is_featured: prod.isFeatured || false,
      is_active: true
    };
    await supabase.from('products').upsert(row);
  } catch (e) {
    console.warn('Upsert product cloud error:', e);
  }
}

export async function deleteProduct(id) {
  try {
    await supabase.from('products').delete().eq('id', id);
  } catch (e) {
    console.warn('Delete product cloud error:', e);
  }
}

// ── Enquiries / Orders ──
export async function submitEnquiry(enquiry) {
  try {
    await supabase.from('enquiries').insert([{
      customer_name: enquiry.name || 'Website Customer',
      customer_phone: enquiry.phone || '',
      customer_city: enquiry.city || '',
      total_estimated_amount: enquiry.total || 0,
      items: enquiry.items || [],
      enquiry_channel: 'whatsapp',
      status: 'pending'
    }]);
  } catch (e) {
    console.warn('Submit enquiry notice:', e);
  }

  // Send WhatsApp message
  const itemsText = enquiry.items.map(i => `• ${i.name} (${i.meta}) x${i.qty} — ₹${i.price * i.qty}`).join('\n');
  const msg = encodeURIComponent(
    `🎆 *SP Traders Sivakasi — Diwali Enquiry*\n\n` +
    `Hello, I would like to confirm availability and wholesale pricing for:\n\n` +
    `${itemsText}\n\n` +
    `💰 *Estimated Total:* ₹${enquiry.total}\n` +
    `📍 *Delivery City:* ${enquiry.city || 'Not specified'}\n\n` +
    `Please confirm order dispatch details.`
  );

  window.open(`https://wa.me/${WA_PHONE}?text=${msg}`, '_blank');
}
