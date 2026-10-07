import React, { useState, useEffect } from 'react';
import {
  X,
  Users,
  Package,
  ShoppingBag,
  DollarSign,
  Plus,
  Trash2,
  ShieldAlert,
  ShieldCheck,
  CheckCircle,
  Ban,
  Tag,
  Activity,
  RefreshCw,
  LogIn,
  LogOut,
  UserPlus,
  ArrowRightLeft,
  Search,
  Eye,
  Check
} from 'lucide-react';
import axios from 'axios';
import API_BASE_URL from '../api/config';

export default function AdminDashboardModal({
  isOpen,
  onClose,
  currentUser,
  onSyncProducts
}) {
  if (!isOpen) return null;

  // Tab State: 'overview' | 'monitor' | 'products' | 'orders' | 'users'
  const [activeTab, setActiveTab] = useState('overview');

  // Real-Time Data from SQLite Database
  const [stats, setStats] = useState({ total_users: 0, total_products: 0, total_orders: 0, total_sales: 0 });
  const [productsList, setProductsList] = useState([]);
  const [ordersList, setOrdersList] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bannerNotice, setBannerNotice] = useState('');

  // Add Product Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProd, setNewProd] = useState({
    name: '',
    category: 'women',
    brand: 'Local Guru Ethnic',
    price: '',
    discountPercent: '20',
    stock: '35',
    description: '',
    images: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800'
  });

  // Filter logs state
  const [logFilter, setLogFilter] = useState('ALL');

  // Fetch real-time data from backend
  const fetchAllAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, prodsRes, ordersRes, usersRes, logsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/admin/stats`),
        axios.get(`${API_BASE_URL}/products`),
        axios.get(`${API_BASE_URL}/orders`),
        axios.get(`${API_BASE_URL}/admin/users`),
        axios.get(`${API_BASE_URL}/admin/logs`)
      ]);

      setStats(statsRes.data);
      setProductsList(prodsRes.data.products || []);
      setOrdersList(ordersRes.data.orders || []);
      setUsersList(usersRes.data.users || []);
      setActivityLogs(logsRes.data.logs || []);

      if (onSyncProducts) {
        onSyncProducts(prodsRes.data.products || []);
      }
    } catch (err) {
      console.error('Failed to load admin data from DB', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAllAdminData();
    // Auto-refresh activity logs and stats every 10 seconds while open
    const interval = setInterval(() => {
      fetchAllAdminData();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // --- ACTIONS: PRODUCTS ---
  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newProd.name || !newProd.price) return;

    try {
      const payload = {
        name: newProd.name,
        category: newProd.category,
        brand: newProd.brand,
        price: parseFloat(newProd.price),
        discountPercent: parseFloat(newProd.discountPercent || 0),
        stock: parseInt(newProd.stock || 10),
        description: newProd.description || 'Premium Local Guru collection.',
        images: [newProd.images]
      };

      const res = await axios.post(`${API_BASE_URL}/admin/products`, payload);
      setBannerNotice(`Product "${res.data.product.name}" added to database!`);
      setShowAddForm(false);
      setNewProd({
        name: '',
        category: 'women',
        brand: 'Local Guru Ethnic',
        price: '',
        discountPercent: '20',
        stock: '35',
        description: '',
        images: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800'
      });
      fetchAllAdminData();
    } catch (err) {
      setBannerNotice('Failed to create product in database');
    }
  };

  const handleDeleteProduct = async (prodId, prodName) => {
    if (!window.confirm(`Are you sure you want to remove "${prodName}" from the store catalog?`)) return;
    try {
      await axios.delete(`${API_BASE_URL}/admin/products/${prodId}`);
      setBannerNotice(`Product "${prodName}" removed from database.`);
      fetchAllAdminData();
    } catch (err) {
      setBannerNotice('Failed to delete product.');
    }
  };

  // --- ACTIONS: USERS ---
  const handleToggleUserRole = async (userId, currentRole) => {
    const nextRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      await axios.patch(`${API_BASE_URL}/admin/users/${userId}/role`, { role: nextRole });
      setBannerNotice(`User permission updated to ${nextRole.toUpperCase()} ✓`);
      fetchAllAdminData();
    } catch (err) {
      setBannerNotice('Failed to update role');
    }
  };

  const handleToggleUserStatus = async (userId) => {
    try {
      await axios.patch(`${API_BASE_URL}/admin/users/${userId}/status`);
      setBannerNotice('User account status updated ✓');
      fetchAllAdminData();
    } catch (err) {
      setBannerNotice('Failed to update user status');
    }
  };

  // --- ACTIONS: ORDERS ---
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.patch(`${API_BASE_URL}/admin/orders/${orderId}/status`, { status: newStatus });
      setBannerNotice(`Order status changed to ${newStatus} ✓`);
      fetchAllAdminData();
    } catch (err) {
      setBannerNotice('Failed to update order status');
    }
  };

  // Filtered Logs
  const filteredLogs = activityLogs.filter((log) => {
    if (logFilter === 'ALL') return true;
    return log.action.toUpperCase().includes(logFilter);
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-6xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 relative my-6 flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Header Bar */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between sticky top-0 z-20 shadow-md">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl gradient-banner flex items-center justify-center font-black text-lg">
              LG
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-extrabold text-xl tracking-tight">STORE ADMIN DASHBOARD</h3>
                <span className="bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                  Real-Time Database
                </span>
              </div>
              <p className="text-xs text-slate-400">Restricted Administrator Console • Live Session & Catalog Controller</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={fetchAllAdminData}
              disabled={loading}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors flex items-center space-x-1 text-xs font-bold"
              title="Refresh Real-time Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-400' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Banner Alert */}
        {bannerNotice && (
          <div className="bg-amber-50 border-b border-amber-200 px-6 py-2.5 flex items-center justify-between text-xs text-amber-900 font-bold">
            <span>{bannerNotice}</span>
            <button onClick={() => setBannerNotice('')} className="text-amber-700 hover:text-amber-900 ml-4 font-black">×</button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="bg-slate-100 border-b border-slate-200 px-6 py-2 flex items-center space-x-2 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview Stats', icon: DollarSign },
            { id: 'monitor', label: `Login & Logout Monitor (${activityLogs.length})`, icon: Activity },
            { id: 'products', label: `Manage Products (${productsList.length})`, icon: Package },
            { id: 'orders', label: `Customer Orders (${ordersList.length})`, icon: ShoppingBag },
            { id: 'users', label: `User Permissions (${usersList.length})`, icon: Users }
          ].map((tab) => {
            const IconComp = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center space-x-2 transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-white text-indigo-600 shadow-xs border border-slate-200/80'
                    : 'text-slate-600 hover:bg-slate-200/60'
                }`}
              >
                <IconComp className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Body Content */}
        <div className="p-6 sm:p-8 flex-1 space-y-6">

          {/* TAB 1: OVERVIEW STATS */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-indigo-50 border border-indigo-200 p-5 rounded-2xl text-indigo-900 space-y-1">
                  <div className="flex items-center justify-between text-indigo-600">
                    <span className="text-xs font-bold uppercase tracking-wider">Registered Users</span>
                    <Users className="w-5 h-5" />
                  </div>
                  <p className="text-3xl font-black">{stats.total_users}</p>
                  <p className="text-[10px] text-indigo-600 font-semibold">Persisted in SQLite DB</p>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl text-emerald-900 space-y-1">
                  <div className="flex items-center justify-between text-emerald-600">
                    <span className="text-xs font-bold uppercase tracking-wider">Active Products</span>
                    <Package className="w-5 h-5" />
                  </div>
                  <p className="text-3xl font-black">{stats.total_products}</p>
                  <p className="text-[10px] text-emerald-600 font-semibold">Ready for customer purchase</p>
                </div>

                <div className="bg-amber-50 border border-amber-200 p-5 rounded-2xl text-amber-900 space-y-1">
                  <div className="flex items-center justify-between text-amber-600">
                    <span className="text-xs font-bold uppercase tracking-wider">Orders Placed</span>
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <p className="text-3xl font-black">{stats.total_orders}</p>
                  <p className="text-[10px] text-amber-600 font-semibold">100% real-time tracking</p>
                </div>

                <div className="bg-purple-50 border border-purple-200 p-5 rounded-2xl text-purple-900 space-y-1">
                  <div className="flex items-center justify-between text-purple-600">
                    <span className="text-xs font-bold uppercase tracking-wider">Total Sales (INR)</span>
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <p className="text-2xl font-black">₹{stats.total_sales?.toLocaleString('en-IN')}</p>
                  <p className="text-[10px] text-purple-600 font-semibold">Gross processed revenue</p>
                </div>
              </div>

              {/* Quick Summary of Recent Activity */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-700 flex items-center space-x-2">
                    <Activity className="w-4 h-4 text-indigo-600" />
                    <span>Recent Live System Events</span>
                  </h4>
                  <button
                    onClick={() => setActiveTab('monitor')}
                    className="text-indigo-600 hover:text-indigo-800 text-xs font-bold"
                  >
                    View All Logs →
                  </button>
                </div>

                <div className="space-y-2">
                  {activityLogs.slice(0, 5).map((log) => (
                    <div key={log.id} className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-3">
                        <span className={`w-2.5 h-2.5 rounded-full ${
                          log.action.includes('LOGIN') ? 'bg-emerald-500' :
                          log.action.includes('LOGOUT') ? 'bg-rose-500' :
                          log.action.includes('REGISTER') ? 'bg-sky-500' : 'bg-purple-500'
                        }`} />
                        <div>
                          <strong className="text-slate-900">{log.user_name}</strong>
                          <span className="text-slate-500 ml-1">({log.user_email})</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="font-bold text-slate-700">{log.action}</span>
                        <span className="text-slate-400 font-mono text-[11px]">{log.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LOGIN & LOGOUT REAL-TIME MONITOR */}
          {activeTab === 'monitor' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm flex items-center space-x-2">
                    <Activity className="w-4 h-4 text-indigo-600" />
                    <span>Real-Time Authentication & Session Monitor</span>
                  </h4>
                  <p className="text-xs text-slate-500">Live monitoring of user logins, logouts, registrations, and administrative changes</p>
                </div>

                {/* Filter buttons */}
                <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
                  {['ALL', 'LOGIN', 'LOGOUT', 'REGISTER'].map((flt) => (
                    <button
                      key={flt}
                      onClick={() => setLogFilter(flt)}
                      className={`px-3 py-1 rounded-lg transition-colors ${
                        logFilter === flt ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {flt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Activity Logs Table */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="p-3.5">Action Event</th>
                      <th className="p-3.5">User Identity</th>
                      <th className="p-3.5">Account Role</th>
                      <th className="p-3.5">IP Address</th>
                      <th className="p-3.5">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredLogs.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="p-8 text-center text-slate-400">
                          No session activity logs found for this filter.
                        </td>
                      </tr>
                    ) : (
                      filteredLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="p-3.5 font-bold">
                            {log.action === 'LOGIN' && (
                              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-lg flex items-center space-x-1.5 w-fit">
                                <LogIn className="w-3 h-3 text-emerald-600" />
                                <span>LOGGED IN</span>
                              </span>
                            )}
                            {log.action === 'LOGOUT' && (
                              <span className="bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-lg flex items-center space-x-1.5 w-fit">
                                <LogOut className="w-3 h-3 text-rose-600" />
                                <span>LOGGED OUT</span>
                              </span>
                            )}
                            {log.action === 'REGISTER' && (
                              <span className="bg-sky-50 text-sky-700 border border-sky-200 px-2 py-0.5 rounded-lg flex items-center space-x-1.5 w-fit">
                                <UserPlus className="w-3 h-3 text-sky-600" />
                                <span>NEW REGISTER</span>
                              </span>
                            )}
                            {!['LOGIN', 'LOGOUT', 'REGISTER'].includes(log.action) && (
                              <span className="bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded-lg w-fit block font-mono">
                                {log.action}
                              </span>
                            )}
                          </td>
                          <td className="p-3.5">
                            <strong className="text-slate-900 block">{log.user_name}</strong>
                            <span className="text-slate-400 font-mono text-[11px]">{log.user_email}</span>
                          </td>
                          <td className="p-3.5">
                            <span className={`px-2 py-0.5 rounded-md font-extrabold text-[10px] uppercase ${
                              log.role === 'admin'
                                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                : 'bg-slate-100 text-slate-600'
                            }`}>
                              {log.role}
                            </span>
                          </td>
                          <td className="p-3.5 font-mono text-slate-500 text-[11px]">{log.ip_address}</td>
                          <td className="p-3.5 font-mono text-slate-600">{log.timestamp}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: MANAGE PRODUCTS (ADDING & REMOVING PRODUCTS REAL-TIME) */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">Product Catalog Controller</h4>
                  <p className="text-xs text-slate-500">Add or remove products directly from the live database</p>
                </div>

                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors flex items-center space-x-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>{showAddForm ? 'Close Form' : 'Add New Product'}</span>
                </button>
              </div>

              {/* Add Product Modal Form */}
              {showAddForm && (
                <form onSubmit={handleAddProduct} className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4 animate-in fade-in duration-200">
                  <h5 className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center space-x-1.5">
                    <Plus className="w-4 h-4 text-indigo-600" />
                    <span>Create & Publish New Product to Database</span>
                  </h5>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                    <div className="sm:col-span-2">
                      <label className="block font-bold text-slate-600 mb-1">Product Title *</label>
                      <input
                        type="text"
                        value={newProd.name}
                        onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                        required
                        placeholder="e.g. Pure Silk Festive Embroidered Kurti"
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-hidden focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-600 mb-1">Category *</label>
                      <select
                        value={newProd.category}
                        onChange={(e) => setNewProd({ ...newProd, category: e.target.value })}
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-hidden focus:border-indigo-500"
                      >
                        <option value="women">Women Kurtis & Sarees</option>
                        <option value="sarees">Sarees & Lehengas</option>
                        <option value="men">Men Shirts & Kurtas</option>
                        <option value="kids">Kids Wear</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-600 mb-1">Brand Name *</label>
                      <input
                        type="text"
                        value={newProd.brand}
                        onChange={(e) => setNewProd({ ...newProd, brand: e.target.value })}
                        required
                        placeholder="e.g. Local Guru Silks"
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-hidden focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-600 mb-1">MRP Price (₹) *</label>
                      <input
                        type="number"
                        value={newProd.price}
                        onChange={(e) => setNewProd({ ...newProd, price: e.target.value })}
                        required
                        placeholder="1499"
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-hidden focus:border-indigo-500 font-bold"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-600 mb-1">Discount %</label>
                      <input
                        type="number"
                        value={newProd.discountPercent}
                        onChange={(e) => setNewProd({ ...newProd, discountPercent: e.target.value })}
                        placeholder="20"
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-hidden focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-600 mb-1">Stock Units</label>
                      <input
                        type="number"
                        value={newProd.stock}
                        onChange={(e) => setNewProd({ ...newProd, stock: e.target.value })}
                        placeholder="50"
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-hidden focus:border-indigo-500"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-bold text-slate-600 mb-1">Image URL</label>
                      <input
                        type="url"
                        value={newProd.images}
                        onChange={(e) => setNewProd({ ...newProd, images: e.target.value })}
                        placeholder="https://images.unsplash.com/photo-..."
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-hidden focus:border-indigo-500 text-xs font-mono"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block font-bold text-slate-600 mb-1">Product Description</label>
                      <textarea
                        rows="2"
                        value={newProd.description}
                        onChange={(e) => setNewProd({ ...newProd, description: e.target.value })}
                        placeholder="Enter fabric specifications, styling advice, and care instructions..."
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-hidden focus:border-indigo-500"
                      ></textarea>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md"
                    >
                      PUBLISH PRODUCT TO DATABASE
                    </button>
                  </div>
                </form>
              )}

              {/* Products Table */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="p-3.5">Product</th>
                      <th className="p-3.5">Category</th>
                      <th className="p-3.5">Price / Disc.</th>
                      <th className="p-3.5">Stock</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {productsList.map((prod) => (
                      <tr key={prod.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3.5 flex items-center space-x-3">
                          <img
                            src={prod.images?.[0] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=100'}
                            alt={prod.name}
                            className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                          />
                          <div>
                            <strong className="text-slate-900 line-clamp-1">{prod.name}</strong>
                            <span className="text-slate-400 text-[11px]">{prod.brand}</span>
                          </div>
                        </td>
                        <td className="p-3.5">
                          <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase">
                            {prod.category}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <strong className="text-slate-900">₹{prod.price}</strong>
                          {prod.discountPercent > 0 && (
                            <span className="text-emerald-600 text-[11px] font-bold ml-1.5">
                              ({prod.discountPercent}% off)
                            </span>
                          )}
                        </td>
                        <td className="p-3.5">
                          <span className={`font-bold px-2 py-0.5 rounded-md ${
                            prod.stock > 10 ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'
                          }`}>
                            {prod.stock} in stock
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => handleDeleteProduct(prod.id, prod.name)}
                            className="text-rose-600 hover:text-rose-800 hover:bg-rose-50 p-2 rounded-lg font-bold transition-colors inline-flex items-center space-x-1"
                            title="Remove product from database"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Remove</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: CUSTOMER ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">Customer Orders Manager</h4>
                  <p className="text-xs text-slate-500">Live order fulfillment and status update portal</p>
                </div>
              </div>

              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="p-3.5">Order ID</th>
                      <th className="p-3.5">Customer & Destination</th>
                      <th className="p-3.5">Amount</th>
                      <th className="p-3.5">Fulfillment Status</th>
                      <th className="p-3.5 text-right">Update Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {ordersList.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="p-8 text-center text-slate-400">
                          No orders placed yet.
                        </td>
                      </tr>
                    ) : (
                      ordersList.map((ord) => (
                        <tr key={ord.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-3.5 font-mono font-bold text-indigo-700">
                            {ord.order_number}
                            <span className="block text-[10px] text-slate-400">{ord.date}</span>
                          </td>
                          <td className="p-3.5">
                            <strong className="text-slate-900 block">{ord.address?.fullName || ord.user_email}</strong>
                            <span className="text-slate-500 text-[11px]">
                              {ord.address?.city}, {ord.address?.state} ({ord.address?.pincode})
                            </span>
                          </td>
                          <td className="p-3.5 font-bold text-slate-900">
                            ₹{ord.total_amount?.toLocaleString('en-IN')}
                            <span className="block text-[10px] text-slate-400">{ord.payment_method}</span>
                          </td>
                          <td className="p-3.5">
                            <span className={`px-2.5 py-1 rounded-full font-black text-[10px] uppercase ${
                              ord.order_status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                              ord.order_status === 'Shipped' ? 'bg-sky-100 text-sky-800' :
                              'bg-amber-100 text-amber-800'
                            }`}>
                              {ord.order_status}
                            </span>
                          </td>
                          <td className="p-3.5 text-right">
                            <select
                              value={ord.order_status}
                              onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                              className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 font-bold text-[11px] text-slate-700 outline-hidden"
                            >
                              <option value="Confirmed">Confirmed</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: USER PERMISSIONS & ROLES */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-extrabold text-slate-900 text-sm">User Directory & Role Access Control</h4>
                <p className="text-xs text-slate-500">Assign administrator rights or manage customer login access</p>
              </div>

              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="p-3.5">User</th>
                      <th className="p-3.5">Contact Details</th>
                      <th className="p-3.5">Verification</th>
                      <th className="p-3.5">Role</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Admin Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {usersList.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3.5 font-bold text-slate-900">{u.full_name}</td>
                        <td className="p-3.5">
                          <span className="block font-mono text-slate-700">{u.email}</span>
                          <span className="block font-mono text-[11px] text-slate-500">{u.mobile}</span>
                        </td>
                        <td className="p-3.5">
                          <div className="flex items-center space-x-1">
                            {u.is_mobile_verified && (
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                                OTP ✓
                              </span>
                            )}
                            {u.is_email_verified && (
                              <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                                Email ✓
                              </span>
                            )}
                            {!u.is_mobile_verified && !u.is_email_verified && (
                              <span className="text-[10px] text-slate-400">Standard</span>
                            )}
                          </div>
                        </td>
                        <td className="p-3.5">
                          <span className={`px-2.5 py-0.5 rounded-full font-black text-[10px] uppercase ${
                            u.role === 'admin'
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            {u.role === 'admin' ? 'Store Admin' : 'Customer'}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                            u.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                          }`}>
                            {u.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-right space-x-2">
                          <button
                            onClick={() => handleToggleUserRole(u.id, u.role)}
                            className="text-indigo-600 hover:text-indigo-800 font-bold text-[11px] hover:underline"
                            title="Toggle Admin role"
                          >
                            {u.role === 'admin' ? 'Revoke Admin' : 'Make Admin'}
                          </button>
                          <button
                            onClick={() => handleToggleUserStatus(u.id)}
                            className={`font-bold text-[11px] hover:underline ${
                              u.status === 'Active' ? 'text-rose-600' : 'text-emerald-600'
                            }`}
                          >
                            {u.status === 'Active' ? 'Block User' : 'Unblock'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
