import React, { useEffect, useState, useContext } from "react";
import { Helmet } from "react-helmet-async";
import { useParams, Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import ProductCard from "../components/ProductCard";
import ImageMagnifier from "../components/ImageMagnifier";
import CustomerGalleryBanner from "../components/CustomerGalleryBanner";
import {
  HiHeart, HiOutlineHeart,
  HiBookmark, HiOutlineBookmark,
  HiOutlineShoppingBag, HiOutlineBolt,
  HiOutlineStar, HiStar,
  HiOutlineCheckCircle, HiOutlineTruck,
  HiOutlineShieldCheck, HiOutlineSparkles,
  HiOutlineArrowLeft, HiOutlineUser,
  HiOutlineChatBubbleLeftRight, HiOutlineTag,
} from "react-icons/hi2";

const img = (src) => {
  if (!src) return "https://placehold.co/800x1000?text=No+Image";
  return src.startsWith("http") || src.startsWith("/") ? src : `/${src}`;
};

const StarPicker = ({ value, onChange }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((s) => (
      <button key={s} type="button" onClick={() => onChange(s)}
        className="text-2xl transition-transform hover:scale-110">
        {s <= value
          ? <HiStar className="text-[#C9A646]" />
          : <HiOutlineStar className="text-[#D8B9A5]" />}
      </button>
    ))}
  </div>
);

