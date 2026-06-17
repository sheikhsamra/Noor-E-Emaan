import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import ProductCard from '../components/ProductCard';
import { Link } from 'react-router-dom';
import { allProducts } from '../api/dummyData';

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    API.get('/products')
      .then(res => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          setProducts(res.data);
        } else {
          setProducts(allProducts);
        }
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setProducts(allProducts);
      });
  }, []);

  const abayas = products.filter(p => p.category === 'Abaya').slice(0, 4);
  const jubbas = products.filter(p => p.category === 'Jubba').slice(0, 4);
  const essentials = products.filter(p => ['Topi', 'Tasbih', 'Jainamaz'].includes(p.category)).slice(0, 4);

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <section className="bg-primary text-white py-20 lg:py-32 mb-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-accent/10 rounded-l-full transform translate-x-1/2 -rotate-12"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full transform -translate-x-1/2 translate-y-1/2"></div>
        
        <div className="container-custom relative z-10 text-center lg:text-left">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              Elegance & <span className="text-accent">Faith</span> Combined
            </h1>
            <p className="text-xl md:text-2xl opacity-90 mb-10 max-w-2xl leading-relaxed">
              Discover our curated collection of high-quality Islamic products, crafted for your spiritual and modern lifestyle.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
              <Link to="/products" className="btn-accent text-primary px-10 py-4 text-lg">Shop Collection</Link>
              <Link to="/categories" className="btn-primary border border-white/30 px-10 py-4 text-lg">Browse Categories</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Category Section: Abayas */}
      <section className="container-custom mb-20">
        <div className="flex justify-between items-end mb-10 border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Premium Abayas</h2>
            <p className="text-gray-500 mt-1">Elegant and modest designs for every occasion.</p>
          </div>
          <Link to="/products?category=Abaya" className="text-primary font-bold hover:text-accent transition-colors">See All Abayas →</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {abayas.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      {/* Category Section: Jubbas */}
      <section className="container-custom mb-20">
        <div className="flex justify-between items-end mb-10 border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Traditional Jubbas</h2>
            <p className="text-gray-500 mt-1">Classic thobes crafted for comfort and grace.</p>
          </div>
          <Link to="/products?category=Jubba" className="text-primary font-bold hover:text-accent transition-colors">See All Jubbas →</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {jubbas.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      {/* Category Section: Essentials */}
      <section className="container-custom mb-20">
        <div className="flex justify-between items-end mb-10 border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Spiritual Essentials</h2>
            <p className="text-gray-500 mt-1">Prayer mats, tasbihs, and caps for your daily dhikr.</p>
          </div>
          <Link to="/categories" className="text-primary font-bold hover:text-accent transition-colors">View All Essentials →</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {essentials.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      {/* Trust Section */}
      <section className="bg-white py-20 border-y border-gray-100">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: "✨", title: "Premium Quality", desc: "Every item is hand-picked and verified for authentic quality and durability." },
              { icon: "🚚", title: "Global Delivery", desc: "Safe, fast, and secure shipping to customers all over the world." },
              { icon: "🔒", title: "Secure Checkout", desc: "Your transactions are protected with industry-leading security standards." },
            ].map((item, i) => (
              <div key={i} className="text-center group">
                <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-300">{item.icon}</div>
                <h3 className="font-bold text-xl mb-3 text-gray-800 uppercase tracking-wide">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
