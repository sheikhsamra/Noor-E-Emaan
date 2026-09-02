import { useEffect, useState, useRef } from 'react';
import API from '../../api/axios';
import { useToast } from '../../context/ToastContext';
import {
  HiOutlinePlus,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineXMark,
  HiOutlineMagnifyingGlass,
  HiOutlinePhoto,
  HiOutlineCloudArrowUp,
} from 'react-icons/hi2';

const CATEGORIES = ['Abaya', 'Hijab', 'Prayer Set', 'Islamic Books', 'Fragrances', 'Kids', 'Men', 'Other'];

// Style/sub-category options per category — must match the navbar dropdown labels
const SUBCATEGORIES = {
  Abaya:      ['Open Abaya', 'Butterfly Abaya', 'Embroidered Abaya', 'Ombre Abaya', 'Pleated / Crepe Maxi Abaya'],
  Hijab:      ['Chiffon Scarf', 'Jersey Hijab', 'Khimar', 'Pashmina Shawl', 'Niqab', 'Cap', 'Hand Gloves'],
  'Prayer Set': ['Jainamaz', 'Prayer Cap', 'Tasbih', 'Velvet Prayer Mat', 'Complete Set', 'Couple Set'],
  Fragrances: ['Attar', 'Oud', 'Perfumes'],
  Men:        ['Jubba / Thobe', 'Kurta'],
};

const EMPTY = {
  name: '', category: '', subCategory: '', price: '', discountPrice: '', stock: '', description: '',
  images: [''],
};

const imgSrc = (src) => {
  if (!src) return null;
  return src.startsWith('http') || src.startsWith('/') ? src : `/${src}`;
};

