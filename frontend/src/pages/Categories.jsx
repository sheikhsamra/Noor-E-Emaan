import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { allProducts } from '../api/dummyData';

const Categories = () => {
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const initialCategory = queryParams.get('category') || 'Abaya';

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const categoriesList = [
    { name: 'Abaya', icon: '👗' },
    { name: 'Jubba', icon: '🥋' },
    { name: 'Topi', icon: '🕌' },
    { name: 'Tasbih', icon: '📿' },
    { name: 'Jainamaz', icon: '🗺️' },
    { name: 'Fragrances', icon: '🧪' },
    { name: 'Books', icon: '📚' },
  ];

  useEffect(() => {
    const filtered = allProducts.filter(
      p => p.category.toLowerCase() === selectedCategory.toLowerCase()
    );
    setFilteredProducts(filtered);
  }, [selectedCategory]);

  useEffect(() => {
    if (queryParams.get('category')) {
      setSelectedCategory(queryParams.get('category'));
    }
  }, [search]);

  return (
    <div className="container-custom py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 tracking-tight">Explore Categories</h1>
        <p className="text-gray-600 mt-2">Discover our collection organized by category</p>
      </div>

      {/* Category Sub-Navbar */}
      <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-16 border-b border-gray-100 pb-8">
        {categoriesList.map((cat) => (
          <button
            key={cat.name}
            onClick={() => setSelectedCategory(cat.name)}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all duration-300 shadow-sm ${
              selectedCategory === cat.name
                ? 'bg-primary text-white scale-105 shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'
            }`}
          >
            <span className="text-xl">{cat.icon}</span>
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      {/* Product Display */}
      <div className="mb-8 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <span className="text-accent">{categoriesList.find(c => c.name === selectedCategory)?.icon}</span>
          {selectedCategory} Collection
        </h2>
        <span className="text-sm text-gray-500 font-medium bg-gray-100 px-3 py-1 rounded-full">
          {filteredProducts.length} Products Found
        </span>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-surface rounded-3xl border border-dashed border-gray-200">
          <p className="text-gray-500">No products found in this category yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredProducts.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
      
      {/* Visual Spacer */}
      <div className="mt-20 py-12 bg-primary/5 rounded-3xl text-center px-6">
        <h3 className="text-2xl font-bold text-primary">Quality You Can Trust</h3>
        <p className="text-gray-600 mt-2 max-w-xl mx-auto">
          All our {selectedCategory.toLowerCase()} are crafted with precision and respect for tradition. 
          Shop with confidence knowing you are getting the finest quality.
        </p>
      </div>
    </div>
  );
};

export default Categories;
