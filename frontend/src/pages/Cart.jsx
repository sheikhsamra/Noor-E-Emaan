import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import CartItem from '../components/CartItem';
import { Link } from 'react-router-dom';

export default function Cart() {
  const { cart, removeFromCart } = useContext(CartContext);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="p-4">
      {cart.length === 0 ? <p>Your cart is empty</p> :
        <>
          {cart.map(item => <CartItem key={item._id} item={item} removeFromCart={removeFromCart} />)}
          <div className="mt-4 font-bold text-lg text-primary text-right">Total: Rs. {total}</div>
          <Link to="/checkout" className="bg-accent text-white px-4 py-2 rounded mt-2 inline-block">Proceed to Checkout</Link>
        </>
      }
    </div>
  );
}
