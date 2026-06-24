import { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { AuthContext } from "../context/AuthContext";
import API from "../api/axios";
import {
  HiOutlineArrowLeft,
  HiOutlineShoppingBag,
  HiOutlineMapPin,
  HiOutlinePhone,
  HiOutlineEnvelope,
  HiOutlineUser,
  HiOutlineClock,
  HiCheckCircle,
  HiOutlineCircleStack,
} from "react-icons/hi2";

const STEPS = ["Pending", "Confirmed", "Shipped", "Delivered"];

const STEP_META = {
  Pending:   { icon: "🕐", label: "Order Placed",    desc: "We have received your order."              },
  Confirmed: { icon: "✅", label: "Order Confirmed",  desc: "Your order has been confirmed."            },
  Shipped:   { icon: "🚚", label: "Out for Delivery", desc: "Your order is on its way to you."          },
  Delivered: { icon: "🎉", label: "Delivered",        desc: "Order delivered successfully. Enjoy!"      },
};

const STATUS_STYLE = {
  Pending:   { text: "text-amber-700",   bg: "bg-amber-50   border-amber-200"  },
  Confirmed: { text: "text-blue-700",    bg: "bg-blue-50    border-blue-200"   },
  Shipped:   { text: "text-purple-700",  bg: "bg-purple-50  border-purple-200" },
  Delivered: { text: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200"},
  Cancelled: { text: "text-red-700",     bg: "bg-red-50     border-red-200"    },
};

const imgSrc = (src) => {
  if (!src) return null;
  return src.startsWith("http") || src.startsWith("/") ? src : `/${src}`;
};

export default function OrderDetail() {
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const [order, setOrder]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    API.get(`/orders/${id}`)
      .then((res) => setOrder(res.data))
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [id, token]);

  if (loading) return (
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-[3px] border-[#E8DDD1] border-t-[#8A5A44] rounded-full animate-spin mx-auto mb-4" />
        <p className="text-[#8A5A44] font-black tracking-[0.3em] uppercase text-[10px]">Loading</p>
      </div>
    </div>
  );

  if (!order) return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center px-4 pt-20">
      <HiOutlineCircleStack className="text-5xl text-[#D8B9A5] mb-4" />
      <h2 className="text-2xl font-black text-[#27211E] mb-2">Order Not Found</h2>
      <Link to="/my-orders" className="text-[#8A5A44] font-black text-sm underline mt-1">Back to My Orders</Link>
    </div>
  );

  const currentStepIdx = STEPS.indexOf(order.status);
  const isCancelled    = order.status === "Cancelled";
  const s              = STATUS_STYLE[order.status] || STATUS_STYLE.Pending;
  const delivery       = order.total >= 3000 ? 0 : 200;
  const orderDate      = new Date(order.createdAt).toLocaleDateString("en-PK", { day: "numeric", month: "long", year: "numeric" });
  const orderTime      = new Date(order.createdAt).toLocaleTimeString("en-PK", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-20 pb-16">
      <Helmet><title>Order #{order._id.slice(-8).toUpperCase()} | Noor-E-Emaan</title></Helmet>

      {/* ── Header ── */}
      <div className="bg-gradient-to-br from-[#F7F2EC] via-[#EEDFD4] to-[#E0CFC3] border-b border-[#E8DDD1]">
        <div className="container-custom py-10">
          <Link to="/my-orders" className="inline-flex items-center gap-2 text-[#8A5A44] text-xs font-black uppercase tracking-widest hover:gap-3 transition-all mb-5">
            <HiOutlineArrowLeft /> My Orders
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <p className="text-[10px] font-black tracking-[0.35em] uppercase text-[#8A5A44] mb-1">Order Details</p>
              <h1 className="text-3xl font-black text-[#27211E] tracking-tight">
                #{order._id.slice(-8).toUpperCase()}
              </h1>
              <p className="text-[#9B8C83] text-xs font-medium mt-1 flex items-center gap-1.5">
                <HiOutlineClock className="text-sm" /> {orderDate} at {orderTime}
              </p>
            </div>
            <span className={`self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border ${s.bg} ${s.text}`}>
              {order.status}
            </span>
          </div>
        </div>
      </div>

      <div className="container-custom py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* ── Left column ── */}
          <div className="lg:col-span-2 flex flex-col gap-6">

            {/* ── Status Timeline ── */}
            {!isCancelled && (
              <div className="bg-white border border-[#E8DDD1] rounded-[2rem] p-7 shadow-sm">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#8A5A44] mb-7">Order Tracking</h3>

                <div className="relative">
                  {/* connector line */}
                  <div className="absolute top-5 left-5 right-5 h-0.5 bg-[#E8DDD1] z-0" />
                  {/* progress fill */}
                  <div
                    className="absolute top-5 left-5 h-0.5 bg-[#8A5A44] z-0 transition-all duration-700"
                    style={{ width: currentStepIdx < 0 ? "0%" : `${(currentStepIdx / (STEPS.length - 1)) * 100}%` }}
                  />

                  <div className="relative z-10 flex justify-between">
                    {STEPS.map((step, i) => {
                      const done    = i <= currentStepIdx;
                      const active  = i === currentStepIdx;
                      const meta    = STEP_META[step];
                      return (
                        <div key={step} className="flex flex-col items-center gap-2 flex-1">
                          <div className={`h-10 w-10 rounded-full border-2 flex items-center justify-center text-base transition-all duration-500 ${
                            done
                              ? "bg-[#8A5A44] border-[#8A5A44] text-white shadow-[0_4px_14px_rgba(138,90,68,0.35)]"
                              : "bg-white border-[#E8DDD1] text-[#D8B9A5]"
                          } ${active ? "scale-110 shadow-[0_4px_18px_rgba(138,90,68,0.4)]" : ""}`}>
                            {done ? <HiCheckCircle className="text-xl" /> : <span>{meta.icon}</span>}
                          </div>
                          <p className={`text-[10px] font-black text-center leading-tight ${done ? "text-[#3F312B]" : "text-[#B8AAA0]"}`}>
                            {meta.label}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Current step description */}
                {currentStepIdx >= 0 && (
                  <div className="mt-7 bg-gradient-to-br from-[#F7F2EC] to-[#EEDFD4] rounded-2xl px-5 py-4 border border-[#E8DDD1]">
                    <p className="text-xs font-black text-[#27211E] mb-0.5">{STEP_META[order.status]?.label}</p>
                    <p className="text-[#6F5E55] text-xs font-medium">{STEP_META[order.status]?.desc}</p>
                  </div>
                )}
              </div>
            )}

            {/* ── Order Items ── */}
            <div className="bg-white border border-[#E8DDD1] rounded-[2rem] p-7 shadow-sm">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#8A5A44] mb-6">
                Items ({order.products.length})
              </h3>
              <div className="flex flex-col gap-4">
                {order.products.map((item, i) => {
                  const src = imgSrc(item.image);
                  return (
                    <div key={i} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-[#FAF8F5] transition-colors">
                      <div className="h-16 w-14 rounded-xl overflow-hidden bg-[#F7F2EC] border border-[#E8DDD1] flex-shrink-0">
                        {src
                          ? <img src={src} alt={item.name} className="h-full w-full object-cover object-top" />
                          : <HiOutlineShoppingBag className="text-xl text-[#D8B9A5] m-auto h-full" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-black text-[#27211E] text-sm leading-tight truncate">{item.name}</p>
                        <p className="text-[#9B8C83] text-xs font-medium mt-0.5">Qty: {item.quantity}</p>
                        <p className="text-[#8A5A44] font-black text-xs mt-0.5">Rs. {item.price?.toLocaleString()} each</p>
                      </div>
                      <p className="font-black text-[#3F312B] text-sm flex-shrink-0">
                        Rs. {(item.price * item.quantity)?.toLocaleString()}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Status History ── */}
            {order.statusHistory?.length > 0 && (
              <div className="bg-white border border-[#E8DDD1] rounded-[2rem] p-7 shadow-sm">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#8A5A44] mb-6">Activity Log</h3>
                <div className="relative flex flex-col gap-0">
                  {[...order.statusHistory].reverse().map((entry, i) => (
                    <div key={i} className="flex gap-4 pb-5 last:pb-0 relative">
                      {/* vertical line */}
                      {i < order.statusHistory.length - 1 && (
                        <div className="absolute left-[13px] top-7 bottom-0 w-0.5 bg-[#E8DDD1]" />
                      )}
                      <div className="h-7 w-7 rounded-full bg-[#8A5A44] border-2 border-[#EEDFD4] flex-shrink-0 flex items-center justify-center mt-0.5 z-10">
                        <HiCheckCircle className="text-white text-sm" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-[#27211E]">{entry.status}</p>
                        {entry.note && <p className="text-xs text-[#6F5E55] font-medium mt-0.5">{entry.note}</p>}
                        <p className="text-[10px] text-[#B8AAA0] font-medium mt-1">
                          {new Date(entry.timestamp).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" })}
                          {" · "}
                          {new Date(entry.timestamp).toLocaleTimeString("en-PK", { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Right column ── */}
          <div className="flex flex-col gap-5 lg:sticky lg:top-28">

            {/* Delivery Info */}
            <div className="bg-white border border-[#E8DDD1] rounded-[2rem] p-6 shadow-sm">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#8A5A44] mb-5">Delivery Info</h3>
              <div className="flex flex-col gap-3.5">
                <div className="flex items-start gap-3">
                  <HiOutlineUser className="text-[#8A5A44] text-lg flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] text-[#9B8C83] font-semibold uppercase tracking-widest">Name</p>
                    <p className="text-sm font-black text-[#27211E]">{order.customerInfo?.name}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <HiOutlinePhone className="text-[#8A5A44] text-lg flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] text-[#9B8C83] font-semibold uppercase tracking-widest">WhatsApp</p>
                    <p className="text-sm font-black text-[#27211E]">{order.customerInfo?.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <HiOutlineEnvelope className="text-[#8A5A44] text-lg flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] text-[#9B8C83] font-semibold uppercase tracking-widest">Email</p>
                    <p className="text-sm font-black text-[#27211E]">{order.customerInfo?.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <HiOutlineMapPin className="text-[#8A5A44] text-lg flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] text-[#9B8C83] font-semibold uppercase tracking-widest">Address</p>
                    <p className="text-sm font-black text-[#27211E]">{order.customerInfo?.address}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Price summary */}
            <div className="bg-white border border-[#E8DDD1] rounded-[2rem] p-6 shadow-sm">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#8A5A44] mb-5">Payment Summary</h3>
              <div className="flex flex-col gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#6F5E55] font-medium">Subtotal</span>
                  <span className="font-black text-[#27211E]">Rs. {(order.total - (order.total >= 3000 ? 0 : delivery)).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6F5E55] font-medium">Delivery</span>
                  <span className={`font-black ${delivery === 0 ? "text-emerald-600" : "text-[#27211E]"}`}>
                    {delivery === 0 ? "Free" : `Rs. ${delivery}`}
                  </span>
                </div>
                <div className="h-px bg-[#E8DDD1] my-1" />
                <div className="flex justify-between items-center">
                  <span className="font-black text-[#27211E] uppercase tracking-wide text-xs">Total</span>
                  <span className="text-xl font-black text-[#8A5A44]">Rs. {order.total?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#6F5E55] font-medium text-xs">Payment Method</span>
                  <span className="text-xs font-black text-[#3F312B]">Cash on Delivery</span>
                </div>
              </div>
            </div>

            <Link
              to="/my-orders"
              className="w-full flex items-center justify-center gap-2 bg-white border-2 border-[#E8DDD1] hover:border-[#8A5A44] text-[#3F312B] hover:text-[#8A5A44] font-black py-3.5 rounded-2xl transition-all duration-300 text-xs uppercase tracking-widest"
            >
              <HiOutlineArrowLeft /> Back to Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
