import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { AuthContext } from "../context/AuthContext";
import AnimateOnScroll from "../components/AnimateOnScroll";
import API from "../api/axios";
import {
  HiOutlineShoppingBag,
  HiOutlineArrowRight,
  HiOutlineLockClosed,
} from "react-icons/hi2";

const STATUS_STYLE = {
  Pending:   { dot: "bg-amber-400",    text: "text-amber-700",    bg: "bg-amber-50    border-amber-200",    label: "Pending"   },
  Confirmed: { dot: "bg-[#8A5A44]",    text: "text-[#6F4736]",    bg: "bg-[#F7F2EC]   border-[#D8B9A5]",    label: "Confirmed" },
  Shipped:   { dot: "bg-[#2D6A4F]",    text: "text-[#2D6A4F]",    bg: "bg-[#EDF5EF]   border-[#9FCDB5]",    label: "Shipped"   },
  Delivered: { dot: "bg-emerald-500",  text: "text-emerald-700",  bg: "bg-emerald-50  border-emerald-200",  label: "Delivered" },
  Cancelled: { dot: "bg-red-400",      text: "text-red-700",      bg: "bg-red-50      border-red-200",      label: "Cancelled" },
};

const imgSrc = (src) => {
  if (!src) return null;
  return src.startsWith("http") || src.startsWith("/") ? src : `/${src}`;
};

