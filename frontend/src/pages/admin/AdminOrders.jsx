import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../../api/axios';
import { useToast } from '../../context/ToastContext';
import { HiOutlineChevronLeft, HiOutlineChevronRight, HiOutlineFunnel } from 'react-icons/hi2';

const STATUSES = ['All', 'Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];

const STATUS_STYLE = {
  Pending:   { dot: 'bg-amber-400',   text: 'text-amber-700',   bg: 'bg-amber-50   border-amber-200'   },
  Confirmed: { dot: 'bg-blue-500',    text: 'text-blue-700',    bg: 'bg-blue-50    border-blue-200'    },
  Shipped:   { dot: 'bg-purple-500',  text: 'text-purple-700',  bg: 'bg-purple-50  border-purple-200'  },
  Delivered: { dot: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
  Cancelled: { dot: 'bg-red-400',     text: 'text-red-700',     bg: 'bg-red-50     border-red-200'     },
};

const STATUS_SELECT_COLORS = {
  Pending:   'bg-amber-50   text-amber-700   border-amber-300',
  Confirmed: 'bg-blue-50    text-blue-700    border-blue-300',
  Shipped:   'bg-purple-50  text-purple-700  border-purple-300',
  Delivered: 'bg-emerald-50 text-emerald-700 border-emerald-300',
  Cancelled: 'bg-red-50     text-red-700     border-red-300',
};

export default function AdminOrders() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { showToast } = useToast();

  const [orders, setOrders]         = useState([]);
  const [total, setTotal]           = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading]       = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const statusFilter = searchParams.get('status') || 'All';
  const page         = parseInt(searchParams.get('page') || '1');

  const fetchOrders = () => {
    setLoading(true);
    setFetchError(null);
    const params = new URLSearchParams({ page, limit: 15 });
    if (statusFilter !== 'All') params.set('status', statusFilter);

    API.get(`/admin/orders?${params}`)
      .then(r => {
        setOrders(r.data.orders);
        setTotal(r.data.total);
        setTotalPages(r.data.totalPages);
      })
      .catch(err => {
        const msg = err.response?.data?.message || err.message || 'Failed to load orders';
        setFetchError(msg);
        showToast(msg, 'error');
      })
      .finally(() => setLoading(false));
  };

  useEffect(fetchOrders, [statusFilter, page]);

  const setStatus = (val) => {
    setSearchParams({ status: val, page: 1 });
  };
  const setPage = (p) => {
    setSearchParams({ status: statusFilter, page: p });
  };

  const updateStatus = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await API.patch(`/admin/orders/${orderId}/status`, { status: newStatus });
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
      showToast(`Order updated to ${newStatus}`, 'success');
    } catch {
      showToast('Failed to update status', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">

      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-black text-[#27211E] tracking-tight">Orders</h1>
          <p className="text-[#9B8C83] font-medium mt-1 text-sm">{total} total order{total !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Status filter tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        <HiOutlineFunnel className="text-[#9B8C83] text-base flex-shrink-0" />
        {STATUSES.map(s => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-[0.15em] border transition-all duration-200 ${
              statusFilter === s
                ? 'bg-[#3F312B] text-white border-[#3F312B] shadow-md'
                : 'bg-white text-[#6F5E55] border-[#E8DDD1] hover:border-[#8A5A44] hover:text-[#8A5A44]'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-[2rem] border border-[#E8DDD1] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-9 h-9 border-[3px] border-[#E8DDD1] border-t-[#8A5A44] rounded-full animate-spin" />
            </div>
          ) : fetchError ? (
            <div className="py-16 text-center flex flex-col items-center gap-4">
              <p className="text-red-500 font-bold text-sm bg-red-50 border border-red-200 rounded-2xl px-6 py-3 max-w-md">{fetchError}</p>
              <button
                onClick={fetchOrders}
                className="px-5 py-2 rounded-xl bg-[#8A5A44] text-white text-xs font-black uppercase tracking-widest hover:bg-[#6F4736] transition-all"
              >
                Try Again
              </button>
            </div>
          ) : orders.length === 0 ? (
            <div className="py-20 text-center text-[#9B8C83] font-medium text-sm">No orders found.</div>
          ) : (
            <table className="w-full text-sm min-w-[700px]">
              <thead>
                <tr className="bg-[#FAF8F5] border-b border-[#E8DDD1]">
                  {['Order', 'Customer', 'Date', 'Items', 'Total', 'Status', 'Update'].map(h => (
                    <th key={h} className="px-5 py-3.5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-[#9B8C83] whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EBE5]">
                {orders.map(order => {
                  const s = STATUS_STYLE[order.status] || STATUS_STYLE.Pending;
                  const date = new Date(order.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: '2-digit' });
                  const isUpdating = updatingId === order._id;

                  return (
                    <tr key={order._id} className="hover:bg-[#FAF8F5] transition-colors">
                      <td className="px-5 py-4 whitespace-nowrap">
                        <p className="font-black text-[#27211E] text-xs">#{order._id.slice(-8).toUpperCase()}</p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-bold text-[#3F312B] text-xs whitespace-nowrap">{order.customerInfo?.name}</p>
                        <p className="text-[10px] text-[#9B8C83] mt-0.5">{order.customerInfo?.phone}</p>
                      </td>
                      <td className="px-5 py-4 text-[#6F5E55] font-medium text-xs whitespace-nowrap">{date}</td>
                      <td className="px-5 py-4 text-[#6F5E55] font-medium text-xs whitespace-nowrap">
                        {order.products?.length} item{order.products?.length !== 1 ? 's' : ''}
                      </td>
                      <td className="px-5 py-4 font-black text-[#8A5A44] text-sm whitespace-nowrap">
                        Rs. {order.total?.toLocaleString()}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border whitespace-nowrap ${s.bg} ${s.text}`}>
                          <span className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${s.dot} ${order.status !== 'Delivered' && order.status !== 'Cancelled' ? 'animate-pulse' : ''}`} />
                          {order.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <select
                          value={order.status}
                          disabled={isUpdating || order.status === 'Delivered' || order.status === 'Cancelled'}
                          onChange={e => updateStatus(order._id, e.target.value)}
                          className={`text-xs font-bold rounded-xl border px-3 py-1.5 outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all ${STATUS_SELECT_COLORS[order.status] || 'bg-white text-[#3F312B] border-[#E8DDD1]'}`}
                        >
                          {STATUSES.filter(s => s !== 'All').map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between gap-4">
          <p className="text-xs text-[#9B8C83] font-medium">
            Page {page} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="h-9 w-9 rounded-xl border border-[#E8DDD1] bg-white flex items-center justify-center text-[#8A5A44] hover:bg-[#FAF8F5] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <HiOutlineChevronLeft className="text-base" />
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              className="h-9 w-9 rounded-xl border border-[#E8DDD1] bg-white flex items-center justify-center text-[#8A5A44] hover:bg-[#FAF8F5] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <HiOutlineChevronRight className="text-base" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
