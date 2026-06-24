import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import API from "../api/axios";
import {
  HiHeart,
  HiOutlineHeart,
  HiOutlineEye,
  HiOutlineShoppingBag,
  HiOutlineStar,
} from "react-icons/hi2";

function getOptimizedImage(url, width = 500) {
  if (!url) return 'https://placehold.co/400x500?text=No+Image';
  if (url.includes('res.cloudinary.com')) {
    return url.replace('/upload/', `/upload/f_auto,q_auto,w_${width}/`);
  }
  if (url.startsWith('http') || url.startsWith('/')) return url;
  return `/${url}`;
}

export default function ProductCard({ product }) {
  const { user, token } = useContext(AuthContext);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(product.likes?.length || 0);

  useEffect(() => {
    if (user && product.likes) {
      setIsLiked(product.likes.includes(user._id));
    }
  }, [user, product.likes]);

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!token) {
      showToast("Please log in to like products.", "info");
      navigate("/login");
      return;
    }
    try {
      const res = await API.post(`/products/${product._id}/like`);
      setIsLiked(res.data.isLiked);
      setLikesCount(res.data.likes);
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  const imageSrc = getOptimizedImage(product.images?.[0]);
  const finalPrice = product.discountPrice || product.price;
  const discountPercent =
    product.discountPrice && product.price
      ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
      : null;

  return (
    <Link
      to={`/products/${product._id}`}
      className="group relative flex flex-col overflow-hidden rounded-[2.2rem] bg-white/75 backdrop-blur-xl border border-[#E8DDD1] shadow-[0_20px_55px_rgba(63,49,43,0.10)] transition-all duration-700 hover:-translate-y-3 hover:shadow-[0_35px_90px_rgba(63,49,43,0.18)]"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#FFFDF9] via-[#F7F2EC] to-[#EEDFD4] opacity-80" />
      <div className="absolute -top-24 -right-24 h-56 w-56 rounded-full bg-[#D8B9A5]/35 blur-3xl transition-all duration-700 group-hover:scale-125" />

      {/* Image — fixed aspect ratio, always same height */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-b-[2rem] bg-gradient-to-br from-[#F7F2EC] to-[#E8DDD1] m-3 flex-shrink-0">
        <img
          src={imageSrc}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover object-top transition-all duration-1000 group-hover:scale-110"
          onError={(e) => { e.target.src = "https://placehold.co/400x500?text=Coming+Soon"; }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700" />

        <button
          onClick={handleLike}
          className={`absolute top-3 right-3 h-10 w-10 rounded-full backdrop-blur-xl flex items-center justify-center transition-all duration-300 z-20 border shadow-lg ${
            isLiked
              ? "bg-[#8A5A44] text-white border-[#8A5A44]"
              : "bg-white/80 text-[#8A5A44] border-white/80 hover:bg-[#8A5A44] hover:text-white"
          }`}
        >
          {isLiked ? <HiHeart className="text-lg" /> : <HiOutlineHeart className="text-lg" />}
          {likesCount > 0 && (
            <span className="absolute -bottom-1 -right-1 bg-white text-[#8A5A44] text-[9px] font-black min-w-4 h-4 px-0.5 rounded-full flex items-center justify-center shadow-md">
              {likesCount}
            </span>
          )}
        </button>

        {discountPercent && (
          <div className="absolute top-3 left-3 bg-[#8A5A44] text-white px-3 py-1.5 rounded-full font-black text-[9px] uppercase tracking-widest shadow-lg z-20">
            {discountPercent}% OFF
          </div>
        )}

        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px] flex items-center justify-center z-30">
            <span className="text-white font-black bg-red-600 px-4 py-2 rounded-full text-[9px] uppercase tracking-widest shadow-xl">
              Out of Stock
            </span>
          </div>
        )}

        <div className="absolute left-3 right-3 bottom-3 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
          <div className="flex items-center justify-between rounded-full bg-white/85 backdrop-blur-xl border border-white/80 px-3 py-2.5 shadow-xl">
            <span className="flex items-center gap-1.5 text-[#3F312B] font-black text-[10px] uppercase tracking-widest">
              <HiOutlineEye className="text-base" /> Quick View
            </span>
            <span className="h-8 w-8 rounded-full bg-[#8A5A44] text-white flex items-center justify-center">
              <HiOutlineShoppingBag className="text-base" />
            </span>
          </div>
        </div>
      </div>

      {/* Info — fixed height so all cards align */}
      <div className="relative z-10 p-4 pt-2 flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex px-2.5 py-1 rounded-full bg-[#F7F2EC] text-[#8A5A44] text-[9px] font-black uppercase tracking-[0.15em]">
            {product.category}
          </span>
          <span className="flex items-center gap-0.5 text-[#C9A646] text-[10px] font-black">
            <HiOutlineStar className="text-sm fill-[#C9A646]" /> 4.8
          </span>
        </div>

        <h2 className="font-black text-base text-[#3F312B] line-clamp-1 group-hover:text-[#8A5A44] transition-colors leading-tight">
          {product.name}
        </h2>

        <div className="flex justify-between items-end mt-0.5">
          <div>
            <p className="text-[#8A5A44] font-black text-lg leading-none">
              Rs. {finalPrice}
            </p>
            {product.discountPrice && (
              <p className="text-[10px] text-[#B8AAA0] line-through mt-0.5 font-bold">
                Rs. {product.price}
              </p>
            )}
          </div>
          <span className="inline-flex items-center gap-1 text-[9px] font-black text-[#3F312B] uppercase tracking-widest group-hover:text-[#8A5A44] transition-all">
            View <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
