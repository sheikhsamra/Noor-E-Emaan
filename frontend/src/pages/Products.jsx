import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import API from '../api/axios';
import ProductCard from '../components/ProductCard';
import { allProducts } from '../api/dummyData';

const Products = () => {
  const { search: urlSearch } = useLocation();
  const queryParams = new URLSearchParams(urlSearch);
  const categoryParam = queryParams.get('category');

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || 'All');

  const categories = ['All', 'Abaya', 'Jubba', 'Topi', 'Tasbih', 'Jainamaz', 'Fragrances', 'Books'];

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  useEffect(() => {
    API.get('/products')
      .then(res => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          setProducts(res.data);
          setFilteredProducts(res.data);
        } else {
          setProducts(allProducts);
          setFilteredProducts(allProducts);
        }
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setProducts(allProducts);
        setFilteredProducts(allProducts);
      });
  }, []);

  useEffect(() => {
    let result = products;

    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category?.toLowerCase() === selectedCategory.toLowerCase());
    }

    if (search) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(search.toLowerCase()) || 
        p.description?.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredProducts(result);
  }, [search, selectedCategory, products]);

  return (
    <div className="container-custom py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 tracking-tight">Our Collection</h1>
          <p className="text-gray-600 mt-2">Find the perfect Islamic essentials for your lifestyle.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-grow md:w-64">
            <input 
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-10"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40">🔍</span>
          </div>
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="input md:w-48 bg-white cursor-pointer"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-3xl shadow-sm border border-dashed border-gray-300">
          <div className="text-5xl mb-4">🛍️</div>
          <h3 className="text-xl font-semibold text-gray-800">No products found</h3>
          <p className="text-gray-500 mt-2">Try adjusting your search or category filters.</p>
          <button 
            onClick={() => {setSearch(''); setSelectedCategory('All');}}
            className="mt-6 text-primary font-bold hover:underline"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredProducts.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
