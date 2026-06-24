import { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import API from '../api/axios';
import {
  HiOutlineCheckCircle,
  HiOutlineShoppingBag,
  HiOutlineArrowLeft,
  HiOutlineXMark,
  HiOutlineMapPin,
  HiOutlinePhone,
  HiOutlineUser,
  HiOutlineExclamationCircle,
  HiCheckCircle,
} from 'react-icons/hi2';

const imgSrc = (src) => {
  if (!src) return null;
  return src.startsWith('http') || src.startsWith('/') ? src : `/${src}`;
};

export default function Checkout() {
  const { cart, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm]           = useState({ name: '', email: '', phone: '', address: '' });
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess]     = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + (item.discountPrice || item.price) * item.quantity, 0);
  const delivery = subtotal >= 3000 ? 0 : 200;
  const total    = subtotal + delivery;

  // Step 1 — validate form & open confirmation modal
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    if (cart.length === 0) { setError('Your cart is empty.'); return; }
    setError('');
    setShowConfirm(true);
  };

  // Step 2 — place order after user confirms in modal
  const handleConfirmOrder = async () => {
    setLoading(true);
    setError('');
    try {
      const items = cart.map((item) => ({ productId: item._id, quantity: item.quantity }));
      await API.post('/orders', { items, customerInfo: form });
      clearCart();
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    if (success) navigate('/products');
    setShowConfirm(false);
    setSuccess(false);
    setError('');
  };

  const inputClass = "w-full bg-white border border-[#E8DDD1] rounded-2xl px-5 py-4 text-[#27211E] placeholder:text-[#B8AAA0] font-medium outline-none focus:border-[#8A5A44] focus:ring-2 focus:ring-[#8A5A44]/10 transition-all text-sm";
  const labelClass = "block text-xs font-black uppercase tracking-[0.2em] text-[#3F312B] mb-2";

  return (
    <>
      <div className="min-h-screen bg-[#FAF8F5] pt-28 pb-20">
        <div className="container-custom">

          <div className="mb-10">
            <Link to="/cart" className="flex items-center gap-2 text-[#8A5A44] text-xs font-black uppercase tracking-[0.2em] hover:gap-3 transition-all duration-200 mb-3 w-fit">
              <HiOutlineArrowLeft /> Back to Cart
            </Link>
            <h1 className="text-4xl font-black text-[#27211E] tracking-tight">Checkout</h1>
            <p className="text-[#9B8C83] font-medium mt-1">Complete your order details below</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">

            {/* ── Form ── */}
            <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-5">
              <div className="bg-white border border-[#E8DDD1] rounded-[2rem] p-7 shadow-[0_8px_30px_rgba(63,49,43,0.06)]">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#8A5A44] mb-6">Delivery Information</h3>

                {error && (
                  <div className="mb-5 p-4 bg-red-50 border border-red-200/60 text-red-700 text-sm rounded-2xl font-medium flex items-center gap-2">
                    <HiOutlineExclamationCircle className="text-lg flex-shrink-0" /> {error}
                  </div>
                )}

                <div className="space-y-5">
                  <div>
                    <label className={labelClass}>Full Name</label>
                    <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                      placeholder="Your Full Name" required className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Email Address</label>
                    <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                      placeholder="name@example.com" type="email" required className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>WhatsApp Number</label>
                    <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                      placeholder="+92 300 0000000" required className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Delivery Address</label>
                    <textarea value={form.address} onChange={e => setForm({ ...form, address: e.target.value })}
                      placeholder="House No, Street, Area, City"
                      required rows={3}
                      className={`${inputClass} resize-none`} />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={cart.length === 0}
                className="btn-shimmer btn-glow w-full bg-[#8A5A44] hover:bg-[#6F4736] text-white font-black py-5 rounded-2xl transition-all duration-300 shadow-[0_15px_35px_rgba(138,90,68,0.3)] hover:-translate-y-0.5 disabled:opacity-40 disabled:translate-y-0 text-sm uppercase tracking-[0.15em]"
              >
                Place Order
              </button>
            </form>

            {/* ── Order Summary ── */}
            <div className="lg:col-span-2">
              <div className="bg-white border border-[#E8DDD1] rounded-[2rem] p-7 shadow-[0_20px_60px_rgba(63,49,43,0.08)] sticky top-28">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#8A5A44] mb-6">
                  Order Summary ({cart.length} items)
                </h3>

                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                  {cart.map((item) => {
                    const price = item.discountPrice || item.price;
                    const src   = imgSrc(item.images?.[0]);
                    return (
                      <div key={item._id} className="flex items-center gap-3">
                        <div className="h-14 w-14 rounded-xl overflow-hidden bg-[#F7F2EC] flex-shrink-0 border border-[#E8DDD1]">
                          {src
                            ? <img src={src} alt={item.name} className="h-full w-full object-cover object-top" />
                            : <HiOutlineShoppingBag className="text-2xl text-[#8A5A44] m-auto h-full" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[#27211E] font-black text-sm truncate">{item.name}</p>
                          <p className="text-[#9B8C83] text-xs font-medium">× {item.quantity}</p>
                        </div>
                        <p className="text-[#8A5A44] font-black text-sm flex-shrink-0">
                          Rs. {(price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div className="h-px bg-[#E8DDD1] mb-5" />
                <div className="space-y-3 mb-5">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#6F5E55] font-medium">Subtotal</span>
                    <span className="text-[#27211E] font-black">Rs. {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#6F5E55] font-medium">Delivery</span>
                    <span className={`font-black ${delivery === 0 ? 'text-emerald-600' : 'text-[#27211E]'}`}>
                      {delivery === 0 ? 'Free' : `Rs. ${delivery}`}
                    </span>
                  </div>
                </div>
                <div className="h-px bg-[#E8DDD1] mb-5" />
                <div className="flex justify-between items-center">
                  <span className="font-black text-[#27211E] uppercase tracking-wider text-sm">Total</span>
                  <span className="text-[#8A5A44] font-black text-2xl">Rs. {total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Confirmation / Success Modal ── */}
      {showConfirm && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center p-4 animate-lbFadeIn"
          style={{ backgroundColor: 'rgba(15,10,8,0.65)' }}
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div className="relative w-full max-w-md bg-[#FAF8F5] rounded-[2rem] shadow-[0_40px_100px_rgba(0,0,0,0.35)] overflow-hidden animate-lbScaleIn">

            {/* Close button */}
            {!loading && (
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 h-9 w-9 rounded-full bg-white border border-[#E8DDD1] flex items-center justify-center text-[#9B8C83] hover:text-[#3F312B] hover:bg-[#F7F2EC] transition-all z-10"
              >
                <HiOutlineXMark className="text-lg" />
              </button>
            )}

            {success ? (
              /* ── SUCCESS STATE ── */
              <div className="p-8 text-center">
                <div className="relative w-24 h-24 mx-auto mb-6">
                  <div className="absolute inset-0 rounded-full bg-emerald-100 animate-ping opacity-40" />
                  <div className="relative h-24 w-24 rounded-full bg-gradient-to-br from-emerald-50 to-emerald-100 border-2 border-emerald-200 flex items-center justify-center shadow-lg">
                    <HiCheckCircle className="text-5xl text-emerald-500" />
                  </div>
                </div>
                <span className="text-[9px] font-black tracking-[0.4em] uppercase text-emerald-600 block mb-3">
                  Order Confirmed
                </span>
                <h2 className="text-3xl font-black text-[#27211E] tracking-tight mb-3">JazakAllah Khair!</h2>
                <p className="text-[#9B8C83] font-medium leading-relaxed mb-2 text-sm">
                  Your order has been placed successfully.
                </p>
                <p className="text-[#9B8C83] font-medium leading-relaxed mb-8 text-sm">
                  We will contact you on <span className="text-[#8A5A44] font-black">WhatsApp</span> to confirm delivery details.
                </p>

                <div className="bg-gradient-to-br from-[#F7F2EC] to-[#EEDFD4] rounded-2xl p-4 mb-7 border border-[#E8DDD1] text-left">
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#8A5A44] mb-3">Delivery to</p>
                  <div className="flex items-start gap-2 text-sm text-[#3F312B]">
                    <HiOutlineUser className="text-[#8A5A44] mt-0.5 flex-shrink-0" />
                    <span className="font-bold">{form.name}</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-[#6F5E55] mt-1.5">
                    <HiOutlinePhone className="text-[#8A5A44] mt-0.5 flex-shrink-0" />
                    <span>{form.phone}</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-[#6F5E55] mt-1.5">
                    <HiOutlineMapPin className="text-[#8A5A44] mt-0.5 flex-shrink-0" />
                    <span>{form.address}</span>
                  </div>
                </div>

                <button
                  onClick={closeModal}
                  className="w-full bg-[#8A5A44] hover:bg-[#6F4736] text-white font-black py-3.5 rounded-2xl transition-all duration-300 shadow-[0_8px_25px_rgba(138,90,68,0.3)] hover:-translate-y-0.5 text-sm uppercase tracking-[0.15em]"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              /* ── CONFIRMATION STATE ── */
              <div>
                {/* Header */}
                <div className="bg-gradient-to-r from-[#F7F2EC] to-[#EEDFD4] px-7 py-5 border-b border-[#E8DDD1]">
                  <span className="text-[9px] font-black tracking-[0.35em] uppercase text-[#8A5A44] block mb-1">
                    Confirm Order
                  </span>
                  <h3 className="text-xl font-black text-[#27211E] tracking-tight">
                    Review before placing
                  </h3>
                </div>

                <div className="px-7 py-5 space-y-5">

                  {/* Cart items mini list */}
                  <div className="space-y-3 max-h-40 overflow-y-auto">
                    {cart.map((item) => {
                      const price = item.discountPrice || item.price;
                      const src   = imgSrc(item.images?.[0]);
                      return (
                        <div key={item._id} className="flex items-center gap-3">
                          <div className="h-11 w-10 rounded-xl overflow-hidden bg-[#F7F2EC] flex-shrink-0 border border-[#E8DDD1]">
                            {src
                              ? <img src={src} alt={item.name} className="h-full w-full object-cover object-top" />
                              : <HiOutlineShoppingBag className="text-lg text-[#8A5A44] m-auto h-full" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[#27211E] font-black text-xs truncate">{item.name}</p>
                            <p className="text-[#9B8C83] text-[10px]">× {item.quantity}</p>
                          </div>
                          <p className="text-[#8A5A44] font-black text-xs flex-shrink-0">
                            Rs. {(price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Totals */}
                  <div className="bg-white border border-[#E8DDD1] rounded-2xl p-4 space-y-2">
                    <div className="flex justify-between text-xs text-[#6F5E55]">
                      <span>Subtotal</span>
                      <span className="font-bold text-[#27211E]">Rs. {subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs text-[#6F5E55]">
                      <span>Delivery</span>
                      <span className={`font-bold ${delivery === 0 ? 'text-emerald-600' : 'text-[#27211E]'}`}>
                        {delivery === 0 ? 'Free' : `Rs. ${delivery}`}
                      </span>
                    </div>
                    <div className="h-px bg-[#E8DDD1]" />
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-black text-[#27211E] uppercase tracking-wide">Total</span>
                      <span className="text-lg font-black text-[#8A5A44]">Rs. {total.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Delivery info */}
                  <div className="bg-gradient-to-br from-[#F7F2EC] to-[#EEDFD4] rounded-2xl p-4 border border-[#E8DDD1] space-y-1.5">
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#8A5A44] mb-2">Delivery to</p>
                    <div className="flex items-center gap-2 text-xs text-[#3F312B]">
                      <HiOutlineUser className="text-[#8A5A44] flex-shrink-0" />
                      <span className="font-bold">{form.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#6F5E55]">
                      <HiOutlinePhone className="text-[#8A5A44] flex-shrink-0" />
                      <span>{form.phone}</span>
                    </div>
                    <div className="flex items-start gap-2 text-xs text-[#6F5E55]">
                      <HiOutlineMapPin className="text-[#8A5A44] flex-shrink-0 mt-0.5" />
                      <span>{form.address}</span>
                    </div>
                  </div>

                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200/60 text-red-700 text-xs rounded-xl font-medium flex items-center gap-2">
                      <HiOutlineExclamationCircle className="text-base flex-shrink-0" /> {error}
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex gap-3 pt-1">
                    <button
                      onClick={() => { setShowConfirm(false); setError(''); }}
                      disabled={loading}
                      className="flex-1 bg-white border-2 border-[#E8DDD1] hover:border-[#8A5A44] text-[#3F312B] hover:text-[#8A5A44] font-black py-3.5 rounded-2xl transition-all duration-300 text-sm uppercase tracking-[0.12em] disabled:opacity-40"
                    >
                      Go Back
                    </button>
                    <button
                      onClick={handleConfirmOrder}
                      disabled={loading}
                      className="flex-1 btn-shimmer btn-glow bg-[#8A5A44] hover:bg-[#6F4736] text-white font-black py-3.5 rounded-2xl transition-all duration-300 shadow-[0_8px_25px_rgba(138,90,68,0.3)] hover:-translate-y-0.5 disabled:opacity-50 disabled:translate-y-0 text-sm uppercase tracking-[0.12em]"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Placing...
                        </span>
                      ) : 'Confirm Order'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