const avgRating = (reviews) => {
  if (!reviews?.length) return 0;
  return (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);
};

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, setUser, token } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const { showToast } = useToast();

  const [product, setProduct]           = useState(null);
  const [loading, setLoading]           = useState(true);
  const [mainImage, setMainImage]       = useState("");
  const [imageKey, setImageKey]         = useState(0);
  const [quantity, setQuantity]         = useState(1);
  const [selectedSize, setSelectedSize]   = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [related, setRelated]           = useState([]);
  const [isLiked, setIsLiked]           = useState(false);
  const [likesCount, setLikesCount]     = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [visible, setVisible]           = useState(false);

  const [reviews, setReviews]           = useState([]);
  const [reviewForm, setReviewForm]     = useState({ name: "", rating: 5, comment: "" });
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError]   = useState("");

  // Lightbox
  const [lightbox, setLightbox] = useState({ open: false, index: 0 });
  const openLightbox  = (i) => setLightbox({ open: true, index: i });
  const closeLightbox = () => setLightbox({ open: false, index: 0 });
  const lbPrev = () => setLightbox(l => ({ ...l, index: (l.index - 1 + (product?.images?.length || 1)) % (product?.images?.length || 1) }));
  const lbNext = () => setLightbox(l => ({ ...l, index: (l.index + 1) % (product?.images?.length || 1) }));


  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    setVisible(false);
    setProduct(null);
    API.get(`/products/${id}`)
      .then((res) => {
        const d = res.data;
        setProduct(d);
        setMainImage(d.images?.[0] || "");
        setSelectedSize(d.sizes?.[0] || "");
        setSelectedColor(d.colors?.[0] || "");
        setLikesCount(d.likes?.length || 0);
        setReviews(d.reviews || []);
        setTimeout(() => setVisible(true), 50);
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!product?.category) return;
    API.get(`/products?category=${product.category}&limit=5`)
      .then((res) =>
        setRelated(res.data.products.filter((p) => p._id !== product._id).slice(0, 4))
      )
      .catch(() => setRelated([]));
  }, [product]);

  useEffect(() => {
    if (user && product) {
      setIsLiked(product.likes?.includes(user._id) || false);
      setIsWishlisted(
        user.wishlist?.some((item) => (item._id || item) === product._id) || false
      );
    }
  }, [user, product]);

  const switchImage = (newImg) => {
    setMainImage(newImg);
    setImageKey((k) => k + 1);
  };

  const handleLike = async () => {
    if (!token) return navigate("/login");
    try {
      const res = await API.post(`/products/${product._id}/like`);
      setIsLiked(res.data.isLiked);
      setLikesCount(res.data.likes);
    } catch {}
  };

  const handleWishlist = async () => {
    if (!token) return navigate("/login");
    try {
      const res = await API.post(`/auth/wishlist/${product._id}`);
      setIsWishlisted(res.data.isWishlisted);
      showToast(res.data.isWishlisted ? "Added to wishlist!" : "Removed from wishlist.", "info");
      const fresh = await API.get("/auth/profile");
      setUser(fresh.data);
      localStorage.setItem("user", JSON.stringify(fresh.data));
    } catch {
      showToast("Failed to update wishlist.", "error");
    }
  };

  const handleAddToCart = () => {
    addToCart({ ...product, quantity, selectedSize, selectedColor });
    showToast(`${product.name} added to cart!`, "success");
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError("");
    if (!reviewForm.name.trim() || !reviewForm.comment.trim()) {
      setReviewError("Please fill in all fields.");
      return;
    }
    setReviewLoading(true);
    try {
      const res = await API.post(`/products/${product._id}/review`, reviewForm);
      setReviews(res.data.reviews);
      setReviewForm({ name: "", rating: 5, comment: "" });
      showToast("Review submitted! Shukriya.", "success");
    } catch (err) {
      setReviewError(err.response?.data?.message || "Failed to submit review.");
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-[3px] border-[#E8DDD1] border-t-[#8A5A44] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#8A5A44] font-black tracking-[0.3em] uppercase text-[10px]">Loading</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center px-4">
        <span className="text-6xl mb-6">🛍️</span>
        <h2 className="text-3xl font-black text-[#3F312B] mb-4">Product Not Found</h2>
        <Link to="/products" className="bg-[#8A5A44] text-white px-8 py-3.5 rounded-full font-black text-sm uppercase tracking-widest">
          Back to Products
        </Link>
      </div>
    );
  }

  const discountPercent = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0;
  const finalPrice = product.discountPrice || product.price;
  const sizes      = product.sizes?.length ? product.sizes : [];
  const colors     = product.colors?.length ? product.colors : [];
  const avg        = avgRating(reviews);

  return (
    <div className={`min-h-screen bg-[#FAF8F5] pt-20 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
      <Helmet>
        <title>{product.name} | Noor-E-Emaan</title>
        <meta name="description" content={product.description?.slice(0, 160)} />
        <meta property="og:title" content={`${product.name} | Noor-E-Emaan`} />
        <meta property="og:image" content={product.images?.[0]} />
        <meta property="og:type" content="product" />
      </Helmet>

      {/* ── Breadcrumb ── */}
      <div className="bg-white/90 backdrop-blur-md border-b border-[#E8DDD1] py-3 sticky top-20 z-30 shadow-sm">
        <div className="container-custom flex items-center justify-between">
          <nav className="flex items-center gap-2 text-[11px] font-semibold text-[#B8AAA0] overflow-x-auto">
            <Link to="/" className="hover:text-[#8A5A44] transition-colors whitespace-nowrap">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-[#8A5A44] transition-colors whitespace-nowrap">Products</Link>
            <span>/</span>
            <Link to={`/categories?category=${product.category}`} className="hover:text-[#8A5A44] transition-colors whitespace-nowrap">
              {product.category}
            </Link>
            <span>/</span>
            <span className="text-[#3F312B] truncate max-w-[160px]">{product.name}</span>
          </nav>
          <button onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.15em] text-[#8A5A44] hover:text-[#6F4736] transition-colors ml-4 whitespace-nowrap flex-shrink-0">
            <HiOutlineArrowLeft /> Back
          </button>
        </div>
      </div>

      {/* ── MAIN PRODUCT SECTION ── */}
      <div className="container-custom py-10 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-14 items-start">

          {/* LEFT — Images */}
          <div className="flex flex-col gap-4 animate-slideInLeft">
            <div className="flex gap-3 items-start">

              {/* Vertical thumbnails on md+ — current product images + related products */}
              <div className="hidden md:flex flex-col gap-2 flex-shrink-0 max-h-[600px] overflow-y-auto pr-1 scrollbar-thin">

                {/* Current product images */}
                {product.images?.map((im, i) => (
                  <button key={`img-${i}`}
                    onClick={() => switchImage(im)}
                    className={`relative h-[72px] w-[56px] rounded-2xl overflow-hidden flex-shrink-0 transition-all duration-300 ${
                      mainImage === im
                        ? "ring-2 ring-[#8A5A44] ring-offset-2 shadow-lg scale-105"
                        : "opacity-55 hover:opacity-90 hover:scale-105"
                    }`}>
                    <img src={img(im)} alt="" className="h-full w-full object-cover object-top" />
                  </button>
                ))}

                {/* Divider + related products */}
                {related.length > 0 && (
                  <>
                    <div className="flex flex-col items-center gap-1 py-1">
                      <div className="w-px h-3 bg-[#D8B9A5]" />
                      <span className="text-[8px] font-black text-[#9B8C83] uppercase tracking-widest">More</span>
                      <div className="w-px h-3 bg-[#D8B9A5]" />
                    </div>
                    {related.map((p) => (
                      <button key={`rel-${p._id}`}
                        onClick={() => navigate(`/products/${p._id}`)}
                        title={p.name}
                        className="relative h-[72px] w-[56px] rounded-2xl overflow-hidden flex-shrink-0 transition-all duration-300 group opacity-60 hover:opacity-100 hover:scale-105 hover:ring-2 hover:ring-[#C9A646] hover:ring-offset-2">
                        <img src={img(p.images?.[0])} alt={p.name} className="h-full w-full object-cover object-top" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end justify-center pb-1">
                          <span className="text-white text-[7px] font-black text-center leading-tight px-0.5 line-clamp-2">{p.name}</span>
                        </div>
                      </button>
                    ))}
                  </>
                )}
              </div>

              {/* Main image with magnifier */}
              <div className="relative flex-1 rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(63,49,43,0.12)] min-w-0"
                style={{ aspectRatio: "3/4" }}>
                <div
                  className="w-full h-full cursor-zoom-in"
                  onClick={() => openLightbox(product.images?.indexOf(mainImage) ?? 0)}
                >
                  <ImageMagnifier
                    key={imageKey}
                    src={img(mainImage)}
                    magnifierSize={220}
                    zoomLevel={2.5}
                    imgClassName="w-full h-full object-cover object-top animate-fadeIn"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none z-10" />

                {/* Badges top-left */}
                <div className="absolute top-4 left-4 flex flex-col gap-2 z-20 pointer-events-none">
                  {discountPercent > 0 && (
                    <span className="bg-[#8A5A44] text-white px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase shadow-lg">
                      {discountPercent}% OFF
                    </span>
                  )}
                  {product.stock <= 0 && (
                    <span className="bg-red-500 text-white px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase shadow-lg">
                      Sold Out
                    </span>
                  )}
                  {product.stock > 0 && product.stock <= 5 && (
                    <span className="bg-amber-500 text-white px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase shadow-lg">
                      Only {product.stock} Left!
                    </span>
                  )}
                </div>

                {/* Like / Wishlist top-right */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
                  <button onClick={handleLike}
                    className={`h-10 w-10 rounded-full border-2 shadow-lg flex items-center justify-center transition-all duration-300 backdrop-blur-md ${
                      isLiked ? "bg-[#8A5A44] border-[#8A5A44] text-white scale-110"
                             : "bg-white/70 border-white/80 text-[#8A5A44] hover:bg-[#8A5A44] hover:text-white hover:border-[#8A5A44]"
                    }`}>
                    {isLiked ? <HiHeart className="text-lg" /> : <HiOutlineHeart className="text-lg" />}
                  </button>
                  <button onClick={handleWishlist}
                    className={`h-10 w-10 rounded-full border-2 shadow-lg flex items-center justify-center transition-all duration-300 backdrop-blur-md ${
                      isWishlisted ? "bg-[#8A5A44] border-[#8A5A44] text-white scale-110"
                                   : "bg-white/70 border-white/80 text-[#8A5A44] hover:bg-[#8A5A44] hover:text-white hover:border-[#8A5A44]"
                    }`}>
                    {isWishlisted ? <HiBookmark className="text-lg" /> : <HiOutlineBookmark className="text-lg" />}
                  </button>
                </div>

                {/* Rating pill bottom-left */}
                {reviews.length > 0 && (
                  <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 bg-white/80 backdrop-blur-md border border-white/60 rounded-full px-3 py-1.5 shadow-lg pointer-events-none">
                    <HiStar className="text-[#C9A646] text-sm" />
                    <span className="text-xs font-black text-[#3F312B]">{avg}</span>
                    <span className="text-[10px] text-[#9B8C83] font-medium">({reviews.length})</span>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile thumbnails horizontal strip — current product images + related */}
            <div className="flex md:hidden gap-2.5 overflow-x-auto pb-1">
              {product.images?.map((im, i) => (
                <button key={`m-img-${i}`}
                  onClick={() => switchImage(im)}
                  className={`relative h-20 w-16 rounded-xl overflow-hidden flex-shrink-0 transition-all duration-300 ${
                    mainImage === im ? "ring-2 ring-[#8A5A44] ring-offset-1 shadow-md scale-105" : "opacity-55 hover:opacity-90"
                  }`}>
                  <img src={img(im)} alt="" className="h-full w-full object-cover object-top" />
                </button>
              ))}
              {related.length > 0 && (
                <>
                  <div className="flex items-center px-1">
                    <div className="h-full w-px bg-[#D8B9A5]" />
                  </div>
                  {related.map((p) => (
                    <button key={`m-rel-${p._id}`}
                      onClick={() => navigate(`/products/${p._id}`)}
                      title={p.name}
                      className="relative h-20 w-16 rounded-xl overflow-hidden flex-shrink-0 transition-all duration-300 group opacity-55 hover:opacity-100 hover:ring-2 hover:ring-[#C9A646] hover:ring-offset-1">
                      <img src={img(p.images?.[0])} alt={p.name} className="h-full w-full object-cover object-top" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end justify-center pb-1">
                        <span className="text-white text-[7px] font-black text-center leading-tight px-0.5 line-clamp-2">{p.name}</span>
                      </div>
                    </button>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* RIGHT — Product info */}
          <div className="flex flex-col animate-slideInRight">

            {/* Category + stars */}
            <div className="flex items-center justify-between mb-3">
              <Link to={`/categories?category=${product.category}`}
                className="text-[11px] font-black uppercase tracking-[0.3em] text-[#8A5A44] hover:text-[#6F4736] transition-colors">
                {product.category}
              </Link>
              {reviews.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(s => (
                      <HiStar key={s} className={`text-sm ${s <= Math.round(avg) ? "text-[#C9A646]" : "text-[#E8DDD1]"}`} />
                    ))}
                  </div>
                  <span className="text-xs text-[#9B8C83] font-semibold">{avg} ({reviews.length})</span>
                </div>
              )}
            </div>

            {/* Name */}
            <h1 className="text-3xl sm:text-4xl xl:text-[42px] font-black text-[#27211E] tracking-tight leading-[1.05] mb-5">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-5">
              <span className="text-3xl font-black text-[#8A5A44]">Rs. {finalPrice.toLocaleString()}</span>
              {product.discountPrice && (
                <>
                  <span className="text-lg text-[#B8AAA0] line-through font-semibold">Rs. {product.price.toLocaleString()}</span>
                  <span className="text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                    Save {discountPercent}%
                  </span>
                </>
              )}
            </div>

            <div className="h-px bg-[#E8DDD1] mb-5" />

            {/* Description */}
            <p className="text-[#6F5E55] leading-relaxed text-[15px] mb-6">{product.description}</p>

            <div className="h-px bg-[#E8DDD1] mb-6" />

            {/* Color selector — swatches */}
            {colors.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-black uppercase tracking-[0.25em] text-[#3F312B]">Color</span>
                  <span className="text-[11px] text-[#8A5A44] font-bold capitalize">{selectedColor}</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {colors.map((c) => {
                    const cssColor = {
                      black: "#1a1a1a", white: "#f5f5f5", red: "#c0392b",
                      blue: "#2563eb", "navy blue": "#1e3a5f", navy: "#1e3a5f",
                      green: "#16a34a", "dark green": "#14532d",
                      brown: "#7c3d12", "dark brown": "#3b1a08",
                      maroon: "#7f1d1d", pink: "#f9a8d4", purple: "#7c3aed",
                      grey: "#6b7280", gray: "#6b7280", beige: "#d4b896",
                      cream: "#f5f0e8", camel: "#c19a6b", gold: "#c9a646",
                      olive: "#6b6b2a", orange: "#ea580c", yellow: "#eab308",
                      "light blue": "#93c5fd", teal: "#0d9488",
                    }[c.toLowerCase()] || "#9B8C83";
                    const isSelected = selectedColor === c;
                    return (
                      <button
                        key={c}
                        title={c}
                        onClick={() => setSelectedColor(c)}
                        className={`relative h-9 w-9 rounded-full transition-all duration-200 hover:scale-110 focus:outline-none ${
                          isSelected ? "ring-2 ring-[#8A5A44] ring-offset-2 scale-110 shadow-lg" : "ring-1 ring-[#E8DDD1] hover:ring-[#8A5A44]"
                        }`}
                        style={{ backgroundColor: cssColor }}
                      >
                        {isSelected && (
                          <span className="absolute inset-0 flex items-center justify-center">
                            <HiOutlineCheckCircle className={`text-base ${cssColor === "#f5f5f5" || cssColor === "#f5f0e8" || cssColor === "#d4b896" ? "text-[#3F312B]" : "text-white"}`} />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Size selector */}
            {sizes.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[11px] font-black uppercase tracking-[0.25em] text-[#3F312B]">Size</span>
                  <span className="text-[11px] text-[#8A5A44] font-bold">{selectedSize}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((s) => (
                    <button key={s} onClick={() => setSelectedSize(s)}
                      className={`min-w-[44px] h-10 px-3 rounded-xl text-xs font-black border transition-all duration-200 ${
                        selectedSize === s
                          ? "bg-[#8A5A44] text-white border-[#8A5A44] shadow-md scale-105"
                          : "bg-white text-[#6F5E55] border-[#E8DDD1] hover:border-[#8A5A44]"
                      }`}>{s}</button>
                  ))}
                </div>
              </div>
            )}

            {/* Qty + stock status */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center bg-white border border-[#E8DDD1] rounded-2xl overflow-hidden shadow-sm">
                <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="h-11 w-11 text-[#3F312B] hover:bg-[#F7F2EC] font-black text-xl transition-colors">−</button>
                <span className="w-12 text-center font-black text-[#27211E] text-base border-x border-[#E8DDD1]">{quantity}</span>
                <button onClick={() => setQuantity((q) => Math.min(product.stock || 99, q + 1))}
                  className="h-11 w-11 text-[#3F312B] hover:bg-[#F7F2EC] font-black text-xl transition-colors">+</button>
              </div>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border ${
                product.stock > 0 ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-600 border-red-200"
              }`}>
                <span className={`h-1.5 w-1.5 rounded-full ${product.stock > 0 ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`} />
                {product.stock > 0 ? `${product.stock} in stock` : "Sold Out"}
              </div>
            </div>

            {/* CTA buttons — full width, light theme */}
            <div className="flex flex-col gap-3 mb-5">
              <button onClick={handleAddToCart} disabled={product.stock <= 0}
                className="btn-shimmer w-full flex items-center justify-center gap-2.5 bg-white border-2 border-[#8A5A44] text-[#8A5A44] hover:bg-[#8A5A44] hover:text-white font-black py-4 rounded-2xl text-sm uppercase tracking-[0.15em] transition-all duration-500 shadow-[0_4px_20px_rgba(138,90,68,0.12)] hover:shadow-[0_10px_35px_rgba(138,90,68,0.3)] hover:-translate-y-1 active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed disabled:animate-none">
                <HiOutlineShoppingBag className="text-lg flex-shrink-0" /> Add to Cart
              </button>
              <button onClick={() => { handleAddToCart(); navigate("/checkout"); }} disabled={product.stock <= 0}
                className="btn-shimmer btn-glow w-full flex items-center justify-center gap-2.5 bg-[#C9A646] hover:bg-[#b8943d] text-white font-black py-4 rounded-2xl text-sm uppercase tracking-[0.15em] transition-all duration-500 hover:-translate-y-1 active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed disabled:animate-none">
                <HiOutlineBolt className="text-lg flex-shrink-0" /> Buy Now
              </button>
            </div>

            {/* Likes count */}
            <div className="flex items-center gap-2 text-[#9B8C83] text-xs font-semibold mb-6">
              <HiHeart className="text-[#8A5A44]" /> {likesCount} people liked this
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 pt-5 border-t border-[#E8DDD1]">
              {[
                { icon: <HiOutlineTruck />, title: "Fast Delivery", sub: "2–5 days" },
                { icon: <HiOutlineShieldCheck />, title: "Authentic", sub: "100% verified" },
                { icon: <HiOutlineCheckCircle />, title: "Easy Return", sub: "7-day policy" },
              ].map((b) => (
                <div key={b.title} className="flex flex-col items-center text-center gap-1.5 bg-gradient-to-br from-[#F7F2EC] to-[#EEDFD4] rounded-2xl p-3 border border-[#E8DDD1]">
                  <span className="text-[#8A5A44] text-xl">{b.icon}</span>
                  <p className="text-[10px] font-black text-[#3F312B] uppercase tracking-wide leading-none">{b.title}</p>
                  <p className="text-[10px] text-[#9B8C83] font-medium">{b.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── REVIEWS SECTION ── */}
        <div className="mt-20 pt-14 border-t border-[#E8DDD1]">
          <div className="text-center mb-12">
            <span className="text-[10px] font-black uppercase tracking-[0.35em] text-[#8A5A44] block mb-3">
              Customer Reviews
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#27211E] tracking-tight">
              {reviews.length > 0 ? `${reviews.length} Review${reviews.length !== 1 ? "s" : ""}` : "Be the First to Review"}
            </h2>
          </div>

          <div className="flex flex-col lg:flex-row gap-12">

            {/* Left — rating summary + review cards */}
            <div className="flex-1 min-w-0">

              {/* Average rating + bars */}
              {reviews.length > 0 && (
                <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-center bg-gradient-to-br from-[#F7F2EC] to-[#EEDFD4] border border-[#E8DDD1] rounded-3xl p-7 mb-8">
                  <div className="text-center flex-shrink-0">
                    <p className="text-6xl font-black text-[#8A5A44] leading-none">{avg}</p>
                    <div className="flex gap-0.5 justify-center my-2">
                      {[1,2,3,4,5].map(s => (
                        <HiStar key={s} className={`text-xl ${s <= Math.round(avg) ? "text-[#C9A646]" : "text-[#E8DDD1]"}`} />
                      ))}
                    </div>
                    <p className="text-[11px] text-[#9B8C83] font-semibold">out of 5 · {reviews.length} review{reviews.length !== 1 ? "s" : ""}</p>
                  </div>

                  <div className="flex-1 w-full flex flex-col gap-2">
                    {[5,4,3,2,1].map((star) => {
                      const count = reviews.filter(r => r.rating === star).length;
                      const pct   = reviews.length ? Math.round((count / reviews.length) * 100) : 0;
                      return (
                        <div key={star} className="flex items-center gap-3">
                          <span className="text-xs font-black text-[#6F5E55] w-4 text-right">{star}</span>
                          <HiStar className="text-[#C9A646] text-sm flex-shrink-0" />
                          <div className="flex-1 h-2.5 bg-white rounded-full overflow-hidden">
                            <div className="h-full bg-[#C9A646] rounded-full transition-all duration-700"
                              style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs text-[#9B8C83] font-semibold w-6 text-right">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Review list */}
              {reviews.length === 0 ? (
                <div className="text-center py-16 bg-gradient-to-br from-[#F7F2EC] to-[#EEDFD4] rounded-3xl border border-[#E8DDD1]">
                  <HiOutlineChatBubbleLeftRight className="text-4xl text-[#D8B9A5] mx-auto mb-4" />
                  <p className="text-[#9B8C83] font-semibold text-sm">No reviews yet — share your experience!</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {[...reviews].reverse().map((r, i) => (
                    <div key={i} className="bg-white border border-[#E8DDD1] rounded-2xl p-5 hover:shadow-md transition-shadow duration-300">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#F7F2EC] to-[#EEDFD4] border border-[#E8DDD1] flex items-center justify-center flex-shrink-0">
                            <HiOutlineUser className="text-[#8A5A44] text-base" />
                          </div>
                          <div>
                            <p className="font-black text-[#3F312B] text-sm">{r.name}</p>
                            <p className="text-[10px] text-[#B8AAA0] font-medium">
                              {new Date(r.createdAt).toLocaleDateString("en-PK", { year: "numeric", month: "short", day: "numeric" })}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-0.5 flex-shrink-0">
                          {[1,2,3,4,5].map(s => (
                            <HiStar key={s} className={`text-sm ${s <= r.rating ? "text-[#C9A646]" : "text-[#E8DDD1]"}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-[#6F5E55] text-sm font-medium leading-relaxed">{r.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right — write review form */}
            <div className="w-full lg:w-96 flex-shrink-0">
              <div className="bg-gradient-to-br from-[#F7F2EC] to-[#EEDFD4] border border-[#E8DDD1] rounded-3xl p-7 sticky top-28">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#8A5A44] block mb-2">Share Your Experience</span>
                <h3 className="text-xl font-black text-[#27211E] tracking-tight mb-6">Write a Review</h3>

                {reviewError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl font-medium">
                    {reviewError}
                  </div>
                )}

                <form onSubmit={handleReviewSubmit} className="flex flex-col gap-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#3F312B] mb-2">Your Name</label>
                    <input
                      type="text"
                      value={reviewForm.name}
                      onChange={e => setReviewForm({ ...reviewForm, name: e.target.value })}
                      placeholder="e.g. Ahmed Khan"
                      required
                      className="w-full bg-white border border-[#E8DDD1] rounded-xl px-4 py-3 text-[#27211E] placeholder:text-[#B8AAA0] text-sm font-medium outline-none focus:border-[#8A5A44] focus:ring-2 focus:ring-[#8A5A44]/10 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#3F312B] mb-2">Your Rating</label>
                    <StarPicker value={reviewForm.rating} onChange={(r) => setReviewForm({ ...reviewForm, rating: r })} />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#3F312B] mb-2">Your Review</label>
                    <textarea
                      value={reviewForm.comment}
                      onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })}
                      placeholder="Share your honest experience with this product..."
                      required
                      rows={4}
                      className="w-full bg-white border border-[#E8DDD1] rounded-xl px-4 py-3 text-[#27211E] placeholder:text-[#B8AAA0] text-sm font-medium outline-none focus:border-[#8A5A44] focus:ring-2 focus:ring-[#8A5A44]/10 transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={reviewLoading}
                    className="w-full bg-[#8A5A44] hover:bg-[#6F4736] text-white font-black py-3.5 rounded-xl transition-all duration-300 shadow-[0_8px_20px_rgba(138,90,68,0.25)] hover:shadow-[0_12px_30px_rgba(138,90,68,0.35)] hover:-translate-y-0.5 disabled:opacity-50 disabled:translate-y-0 text-sm uppercase tracking-[0.15em]"
                  >
                    {reviewLoading ? "Submitting..." : "Submit Review"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── LIGHTBOX MODAL ── */}
      {lightbox.open && product?.images?.length > 0 && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center animate-lbFadeIn"
          style={{ backgroundColor: "rgba(15,10,8,0.92)" }}
          onClick={closeLightbox}
        >
          {/* Image */}
          <div
            className="relative max-w-[92vw] max-h-[90vh] animate-lbScaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={img(product.images[lightbox.index])}
              alt={product.name}
              className="max-w-[90vw] max-h-[85vh] object-contain rounded-3xl shadow-[0_40px_100px_rgba(0,0,0,0.6)]"
            />

            {/* Counter */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-md text-white text-xs font-black px-4 py-1.5 rounded-full">
              {lightbox.index + 1} / {product.images.length}
            </div>

            {/* Close */}
            <button
              onClick={closeLightbox}
              className="absolute -top-4 -right-4 h-10 w-10 rounded-full bg-white/90 text-[#3F312B] flex items-center justify-center font-black text-lg shadow-xl hover:bg-white hover:scale-110 transition-all"
            >✕</button>

            {/* Prev / Next */}
            {product.images.length > 1 && (
              <>
                <button
                  onClick={lbPrev}
                  className="absolute left-[-52px] top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md text-white flex items-center justify-center text-xl font-black transition-all hover:scale-110"
                >‹</button>
                <button
                  onClick={lbNext}
                  className="absolute right-[-52px] top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md text-white flex items-center justify-center text-xl font-black transition-all hover:scale-110"
                >›</button>
              </>
            )}
          </div>

          {/* Thumbnail strip at bottom */}
          {product.images.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
              {product.images.map((im, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setLightbox(l => ({ ...l, index: i })); }}
                  className={`h-14 w-11 rounded-xl overflow-hidden flex-shrink-0 transition-all duration-300 ${
                    lightbox.index === i ? "ring-2 ring-[#C9A646] scale-110 opacity-100" : "opacity-50 hover:opacity-80"
                  }`}
                >
                  <img src={img(im)} alt="" className="h-full w-full object-cover object-top" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── HAPPY CUSTOMERS ── */}
      <CustomerGalleryBanner />

      {/* ── RELATED PRODUCTS ── */}
      {related.length > 0 && (
        <div className="container-custom pb-20">
          <div className="border-t border-[#E8DDD1] pt-14">
            <div className="flex items-end justify-between mb-10">
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.35em] text-[#8A5A44] block mb-2">You May Also Like</span>
                <h2 className="text-3xl font-black text-[#27211E] tracking-tight">More from {product.category}</h2>
              </div>
              <Link to={`/categories?category=${product.category}`}
                className="text-[#8A5A44] font-black text-xs uppercase tracking-[0.2em] border-b-2 border-[#C9A646] pb-1 hover:text-[#6F4736] transition-colors">
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {related.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
