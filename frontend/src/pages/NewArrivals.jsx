import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import ProductCard from '../components/ProductCard';
import { allProducts } from '../api/dummyData';

const NewArrivals = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    API.get('/products')
      .then(res => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          setProducts(res.data.slice(0, 10));
        } else {
          // Use the latest 10 products from dummy data
          setProducts(allProducts.slice(0, 10));
        }
      })
      .catch(err => {
        console.error("Fetch error:", err);
        // Fallback to dummy data on error
        setProducts(allProducts.slice(0, 10));
      });
  }, []);

  return (
    <div className="container-custom py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-800 tracking-tight">New Arrivals</h1>
        <p className="text-gray-600 mt-2 text-lg">Check out our latest and most sought-after Islamic essentials.</p>
        <div className="h-1.5 w-24 bg-accent mt-4 rounded-full"></div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl shadow-inner">
          <p className="text-gray-500">Loading new arrivals...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default NewArrivals;
