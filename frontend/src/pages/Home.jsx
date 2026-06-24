import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import ProductCard from '../components/ProductCard';
import { Link } from 'react-router-dom';
import CustomerGalleryBanner from "../components/CustomerGalleryBanner";
import AnimateOnScroll from '../components/AnimateOnScroll';
import API from '../api/axios';
import {
  HiOutlineShieldCheck,
  HiOutlineTruck,
  HiOutlineSparkles,
} from "react-icons/hi2";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  const normalize = (value) =>
    value?.toString().toLowerCase().trim();

  useEffect(() => {
    setLoading(true);
    API.get('/products?limit=100')
      .then(res => setProducts(res.data.products || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const categories = [
    { id: 'Abaya', title: 'Premium Abaya', subtitle: 'Exquisite Modesty' },
    { id: 'Jubba', title: 'Royal Jubba', subtitle: 'Traditional Heritage' },
    { id: 'Topi', title: 'Premium Topi', subtitle: 'Traditional Style' },
    { id: 'Jainamaz', title: 'Luxury Jainamaz', subtitle: 'Divine Comfort' },
    { id: 'Tasbih', title: 'Handcrafted Tasbih', subtitle: 'Spiritual Dhikr' },
    { id: 'Books', title: 'Islamic Books', subtitle: 'Divine Knowledge' },
    { id: 'Fragrances', title: 'Premium Attar', subtitle: 'Sacred Fragrance' },
  ];

  const heroSlides = [
    {
      image: "/banner/bg1.png",
      title: "Elegance & Faith Combined",
      highlight: "Faith",
      desc: "Discover premium Islamic products crafted for your spiritual and modern lifestyle.",
      bg: "from-[#F7F2EC] via-[#EEDFD4] to-[#DCC8B8]",
      text: "text-[#3F312B]",
      highlightColor: "text-[#9C6B4F]",
      primaryBtn: "bg-[#8A5A44] text-white hover:bg-[#6F4736]",
      secondaryBtn: "border border-[#8A5A44] text-[#8A5A44] hover:bg-[#8A5A44]/10",
      circle: "bg-[#D8B9A5]",
    },
    {
      image: "/banner/bg2.png",
      title: "Modesty With Modern Grace",
      highlight: "Grace",
      desc: "Beautiful abayas, hijabs and modest fashion for everyday elegance.",
      bg: "from-[#EEF2F7] via-[#DDE7F4] to-[#CBD7EB]",
      text: "text-[#1F2D44]",
      highlightColor: "text-[#274C77]",
      primaryBtn: "bg-[#274C77] text-white hover:bg-[#1D3B5C]",
      secondaryBtn: "border border-[#274C77] text-[#274C77] hover:bg-[#274C77]/10",
      circle: "bg-[#9CB7D8]",
    },
    {
      image: "/banner/bg3.png",
      title: "Premium Islamic Wear",
      highlight: "Wear",
      desc: "Elegant jubbas designed for comfort, simplicity and timeless modest style.",
      bg: "from-[#FAFAF8] via-[#F3F1ED] to-[#E8E3DB]",
      text: "text-[#444444]",
      highlightColor: "text-[#8A6A3E]",
      primaryBtn: "bg-[#8A6A3E] text-white hover:bg-[#6E5432]",
      secondaryBtn: "border border-[#8A6A3E] text-[#8A6A3E] hover:bg-[#8A6A3E]/10",
      circle: "bg-[#D9C8A7]",
    },
    {
      image: "/banner/bg4.png",
      title: "Traditional Topi Collection",
      highlight: "Topi",
      desc: "Explore premium topis in elegant neutral shades for everyday spiritual style.",
      bg: "from-[#EEF1EC] via-[#DFE6DD] to-[#CED9CF]",
      text: "text-[#324236]",
      highlightColor: "text-[#556B2F]",
      primaryBtn: "bg-[#556B2F] text-white hover:bg-[#445623]",
      secondaryBtn: "border border-[#556B2F] text-[#556B2F] hover:bg-[#556B2F]/10",
      circle: "bg-[#AAB89F]",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="pb-20 bg-[#FAF8F5]">
      <Helmet>
        <title>Noor-E-Emaan | Premium Islamic Store Pakistan</title>
        <meta name="description" content="Shop premium Islamic clothing, prayer accessories, books and fragrances. Authentic products delivered across Pakistan." />
        <meta property="og:title" content="Noor-E-Emaan | Premium Islamic Store" />
        <meta property="og:description" content="Abayas, Jubbas, Prayer accessories, Books and Fragrances." />
      </Helmet>

      {/* Hero Section  */}

      <section
        className={`relative max-w-screen-2xl mx-auto pt-28 pb-16 sm:pb-20 lg:py-24 overflow-hidden bg-gradient-to-br ${heroSlides[currentSlide].bg} ${heroSlides[currentSlide].text}`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_35%,rgba(255,255,255,0.7),transparent_35%)]"></div>

        <div className="container-custom relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] items-center gap-8 sm:gap-10 lg:gap-14">

            <div key={currentSlide} className="text-center lg:text-left animate-bannerText order-2 lg:order-1">
              <span
                className={`inline-flex mb-4 sm:mb-5 px-4 sm:px-5 py-2 rounded-full text-[10px] sm:text-xs lg:text-sm font-black tracking-[0.18em] sm:tracking-[0.25em] uppercase bg-white/45 border border-white/60 backdrop-blur-md ${heroSlides[currentSlide].highlightColor}`}
              >
                Premium Islamic Store
              </span>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black mb-5 sm:mb-7 leading-[0.98] tracking-tighter">
                {heroSlides[currentSlide].title.replace(heroSlides[currentSlide].highlight, "")}
                <span className={`${heroSlides[currentSlide].highlightColor} italic`}>
                  {heroSlides[currentSlide].highlight}
                </span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl opacity-80 mb-7 sm:mb-9 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                {heroSlides[currentSlide].desc}
              </p>

              <div className="flex flex-col xs:flex-row sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                <Link
                  to="/products"
                  className={`${heroSlides[currentSlide].primaryBtn} px-7 sm:px-9 py-3.5 sm:py-4 text-base sm:text-lg font-black rounded-full shadow-xl hover:scale-105 transition-all duration-300`}
                >
                  Shop Collection
                </Link>

                <Link
                  to="/categories"
                  className={`${heroSlides[currentSlide].secondaryBtn} px-7 sm:px-9 py-3.5 sm:py-4 text-base sm:text-lg font-black rounded-full bg-white/30 backdrop-blur-md transition-all duration-300`}
                >
                  Browse Categories
                </Link>
              </div>
            </div>

            <div className="relative flex justify-center lg:justify-end [perspective:1600px] order-1 lg:order-2">
              <div
                className={`absolute top-1/2 left-1/2 h-[260px] w-[260px] sm:h-[380px] sm:w-[380px] lg:h-[520px] lg:w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full ${heroSlides[currentSlide].circle} opacity-45 blur-3xl`}
              ></div>

              <div className="absolute right-4 top-8 hidden lg:block h-[420px] w-[420px] rounded-[3rem] bg-white/25 backdrop-blur-md rotate-6 border border-white/40"></div>

              <div className="relative z-10 w-full max-w-[330px] sm:max-w-[430px] md:max-w-[520px] lg:max-w-[640px] h-[310px] sm:h-[420px] md:h-[500px] lg:h-[650px] flex items-end justify-center">
                <img
                  key={currentSlide}
                  src={heroSlides[currentSlide].image}
                  alt="Islamic Fashion"
                  className="h-full w-full object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.22)] animate-pageFlip"
                />
              </div>

              <div className="absolute -bottom-2 sm:bottom-2 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-3 z-20 rounded-full bg-white/40 backdrop-blur-md px-3 sm:px-4 py-2.5 sm:py-3 border border-white/60">
                {heroSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-2.5 sm:h-3 rounded-full transition-all duration-500 ${currentSlide === index
                        ? `w-8 sm:w-10 ${heroSlides[currentSlide].circle}`
                        : "w-2.5 sm:w-3 bg-white/90"
                      }`}
                  ></button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* card section */}

      {categories.map((cat) => {
        const categoryProducts = products
          .filter((product) => normalize(product.category) === normalize(cat.id))
          .slice(0, 4);

        const delays = ["", "delay-100", "delay-200", "delay-300"];

        return (
          <section key={cat.id} className="container-custom mb-20">
            <AnimateOnScroll variant="fadeLeft">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-10 border-b-2 border-[#E8DDD1] pb-5 gap-3 sm:gap-0">
                <div>
                  <span className="text-[#C9A646] font-black tracking-widest uppercase text-[10px]">
                    {cat.subtitle}
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-black text-[#27211E] mt-1 tracking-tight">
                    {cat.title}
                  </h2>
                </div>
                <Link
                  to={`/products?category=${cat.id}`}
                  className="inline-flex items-center gap-2 self-start sm:self-auto px-5 py-2.5 rounded-full border-2 border-[#8A5A44] text-[#8A5A44] font-black text-[11px] uppercase tracking-widest hover:bg-[#8A5A44] hover:text-white transition-all duration-300 flex-shrink-0"
                >
                  View All {cat.id}
                  <span className="text-sm">→</span>
                </Link>
              </div>
            </AnimateOnScroll>

            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-10">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="aspect-[4/5] bg-[#F0EBE5] animate-pulse rounded-[2rem]" />
                ))}
              </div>
            ) : categoryProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-10">
                {categoryProducts.map((product, idx) => (
                  <AnimateOnScroll key={product._id} variant="fadeUp" delay={delays[idx] || ""}>
                    <ProductCard product={product} />
                  </AnimateOnScroll>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-[#F7F2EC] rounded-[2rem] border-2 border-dashed border-[#E8DDD1]">
                <p className="text-[#9B8C83] font-bold italic">
                  No Products Available in {cat.id}
                </p>
              </div>
            )}
          </section>
        );
      })}

            {/* Customer Gallery Banner */}
<CustomerGalleryBanner />

      <section className="bg-[#F7F2EC] py-16 sm:py-24 border-y border-[#E8DDD1]">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-10 lg:gap-16">
            {[
              {
                icon: <HiOutlineSparkles />,
                title: "Premium Quality",
                desc: "Every item is hand-picked and verified for authentic quality and durability.",
              },
              {
                icon: <HiOutlineTruck />,
                title: "Fast Delivery",
                desc: "Safe, fast and secure shipping to customers all over the world.",
              },
              {
                icon: <HiOutlineShieldCheck />,
                title: "Secure Shopping",
                desc: "Your transactions are protected with industry-leading security standards.",
              },
            ].map((item, i) => (
              <AnimateOnScroll key={i} variant="scaleUp" delay={["", "delay-150", "delay-300"][i]}>
                <div className="text-center group bg-white p-8 sm:p-10 flex flex-col gap-4 sm:gap-5 rounded-[2.5rem] sm:rounded-[3rem] shadow-sm hover:shadow-xl transition-all duration-500 border border-[#E8DDD1]">
                  <div className="mx-auto h-18 w-18 sm:h-20 sm:w-20 rounded-full bg-gradient-to-br from-[#F7F2EC] to-[#D8B9A5] flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                    <span className="text-3xl sm:text-4xl text-[#8A5A44] group-hover:text-[#6F4736] transition-all duration-500">
                      {item.icon}
                    </span>
                  </div>
                  <h3 className="font-black text-xl sm:text-2xl text-[#8A5A44] uppercase tracking-tighter leading-none">
                    {item.title}
                  </h3>
                  <p className="text-[#9B8C83] leading-relaxed font-medium text-sm sm:text-base">
                    {item.desc}
                  </p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>


    </div>
  );
};

export default Home;