import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import AnimateOnScroll from '../components/AnimateOnScroll';
import API from '../api/axios';
import { HiOutlineMagnifyingGlass } from 'react-icons/hi2';

const CATEGORIES = ['All', 'Abaya', 'Jubba', 'Topi', 'Tasbih', 'Jainamaz', 'Fragrances', 'Books'];

const Products = () => {
  const { search: urlSearch } = useLocation();
  const categoryParam = new URLSearchParams(urlSearch).get('category');

  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, totalProducts: 0 });
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || 'All');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const debounceRef = useRef(null);

  const fetchProducts = useCallback(async (searchVal, category, sortVal, pageVal) => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ sort: sortVal, page: pageVal, limit: 12 });
      if (searchVal.trim()) params.set('search', searchVal.trim());
      if (category !== 'All') params.set('category', category);

      const res = await API.get(`/products?${params}`);
      setProducts(res.data.products);
      setPagination(res.data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load products. Please try again.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Sync URL category param on navigation (e.g. from Home page category click)
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
      setPage(1);
    }
  }, [categoryParam]);

  // Debounce search; fire immediately for category/sort/page changes
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchProducts(search, selectedCategory, sort, page);
    }, search ? 400 : 0);
    return () => clearTimeout(debounceRef.current);
  }, [search, selectedCategory, sort, page, fetchProducts]);

  const handleSearch = (val) => { setSearch(val); setPage(1); };
  const handleCategory = (val) => { setSelectedCategory(val); setPage(1); };
  const handleSort = (val) => { setSort(val); setPage(1); };
  const clearFilters = () => { setSearch(''); setSelectedCategory('All'); setSort('newest'); setPage(1); };

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <Helmet>
        <title>All Products | Noor-E-Emaan</title>
        <meta name="description" content="Browse our complete collection of Islamic products — Abayas, Jubbas, Tasbih, Jainamaz, Books and Fragrances." />
      </Helmet>

      {/* Hero banner */}
      <section className="relative pt-36 pb-24 overflow-hidden bg-gradient-to-br from-[#F7F2EC] via-[#EEDFD4] to-[#DCC8B8]">

        {/* Drifting background orbs */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.55),transparent_60%)]" />
        <div className="absolute top-1/2 right-8 sm:right-16 h-56 w-56 sm:h-72 sm:w-72 rounded-full bg-[#D8B9A5]/55 blur-3xl -translate-y-1/2 animate-orb" />
        <div className="absolute bottom-0 left-8 sm:left-20 h-40 w-40 sm:h-52 sm:w-52 rounded-full bg-[#C9A646]/15 blur-3xl animate-orb-2" />
        <div className="absolute top-12 left-1/3 h-28 w-28 rounded-full bg-[#8A5A44]/10 blur-3xl animate-orb-3" />

        {/* Gold top accent line */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#C9A646] to-transparent" />

        <div className="container-custom relative z-10 text-center">

          {/* Badge */}
          <span className="animate-banner-badge inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/50 border border-[#C9A646]/40 backdrop-blur-md text-[#8A5A44] text-[10px] font-black tracking-[0.3em] uppercase mb-6 shadow-sm">
            <span className="animate-spark">🛍️</span> Full Collection
          </span>

          {/* Title */}
          <h1 className="animate-banner-title text-5xl sm:text-6xl lg:text-8xl font-black text-[#3F312B] tracking-tight leading-none mb-5">
            Our <span className="text-[#8A5A44] italic">Collection</span>
          </h1>

          {/* Gold divider */}
          <div className="animate-gold-line mx-auto mb-5 h-[3px] w-24 bg-gradient-to-r from-[#C9A646] to-[#B8942E] rounded-full" />

          {/* Description */}
          <p className="animate-banner-desc text-[#6F5E55] font-medium text-base sm:text-lg max-w-xl mx-auto">
            Find the perfect Islamic essentials for your lifestyle.
          </p>
        </div>
      </section>

      <div className="container-custom py-12">
      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <div className="relative flex-grow md:max-w-72">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full bg-white border border-[#E8DDD1] rounded-2xl px-5 py-3.5 pl-11 text-[#27211E] placeholder:text-[#B8AAA0] font-medium outline-none focus:border-[#8A5A44] focus:ring-2 focus:ring-[#8A5A44]/10 transition-all text-sm"
            />
            <HiOutlineMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B8AAA0] text-lg" />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => handleCategory(e.target.value)}
            className="bg-white border border-[#E8DDD1] rounded-2xl px-5 py-3.5 text-[#27211E] font-medium outline-none focus:border-[#8A5A44] transition-all text-sm cursor-pointer md:w-40"
          >
            {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
          </select>

          <select
            value={sort}
            onChange={(e) => handleSort(e.target.value)}
            className="bg-white border border-[#E8DDD1] rounded-2xl px-5 py-3.5 text-[#27211E] font-medium outline-none focus:border-[#8A5A44] transition-all text-sm cursor-pointer md:w-52"
          >
            <option value="newest">Newest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-[4/5] bg-[#E8DDD1]/50 rounded-[2rem] animate-pulse" />
          ))}
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="text-center py-24 bg-white rounded-[2.5rem] border border-[#E8DDD1]">
          <p className="text-red-500 font-bold mb-4">{error}</p>
          <button
            onClick={() => fetchProducts(search, selectedCategory, sort, page)}
            className="text-[#8A5A44] font-black uppercase tracking-widest text-xs border-b-2 border-[#8A5A44] pb-1 hover:text-[#6F4736]"
          >
            Retry
          </button>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && products.length === 0 && (
        <div className="text-center py-24 bg-white rounded-[2.5rem] border-2 border-dashed border-[#E8DDD1]">
          <div className="text-5xl mb-5">🛍️</div>
          <h3 className="text-xl font-black text-[#3F312B] uppercase tracking-wider mb-2">No Products Found</h3>
          <p className="text-[#9B8C83] font-medium">Try adjusting your search or category filters.</p>
          <button onClick={clearFilters}
            className="mt-6 text-[#8A5A44] font-black uppercase tracking-widest text-xs border-b-2 border-[#8A5A44] pb-1">
            Clear Filters
          </button>
        </div>
      )}

      {/* Product grid */}
      {!loading && !error && products.length > 0 && (
        <>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#9B8C83] mb-6">
            {pagination.totalProducts} products found
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product, idx) => (
              <AnimateOnScroll key={product._id} variant="fadeUp" delay={["", "delay-75", "delay-150", "delay-200"][idx % 4]}>
                <ProductCard product={product} />
              </AnimateOnScroll>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-14 flex-wrap">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-5 py-2.5 rounded-full border border-[#E8DDD1] bg-white text-[#27211E] text-sm font-black disabled:opacity-40 hover:border-[#8A5A44] hover:text-[#8A5A44] transition-all"
              >
                ← Prev
              </button>

              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-10 h-10 rounded-full text-sm font-black border transition-all ${
                    p === page
                      ? 'bg-[#27211E] text-white border-[#27211E]'
                      : 'bg-white border-[#E8DDD1] text-[#27211E] hover:border-[#8A5A44] hover:text-[#8A5A44]'
                  }`}
                >
                  {p}
                </button>
              ))}

              <button
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={page === pagination.totalPages}
                className="px-5 py-2.5 rounded-full border border-[#E8DDD1] bg-white text-[#27211E] text-sm font-black disabled:opacity-40 hover:border-[#8A5A44] hover:text-[#8A5A44] transition-all"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
    </div>
  );
};

export default Products;
