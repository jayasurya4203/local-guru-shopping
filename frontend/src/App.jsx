import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import ProductCard from './components/ProductCard';
import ProductDetailModal from './components/ProductDetailModal';
import AuthModal from './components/AuthModal';
import UserProfileModal from './components/UserProfileModal';
import CartDrawer from './components/CartDrawer';
import WishlistDrawer from './components/WishlistDrawer';
import CheckoutModal from './components/CheckoutModal';
import OrderConfirmationModal from './components/OrderConfirmationModal';
import AdminDashboardModal from './components/AdminDashboardModal';
import Footer from './components/Footer';
import { useAuth } from './context/AuthContext';
import axios from 'axios';
import API_BASE_URL from './api/config';

import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_COUPONS,
  INITIAL_REVIEWS
} from './data/mockData';

import { SlidersHorizontal, Sparkles, Filter, CheckCircle2 } from 'lucide-react';

export default function App() {
  const { user, logout } = useAuth();

  // Master State
  const [categories] = useState(INITIAL_CATEGORIES);
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [coupons] = useState(INITIAL_COUPONS);
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([
    { id: 1, full_name: 'Surya Prakash', email: 'surya@example.com', mobile: '+91 98765 43210', status: 'Active' },
    { id: 2, full_name: 'Ananya Reddy', email: 'ananya@example.com', mobile: '+91 91234 56789', status: 'Active' }
  ]);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Load products from real-time database
  useEffect(() => {
    axios.get(`${API_BASE_URL}/products`)
      .then((res) => {
        if (res.data?.products?.length > 0) {
          setProducts(res.data.products);
        }
      })
      .catch((err) => console.log('Products fetch fallback to mock', err));
  }, []);

  // Filters & Search State
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceFilter, setPriceFilter] = useState('all'); // 'all' | 'under500' | '500-1000' | '1000-2000' | 'above2000'
  const [sizeFilter, setSizeFilter] = useState('all');

  // Modals & Drawers Visibility State
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [latestOrderConfirmed, setLatestOrderConfirmed] = useState(null);
  const [checkoutTotals, setCheckoutTotals] = useState({ subtotal: 0, deliveryFee: 0, couponDiscount: 0, grandTotal: 0 });

  // Notification Toast
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Cart Operations
  const handleAddToCart = (product, size = null, color = null, quantity = 1) => {
    const itemSize = size || (product.sizes ? product.sizes[0] : 'Free Size');
    const itemColor = color || (product.colors ? product.colors[0].name : 'Default');

    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.size === itemSize && item.color === itemColor
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [...prev, { product, size: itemSize, color: itemColor, quantity }];
    });

    showToast(`Added "${product.name}" to Cart!`);
  };

  const handleUpdateQuantity = (productId, size, color, newQty) => {
    if (newQty <= 0) {
      handleRemoveCartItem(productId, size, color);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId && item.size === size && item.color === color
          ? { ...item, quantity: newQty }
          : item
      )
    );
  };

  const handleRemoveCartItem = (productId, size, color) => {
    setCartItems((prev) =>
      prev.filter((item) => !(item.product.id === productId && item.size === size && item.color === color))
    );
  };

  // Wishlist Operations
  const handleToggleWishlist = (product) => {
    const exists = wishlistItems.some((item) => item.id === product.id);
    if (exists) {
      setWishlistItems((prev) => prev.filter((item) => item.id !== product.id));
      showToast('Removed from Wishlist');
    } else {
      setWishlistItems((prev) => [...prev, product]);
      showToast(`Saved "${product.name}" to Wishlist ❤️`);
    }
  };

  const handleMoveToCart = (product) => {
    handleAddToCart(product);
    setWishlistItems((prev) => prev.filter((item) => item.id !== product.id));
  };

  // Checkout & Payment Complete
  const handleProceedToCheckout = (totals) => {
    setCheckoutTotals(totals);
    setIsCheckoutOpen(true);
  };

  const handlePaymentComplete = (orderData) => {
    setIsCheckoutOpen(false);
    setOrders((prev) => [orderData, ...prev]);
    setLatestOrderConfirmed(orderData);
    setCartItems([]);
  };

  // Admin Actions
  const handleAddProduct = (newProduct) => {
    setProducts((prev) => [newProduct, ...prev]);
    showToast(`New Product "${newProduct.name}" created!`);
  };

  const handleDeleteProduct = (productId) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    showToast('Product removed from database');
  };

  const handleToggleUserStatus = (userId) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: u.status === 'Active' ? 'Blocked' : 'Active' } : u))
    );
    showToast('User account status updated');
  };

  // Review Addition
  const handleAddReview = (newReview) => {
    setReviews((prev) => [newReview, ...prev]);
    showToast('Thank you! Review published.');
  };

  // Filter Logic
  const filteredProducts = products.filter((prod) => {
    // Category filter
    if (selectedCategory !== 'all' && prod.category !== selectedCategory) {
      return false;
    }
    // Search query
    if (
      searchQuery &&
      !prod.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !prod.brand.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    // Price filter
    const finalPrice = Math.round(prod.price * (1 - (prod.discountPercent || 0) / 100));
    if (priceFilter === 'under500' && finalPrice >= 500) return false;
    if (priceFilter === '500-1000' && (finalPrice < 500 || finalPrice > 1000)) return false;
    if (priceFilter === '1000-2000' && (finalPrice < 1000 || finalPrice > 2000)) return false;
    if (priceFilter === 'above2000' && finalPrice <= 2000) return false;

    // Size filter
    if (sizeFilter !== 'all' && prod.sizes && !prod.sizes.includes(sizeFilter)) {
      return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-2xl flex items-center space-x-2 animate-in fade-in slide-in-from-bottom duration-300 border border-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Header Navbar */}
      <Navbar
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        wishlistCount={wishlistItems.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        user={user}
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6">
        
        {/* Hero Banner Section */}
        <HeroBanner onShopNow={() => setSelectedCategory('all')} />

        {/* Category Pills Navigation */}
        <div className="my-6 flex items-center space-x-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center space-x-2 ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-md scale-105'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Sparkles className={`w-3.5 h-3.5 ${selectedCategory === cat.id ? 'text-amber-300' : 'text-indigo-500'}`} />
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Filters & Control Toolbar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 mb-8 flex flex-wrap items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center space-x-2 text-xs font-extrabold text-slate-800">
            <Filter className="w-4 h-4 text-indigo-600" />
            <span>FILTER PRODUCTS ({filteredProducts.length} Results)</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            {/* Price Filter */}
            <div className="flex items-center space-x-1.5">
              <span className="text-slate-400 font-semibold">Price:</span>
              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-bold text-slate-700 outline-hidden"
              >
                <option value="all">All Prices</option>
                <option value="under500">Under ₹500</option>
                <option value="500-1000">₹500 – ₹1,000</option>
                <option value="1000-2000">₹1,000 – ₹2,000</option>
                <option value="above2000">Above ₹2,000</option>
              </select>
            </div>

            {/* Size Filter */}
            <div className="flex items-center space-x-1.5">
              <span className="text-slate-400 font-semibold">Size:</span>
              <select
                value={sizeFilter}
                onChange={(e) => setSizeFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-bold text-slate-700 outline-hidden"
              >
                <option value="all">All Sizes</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-xs">
            <h3 className="font-extrabold text-slate-800 text-lg">No Products Found</h3>
            <p className="text-xs text-slate-400 mt-1">Try resetting your price or category filters.</p>
            <button
              onClick={() => { setSelectedCategory('all'); setPriceFilter('all'); setSizeFilter('all'); setSearchQuery(''); }}
              className="mt-4 bg-indigo-600 text-white text-xs font-bold px-4 py-2 rounded-xl"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelectProduct={(p) => setSelectedProduct(p)}
                onAddToCart={(p) => handleAddToCart(p)}
                onToggleWishlist={handleToggleWishlist}
                isWishlisted={wishlistItems.some((w) => w.id === product.id)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modals & Drawers */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={(p, sz, clr, qty) => {
            handleAddToCart(p, sz, clr, qty);
            setSelectedProduct(null);
          }}
          onBuyNow={(p, sz, clr, qty) => {
            handleAddToCart(p, sz, clr, qty);
            setSelectedProduct(null);
            setIsCartOpen(true);
          }}
          onToggleWishlist={handleToggleWishlist}
          isWishlisted={wishlistItems.some((w) => w.id === selectedProduct.id)}
          reviews={reviews}
          onAddReview={handleAddReview}
        />
      )}

      {isAuthOpen && (
        <AuthModal
          onClose={() => setIsAuthOpen(false)}
          onLoginSuccess={(usr) => {
            showToast(`Welcome ${usr.full_name}!`);
          }}
        />
      )}

      {isProfileOpen && (
        <UserProfileModal
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          onLogout={async () => {
            await logout();
            setIsProfileOpen(false);
            showToast('Logged out successfully');
          }}
          onOpenAdmin={() => {
            setIsProfileOpen(false);
            setIsAdminOpen(true);
          }}
        />
      )}

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={handleProceedToCheckout}
        coupons={coupons}
      />

      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistItems={wishlistItems}
        onMoveToCart={handleMoveToCart}
        onRemoveFromWishlist={(id) => setWishlistItems((prev) => prev.filter((item) => item.id !== id))}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        totals={checkoutTotals}
        user={user}
        onPaymentComplete={handlePaymentComplete}
      />

      {latestOrderConfirmed && (
        <OrderConfirmationModal
          orderDetails={latestOrderConfirmed}
          onClose={() => setLatestOrderConfirmed(null)}
          onViewOrders={() => {
            setLatestOrderConfirmed(null);
            if (user?.role === 'admin') {
              setIsAdminOpen(true);
            } else {
              setIsProfileOpen(true);
            }
          }}
        />
      )}

      {/* Admin Dashboard: ONLY ACCESSIBLE TO AUTHENTICATED STORE ADMIN */}
      {isAdminOpen && user?.role === 'admin' && (
        <AdminDashboardModal
          isOpen={isAdminOpen}
          onClose={() => setIsAdminOpen(false)}
          currentUser={user}
          onSyncProducts={(prods) => setProducts(prods)}
        />
      )}

      {/* Main Footer */}
      <Footer />
    </div>
  );
}
