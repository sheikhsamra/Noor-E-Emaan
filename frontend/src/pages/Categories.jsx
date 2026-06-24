import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import AnimateOnScroll from '../components/AnimateOnScroll';
import API from '../api/axios';

const CATEGORIES = [
  { name: 'Abaya',      icon: '👗', desc: 'Elegant modest fashion' },
  { name: 'Jubba',      icon: '🕌', desc: 'Traditional thobes & jubbas' },
  { name: 'Topi',       icon: '🎩', desc: 'Prayer caps & kufi' },
  { name: 'Tasbih',     icon: '📿', desc: 'Dhikr beads & counters' },
  { name: 'Jainamaz',   icon: '🗺️', desc: 'Prayer mats & musallah' },
  { name: 'Fragrances', icon: '✨', desc: 'Attar, oud & bukhoor' },
  { name: 'Books',      icon: '📚', desc: 'Islamic literature' },
];

const Categories = () => {
  const { search } = useLocation();
  const initialCategory = new URLSearchParams(search).get('category') || 'Abaya';

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    API.get(`/products?category=${selectedCategory}&limit=50`)
      .then(res => setProducts(res.data.products || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [selectedCategory]);

  useEffect(() => {
    const cat = new URLSearchParams(search).get('category');
    if (cat) setSelectedCategory(cat);
  }, [search]);

  const current = CATEGORIES.find(c => c.name === selectedCategory);

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <Helmet>
        <title>{selectedCategory} Collection | Noor-E-Emaan</title>
        <meta name="description" content={`Browse our ${selectedCategory} collection at Noor-E-Emaan.`} />
      </Helmet>

      {/* Hero banner */}
      <section className="relative pt-36 pb-20 overflow-hidden bg-gradient-to-br from-[#F7F2EC] via-[#EEDFD4] to-[#DCC8B8]">

        {/* Drifting background orbs */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.55),transparent_60%)]" />
        <div className="absolute top-1/2 left-8 sm:left-16 h-56 w-56 sm:h-72 sm:w-72 rounded-full bg-[#D8B9A5]/55 blur-3xl -translate-y-1/2 animate-orb-2" />
        <div className="absolute top-8 right-1/4 h-40 w-40 rounded-full bg-[#C9A646]/12 blur-3xl animate-orb" />
        <div className="absolute bottom-0 right-12 h-36 w-36 rounded-full bg-[#8A5A44]/10 blur-3xl animate-orb-3" />

        {/* Gold top accent line */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#C9A646] to-transparent" />

        {/* key re-mounts the content on category switch → animations replay */}
        <div key={selectedCategory} className="container-custom relative z-10 text-center">

          {/* Badge — drops in */}
          <span className="animate-banner-badge inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/50 border border-[#C9A646]/40 backdrop-blur-md text-[#8A5A44] text-[10px] font-black tracking-[0.3em] uppercase mb-6 shadow-sm">
            <span className="animate-spark text-base">{current?.icon}</span>
            {current?.desc}
          </span>

          {/* Title — blurs into focus */}
          <h1 className="animate-banner-title text-5xl sm:text-6xl lg:text-8xl font-black text-[#3F312B] tracking-tight leading-none mb-4">
            {selectedCategory}
          </h1>

          {/* Gold divider line */}
          <div className="animate-gold-line mx-auto mb-4 h-[3px] w-20 bg-gradient-to-r from-[#C9A646] to-[#B8942E] rounded-full" />

          {/* Product count */}
          <p className="animate-banner-desc text-[#6F5E55] font-medium text-base sm:text-lg">
            {loading ? (
              <span className="inline-block w-20 h-5 bg-[#D8B9A5]/50 rounded-full animate-pulse" />
            ) : (
              <>{products.length} products in this collection</>
            )}
          </p>
        </div>
      </section>

      {/* Category tab pills — light cream background */}
      <div className="bg-white border-b border-[#E8DDD1] sticky top-[80px] z-40 shadow-sm">
        <div className="container-custom">
          <div className="flex gap-2 overflow-x-auto py-3 scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-black text-xs uppercase tracking-[0.12em] whitespace-nowrap transition-all duration-300 flex-shrink-0 ${
                  selectedCategory === cat.name
                    ? 'bg-[#8A5A44] text-white shadow-md'
                    : 'bg-[#F7F2EC] text-[#6F5E55] border border-[#E8DDD1] hover:bg-[#EEDFD4] hover:text-[#3F312B]'
                }`}
              >
                <span>{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products grid */}
      <section className="container-custom py-14">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[4/5] bg-[#E8DDD1]/50 rounded-[2rem] animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-28 bg-white rounded-[2.5rem] border-2 border-dashed border-[#E8DDD1]">
            <span className="text-5xl block mb-5">{current?.icon}</span>
            <h3 className="text-xl font-black text-[#3F312B] mb-3 uppercase tracking-wider">No Products Yet</h3>
            <p className="text-[#9B8C83] font-medium">This collection is coming soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product, idx) => (
              <AnimateOnScroll key={product._id} variant="fadeUp" delay={["", "delay-75", "delay-150", "delay-200"][idx % 4]}>
                <ProductCard product={product} />
              </AnimateOnScroll>
            ))}
          </div>
        )}
      </section>

      {/* Bottom banner — cream gradient */}
      <section className="container-custom pb-20">
        <div className="bg-gradient-to-br from-[#F7F2EC] to-[#EEDFD4] rounded-[2.5rem] p-10 sm:p-14 text-center border border-[#E8DDD1]">
          <span className="text-[10px] font-black tracking-[0.4em] uppercase text-[#8A5A44] block mb-3">Quality You Can Trust</span>
          <h3 className="text-2xl sm:text-3xl font-black text-[#3F312B] tracking-tight mb-4">
            All {selectedCategory} — Authentic & Premium
          </h3>
          <p className="text-[#6F5E55] font-medium max-w-xl mx-auto leading-relaxed">
            Every product in our {selectedCategory.toLowerCase()} collection is hand-picked for quality, authenticity and value.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Categories;
