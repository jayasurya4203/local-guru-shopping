import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Mail,
  Smartphone,
  MapPin,
  ShoppingBag,
  ShieldCheck,
  Plus,
  Trash2,
  CheckCircle2,
  LogOut,
  Building,
  Home,
  Check,
  Clock,
  Package
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import API_BASE_URL from '../api/config';

export default function UserProfileModal({ isOpen, onClose, onLogout, onOpenAdmin }) {
  if (!isOpen) return null;

  const { user, getUserAddresses, addUserAddress, deleteUserAddress, setDefaultUserAddress } = useAuth();
  const [activeTab, setActiveTab] = useState('addresses'); // 'addresses' | 'orders' | 'details'
  
  // Addresses State
  const [addresses, setAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  const [newAddr, setNewAddr] = useState({
    recipient_name: user?.full_name || '',
    phone: user?.mobile || '',
    house_no: '',
    street: '',
    landmark: '',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560001',
    address_type: 'Home',
    is_default: false
  });

  // Orders State
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Feedback
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const loadAddresses = async () => {
    if (!user?.id) return;
    setLoadingAddresses(true);
    const list = await getUserAddresses(user.id);
    setAddresses(list);
    setLoadingAddresses(false);
  };

  const loadOrders = async () => {
    if (!user?.id) return;
    setLoadingOrders(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/orders?user_id=${user.id}`);
      setOrders(res.data.orders || []);
    } catch (e) {
      console.error('Failed to load user orders', e);
    }
    setLoadingOrders(false);
  };

  useEffect(() => {
    if (user?.id) {
      loadAddresses();
      loadOrders();
    }
  }, [user]);

  const handleCreateAddress = async (e) => {
    e.preventDefault();
    if (!newAddr.street || !newAddr.city || !newAddr.pincode) {
      setFeedbackMsg('Street, City, and Pincode are required.');
      return;
    }

    const res = await addUserAddress(user.id, newAddr);
    if (res.success) {
      setFeedbackMsg('Delivery address saved successfully ✓');
      setShowAddAddressForm(false);
      setNewAddr({
        recipient_name: user?.full_name || '',
        phone: user?.mobile || '',
        house_no: '',
        street: '',
        landmark: '',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560001',
        address_type: 'Home',
        is_default: false
      });
      loadAddresses();
    } else {
      setFeedbackMsg(res.error || 'Failed to save address');
    }
  };

  const handleDeleteAddr = async (addrId) => {
    const res = await deleteUserAddress(addrId);
    if (res.success) {
      setFeedbackMsg('Address deleted ✓');
      loadAddresses();
    }
  };

  const handleSetDefaultAddr = async (addrId) => {
    const res = await setDefaultUserAddress(addrId);
    if (res.success) {
      setFeedbackMsg('Default delivery address updated ✓');
      loadAddresses();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-100 relative my-6 flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Header Profile Bar */}
        <div className="p-6 bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white flex items-center justify-between sticky top-0 z-20 shadow-md">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600/60 border border-indigo-400/40 flex items-center justify-center text-white font-extrabold text-2xl shadow-inner">
              {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-extrabold text-xl tracking-tight text-white">{user?.full_name || 'Shopper'}</h3>
                {user?.role === 'admin' ? (
                  <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center space-x-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Store Admin</span>
                  </span>
                ) : (
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Verified Customer</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 font-mono mt-0.5">{user?.email || 'user@example.com'}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Verification Status Banner */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1.5">
              <Smartphone className="w-4 h-4 text-slate-500" />
              <span className="font-medium text-slate-600">Mobile: <strong className="text-slate-900">{user?.mobile}</strong></span>
              {user?.is_mobile_verified ? (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-md flex items-center space-x-1">
                  <Check className="w-3 h-3" />
                  <span>OTP Verified</span>
                </span>
              ) : (
                <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">Pending</span>
              )}
            </div>

            <div className="flex items-center space-x-1.5">
              <Mail className="w-4 h-4 text-slate-500" />
              <span className="font-medium text-slate-600">Email:</span>
              {user?.is_email_verified ? (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-md flex items-center space-x-1">
                  <Check className="w-3 h-3" />
                  <span>Verified</span>
                </span>
              ) : (
                <span className="text-[10px] font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded-md">Standard</span>
              )}
            </div>
          </div>

          {user?.role === 'admin' && (
            <button
              onClick={() => {
                onClose();
                onOpenAdmin();
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-3 py-1.5 rounded-xl transition-colors flex items-center space-x-1 shadow-xs"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Launch Admin Dashboard →</span>
            </button>
          )}
        </div>

        {/* Tab Switcher */}
        <div className="bg-white border-b border-slate-200 px-6 flex items-center space-x-6 text-xs font-bold">
          <button
            onClick={() => setActiveTab('addresses')}
            className={`py-3.5 border-b-2 flex items-center space-x-1.5 transition-colors ${
              activeTab === 'addresses'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Saved Addresses ({addresses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3.5 border-b-2 flex items-center space-x-1.5 transition-colors ${
              activeTab === 'orders'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>My Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('details')}
            className={`py-3.5 border-b-2 flex items-center space-x-1.5 transition-colors ${
              activeTab === 'details'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Account & Security</span>
          </button>
        </div>

        {/* Feedback alert */}
        {feedbackMsg && (
          <div className="mx-6 mt-4 p-3 bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs rounded-xl flex items-center justify-between">
            <span>{feedbackMsg}</span>
            <button onClick={() => setFeedbackMsg('')} className="text-indigo-600 font-bold ml-2">×</button>
          </div>
        )}

        {/* TAB 1: SAVED ADDRESSES */}
        {activeTab === 'addresses' && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-extrabold text-slate-900 text-sm">Delivery Addresses</h4>
                <p className="text-xs text-slate-500">Manage shipping addresses for faster 1-click checkout</p>
              </div>
              <button
                onClick={() => setShowAddAddressForm(!showAddAddressForm)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-colors flex items-center space-x-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>{showAddAddressForm ? 'Cancel' : 'Add New Address'}</span>
              </button>
            </div>

            {/* Add Address Form */}
            {showAddAddressForm && (
              <form onSubmit={handleCreateAddress} className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4 animate-in fade-in duration-200">
                <h5 className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center space-x-1.5">
                  <MapPin className="w-4 h-4 text-indigo-600" />
                  <span>Enter New Delivery Address</span>
                </h5>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-600 mb-1">Recipient Full Name</label>
                    <input
                      type="text"
                      value={newAddr.recipient_name}
                      onChange={(e) => setNewAddr({ ...newAddr, recipient_name: e.target.value })}
                      required
                      placeholder="e.g. Jaya Surya"
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-hidden focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-600 mb-1">Contact Phone Number</label>
                    <input
                      type="tel"
                      value={newAddr.phone}
                      onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                      required
                      placeholder="e.g. +91 7386846024"
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-hidden focus:border-indigo-500 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-600 mb-1">House / Flat / Floor No.</label>
                    <input
                      type="text"
                      value={newAddr.house_no}
                      onChange={(e) => setNewAddr({ ...newAddr, house_no: e.target.value })}
                      placeholder="e.g. Flat 402, Lotus Residency"
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-hidden focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-600 mb-1">Street Address & Colony *</label>
                    <input
                      type="text"
                      value={newAddr.street}
                      onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })}
                      required
                      placeholder="e.g. MG Road, Near Market"
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-hidden focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-600 mb-1">Landmark (Optional)</label>
                    <input
                      type="text"
                      value={newAddr.landmark}
                      onChange={(e) => setNewAddr({ ...newAddr, landmark: e.target.value })}
                      placeholder="e.g. Opposite City Mall"
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-hidden focus:border-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-slate-600 mb-1">City *</label>
                      <input
                        type="text"
                        value={newAddr.city}
                        onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                        required
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-hidden focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-600 mb-1">Pincode *</label>
                      <input
                        type="text"
                        value={newAddr.pincode}
                        onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })}
                        required
                        className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-hidden focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-600 mb-1">State *</label>
                    <input
                      type="text"
                      value={newAddr.state}
                      onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                      required
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-hidden focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-600 mb-1">Address Type</label>
                    <select
                      value={newAddr.address_type}
                      onChange={(e) => setNewAddr({ ...newAddr, address_type: e.target.value })}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-hidden focus:border-indigo-500"
                    >
                      <option value="Home">Home (7 AM - 9 PM)</option>
                      <option value="Work">Work / Office (10 AM - 6 PM)</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-xs pt-1">
                  <input
                    type="checkbox"
                    id="isDefaultCheck"
                    checked={newAddr.is_default}
                    onChange={(e) => setNewAddr({ ...newAddr, is_default: e.target.checked })}
                    className="rounded text-indigo-600"
                  />
                  <label htmlFor="isDefaultCheck" className="text-slate-700 font-medium cursor-pointer">
                    Set this as my default shipping address
                  </label>
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddAddressForm(false)}
                    className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md"
                  >
                    SAVE ADDRESS TO DATABASE
                  </button>
                </div>
              </form>
            )}

            {/* Address List */}
            {loadingAddresses ? (
              <p className="text-xs text-slate-400 py-6 text-center">Loading saved addresses from database...</p>
            ) : addresses.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
                <MapPin className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-600">No saved addresses found.</p>
                <p className="text-[11px] text-slate-400 mt-1">Add your delivery location above for fast express checkout.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`p-4 rounded-2xl border transition-all relative ${
                      addr.is_default
                        ? 'border-indigo-600 bg-indigo-50/40 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-extrabold text-slate-900">{addr.recipient_name}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 flex items-center space-x-1">
                          {addr.address_type === 'Work' ? <Building className="w-2.5 h-2.5" /> : <Home className="w-2.5 h-2.5" />}
                          <span>{addr.address_type}</span>
                        </span>
                      </div>
                      {addr.is_default && (
                        <span className="text-[10px] font-black text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full border border-indigo-200">
                          DEFAULT
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {addr.house_no ? `${addr.house_no}, ` : ''}{addr.street}
                      {addr.landmark ? `, Near ${addr.landmark}` : ''}
                      <br />
                      {addr.city}, {addr.state} - <strong className="text-slate-800">{addr.pincode}</strong>
                    </p>

                    <p className="text-xs font-mono font-bold text-slate-700 mt-2">
                      Phone: {addr.phone}
                    </p>

                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      {!addr.is_default ? (
                        <button
                          onClick={() => handleSetDefaultAddr(addr.id)}
                          className="text-indigo-600 hover:text-indigo-800 font-bold text-[11px]"
                        >
                          Make Default
                        </button>
                      ) : (
                        <span className="text-emerald-600 font-bold text-[11px] flex items-center space-x-1">
                          <Check className="w-3 h-3" />
                          <span>Selected</span>
                        </span>
                      )}

                      <button
                        onClick={() => handleDeleteAddr(addr.id)}
                        className="text-rose-500 hover:text-rose-700 font-bold text-[11px] flex items-center space-x-1"
                        title="Delete Address"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MY ORDERS */}
        {activeTab === 'orders' && (
          <div className="p-6 sm:p-8 space-y-4">
            <h4 className="font-extrabold text-slate-900 text-sm">Your Order History</h4>
            {loadingOrders ? (
              <p className="text-xs text-slate-400 py-6 text-center">Loading orders from database...</p>
            ) : orders.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
                <Package className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-600">No orders placed yet.</p>
                <p className="text-[11px] text-slate-400 mt-1">Explore our shopping mall catalog and place your first order!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="p-4 bg-white border border-slate-200 rounded-2xl space-y-3 shadow-xs">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                      <div>
                        <span className="text-xs font-mono font-black text-indigo-700">{order.order_number}</span>
                        <span className="text-xs text-slate-400 ml-2">{order.date}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                          {order.order_status}
                        </span>
                        <span className="text-xs font-black text-slate-900">₹{order.total_amount?.toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    <div className="text-xs text-slate-600 space-y-1">
                      <p><strong>Payment Method:</strong> {order.payment_method} ({order.payment_status})</p>
                      {order.address && (
                        <p className="text-slate-500">
                          <strong>Delivery To:</strong> {order.address.fullName || order.address.recipient_name}, {order.address.city} - {order.address.pincode}
                        </p>
                      )}
                    </div>

                    {order.items && order.items.length > 0 && (
                      <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-2">
                        {order.items.map((it, idx) => (
                          <div key={idx} className="flex items-center space-x-2 bg-slate-50 px-2 py-1 rounded-lg text-[11px] border border-slate-100">
                            <span className="font-bold text-slate-800">{it.product?.name || 'Fashion Item'}</span>
                            <span className="text-slate-400">×{it.quantity}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ACCOUNT & SECURITY */}
        {activeTab === 'details' && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
              <h5 className="font-bold text-xs uppercase tracking-wider text-slate-700">Account Credentials & Role</h5>
              <div className="grid sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block font-semibold">Full Legal Name</span>
                  <span className="text-slate-900 font-bold">{user?.full_name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold">Registered Email Address</span>
                  <span className="text-slate-900 font-mono font-bold">{user?.email}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold">Registered Phone Number</span>
                  <span className="text-slate-900 font-mono font-bold">{user?.mobile}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold">Security Level & Role</span>
                  <span className="text-indigo-600 font-bold uppercase">{user?.role === 'admin' ? 'Store Administrator (Full Access)' : 'Standard Customer (Shopping & Orders)'}</span>
                </div>
              </div>
            </div>

            {/* Logout Action */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <h5 className="font-bold text-xs text-slate-800">Sign Out of Session</h5>
                <p className="text-[11px] text-slate-400">Terminates active session and notifies backend activity log</p>
              </div>

              <button
                onClick={onLogout}
                className="bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-extrabold text-xs px-4 py-2.5 rounded-xl transition-colors flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>SIGN OUT OF ACCOUNT</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
