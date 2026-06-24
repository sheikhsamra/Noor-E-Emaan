import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';
import {
  HiOutlineCurrencyRupee,
  HiOutlineShoppingBag,
  HiOutlineClipboardDocumentList,
  HiOutlineUsers,
  HiOutlineClock,
  HiOutlineArrowRight,
} from 'react-icons/hi2';

const STATUS_STYLE = {
  Pending:   { dot: 'bg-amber-400',    text: 'text-amber-700',    bg: 'bg-amber-50    border-amber-200'    },
  Confirmed: { dot: 'bg-[#8A5A44]',    text: 'text-[#6F4736]',    bg: 'bg-[#F7F2EC]   border-[#D8B9A5]'    },
  Shipped:   { dot: 'bg-[#2D6A4F]',    text: 'text-[#2D6A4F]',    bg: 'bg-[#EDF5EF]   border-[#9FCDB5]'    },
  Delivered: { dot: 'bg-emerald-500',  text: 'text-emerald-700',  bg: 'bg-emerald-50  border-emerald-200'  },
  Cancelled: { dot: 'bg-red-400',      text: 'text-red-700',      bg: 'bg-red-50      border-red-200'      },
};

function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div className="bg-white rounded-[1.5rem] border border-[#E8DDD1] p-6 shadow-sm flex items-center gap-5">
      <div className={`h-14 w-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon className="text-2xl text-white" />
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#9B8C83]">{label}</p>
        <p className="text-2xl font-black text-[#27211E] leading-tight mt-0.5">{value}</p>
        {sub && <p className="text-xs text-[#9B8C83] font-medium mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = () => {
    setLoading(true);
    setError(null);
    API.get('/admin/stats')
      .then(r => setStats(r.data))
      .catch(err => setError(err.response?.data?.message || 'Failed to connect to server'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="w-10 h-10 border-[3px] border-[#E8DDD1] border-t-[#8A5A44] rounded-full animate-spin" />
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
      <p className="text-red-500 font-bold text-sm bg-red-50 border border-red-200 rounded-2xl px-6 py-3">{error}</p>
      <button
        onClick={load}
        className="px-6 py-2.5 rounded-xl bg-[#8A5A44] text-white text-sm font-black hover:bg-[#6F4736] transition-all"
      >
        Try Again
      </button>
    </div>
  );

  return (
    <div className="space-y-8 max-w-6xl">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-[#27211E] tracking-tight">Dashboard</h1>
        <p className="text-[#9B8C83] font-medium mt-1 text-sm">Welcome back, here's what's happening.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          icon={HiOutlineCurrencyRupee}
          label="Total Revenue"
          value={`Rs. ${stats.revenue.toLocaleString()}`}
          sub="From non-cancelled orders"
          color="bg-[#8A5A44]"
        />
        <StatCard
          icon={HiOutlineClipboardDocumentList}
          label="Total Orders"
          value={stats.totalOrders}
          sub={`${stats.pendingCount} pending`}
          color="bg-[#C9A646]"
        />
        <StatCard
          icon={HiOutlineShoppingBag}
          label="Products"
          value={stats.totalProducts}
          sub="In catalogue"
          color="bg-[#3F312B]"
        />
        <StatCard
          icon={HiOutlineUsers}
          label="Customers"
          value={stats.totalUsers}
          sub="Registered users"
          color="bg-[#6F4736]"
        />
      </div>

      {/* Pending alert */}
      {stats.pendingCount > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <HiOutlineClock className="text-amber-500 text-xl flex-shrink-0" />
            <p className="text-amber-800 font-bold text-sm">
              <span className="font-black">{stats.pendingCount}</span> order{stats.pendingCount !== 1 ? 's' : ''} waiting for confirmation
            </p>
          </div>
          <Link
            to="/admin/orders?status=Pending"
            className="flex items-center gap-1.5 text-xs font-black text-amber-700 hover:text-amber-900 uppercase tracking-widest whitespace-nowrap group"
          >
            Review <HiOutlineArrowRight className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      )}

      {/* Recent orders */}
      <div className="bg-white rounded-[2rem] border border-[#E8DDD1] shadow-sm overflow-hidden">
        <div className="px-7 py-5 border-b border-[#E8DDD1] flex items-center justify-between">
          <h2 className="font-black text-[#27211E] text-base">Recent Orders</h2>
          <Link
            to="/admin/orders"
            className="text-xs font-black text-[#8A5A44] uppercase tracking-widest hover:text-[#6F4736] flex items-center gap-1 group"
          >
            View All <HiOutlineArrowRight className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#FAF8F5] border-b border-[#E8DDD1]">
                <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-[0.2em] text-[#9B8C83]">Order</th>
                <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-[0.2em] text-[#9B8C83]">Customer</th>
                <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-[0.2em] text-[#9B8C83]">Items</th>
                <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-[0.2em] text-[#9B8C83]">Total</th>
                <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-[0.2em] text-[#9B8C83]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EBE5]">
              {stats.recentOrders.map(order => {
                const s = STATUS_STYLE[order.status] || STATUS_STYLE.Pending;
                const date = new Date(order.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short' });
                return (
                  <tr key={order._id} className="hover:bg-[#FAF8F5] transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-black text-[#27211E] text-xs">#{order._id.slice(-8).toUpperCase()}</p>
                      <p className="text-[10px] text-[#9B8C83] font-medium mt-0.5">{date}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-[#3F312B] text-xs">{order.customerInfo?.name}</p>
                      <p className="text-[10px] text-[#9B8C83] font-medium truncate max-w-[160px]">{order.customerInfo?.phone}</p>
                    </td>
                    <td className="px-6 py-4 text-[#6F5E55] font-medium text-xs">{order.products?.length} item{order.products?.length !== 1 ? 's' : ''}</td>
                    <td className="px-6 py-4 font-black text-[#8A5A44] text-sm">Rs. {order.total?.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${s.bg} ${s.text}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
                        {order.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {stats.recentOrders.length === 0 && (
          <div className="py-16 text-center text-[#9B8C83] font-medium text-sm">No orders yet.</div>
        )}
      </div>
    </div>
  );
}
