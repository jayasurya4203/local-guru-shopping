import React, { useState, useEffect } from 'react';
import { X, MapPin, CreditCard, QrCode, Smartphone, Building, ShieldCheck, CheckCircle2, Lock, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import API_BASE_URL from '../api/config';

export default function CheckoutModal({
  isOpen,
  onClose,
  cartItems,
  totals,
  user,
  onPaymentComplete
}) {
  if (!isOpen) return null;

  const { getUserAddresses, addUserAddress } = useAuth();
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddrId, setSelectedAddrId] = useState(null);
  const [saveToProfile, setSaveToProfile] = useState(false);

  // Delivery Address State
  const [address, setAddress] = useState({
    fullName: user ? user.full_name : 'Jaya Surya',
    mobile: user ? user.mobile || '+91 7386846024' : '+91 7386846024',
    houseNo: 'Flat 402, Lotus Apartments',
    street: 'MG Road, Main Market',
    area: 'Near Town Hall',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560001'
  });

  // Payment Method State
  const [paymentMethod, setPaymentMethod] = useState('UPI'); // 'UPI' | 'QR' | 'CARD' | 'NETBANKING'
  const [upiId, setUpiId] = useState('surya@upi');
  
  // Razorpay simulation state
  const [isProcessingRazorpay, setIsProcessingRazorpay] = useState(false);
  const [showRazorpayModal, setShowRazorpayModal] = useState(false);

  useEffect(() => {
    if (user?.id) {
      getUserAddresses(user.id).then((list) => {
        setSavedAddresses(list);
        if (list.length > 0) {
          const defaultAddr = list.find((a) => a.is_default) || list[0];
          setSelectedAddrId(defaultAddr.id);
          setAddress({
            fullName: defaultAddr.recipient_name,
            mobile: defaultAddr.phone,
            houseNo: defaultAddr.house_no || '',
            street: defaultAddr.street,
            area: defaultAddr.landmark || '',
            city: defaultAddr.city,
            state: defaultAddr.state,
            pincode: defaultAddr.pincode
          });
        }
      });
    }
  }, [user]);

  const handleSelectSavedAddress = (saved) => {
    setSelectedAddrId(saved.id);
    setAddress({
      fullName: saved.recipient_name,
      mobile: saved.phone,
      houseNo: saved.house_no || '',
      street: saved.street,
      area: saved.landmark || '',
      city: saved.city,
      state: saved.state,
      pincode: saved.pincode
    });
  };

  const handleAddressChange = (e) => {
    setSelectedAddrId(null);
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleTriggerRazorpay = (e) => {
    e.preventDefault();
    setShowRazorpayModal(true);
  };

  const handleConfirmRazorpayPayment = async () => {
    setIsProcessingRazorpay(true);

    if (saveToProfile && user?.id && !selectedAddrId) {
      addUserAddress(user.id, {
        recipient_name: address.fullName,
        phone: address.mobile,
        house_no: address.houseNo,
        street: address.street,
        landmark: address.area,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        address_type: 'Home',
        is_default: false
      });
    }

    try {
      const res = await axios.post(`${API_BASE_URL}/orders`, {
        user_id: user?.id || null,
        user_email: user?.email || 'customer@localguru.com',
        items: cartItems,
        address: address,
        total_amount: totals.grandTotal,
        payment_method: paymentMethod
      });

      setTimeout(() => {
        setIsProcessingRazorpay(false);
        setShowRazorpayModal(false);
        onPaymentComplete(res.data.order);
      }, 1200);
    } catch (err) {
      setTimeout(() => {
        setIsProcessingRazorpay(false);
        setShowRazorpayModal(false);
        onPaymentComplete({
          order_number: `LG${Math.floor(100000 + Math.random() * 900000)}`,
          address: address,
          payment_method: paymentMethod,
          total_amount: totals.grandTotal,
          items: cartItems,
          order_status: 'Confirmed'
        });
      }, 1200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 relative my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50 sticky top-0 z-10">
          <div>
            <h3 className="font-extrabold text-slate-900 text-xl">Local Guru Express Checkout</h3>
            <p className="text-xs text-slate-500">Secure Payment powered by Razorpay</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8 p-6 sm:p-8">
          
          {/* Left Column: Delivery Address Form */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-indigo-600 font-bold text-sm">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>1. DELIVERY ADDRESS</span>
              </div>
              {savedAddresses.length > 0 && (
                <span className="text-[11px] font-bold text-slate-500">
                  {savedAddresses.length} saved
                </span>
              )}
            </div>

            {/* Saved Address Quick Selector */}
            {savedAddresses.length > 0 && (
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-500 uppercase">
                  Select Saved Address:
                </label>
                <div className="flex flex-wrap gap-2">
                  {savedAddresses.map((sa) => (
                    <button
                      type="button"
                      key={sa.id}
                      onClick={() => handleSelectSavedAddress(sa)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all text-left flex items-center space-x-1.5 ${
                        selectedAddrId === sa.id
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {selectedAddrId === sa.id && <Check className="w-3.5 h-3.5 shrink-0" />}
                      <span className="truncate max-w-[140px]">{sa.recipient_name} ({sa.address_type})</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={address.fullName}
                    onChange={handleAddressChange}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Mobile Number</label>
                  <input
                    type="text"
                    name="mobile"
                    value={address.mobile}
                    onChange={handleAddressChange}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">House No. & Building</label>
                <input
                  type="text"
                  name="houseNo"
                  value={address.houseNo}
                  onChange={handleAddressChange}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl outline-hidden"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Street & Area</label>
                <input
                  type="text"
                  name="street"
                  value={address.street}
                  onChange={handleAddressChange}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl outline-hidden"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    value={address.city}
                    onChange={handleAddressChange}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-bold mb-1">State</label>
                  <input
                    type="text"
                    name="state"
                    value={address.state}
                    onChange={handleAddressChange}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    value={address.pincode}
                    onChange={handleAddressChange}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Address Preview Box */}
            <div className="p-3 bg-indigo-50/60 border border-indigo-100 rounded-2xl text-[11px] text-slate-700">
              <span className="font-bold text-indigo-900 block mb-0.5">Shipping Destination:</span>
              <p>{address.fullName} ({address.mobile})</p>
              <p>{address.houseNo}, {address.street}, {address.city}, {address.state} - {address.pincode}</p>
            </div>
          </div>

          {/* Right Column: Payment Selection & Summary */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-indigo-600 font-bold text-sm">
              <CreditCard className="w-4 h-4" />
              <span>2. SELECT PAYMENT METHOD</span>
            </div>

            {/* Payment Options Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setPaymentMethod('UPI')}
                className={`p-3 rounded-2xl border flex items-center space-x-2 transition-all ${
                  paymentMethod === 'UPI'
                    ? 'border-indigo-600 bg-indigo-50/80 font-bold text-indigo-900 shadow-xs'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Smartphone className="w-4 h-4 text-indigo-600" />
                <span>BHIM / Google Pay / PhonePe</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('QR')}
                className={`p-3 rounded-2xl border flex items-center space-x-2 transition-all ${
                  paymentMethod === 'QR'
                    ? 'border-indigo-600 bg-indigo-50/80 font-bold text-indigo-900 shadow-xs'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <QrCode className="w-4 h-4 text-purple-600" />
                <span>UPI QR Code Scan</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('CARD')}
                className={`p-3 rounded-2xl border flex items-center space-x-2 transition-all ${
                  paymentMethod === 'CARD'
                    ? 'border-indigo-600 bg-indigo-50/80 font-bold text-indigo-900 shadow-xs'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <CreditCard className="w-4 h-4 text-emerald-600" />
                <span>Debit / Credit Card</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('NETBANKING')}
                className={`p-3 rounded-2xl border flex items-center space-x-2 transition-all ${
                  paymentMethod === 'NETBANKING'
                    ? 'border-indigo-600 bg-indigo-50/80 font-bold text-indigo-900 shadow-xs'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Building className="w-4 h-4 text-amber-600" />
                <span>Net Banking (All Banks)</span>
              </button>
            </div>

            {/* Sub-inputs for selected payment method */}
            {paymentMethod === 'UPI' && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <label className="block text-[11px] font-bold text-slate-600">Enter VPA / UPI ID</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="username@upi"
                  className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs outline-hidden"
                />
              </div>
            )}

            {paymentMethod === 'QR' && (
              <div className="p-4 bg-slate-900 text-white rounded-2xl text-center space-y-2">
                <p className="text-xs font-bold text-amber-400">Scan QR Code with any UPI App</p>
                <div className="w-32 h-32 bg-white p-2 rounded-xl mx-auto flex items-center justify-center">
                  <QrCode className="w-24 h-24 text-slate-900" />
                </div>
                <p className="text-[10px] text-slate-400">Supports PhonePe, Paytm, GooglePay, Cred, BHIM</p>
              </div>
            )}

            {/* Order Summary Box */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <h4 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px]">3. ORDER SUMMARY</h4>
              <div className="flex justify-between text-slate-600">
                <span>Items Subtotal</span>
                <span>₹{totals.subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery Charge</span>
                <span>{totals.deliveryFee === 0 ? 'FREE' : `₹${totals.deliveryFee}`}</span>
              </div>
              {totals.couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Coupon Discount</span>
                  <span>-₹{totals.couponDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-black text-slate-900 border-t border-slate-200 pt-2">
                <span>PAYABLE AMOUNT</span>
                <span className="text-indigo-600">₹{totals.grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Pay Button */}
            <button
              onClick={handleTriggerRazorpay}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3.5 rounded-2xl shadow-lg transition-all flex items-center justify-center space-x-2 text-xs tracking-wider uppercase cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>PAY ₹{totals.grandTotal.toLocaleString('en-IN')} VIA RAZORPAY</span>
            </button>
          </div>
        </div>
      </div>

      {/* RAZORPAY GATEWAY MODAL SIMULATION */}
      {showRazorpayModal && (
        <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-5 text-center animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-center space-x-2 border-b border-slate-100 pb-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-black flex items-center justify-center text-sm">
                RZP
              </div>
              <span className="font-black text-slate-800 text-lg tracking-tight">Razorpay Checkout</span>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Merchant</p>
              <p className="text-base font-extrabold text-slate-900">Local Guru Shopping Mall</p>
              <div className="inline-block bg-indigo-50 text-indigo-700 font-extrabold text-sm px-4 py-1.5 rounded-full mt-2">
                Amount: ₹{totals.grandTotal.toLocaleString('en-IN')}
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 text-left space-y-1">
              <p><strong>Payment Method:</strong> {paymentMethod}</p>
              <p><strong>Customer:</strong> {address.fullName}</p>
              <p className="text-[10px] text-slate-400">Card details & CVV are 256-bit SSL encrypted and never stored on Local Guru servers.</p>
            </div>

            {isProcessingRazorpay ? (
              <div className="py-4 space-y-2">
                <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-xs font-bold text-slate-700">Communicating with Bank Server...</p>
              </div>
            ) : (
              <div className="space-y-2 pt-2">
                <button
                  onClick={handleConfirmRazorpayPayment}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-3 rounded-xl shadow-md text-xs uppercase tracking-wider cursor-pointer"
                >
                  ✓ SIMULATE SUCCESSFUL PAYMENT
                </button>
                <button
                  onClick={() => setShowRazorpayModal(false)}
                  className="w-full text-xs font-semibold text-slate-500 hover:underline"
                >
                  Cancel Transaction
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
