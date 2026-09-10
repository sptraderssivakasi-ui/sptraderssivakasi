/**
 * SP Traders — Supabase Database Configuration & Client
 * 
 * You can set your Supabase credentials here OR configure them in the Admin Dashboard.
 */

const SUPABASE_DEFAULT_URL = 'https://websuabugmjknzmaqzfi.supabase.co';
const SUPABASE_DEFAULT_ANON_KEY = 'sb_publishable_pioEQydt_VajxlN8J2Nqaw_W5ctH95S';

const SP_SUPABASE = (() => {
  // Read from localStorage (if configured in Admin) or fallback to defaults
  function getCredentials() {
    const url = localStorage.getItem('sp_supabase_url') || SUPABASE_DEFAULT_URL;
    const anonKey = localStorage.getItem('sp_supabase_anon_key') || SUPABASE_DEFAULT_ANON_KEY;
    const isConfigured = Boolean(url && url.includes('supabase.co') && anonKey && !anonKey.includes('YOUR_SUPABASE'));
    return { url, anonKey, isConfigured };
  }

  function setCredentials(url, anonKey) {
    if (url) localStorage.setItem('sp_supabase_url', url.trim());
    if (anonKey) localStorage.setItem('sp_supabase_anon_key', anonKey.trim());
  }

  // Create Client
  function getClient() {
    const creds = getCredentials();
    if (!creds.isConfigured) return null;
    if (typeof window.supabase === 'undefined' || !window.supabase.createClient) {
      console.warn('Supabase JS library not loaded.');
      return null;
    }
    try {
      return window.supabase.createClient(creds.url, creds.anonKey);
    } catch (e) {
      console.error('Failed to initialize Supabase client:', e);
      return null;
    }
  }

  // API Methods
  return {
    getCredentials,
    setCredentials,
    getClient,

    // Test Connection
    async testConnection() {
      const client = getClient();
      if (!client) return { success: false, message: 'Supabase credentials not set or invalid.' };
      try {
        const { data, error } = await client.from('categories').select('count', { count: 'exact', head: true });
        if (error) throw error;
        return { success: true, message: 'Connected to Supabase successfully!' };
      } catch (err) {
        return { success: false, message: err.message || 'Connection failed' };
      }
    },

    // Categories
    async fetchCategories() {
      const client = getClient();
      if (!client) return null;
      try {
        const { data, error } = await client
          .from('categories')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true });
        if (error) throw error;
        return data.map(c => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          image: c.image_url || ''
        }));
      } catch (err) {
        console.warn('Supabase fetchCategories error, using local fallback:', err);
        return null;
      }
    },

    async upsertCategory(cat) {
      const client = getClient();
      if (!client) return null;
      const row = {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        image_url: cat.image || '',
        is_active: true
      };
      const { data, error } = await client.from('categories').upsert(row).select();
      if (error) throw error;
      return data;
    },

    async deleteCategory(id) {
      const client = getClient();
      if (!client) return null;
      const { error } = await client.from('categories').delete().eq('id', id);
      if (error) throw error;
      return true;
    },

    // Products
    async fetchProducts() {
      const client = getClient();
      if (!client) return null;
      try {
        const { data, error } = await client
          .from('products')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });
        if (error) throw error;
        return data.map(p => ({
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
          isFeatured: p.is_featured || false
        }));
      } catch (err) {
        console.warn('Supabase fetchProducts error, using local fallback:', err);
        return null;
      }
    },

    async upsertProduct(prod) {
      const client = getClient();
      if (!client) return null;
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
      const { data, error } = await client.from('products').upsert(row).select();
      if (error) throw error;
      return data;
    },

    async deleteProduct(id) {
      const client = getClient();
      if (!client) return null;
      const { error } = await client.from('products').delete().eq('id', id);
      if (error) throw error;
      return true;
    },

    // Record Enquiries in DB
    async submitEnquiry(enquiryData) {
      const client = getClient();
      if (!client) return null;
      try {
        const { data, error } = await client.from('enquiries').insert([{
          customer_name: enquiryData.name || 'Customer',
          customer_phone: enquiryData.phone || '',
          customer_city: enquiryData.city || '',
          total_estimated_amount: enquiryData.total || 0,
          items: enquiryData.items || [],
          enquiry_channel: enquiryData.channel || 'whatsapp',
          status: 'pending'
        }]).select();
        if (error) throw error;
        return data;
      } catch (e) {
        console.warn('Supabase submitEnquiry notice:', e);
        return null;
      }
    }
  };
})();

window.SP_SUPABASE = SP_SUPABASE;
