import React, { useState, useEffect, useRef } from 'react';
import Navbar, { MobileDock } from './components/Navbar';
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

import { CheckCircle2, SlidersHorizontal } from 'lucide-react';

function readStore(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

const COLLECTIONS = [
  { id: 'all', label: 'All' },
  { id: 'trending', label: 'Trending' },
  { id: 'new', label: 'New' },
  { id: 'sale', label: 'On sale' }
];

export default function App() {
  const { user, logout } = useAuth();

  // Master State
  const [categories] = useState(INITIAL_CATEGORIES);
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [coupons] = useState(INITIAL_COUPONS);
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [cartItems, setCartItems] = useState(() => readStore('lg_cart', []));
  const [wishlistItems, setWishlistItems] = useState(() => readStore('lg_wishlist', []));
  const [recentIds, setRecentIds] = useState(() => readStore('lg_recent', []));
  const shopRef = useRef(null);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([
    { id: 1, full_name: 'Surya Prakash', email: 'surya@example.com', mobile: '+91 98765 43210', status: 'Active' },
    { id: 2, full_name: 'Ananya Reddy', email: 'ananya@example.com', mobile: '+91 91234 56789', status: 'Active' }
  ]);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('lg_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('lg_wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

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
  const [sortBy, setSortBy] = useState('featured');
  const [collection, setCollection] = useState('all');

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

    if (collection === 'trending' && !prod.isTrending) return false;
    if (collection === 'new' && !prod.isNewArrival) return false;
    if (collection === 'sale' && !(prod.discountPercent > 0)) return false;

    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const price = (p) => Math.round(p.price * (1 - (p.discountPercent || 0) / 100));
    if (sortBy === 'price-asc') return price(a) - price(b);
    if (sortBy === 'price-desc') return price(b) - price(a);
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    if (sortBy === 'discount') return (b.discountPercent || 0) - (a.discountPercent || 0);
    return 0;
  });

  const recentProducts = recentIds
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean);

  const openProduct = (product) => {
    setSelectedProduct(product);
    setRecentIds((prev) => {
      const next = [product.id, ...prev.filter((id) => id !== product.id)].slice(0, 8);
      localStorage.setItem('lg_recent', JSON.stringify(next));
      return next;
    });
  };

  const scrollToShop = () => {
    shopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const chooseCategory = (id) => {
    setSelectedCategory(id);
    scrollToShop();
  };

  const resetFilters = () => {
    setSelectedCategory('all');
    setPriceFilter('all');
    setSizeFilter('all');
    setSearchQuery('');
    setCollection('all');
    setSortBy('featured');
  };

  const copyCoupon = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      /* clipboard can be blocked; the toast still names the code */
    }
    showToast(`${code} copied. Apply it in your bag.`);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f1ea] text-stone-900 pb-dock">
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-6 left-3 right-3 md:left-auto md:right-6 z-50 bg-stone-900 text-white text-sm font-semibold px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <Navbar
        cartCount={cartCount}
        wishlistCount={wishlistItems.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setSelectedCategory={setSelectedCategory}
        onShop={scrollToShop}
        user={user}
      />

      <main className="flex-1 max-w-6xl mx-auto w-full px-3 sm:px-6">
        <HeroBanner onShopNow={scrollToShop} />

        <section className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
          {coupons.map((coupon) => (
            <button
              key={coupon.code}
              type="button"
              onClick={() => copyCoupon(coupon.code)}
              className="text-left bg-white border border-dashed border-amber-700/40 rounded-2xl px-4 py-3 hover:border-amber-800"
            >
              <p className="text-[11px] uppercase tracking-wider text-amber-800 font-bold">{coupon.code}</p>
              <p className="text-sm font-semibold text-stone-800 mt-0.5">{coupon.description}</p>
            </button>
          ))}
        </section>

        <div ref={shopRef} className="scroll-mt-24 mt-6 space-y-3">
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => chooseCategory(cat.id)}
                className={`h-9 px-3.5 rounded-full text-sm font-semibold shrink-0 ${
                  selectedCategory === cat.id
                    ? 'bg-stone-900 text-white'
                    : 'bg-white text-stone-700 border border-stone-200'
                }`}
              >
                {cat.id === 'all' ? 'All' : cat.name.replace('Women Kurtis & Sarees', 'Women').replace('Sarees & Lehengas', 'Sarees').replace('Men Shirts & Kurtas', 'Men').replace('Kids Wear', 'Kids')}
              </button>
            ))}
          </div>

          <div className="flex gap-2 overflow-x-auto">
            {COLLECTIONS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setCollection(item.id)}
                className={`h-8 px-3 rounded-full text-xs font-bold shrink-0 ${
                  collection === item.id ? 'bg-amber-800 text-white' : 'bg-amber-100 text-amber-950'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 p-3 flex flex-col sm:flex-row sm:items-center gap-3">
            <p className="inline-flex items-center gap-1.5 text-sm font-bold text-stone-800 shrink-0">
              <SlidersHorizontal className="w-4 h-4" />
              {sortedProducts.length} pieces
            </p>
            <div className="grid grid-cols-3 gap-2 w-full sm:ml-auto sm:w-auto">
              <select value={priceFilter} onChange={(e) => setPriceFilter(e.target.value)} className="h-10 rounded-xl border border-stone-200 bg-stone-50 px-2 text-xs font-semibold">
                <option value="all">Any price</option>
                <option value="under500">Under ₹500</option>
                <option value="500-1000">₹500–1,000</option>
                <option value="1000-2000">₹1,000–2,000</option>
                <option value="above2000">Above ₹2,000</option>
              </select>
              <select value={sizeFilter} onChange={(e) => setSizeFilter(e.target.value)} className="h-10 rounded-xl border border-stone-200 bg-stone-50 px-2 text-xs font-semibold">
                <option value="all">Any size</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
              </select>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="h-10 rounded-xl border border-stone-200 bg-stone-50 px-2 text-xs font-semibold">
                <option value="featured">Featured</option>
                <option value="price-asc">Price ↑</option>
                <option value="price-desc">Price ↓</option>
                <option value="rating">Top rated</option>
                <option value="discount">Biggest off</option>
              </select>
            </div>
          </div>
        </div>

        {sortedProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 mt-4">
            <h3 className="font-bold text-stone-800 text-lg">Nothing matches those filters</h3>
            <button type="button" onClick={resetFilters} className="mt-4 bg-stone-900 text-white text-sm font-bold px-4 py-2.5 rounded-full">
              Clear filters
            </button>
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {sortedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                compact
                onSelectProduct={openProduct}
                onAddToCart={(p) => handleAddToCart(p)}
                onToggleWishlist={handleToggleWishlist}
                isWishlisted={wishlistItems.some((w) => w.id === product.id)}
              />
            ))}
          </div>
        )}

        {recentProducts.length > 0 && (
          <section className="mt-10">
            <h3 className="text-lg font-black text-stone-900 mb-3">Recently viewed</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {recentProducts.slice(0, 4).map((product) => (
                <ProductCard
                  key={`recent-${product.id}`}
                  product={product}
                  compact
                  onSelectProduct={openProduct}
                  onAddToCart={(p) => handleAddToCart(p)}
                  onToggleWishlist={handleToggleWishlist}
                  isWishlisted={wishlistItems.some((w) => w.id === product.id)}
                />
              ))}
            </div>
          </section>
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
      <Footer onSelectCategory={chooseCategory} />

      <MobileDock
        cartCount={cartCount}
        wishlistCount={wishlistItems.length}
        user={user}
        onHome={() => {
          resetFilters();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onShop={scrollToShop}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />
    </div>
  );
}
