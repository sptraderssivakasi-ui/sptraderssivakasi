import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, MessageSquare, ShoppingBag, MapPin, Sparkles, Send } from 'lucide-react';
import { submitEnquiry } from '../services/supabase';

export default function CartDrawer({ isOpen, onClose, cart, updateQty, removeItem, clearCart, showToast }) {
  const [customerCity, setCustomerCity] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const totalItemsCount = cart.reduce((sum, item) => sum + item.qty, 0);

  const handleSendEnquiry = async () => {
    if (cart.length === 0) return;
    setSubmitting(true);
    try {
      await submitEnquiry({
        name: 'Website Visitor',
        city: customerCity.trim() || 'Not Specified',
        total: totalAmount,
        items: cart
      });
      showToast('Enquiry sent via WhatsApp and recorded in database!', '✅');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity" 
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-night-2 border-l border-gold/30 flex flex-col shadow-2xl relative">
          {/* Drawer Header */}
          <div className="p-5 sm:p-6 bg-night-3 border-b border-gold/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gold/15 border border-gold/40 flex items-center justify-center text-gold shadow-glow-gold">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-white flex items-center gap-1.5">
                  Diwali Enquiry Cart <Sparkles className="w-4 h-4 text-gold" />
                </h3>
                <p className="text-xs text-paper-dim">{totalItemsCount} fireworks selected</p>
              </div>
            </div>

            <button 
              onClick={onClose} 
              className="p-2 rounded-xl text-paper-dim hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-3.5">
            {cart.length === 0 ? (
              <div className="text-center py-20 text-paper-muted space-y-3">
                <div className="text-5xl">🎆</div>
                <div className="text-base font-bold text-white">Your Enquiry List is Empty</div>
                <div className="text-xs max-w-xs mx-auto text-paper-dim leading-relaxed">
                  Explore our factory wholesale fireworks catalog and add crackers to generate your custom quotation.
                </div>
              </div>
            ) : (
              cart.map(item => (
                <div 
                  key={item.id} 
                  className="p-4 rounded-2xl bg-night-3/90 border border-gold/15 flex items-center justify-between gap-3 shadow-md hover:border-gold/30 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-sm text-white truncate">{item.name}</h4>
                    <div className="text-xs text-gold font-mono font-semibold mt-1">
                      ₹{item.price} × {item.qty} = <span className="font-black text-white">₹{item.price * item.qty}</span>
                    </div>
                    <div className="text-[11px] text-paper-muted mt-0.5">{item.meta || '1 Box'}</div>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button 
                      onClick={() => updateQty(item.id, item.qty - 1)}
                      className="w-8 h-8 rounded-xl bg-night-4 border border-gold/20 text-paper hover:text-gold hover:border-gold flex items-center justify-center text-xs font-bold transition-all active:scale-95"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-black w-6 text-center text-white">{item.qty}</span>
                    <button 
                      onClick={() => updateQty(item.id, item.qty + 1)}
                      className="w-8 h-8 rounded-xl bg-night-4 border border-gold/20 text-paper hover:text-gold hover:border-gold flex items-center justify-center text-xs font-bold transition-all active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-crimson hover:text-crimson-light transition-colors ml-1"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer & WhatsApp Action */}
          {cart.length > 0 && (
            <div className="p-5 sm:p-6 bg-night-3/95 border-t border-gold/20 space-y-4 shadow-2xl">
              {/* Delivery city */}
              <div>
                <label className="block text-xs font-bold text-paper-dim uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-gold" /> Destination City / District
                </label>
                <input
                  type="text"
                  placeholder="e.g. Chennai, Bangalore, Hyderabad, Madurai..."
                  value={customerCity}
                  onChange={(e) => setCustomerCity(e.target.value)}
                  className="w-full bg-night-4 border border-gold/30 rounded-xl px-4 py-3 text-white text-xs placeholder-paper-muted focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
                />
              </div>

              {/* Total Summary */}
              <div className="flex justify-between items-baseline pt-1">
                <div>
                  <span className="text-xs text-paper-dim uppercase font-bold">Estimated Order Value:</span>
                  <div className="text-[10px] text-emerald font-semibold">Direct Factory Discount Included</div>
                </div>
                <span className="font-display text-2xl font-black text-gold">₹{totalAmount}</span>
              </div>

              {/* Submit WhatsApp Button */}
              <button
                onClick={handleSendEnquiry}
                disabled={submitting}
                className="w-full bg-gradient-to-r from-[#25D366] to-[#1eb857] hover:brightness-110 text-white py-3.5 px-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2.5 shadow-xl hover:shadow-[#25D366]/30 transition-all active:scale-98"
              >
                <MessageSquare className="w-5 h-5" />
                <span>Send WhatsApp Order Request</span>
              </button>

              <div className="flex items-center justify-between text-[11px] text-paper-muted pt-1">
                <span>⚡ Instant Response on WhatsApp</span>
                <button 
                  onClick={clearCart}
                  className="text-crimson-light hover:underline font-semibold"
                >
                  Clear All
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