export default function MyOrders() {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchErr, setFetchErr] = useState("");

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    setFetchErr("");
    API.get("/orders/my-orders")
      .then((res) => setOrders(res.data))
      .catch((err) => {
        const msg = err.response?.data?.message || err.message || "Failed to load orders.";
        setFetchErr(msg);
      })
      .finally(() => setLoading(false));
  }, [token]);

  if (!token) return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center px-4 pt-20">
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#F7F2EC] to-[#EEDFD4] border border-[#E8DDD1] flex items-center justify-center mx-auto mb-6 shadow-md">
        <HiOutlineLockClosed className="text-3xl text-[#8A5A44]" />
      </div>
      <h2 className="text-2xl font-black text-[#27211E] mb-2">Login Required</h2>
      <p className="text-[#9B8C83] mb-7 text-sm font-medium">Sign in to view your orders.</p>
      <Link to="/login" className="bg-[#8A5A44] text-white font-black px-8 py-3.5 rounded-2xl shadow-lg hover:bg-[#6F4736] transition-all text-sm uppercase tracking-widest">
        Sign In
      </Link>
    </div>
  );

  if (loading) return (
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-[3px] border-[#E8DDD1] border-t-[#8A5A44] rounded-full animate-spin mx-auto mb-4" />
        <p className="text-[#8A5A44] font-black tracking-[0.3em] uppercase text-[10px]">Loading</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-20">
      <Helmet><title>My Orders | Noor-E-Emaan</title></Helmet>

      {/* Header */}
      <div className="bg-gradient-to-br from-[#F7F2EC] via-[#EEDFD4] to-[#E0CFC3] border-b border-[#E8DDD1]">
        <div className="container-custom py-12">
          <AnimateOnScroll variant="fadeUp">
            <span className="text-[10px] font-black tracking-[0.35em] uppercase text-[#8A5A44] block mb-3">Order History</span>
            <h1 className="text-4xl sm:text-5xl font-black text-[#27211E] tracking-tight leading-none">
              My Orders
            </h1>
            {orders.length > 0 && (
              <p className="text-[#9B8C83] font-medium mt-2 text-sm">{orders.length} order{orders.length !== 1 ? "s" : ""} placed</p>
            )}
          </AnimateOnScroll>
        </div>
      </div>

      <div className="container-custom py-10">
        {fetchErr ? (
          <AnimateOnScroll variant="scaleUp">
            <div className="text-center py-20 bg-red-50 border border-red-200 rounded-[3rem] max-w-lg mx-auto px-8">
              <div className="w-16 h-16 rounded-full bg-red-100 border border-red-200 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚠️</span>
              </div>
              <h3 className="text-lg font-black text-red-700 mb-2">Could not load orders</h3>
              <p className="text-red-500 text-sm font-medium mb-6">{fetchErr}</p>
              <button
                onClick={() => { setFetchErr(""); setLoading(true); API.get("/orders/my-orders").then(r => setOrders(r.data)).catch(e => setFetchErr(e.response?.data?.message || e.message || "Failed")).finally(() => setLoading(false)); }}
                className="inline-flex items-center gap-2 bg-[#8A5A44] hover:bg-[#6F4736] text-white font-black px-7 py-3 rounded-2xl shadow-lg transition-all text-sm uppercase tracking-widest"
              >
                Try Again
              </button>
            </div>
          </AnimateOnScroll>
        ) : orders.length === 0 ? (
          <AnimateOnScroll variant="scaleUp">
            <div className="text-center py-24 bg-gradient-to-br from-[#F7F2EC] to-[#EEDFD4] rounded-[3rem] border border-[#E8DDD1] max-w-lg mx-auto">
              <div className="w-20 h-20 rounded-full bg-white border border-[#E8DDD1] flex items-center justify-center mx-auto mb-5 shadow-md">
                <HiOutlineShoppingBag className="text-3xl text-[#D8B9A5]" />
              </div>
              <h3 className="text-lg font-black text-[#3F312B] mb-2">No orders yet</h3>
              <p className="text-[#9B8C83] text-sm font-medium mb-7 px-6">Start shopping to see your orders here.</p>
              <Link to="/products"
                className="inline-flex items-center gap-2 bg-[#8A5A44] hover:bg-[#6F4736] text-white font-black px-7 py-3 rounded-2xl shadow-lg transition-all text-sm uppercase tracking-widest">
                <HiOutlineShoppingBag /> Shop Now
              </Link>
            </div>
          </AnimateOnScroll>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map((order, idx) => {
              const s = STATUS_STYLE[order.status] || STATUS_STYLE.Pending;
              const date = new Date(order.createdAt).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" });
              const previewImgs = order.products.slice(0, 3);
              return (
                <AnimateOnScroll key={order._id} variant="fadeUp" delay={["", "delay-75", "delay-150"][idx % 3]}>
                  <div className="bg-white border border-[#E8DDD1] rounded-[1.75rem] p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                      {/* Left — images + info */}
                      <div className="flex items-center gap-4">
                        {/* Product images strip */}
                        <div className="flex -space-x-3 flex-shrink-0">
                          {previewImgs.map((p, i) => {
                            const src = imgSrc(p.image);
                            return (
                              <div key={i} className="h-14 w-12 rounded-xl overflow-hidden border-2 border-white bg-[#F7F2EC] shadow-sm flex-shrink-0">
                                {src
                                  ? <img src={src} alt={p.name} className="h-full w-full object-cover object-top" />
                                  : <HiOutlineShoppingBag className="text-xl text-[#D8B9A5] m-auto h-full" />}
                              </div>
                            );
                          })}
                          {order.products.length > 3 && (
                            <div className="h-14 w-12 rounded-xl border-2 border-white bg-[#F7F2EC] flex items-center justify-center text-[10px] font-black text-[#9B8C83] shadow-sm flex-shrink-0">
                              +{order.products.length - 3}
                            </div>
                          )}
                        </div>

                        {/* Order meta */}
                        <div>
                          <p className="text-[10px] font-black text-[#9B8C83] uppercase tracking-widest mb-0.5">
                            Order ID
                          </p>
                          <p className="font-black text-[#27211E] text-sm">
                            #{order._id.slice(-8).toUpperCase()}
                          </p>
                          <p className="text-[11px] text-[#9B8C83] font-medium mt-0.5">{date} · {order.products.length} item{order.products.length !== 1 ? "s" : ""}</p>
                        </div>
                      </div>

                      {/* Right — status + total + button */}
                      <div className="flex flex-col sm:items-end gap-2.5 sm:gap-3">
                        {/* Status badge */}
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] border ${s.bg} ${s.text}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${s.dot} ${order.status !== "Delivered" && order.status !== "Cancelled" ? "animate-pulse" : ""}`} />
                          {s.label}
                        </span>

                        <p className="text-xl font-black text-[#8A5A44]">Rs. {order.total?.toLocaleString()}</p>

                        <Link
                          to={`/my-orders/${order._id}`}
                          className="flex items-center gap-1.5 text-[11px] font-black text-[#8A5A44] uppercase tracking-widest hover:gap-2.5 transition-all duration-200 group"
                        >
                          View Details <HiOutlineArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </AnimateOnScroll>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
