import { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import {
  HiOutlineXMark,
  HiOutlineShoppingBag,
  HiOutlineTrash,
  HiOutlineArrowRight,
} from "react-icons/hi2";

const img = (src) => {
  if (!src) return "https://placehold.co/80x100?text=No+Image";
  return src.startsWith("http") || src.startsWith("/") ? src : `/${src}`;
};

export default function CartSidebar({ isOpen, onClose }) {
  const { cart, removeFromCart, updateQuantity } = useContext(CartContext);

  const subtotal = cart.reduce(
    (sum, item) => sum + (item.discountPrice || item.price) * item.quantity,
    0
  );
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[998] bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-[420px] z-[999] flex flex-col bg-[#FAF8F5] shadow-[−20px_0_80px_rgba(63,49,43,0.18)] transition-transform duration-[380ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E8DDD1] bg-gradient-to-r from-[#F7F2EC] to-[#EEDFD4] flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-[#8A5A44] flex items-center justify-center">
              <HiOutlineShoppingBag className="text-white text-base" />
            </div>
            <div>
              <h2 className="text-base font-black text-[#27211E] tracking-tight">Shopping Cart</h2>
              <p className="text-[10px] text-[#9B8C83] font-semibold uppercase tracking-widest">
                {totalItems} item{totalItems !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-9 w-9 rounded-full bg-white border border-[#E8DDD1] flex items-center justify-center text-[#6F5E55] hover:bg-[#8A5A44] hover:text-white hover:border-[#8A5A44] transition-all duration-200"
          >
            <HiOutlineXMark className="text-lg" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#F7F2EC] to-[#EEDFD4] border border-[#E8DDD1] flex items-center justify-center mb-5 shadow-sm">
                <HiOutlineShoppingBag className="text-3xl text-[#D8B9A5]" />
              </div>
              <h3 className="text-base font-black text-[#3F312B] mb-1">Your cart is empty</h3>
              <p className="text-sm text-[#9B8C83] font-medium mb-6">Add items to get started.</p>
              <button
                onClick={onClose}
                className="bg-[#8A5A44] hover:bg-[#6F4736] text-white font-black text-xs uppercase tracking-[0.15em] px-6 py-3 rounded-xl transition-all duration-200 shadow-md"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            cart.map((item) => {
              const price = item.discountPrice || item.price || 0;
              return (
                <div
                  key={item._id}
                  className="flex gap-3 bg-white rounded-2xl p-3 border border-[#E8DDD1] shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  {/* Image */}
                  <div className="h-20 w-16 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-[#F7F2EC] to-[#E8DDD1]">
                    <img
                      src={img(item.images?.[0])}
                      alt={item.name}
                      className="h-full w-full object-cover object-top"
                      onError={(e) => { e.target.src = "https://placehold.co/80x100?text=No+Image"; }}
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <p className="font-black text-[#27211E] text-sm line-clamp-1 leading-tight">{item.name}</p>
                      {(item.selectedColor || item.selectedSize) && (
                        <p className="text-[10px] text-[#9B8C83] font-medium mt-0.5">
                          {item.selectedColor && <span>{item.selectedColor}</span>}
                          {item.selectedColor && item.selectedSize && <span> · </span>}
                          {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                        </p>
                      )}
                      <p className="text-[#8A5A44] font-black text-sm mt-1">Rs. {price.toLocaleString()}</p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {/* Qty controls */}
                      <div className="flex items-center bg-[#F7F2EC] rounded-xl overflow-hidden border border-[#E8DDD1]">
                        <button
                          onClick={() => updateQuantity(item._id, -1)}
                          className="h-7 w-7 flex items-center justify-center text-[#3F312B] hover:bg-[#E8DDD1] transition-colors text-sm font-black"
                        >
                          −
                        </button>
                        <span className="w-7 text-center text-xs font-black text-[#27211E]">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item._id, +1)}
                          className="h-7 w-7 flex items-center justify-center text-[#3F312B] hover:bg-[#E8DDD1] transition-colors text-sm font-black"
                        >
                          +
                        </button>
                      </div>

                      {/* Item total + remove */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-[#3F312B]">
                          Rs. {(price * item.quantity).toLocaleString()}
                        </span>
                        <button
                          onClick={() => removeFromCart(item._id)}
                          className="h-7 w-7 rounded-lg flex items-center justify-center text-[#B8AAA0] hover:text-red-500 hover:bg-red-50 transition-all duration-200"
                        >
                          <HiOutlineTrash className="text-sm" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="flex-shrink-0 border-t border-[#E8DDD1] bg-white px-5 py-5 space-y-4">
            {/* Subtotal */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-[#6F5E55]">Subtotal</span>
              <span className="text-xl font-black text-[#8A5A44]">Rs. {subtotal.toLocaleString()}</span>
            </div>
            <p className="text-[10px] text-[#B8AAA0] font-medium -mt-2">
              Shipping calculated at checkout
            </p>

            {/* Buttons */}
            <div className="flex flex-col gap-2">
              <Link
                to="/checkout"
                onClick={onClose}
                className="btn-shimmer btn-glow w-full flex items-center justify-center gap-2 bg-[#8A5A44] hover:bg-[#6F4736] text-white font-black py-3.5 rounded-2xl text-sm uppercase tracking-[0.15em] transition-all duration-300 shadow-[0_8px_25px_rgba(138,90,68,0.3)]"
              >
                Checkout <HiOutlineArrowRight className="text-base" />
              </Link>
              <Link
                to="/cart"
                onClick={onClose}
                className="w-full flex items-center justify-center gap-2 bg-white border-2 border-[#E8DDD1] hover:border-[#8A5A44] text-[#3F312B] hover:text-[#8A5A44] font-black py-3 rounded-2xl text-sm uppercase tracking-[0.15em] transition-all duration-300"
              >
                View Full Cart
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
