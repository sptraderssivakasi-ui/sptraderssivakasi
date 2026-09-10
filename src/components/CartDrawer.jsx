import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, MessageSquare, ShoppingBag, MapPin, Sparkles } from 'lucide-react';
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
        city: customerCity.trim(),
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
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-night-2 border-l border-gold/25 flex flex-col shadow-2xl">
          {/* Drawer Header */}
          <div className="p-6 bg-night-3 border-b border-gold/15 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center text-xl text-gold">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-paper">Diwali Enquiry List</h3>
                <p className="text-xs text-paper/50">{totalItemsCount} fireworks selected</p>
              </div>
            </div>

            <button 
              onClick={onClose} 
              className="p-2 rounded-xl text-paper/60 hover:text-paper hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 text-paper/40 space-y-3">
                <div className="text-4xl">🎆</div>
                <div className="text-sm font-semibold text-paper/70">Your enquiry list is empty</div>
                <div className="text-xs max-w-xs mx-auto leading-relaxed">
                  Browse the catalog and add your favourite crackers to generate a custom Diwali price quote.
                </div>
              </div>
            ) : (
              cart.map(item => (
                <div 
                  key={item.id} 
                  className="p-4 rounded-2xl bg-night-3/60 border border-white/5 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-sm text-paper truncate">{item.name}</h4>
                    <div className="text-xs text-gold/80 font-mono mt-0.5">
                      ₹{item.price} × {item.qty} = <span className="font-bold text-gold">₹{item.price * item.qty}</span>
                    </div>
                    <div className="text-[11px] text-paper/40 mt-0.5">{item.meta || '1 Box'}</div>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button 
                      onClick={() => updateQty(item.id, item.qty - 1)}
                      className="w-7 h-7 rounded-lg bg-night-4 border border-white/10 text-paper/80 hover:text-gold hover:border-gold flex items-center justify-center text-xs font-bold transition-all"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-bold w-5 text-center">{item.qty}</span>
                    <button 
                      onClick={() => updateQty(item.id, item.qty + 1)}
                      className="w-7 h-7 rounded-lg bg-night-4 border border-white/10 text-paper/80 hover:text-gold hover:border-gold flex items-center justify-center text-xs font-bold transition-all"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="p-1.5 text-maroon hover:text-red-400 transition-colors ml-1"
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
            <div className="p-6 bg-night-3/90 border-t border-gold/15 space-y-4">
              {/* Delivery city */}
              <div>
                <label className="block text-xs font-bold text-paper/70 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-gold" /> Your City / District (for Courier Estimation)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Chennai, Bangalore, Madurai, Coimbatore..."
                  value={customerCity}
                  onChange={(e) => setCustomerCity(e.target.value)}
                  className="w-full bg-night-4 border border-gold/20 rounded-xl px-4 py-2.5 text-paper text-xs placeholder-paper/30 focus:outline-none focus:border-gold"
                />
              </div>

              {/* Total Summary */}
              <div className="flex justify-between items-baseline pt-2">
                <span className="text-xs text-paper/60 font-semibold uppercase">Estimated Total Amount:</span>
                <span className="font-display text-2xl font-black text-gold">₹{totalAmount}</span>
              </div>

              {/* Submit WhatsApp Button */}
              <button
                onClick={handleSendEnquiry}
                disabled={submitting}
                className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-[#25D366]/20 transition-all active:scale-98"
              >
                <MessageSquare className="w-5 h-5" />
                <span>Send Enquiry on WhatsApp</span>
              </button>

              <p className="text-[11px] text-paper/40 text-center leading-relaxed">
                No advance payment is taken online. Submitting opens WhatsApp with your item list so our Sivakasi team can confirm final wholesale discounts & courier details.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
