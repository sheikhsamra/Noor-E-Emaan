import { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import API from '../api/axios';

export default function Checkout() {
  const { cart, clearCart } = useContext(CartContext);
  const [form, setForm] = useState({ name:'', email:'', phone:'', address:'' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const total = cart.reduce((sum, item) => sum + item.price*item.quantity, 0);
    await API.post('/orders', { user:null, products:cart, total, customerInfo:form });
    clearCart(); alert('Order placed'); setForm({name:'',email:'',phone:'',address:''});
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-2">
      <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Name" className="input" required/>
      <input value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="Email" className="input" required/>
      <input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="Phone" className="input" required/>
      <input value={form.address} onChange={e=>setForm({...form,address:e.target.value})} placeholder="Address" className="input" required/>
      <button type="submit" className="bg-accent text-white px-4 py-2 rounded">Place Order</button>
    </form>
  );
}