export default function AdminProducts() {
  const { showToast } = useToast();

  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage]         = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [search, setSearch]     = useState('');
  const [panelOpen, setPanelOpen] = useState(false);
  const [form, setForm]         = useState(EMPTY);
  const [editId, setEditId]     = useState(null);
  const [saving, setSaving]     = useState(false);
  const [deleteId, setDeleteId]     = useState(null);
  const [uploadingIdx, setUploadingIdx] = useState(null);
  const fileInputRef   = useRef(null);
  const uploadSlotRef  = useRef(null);

  const triggerUpload = (idx) => {
    uploadSlotRef.current = idx;
    fileInputRef.current.value = '';
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const idx = uploadSlotRef.current;
    setUploadingIdx(idx);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const res = await API.post('/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setImg(idx, res.data.url);
    } catch {
      showToast('Image upload failed. Try again.', 'error');
    } finally {
      setUploadingIdx(null);
    }
  };

  const PAGE_SIZE = 50;

  const fetchProducts = () => {
    setLoading(true);
    API.get(`/products?limit=${PAGE_SIZE}&page=1&sort=newest`)
      .then(r => {
        setProducts(r.data.products || []);
        setPage(1);
        setTotalPages(r.data.pagination?.totalPages || 1);
        setTotalProducts(r.data.pagination?.totalProducts || 0);
      })
      .catch(() => showToast('Failed to load products', 'error'))
      .finally(() => setLoading(false));
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setLoadingMore(true);
    API.get(`/products?limit=${PAGE_SIZE}&page=${nextPage}&sort=newest`)
      .then(r => {
        setProducts(prev => [...prev, ...(r.data.products || [])]);
        setPage(nextPage);
      })
      .catch(() => showToast('Failed to load more products', 'error'))
      .finally(() => setLoadingMore(false));
  };

  useEffect(fetchProducts, []);

  const openAdd = () => {
    setForm(EMPTY);
    setEditId(null);
    setPanelOpen(true);
  };

  const openEdit = (p) => {
    setForm({
      name:          p.name         || '',
      category:      p.category     || '',
      subCategory:   p.subCategory  || '',
      price:         p.price        ?? '',
      discountPrice: p.discountPrice ?? '',
      stock:         p.stock        ?? '',
      description:   p.description  || '',
      images:        p.images?.length ? [...p.images] : [''],
    });
    setEditId(p._id);
    setPanelOpen(true);
  };

  const closePanel = () => { setPanelOpen(false); setEditId(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name:        form.name.trim(),
        category:    form.category.trim(),
        subCategory: form.subCategory.trim(),
        price:       Number(form.price),
        stock:       Number(form.stock),
        description: form.description.trim(),
        images:      form.images.filter(u => u.trim()),
        ...(form.discountPrice !== '' && { discountPrice: Number(form.discountPrice) }),
      };

      if (editId) {
        const r = await API.put(`/products/${editId}`, payload);
        setProducts(prev => prev.map(p => p._id === editId ? r.data : p));
        showToast('Product updated', 'success');
      } else {
        const r = await API.post('/products', payload);
        setProducts(prev => [r.data, ...prev]);
        showToast('Product added', 'success');
      }
      closePanel();
    } catch (err) {
      showToast(err.response?.data?.message || 'Save failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await API.delete(`/products/${deleteId}`);
      setProducts(prev => prev.filter(p => p._id !== deleteId));
      showToast('Product deleted', 'success');
    } catch {
      showToast('Delete failed', 'error');
    } finally {
      setDeleteId(null);
    }
  };

  const setImg = (idx, val) =>
    setForm(f => ({ ...f, images: f.images.map((u, i) => i === idx ? val : u) }));
  const addImg = () => setForm(f => ({ ...f, images: [...f.images, ''] }));
  const removeImg = (idx) => setForm(f => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));

  const filtered = products.filter(p =>
    !search ||
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  );

  const inputCls = "w-full bg-white border border-[#E8DDD1] rounded-xl px-4 py-3 text-sm text-[#27211E] placeholder:text-[#C5B9B0] font-medium outline-none focus:border-[#8A5A44] focus:ring-2 focus:ring-[#8A5A44]/10 transition-all";
  const labelCls = "block text-[10px] font-black uppercase tracking-[0.2em] text-[#3F312B] mb-1.5";

  return (
    <>
      <div className="space-y-6 max-w-6xl">

        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-black text-[#27211E] tracking-tight">Products</h1>
            <p className="text-[#9B8C83] font-medium mt-1 text-sm">
              Showing {products.length} of {totalProducts} products
            </p>
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-[#8A5A44] hover:bg-[#6F4736] text-white font-black px-5 py-3 rounded-2xl shadow-[0_8px_20px_rgba(138,90,68,0.3)] transition-all hover:-translate-y-0.5 text-sm uppercase tracking-widest"
          >
            <HiOutlinePlus className="text-lg" /> Add Product
          </button>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <HiOutlineMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9B8C83] text-base" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full bg-white border border-[#E8DDD1] rounded-2xl pl-10 pr-4 py-3 text-sm text-[#27211E] placeholder:text-[#C5B9B0] font-medium outline-none focus:border-[#8A5A44] focus:ring-2 focus:ring-[#8A5A44]/10 transition-all shadow-sm"
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-[2rem] border border-[#E8DDD1] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-9 h-9 border-[3px] border-[#E8DDD1] border-t-[#8A5A44] rounded-full animate-spin" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-20 text-center text-[#9B8C83] font-medium text-sm">No products found.</div>
            ) : (
              <table className="w-full text-sm min-w-[640px]">
                <thead>
                  <tr className="bg-[#FAF8F5] border-b border-[#E8DDD1]">
                    {['Product', 'Category', 'Price', 'Stock', 'Actions'].map(h => (
                      <th key={h} className="px-5 py-3.5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-[#9B8C83]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0EBE5]">
                  {filtered.map(p => {
                    const src = imgSrc(p.images?.[0]);
                    return (
                      <tr key={p._id} className="hover:bg-[#FAF8F5] transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-10 rounded-xl overflow-hidden bg-[#F7F2EC] border border-[#E8DDD1] flex-shrink-0 flex items-center justify-center">
                              {src
                                ? <img src={src} alt={p.name} className="h-full w-full object-cover object-top" onError={e => { e.target.style.display='none'; }} />
                                : <HiOutlinePhoto className="text-[#C5B9B0] text-lg" />}
                            </div>
                            <div className="min-w-0">
                              <p className="font-black text-[#27211E] text-xs truncate max-w-[180px]">{p.name}</p>
                              <p className="text-[10px] text-[#9B8C83] mt-0.5 truncate max-w-[180px]">{p.description?.slice(0, 50)}{p.description?.length > 50 ? '…' : ''}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="px-2.5 py-1 rounded-full bg-[#F7F2EC] text-[#8A5A44] text-[10px] font-black uppercase tracking-widest border border-[#E8DDD1]">
                            {p.category}
                          </span>
                          {p.subCategory && (
                            <p className="text-[10px] text-[#9B8C83] font-medium mt-1">{p.subCategory}</p>
                          )}
                        </td>
                        <td className="px-5 py-3.5">
                          {p.discountPrice ? (
                            <div>
                              <p className="font-black text-[#8A5A44] text-sm">Rs. {p.discountPrice.toLocaleString()}</p>
                              <p className="text-[10px] text-[#B8AAA0] line-through">Rs. {p.price.toLocaleString()}</p>
                            </div>
                          ) : (
                            <p className="font-black text-[#3F312B] text-sm">Rs. {p.price?.toLocaleString()}</p>
                          )}
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`font-black text-sm ${p.stock === 0 ? 'text-red-500' : p.stock < 5 ? 'text-amber-600' : 'text-emerald-600'}`}>
                            {p.stock}
                          </span>
                          <span className="text-[10px] text-[#9B8C83] ml-1">units</span>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openEdit(p)}
                              className="h-8 w-8 rounded-xl bg-[#F7F2EC] border border-[#E8DDD1] flex items-center justify-center text-[#8A5A44] hover:bg-[#8A5A44] hover:text-white hover:border-[#8A5A44] transition-all"
                            >
                              <HiOutlinePencilSquare className="text-sm" />
                            </button>
                            <button
                              onClick={() => setDeleteId(p._id)}
                              className="h-8 w-8 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all"
                            >
                              <HiOutlineTrash className="text-sm" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Load more */}
        {!loading && !search && page < totalPages && (
          <div className="flex justify-center pt-2">
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className="flex items-center gap-2 bg-white border-2 border-[#E8DDD1] hover:border-[#8A5A44] text-[#3F312B] hover:text-[#8A5A44] font-black px-6 py-3 rounded-2xl transition-all text-sm uppercase tracking-widest disabled:opacity-50"
            >
              {loadingMore ? (
                <>
                  <span className="w-4 h-4 border-2 border-[#E8DDD1] border-t-[#8A5A44] rounded-full animate-spin" />
                  Loading…
                </>
              ) : (
                `Load More (${totalProducts - products.length} remaining)`
              )}
            </button>
          </div>
        )}
      </div>

      {/* ── Add/Edit slide panel ── */}
      <>
        <div
          className={`fixed inset-0 bg-black/40 z-[998] transition-opacity duration-300 ${panelOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
          onClick={closePanel}
        />
        <div className={`fixed top-0 right-0 h-full w-full max-w-lg bg-[#FAF8F5] z-[999] shadow-2xl flex flex-col transition-transform duration-[360ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${panelOpen ? 'translate-x-0' : 'translate-x-full'}`}>

          {/* Panel header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#E8DDD1] bg-gradient-to-r from-[#F7F2EC] to-[#EEDFD4] flex-shrink-0">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.35em] text-[#8A5A44]">
                {editId ? 'Edit' : 'Add New'} Product
              </p>
              <h2 className="text-lg font-black text-[#27211E] mt-0.5">
                {editId ? form.name || 'Product' : 'New Product'}
              </h2>
            </div>
            <button
              onClick={closePanel}
              className="h-9 w-9 rounded-full bg-white border border-[#E8DDD1] flex items-center justify-center text-[#6F5E55] hover:bg-[#8A5A44] hover:text-white hover:border-[#8A5A44] transition-all"
            >
              <HiOutlineXMark className="text-lg" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-6 space-y-5">

            <div>
              <label className={labelCls}>Product Name *</label>
              <input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))}
                placeholder="e.g. Black Abaya with Embroidery" required className={inputCls} />
            </div>

            <div>
              <label className={labelCls}>Category *</label>
              <select value={form.category} onChange={e => setForm(f => ({...f, category: e.target.value, subCategory: ''}))}
                required className={inputCls}>
                <option value="">Select category</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {SUBCATEGORIES[form.category] && (
              <div>
                <label className={labelCls}>Style</label>
                <select value={form.subCategory} onChange={e => setForm(f => ({...f, subCategory: e.target.value}))}
                  className={inputCls}>
                  <option value="">No specific style</option>
                  {SUBCATEGORIES[form.category].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Price (Rs.) *</label>
                <input value={form.price} onChange={e => setForm(f => ({...f, price: e.target.value}))}
                  placeholder="2500" type="number" min="1" required className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Discount Price</label>
                <input value={form.discountPrice} onChange={e => setForm(f => ({...f, discountPrice: e.target.value}))}
                  placeholder="Optional" type="number" min="0" className={inputCls} />
              </div>
            </div>

            <div>
              <label className={labelCls}>Stock *</label>
              <input value={form.stock} onChange={e => setForm(f => ({...f, stock: e.target.value}))}
                placeholder="50" type="number" min="0" required className={inputCls} />
            </div>

            <div>
              <label className={labelCls}>Description *</label>
              <textarea value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))}
                placeholder="Describe the product..." required rows={3}
                className={`${inputCls} resize-none`} />
            </div>

            {/* Images */}
            <div>
              <label className={labelCls}>Product Images</label>

              {/* Hidden file input — shared across all slots */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />

              <div className="space-y-3">
                {form.images.map((url, idx) => (
                  <div key={idx} className="rounded-2xl border border-[#E8DDD1] bg-white overflow-hidden">
                    {/* Preview area */}
                    <div
                      className="relative h-36 bg-[#F7F2EC] flex items-center justify-center cursor-pointer group"
                      onClick={() => triggerUpload(idx)}
                    >
                      {url.trim() ? (
                        <img
                          src={url}
                          alt=""
                          className="h-full w-full object-contain"
                          onError={e => { e.target.style.display = 'none'; }}
                        />
                      ) : null}

                      {/* Overlay — always visible when empty, on-hover when image set */}
                      <div className={`absolute inset-0 flex flex-col items-center justify-center gap-2 transition-all duration-200
                        ${url.trim()
                          ? 'bg-black/0 group-hover:bg-black/40 opacity-0 group-hover:opacity-100'
                          : 'bg-transparent opacity-100'}`}>
                        {uploadingIdx === idx ? (
                          <div className="w-7 h-7 border-2 border-[#8A5A44]/30 border-t-[#8A5A44] rounded-full animate-spin" />
                        ) : (
                          <>
                            <HiOutlineCloudArrowUp className={`text-3xl ${url.trim() ? 'text-white' : 'text-[#C5B9B0]'}`} />
                            <span className={`text-xs font-black uppercase tracking-widest ${url.trim() ? 'text-white' : 'text-[#B8AAA0]'}`}>
                              {url.trim() ? 'Change Image' : 'Click to Upload'}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* URL input row */}
                    <div className="flex items-center gap-2 px-3 py-2 border-t border-[#F0EBE5]">
                      <HiOutlinePhoto className="text-[#C5B9B0] text-base flex-shrink-0" />
                      <input
                        value={url}
                        onChange={e => setImg(idx, e.target.value)}
                        placeholder="Or paste image URL…"
                        className="flex-1 bg-transparent text-xs text-[#6F5E55] placeholder:text-[#C5B9B0] outline-none font-medium py-1"
                      />
                      {form.images.length > 1 && (
                        <button type="button" onClick={() => removeImg(idx)}
                          className="h-6 w-6 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center text-red-400 hover:bg-red-100 transition-all flex-shrink-0">
                          <HiOutlineXMark className="text-xs" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                <button
                  type="button" onClick={addImg}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed border-[#D8B9A5] text-[#8A5A44] text-xs font-black uppercase tracking-widest hover:border-[#8A5A44] hover:bg-[#F7F2EC] transition-all"
                >
                  <HiOutlinePlus /> Add Another Image
                </button>
              </div>
            </div>
          </form>

          {/* Footer */}
          <div className="flex gap-3 px-6 py-5 border-t border-[#E8DDD1] bg-white flex-shrink-0">
            <button type="button" onClick={closePanel} disabled={saving}
              className="flex-1 bg-white border-2 border-[#E8DDD1] hover:border-[#8A5A44] text-[#3F312B] font-black py-3.5 rounded-2xl transition-all text-sm uppercase tracking-widest disabled:opacity-40">
              Cancel
            </button>
            <button onClick={handleSubmit} disabled={saving}
              className="flex-1 bg-[#8A5A44] hover:bg-[#6F4736] text-white font-black py-3.5 rounded-2xl transition-all shadow-[0_8px_20px_rgba(138,90,68,0.3)] hover:-translate-y-0.5 disabled:opacity-50 disabled:translate-y-0 text-sm uppercase tracking-widest">
              {saving ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </span>
              ) : editId ? 'Save Changes' : 'Add Product'}
            </button>
          </div>
        </div>
      </>

      {/* ── Delete confirm modal ── */}
      {deleteId && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/50"
          onClick={() => setDeleteId(null)}
        >
          <div
            className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl text-center"
            onClick={e => e.stopPropagation()}
          >
            <div className="h-16 w-16 rounded-full bg-red-50 border border-red-200 flex items-center justify-center mx-auto mb-5">
              <HiOutlineTrash className="text-3xl text-red-500" />
            </div>
            <h3 className="text-xl font-black text-[#27211E] mb-2">Delete Product?</h3>
            <p className="text-[#9B8C83] text-sm font-medium mb-7">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)}
                className="flex-1 bg-white border-2 border-[#E8DDD1] text-[#3F312B] font-black py-3 rounded-2xl hover:border-[#8A5A44] transition-all text-sm">
                Cancel
              </button>
              <button onClick={confirmDelete}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-black py-3 rounded-2xl shadow-lg transition-all text-sm">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
