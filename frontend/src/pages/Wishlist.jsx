import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import AnimateOnScroll from '../components/AnimateOnScroll';
import API from '../api/axios';
import { useToast } from '../context/ToastContext';
import { HiOutlineHeart, HiOutlineShoppingBag, HiOutlineLockClosed, HiOutlineSparkles, HiXMark } from 'react-icons/hi2';

const Wishlist = () => {
  const { user, token, setUser } = useContext(AuthContext);
  const { showToast } = useToast();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!token) { setLoading(false); return; }
      try {
        const res = await API.get('/auth/profile');
        setWishlistItems(res.data.wishlist || []);
        setUser(res.data);
        localStorage.setItem('user', JSON.stringify(res.data));
      } catch (err) {
        console.error("Wishlist fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, [token, setUser]);

  const handleRemove = async (e, productId) => {
    e.preventDefault();
    e.stopPropagation();
    setRemovingId(productId);
    try {
      await API.post(`/auth/wishlist/${productId}`);
      setWishlistItems(prev => prev.filter(p => p._id !== productId));
      const fresh = await API.get('/auth/profile');
      setUser(fresh.data);
      localStorage.setItem('user', JSON.stringify(fresh.data));
      showToast('Removed from wishlist.', 'info');
    } catch {
      showToast('Failed to remove. Please try again.', 'error');
    } finally {
      setRemovingId(null);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-[3px] border-[#E8DDD1] border-t-[#8A5A44] rounded-full animate-spin mx-auto mb-4" />
        <p className="text-[#8A5A44] font-black tracking-[0.3em] uppercase text-[10px]">Loading</p>
      </div>
    </div>
  );

  if (!token) return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center px-4 pt-20">
      <div className="text-center max-w-md">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#F7F2EC] to-[#EEDFD4] border border-[#E8DDD1] flex items-center justify-center mx-auto mb-8 shadow-lg">
          <HiOutlineLockClosed className="text-4xl text-[#8A5A44]" />
        </div>
        <h2 className="text-3xl font-black text-[#27211E] tracking-tight mb-3">Login Required</h2>
        <p className="text-[#9B8C83] font-medium leading-relaxed mb-8">
          Please sign in to view your saved items and wishlist collection.
        </p>
        <Link
          to="/login"
          className="inline-flex items-center gap-2 bg-[#8A5A44] hover:bg-[#6F4736] text-white font-black px-8 py-4 rounded-2xl shadow-[0_8px_25px_rgba(138,90,68,0.3)] hover:shadow-[0_12px_35px_rgba(138,90,68,0.4)] hover:-translate-y-0.5 transition-all duration-300 text-sm uppercase tracking-[0.15em]"
        >
          Sign In to Continue
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-20">
      <Helmet>
        <title>My Wishlist | Noor-E-Emaan</title>
      </Helmet>

      {/* ── Header ── */}
      <div className="bg-gradient-to-br from-[#F7F2EC] via-[#EEDFD4] to-[#E0CFC3] border-b border-[#E8DDD1]">
        <div className="container-custom py-14 text-center">
          <AnimateOnScroll variant="fadeUp">
            <span className="inline-flex items-center gap-2 mb-5 px-5 py-2 rounded-full bg-white/60 border border-white/80 backdrop-blur-md text-[#8A5A44] font-black uppercase tracking-[0.25em] text-[10px]">
              <HiOutlineHeart className="text-base" /> Personal Collection
            </span>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-[#27211E] tracking-tight leading-none mb-4">
              My Wishlist
            </h1>
            {wishlistItems.length > 0 && (
              <p className="text-[#9B8C83] font-semibold text-base mt-3">
                {wishlistItems.length} saved item{wishlistItems.length !== 1 ? 's' : ''}
              </p>
            )}
          </AnimateOnScroll>
        </div>
      </div>

      <div className="container-custom py-14">

        {/* ── Empty State ── */}
        {wishlistItems.length === 0 ? (
          <AnimateOnScroll variant="scaleUp">
            <div className="text-center py-24 bg-gradient-to-br from-[#F7F2EC] to-[#EEDFD4] rounded-[3rem] border border-[#E8DDD1] shadow-sm max-w-lg mx-auto">
              <div className="w-20 h-20 rounded-full bg-white border border-[#E8DDD1] flex items-center justify-center mx-auto mb-6 shadow-md">
                <HiOutlineHeart className="text-3xl text-[#D8B9A5]" />
              </div>
              <h3 className="text-xl font-black text-[#3F312B] mb-2 tracking-tight">Your wishlist is empty</h3>
              <p className="text-[#9B8C83] text-sm font-medium mb-8 px-6">
                Save your favourite items to find them easily later.
              </p>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 bg-[#8A5A44] hover:bg-[#6F4736] text-white font-black px-7 py-3.5 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 text-sm uppercase tracking-[0.15em]"
              >
                <HiOutlineShoppingBag /> Explore Products
              </Link>
            </div>
          </AnimateOnScroll>
        ) : (
          <>
            {/* ── Product Grid ── */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5 mb-16">
              {wishlistItems.map((product, idx) => (
                <AnimateOnScroll key={product._id} variant="fadeUp" delay={["", "delay-75", "delay-150", "delay-200"][idx % 4]}>
                  <div className="relative">
                    <ProductCard product={product} />
                    <button
                      onClick={(e) => handleRemove(e, product._id)}
                      disabled={removingId === product._id}
                      title="Remove from wishlist"
                      className="absolute top-5 left-5 z-30 h-8 w-8 rounded-full bg-white border border-[#E8DDD1] shadow-md flex items-center justify-center text-[#8A5A44] hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-200 disabled:opacity-50"
                    >
                      {removingId === product._id
                        ? <span className="h-3.5 w-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        : <HiXMark className="text-base" />
                      }
                    </button>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>

            {/* ── Notice Banner ── */}
            <AnimateOnScroll variant="fadeUp">
              <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#F7F2EC] via-[#EEDFD4] to-[#E0CFC3] px-8 py-10 text-center border border-[#E8DDD1] shadow-[0_12px_50px_rgba(138,90,68,0.12)]">
                <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-[#C9A646]/20 blur-3xl" />
                <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-[#8A5A44]/15 blur-3xl" />
                <div className="relative z-10">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <HiOutlineSparkles className="text-[#C9A646] text-xl animate-pulse" />
                    <span className="text-[#8A5A44] font-black text-[10px] uppercase tracking-[0.35em]">Reminder</span>
                    <HiOutlineSparkles className="text-[#C9A646] text-xl animate-pulse" />
                  </div>
                  <h4 className="text-2xl font-black text-[#27211E] tracking-tight mb-3">
                    Items are not reserved
                  </h4>
                  <p className="text-[#6F5E55] text-sm font-medium leading-relaxed max-w-xl mx-auto">
                    Our boutique collections sell out quickly. Secure your favourites before they're gone.
                  </p>
                  <Link
                    to="/products"
                    className="btn-shimmer btn-glow inline-flex items-center gap-2 mt-6 bg-[#8A5A44] hover:bg-[#6F4736] text-white font-black px-8 py-3.5 rounded-2xl text-sm uppercase tracking-[0.15em] transition-all duration-300 hover:-translate-y-0.5 shadow-[0_8px_25px_rgba(138,90,68,0.3)]"
                  >
                    <HiOutlineShoppingBag /> Shop Now
                  </Link>
                </div>
              </div>
            </AnimateOnScroll>
          </>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
