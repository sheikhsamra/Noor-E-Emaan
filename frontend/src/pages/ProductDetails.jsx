import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/axios';
import { CartContext } from '../context/CartContext';
import { allProducts } from '../api/dummyData';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setLoading(true);
    API.get(`/products/${id}`)
      .then(res => {
        if (res.data) {
          setProduct(res.data);
        } else {
          const found = allProducts.find(d => d._id === id);
          if (found) setProduct(found);
        }
      })
      .catch(() => {
        const found = allProducts.find(d => d._id === id);
        if (found) setProduct(found);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="container-custom py-20 text-center">
      <div className="animate-spin text-4xl inline-block">⏳</div>
      <p className="mt-4 text-gray-500">Loading product details...</p>
    </div>
  );

  if (!product) return (
    <div className="container-custom py-20 text-center">
      <h2 className="text-2xl font-bold text-gray-800">Product not found</h2>
      <Link to="/products" className="text-primary font-bold hover:underline mt-4 inline-block">Back to Catalog</Link>
    </div>
  );

  return (
    <div className="container-custom py-12 lg:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <div className="space-y-4">
          <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-white shadow-xl border border-gray-100">
            <img 
              src={product.images?.[0] || 'https://via.placeholder.com/600x800'} 
              alt={product.name} 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
        </div>

        <div className="flex flex-col h-full">
          <div className="mb-6">
            <span className="text-accent font-bold tracking-widest uppercase text-sm">{product.category}</span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mt-2 leading-tight">{product.name}</h1>
            <div className="flex items-center gap-4 mt-4">
              <p className="text-3xl font-bold text-primary">Rs. {product.price}</p>
              <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">IN STOCK</span>
            </div>
          </div>

          <p className="text-gray-600 text-lg leading-relaxed mb-8">
            {product.description || "Indulge in the perfect blend of tradition and modernity. This premium item is crafted with the finest materials to ensure comfort and spiritual elegance in your daily life."}
          </p>

          <div className="mt-auto space-y-6">
            <div className="flex items-center gap-6">
              <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="px-4 py-2 hover:bg-gray-100 text-xl font-bold transition-colors"
                >-</button>
                <span className="px-6 py-2 font-bold text-lg border-x-2 border-gray-200">{quantity}</span>
                <button 
                  onClick={() => setQuantity(q => q + 1)}
                  className="px-4 py-2 hover:bg-gray-100 text-xl font-bold transition-colors"
                >+</button>
              </div>
              <button 
                onClick={() => {
                  for(let i=0; i<quantity; i++) addToCart(product);
                  alert(`${quantity} ${product.name} added to cart!`);
                }}
                className="btn-accent flex-1 text-primary py-4 text-lg"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
