export default function CartItem({ item, removeFromCart }) {
  return (
    <div className="flex items-center gap-4 border-b p-2">
      <img src={item.images?.[0]} alt={item.name} className="h-24 w-24 object-cover"/>
      <div className="flex-1">
        <h2 className="font-semibold">{item.name}</h2>
        <p>Qty: {item.quantity}</p>
        <p className="text-primary font-bold">Rs. {item.price * item.quantity}</p>
      </div>
      <button onClick={() => removeFromCart(item._id)} className="text-red-500">Remove</button>
    </div>
  );
}
