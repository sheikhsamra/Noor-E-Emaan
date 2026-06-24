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

      {/* Hero header — light cream gradient matching home page */}
      <section className="relative pt-36 pb-20 overflow-hidden bg-gradient-to-br from-[#F7F2EC] via-[#EEDFD4] to-[#DCC8B8]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.55),transparent_60%)]" />
        <div className="absolute top-1/2 right-16 h-64 w-64 rounded-full bg-[#D8B9A5]/50 blur-3xl -translate-y-1/2" />
        <div className="absolute bottom-0 left-16 h-48 w-48 rounded-full bg-[#C9A646]/10 blur-3xl" />

        <div className="container-custom relative z-10 text-center">
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/45 border border-white/60 backdrop-blur-md text-[#8A5A44] text-[10px] font-black tracking-[0.3em] uppercase mb-6">
            ✨ Just Arrived
          </span>
          <h1 className="text-5xl lg:text-7xl font-black text-[#3F312B] tracking-tight leading-none mb-5">
            New Arrivals
          </h1>
          <p className="text-[#6F5E55] font-medium text-lg max-w-xl mx-auto leading-relaxed">
            Fresh additions to our collection — discover the latest Islamic essentials.
          </p>
          <div className="mt-8">
            <Link to="/products"
              className="inline-flex items-center gap-2 border-2 border-[#8A5A44]/40 text-[#8A5A44] px-8 py-3 rounded-full font-black text-sm uppercase tracking-[0.15em] hover:bg-[#8A5A44] hover:text-white hover:border-[#8A5A44] transition-all duration-300 bg-white/30 backdrop-blur-sm">
              View All Products
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
