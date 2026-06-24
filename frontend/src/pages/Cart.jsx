import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import CartItem from '../components/CartItem';
import { Link } from 'react-router-dom';
import { HiOutlineShoppingBag, HiOutlineArrowLeft, HiOutlineTrash } from 'react-icons/hi2';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useContext(CartContext);
  const subtotal = cart.reduce((sum, item) => sum + (item.discountPrice || item.price) * item.quantity, 0);
  const delivery = subtotal >= 3000 ? 0 : 200;
  const total = subtotal + delivery;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center px-4 pt-28">
        <div className="h-28 w-28 rounded-full bg-[#F7F2EC] border-2 border-[#E8DDD1] flex items-center justify-center mb-8 shadow-lg">
          <HiOutlineShoppingBag className="text-5xl text-[#8A5A44]" />
        </div>
        <h2 className="text-3xl font-black text-[#27211E] tracking-tight mb-3">Your Cart is Empty</h2>
        <p className="text-[#9B8C83] font-medium mb-10 text-center max-w-sm">
          Explore our collection and add products you love to your cart.
        </p>
        <Link
          to="/products"
          className="bg-[#27211E] hover:bg-[#3F312B] text-white font-black px-10 py-4 rounded-full transition-all duration-300 shadow-[0_15px_35px_rgba(39,33,30,0.25)] hover:-translate-y-0.5 text-sm uppercase tracking-[0.15em]"
        >
          Browse Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-28 pb-20">
      <div className="container-custom">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <Link to="/products" className="flex items-center gap-2 text-[#8A5A44] text-xs font-black uppercase tracking-[0.2em] hover:gap-3 transition-all duration-200 mb-3">
              <HiOutlineArrowLeft /> Back to Products
            </Link>
            <h1 className="text-4xl font-black text-[#27211E] tracking-tight">Your Cart</h1>
            <p className="text-[#9B8C83] font-medium mt-1">{cart.length} item{cart.length !== 1 ? 's' : ''} in your cart</p>
          </div>
          <button
            onClick={clearCart}
            className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.15em] text-red-400 hover:text-red-600 border border-red-100 hover:border-red-300 px-4 py-2 rounded-full transition-all duration-200"
          >
            <HiOutlineTrash className="text-sm" /> Clear All
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* Items list */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map(item => (
              <CartItem
                key={item._id}
                item={item}
                removeFromCart={removeFromCart}
                updateQuantity={updateQuantity}
              />
            ))}
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-[#E8DDD1] rounded-[2rem] p-7 shadow-[0_20px_60px_rgba(63,49,43,0.08)] sticky top-28">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#8A5A44] mb-6">Order Summary</h3>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-[#6F5E55] font-medium text-sm">Subtotal</span>
                  <span className="text-[#27211E] font-black">Rs. {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#6F5E55] font-medium text-sm">Delivery</span>
                  <span className={`font-black text-sm ${delivery === 0 ? 'text-emerald-600' : 'text-[#27211E]'}`}>
                    {delivery === 0 ? 'Free' : `Rs. ${delivery}`}
                  </span>
                </div>
                {delivery > 0 && (
                  <p className="text-xs text-[#9B8C83] font-medium bg-[#FAF8F5] rounded-xl p-3">
                    Add Rs. {(3000 - subtotal).toLocaleString()} more for free delivery
                  </p>
                )}
              </div>

              <div className="h-px bg-[#E8DDD1] mb-6" />

              <div className="flex justify-between items-center mb-8">
                <span className="font-black text-[#27211E] uppercase tracking-wider text-sm">Total</span>
                <span className="text-[#8A5A44] font-black text-2xl">Rs. {total.toLocaleString()}</span>
              </div>

              <Link
                to="/checkout"
                className="w-full bg-[#27211E] hover:bg-[#3F312B] text-white font-black py-4 rounded-2xl text-center block transition-all duration-300 shadow-[0_15px_35px_rgba(39,33,30,0.25)] hover:-translate-y-0.5 text-sm uppercase tracking-[0.15em]"
              >
                Proceed to Checkout
              </Link>

              <Link
                to="/products"
                className="w-full mt-3 border border-[#E8DDD1] text-[#6F5E55] hover:border-[#8A5A44] hover:text-[#8A5A44] font-black py-3.5 rounded-2xl text-center block transition-all duration-300 text-sm uppercase tracking-[0.12em]"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
