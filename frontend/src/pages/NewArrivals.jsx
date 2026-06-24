import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import ProductCard from '../components/ProductCard';
import AnimateOnScroll from '../components/AnimateOnScroll';

const NewArrivals = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/products?sort=newest&limit=12')
      .then(res => setProducts(res.data.products || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <Helmet>
        <title>New Arrivals | Noor-E-Emaan</title>
        <meta name="description" content="Explore the latest Islamic clothing and accessories at Noor-E-Emaan." />
      </Helmet>

      {/* Hero banner */}
      <section className="relative pt-36 pb-24 overflow-hidden bg-gradient-to-br from-[#F7F2EC] via-[#EEDFD4] to-[#DCC8B8]">

        {/* Background glow orbs — they drift slowly */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.55),transparent_60%)]" />
        <div className="absolute top-1/2 right-8 sm:right-16 h-56 w-56 sm:h-72 sm:w-72 rounded-full bg-[#D8B9A5]/55 blur-3xl -translate-y-1/2 animate-orb" />
        <div className="absolute bottom-0 left-8 sm:left-16 h-40 w-40 sm:h-56 sm:w-56 rounded-full bg-[#C9A646]/18 blur-3xl animate-orb-2" />
        <div className="absolute top-10 left-1/3 h-32 w-32 rounded-full bg-[#8A5A44]/10 blur-3xl animate-orb-3" />

        {/* Gold top accent line */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#C9A646] to-transparent" />

        <div className="container-custom relative z-10 text-center">

          {/* Badge — bounces in from top */}
          <span className="animate-banner-badge inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/50 border border-[#C9A646]/40 backdrop-blur-md text-[#8A5A44] text-[10px] font-black tracking-[0.3em] uppercase mb-6 shadow-sm">
            <span className="animate-spark">✨</span> Just Arrived
          </span>

          {/* Title — blurs into focus */}
          <h1 className="animate-banner-title text-5xl sm:text-6xl lg:text-8xl font-black text-[#3F312B] tracking-tight leading-none mb-5">
            New <span className="text-[#8A5A44] italic">Arrivals</span>
          </h1>

          {/* Gold divider line — expands from center */}
          <div className="animate-gold-line mx-auto mb-5 h-[3px] w-24 bg-gradient-to-r from-[#C9A646] to-[#B8942E] rounded-full" />

          {/* Description */}
          <p className="animate-banner-desc text-[#6F5E55] font-medium text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Fresh additions to our collection — discover the latest Islamic essentials.
          </p>

          {/* Button */}
          <div className="animate-banner-btn mt-8">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 border-2 border-[#8A5A44] text-[#8A5A44] px-8 py-3.5 rounded-full font-black text-sm uppercase tracking-[0.15em] hover:bg-[#8A5A44] hover:text-white transition-all duration-300 bg-white/40 backdrop-blur-sm shadow-sm"
            >
              View All Products →
            </Link>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="container-custom py-16">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[4/5] bg-[#E8DDD1]/50 rounded-[2rem] animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-28 bg-white rounded-[2.5rem] border-2 border-dashed border-[#E8DDD1]">
            <span className="text-5xl block mb-5">✨</span>
            <h3 className="text-xl font-black text-[#3F312B] mb-3 uppercase tracking-wider">No New Arrivals Yet</h3>
            <p className="text-[#9B8C83] font-medium">Check back soon for fresh additions.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-10 border-b-2 border-[#E8DDD1] pb-6">
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#8A5A44] block mb-1">Latest Collection</span>
                <h2 className="text-3xl font-black text-[#27211E] tracking-tight">{products.length} Fresh Items</h2>
              </div>
              <Link to="/products"
                className="text-[#8A5A44] font-black text-xs uppercase tracking-[0.2em] border-b-2 border-[#C9A646] pb-1 hover:text-[#6F4736] transition-colors">
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {products.map((product, idx) => (
                <AnimateOnScroll key={product._id} variant="fadeUp" delay={["", "delay-75", "delay-150", "delay-200"][idx % 4]}>
                  <ProductCard product={product} />
                </AnimateOnScroll>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default NewArrivals;
