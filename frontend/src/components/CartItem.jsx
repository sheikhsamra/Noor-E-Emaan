import { HiOutlineTrash } from 'react-icons/hi2';

export default function CartItem({ item, removeFromCart, updateQuantity }) {
  const price = item.discountPrice || item.price;
  const imageSrc = item.images?.[0]
    ? (item.images[0].startsWith('http') || item.images[0].startsWith('/') ? item.images[0] : `/${item.images[0]}`)
    : 'https://placehold.co/80x80?text=No+Image';

  return (
    <div className="flex items-center gap-4 bg-white border border-[#E8DDD1] rounded-[1.5rem] p-4 shadow-[0_4px_20px_rgba(63,49,43,0.06)] hover:shadow-[0_8px_30px_rgba(63,49,43,0.10)] transition-all duration-300">

      {/* Image */}
      <div className="h-20 w-20 flex-shrink-0 rounded-2xl overflow-hidden bg-[#F7F2EC] border border-[#E8DDD1]">
        <img
          src={imageSrc}
          alt={item.name}
          className="h-full w-full object-cover object-top"
          onError={(e) => { e.target.src = 'https://placehold.co/80x80?text=Item'; }}
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <span className="text-[9px] font-black uppercase tracking-[0.25em] text-[#8A5A44] block mb-1">
          {item.category}
        </span>
        <h3 className="font-black text-[#27211E] text-sm leading-tight truncate">{item.name}</h3>
        <p className="text-[#8A5A44] font-black text-base mt-1">
          Rs. {(price * item.quantity).toLocaleString()}
        </p>
        <p className="text-[#B8AAA0] text-xs font-medium">Rs. {price.toLocaleString()} each</p>
      </div>

      {/* Qty controls */}
      <div className="flex items-center gap-1 bg-[#FAF8F5] border border-[#E8DDD1] rounded-full p-1">
        <button
          onClick={() => updateQuantity(item._id, -1)}
          className="h-7 w-7 rounded-full text-[#3F312B] hover:bg-[#8A5A44] hover:text-white font-black text-sm transition-all duration-200 flex items-center justify-center"
        >
          −
        </button>
        <span className="w-6 text-center font-black text-[#27211E] text-sm">{item.quantity}</span>
        <button
          onClick={() => updateQuantity(item._id, +1)}
          className="h-7 w-7 rounded-full text-[#3F312B] hover:bg-[#8A5A44] hover:text-white font-black text-sm transition-all duration-200 flex items-center justify-center"
        >
          +
        </button>
      </div>

      {/* Remove */}
      <button
        onClick={() => removeFromCart(item._id)}
        className="h-9 w-9 rounded-full bg-red-50 border border-red-100 text-red-400 hover:bg-red-500 hover:text-white hover:border-red-500 flex items-center justify-center transition-all duration-200 flex-shrink-0"
      >
        <HiOutlineTrash className="text-sm" />
      </button>
    </div>
  );
}
