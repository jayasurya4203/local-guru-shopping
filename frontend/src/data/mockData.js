export const INITIAL_CATEGORIES = [
  { id: 'all', name: 'All Collection', icon: 'Sparkles', count: 12 },
  { id: 'women', name: 'Women Kurtis & Sarees', icon: 'Shirt', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600' },
  { id: 'sarees', name: 'Sarees & Lehengas', icon: 'Sparkle', image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600' },
  { id: 'men', name: 'Men Shirts & Kurtas', icon: 'UserCheck', image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600' },
  { id: 'kids', name: 'Kids Wear', icon: 'Smile', image: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=600' },
];

export const INITIAL_PRODUCTS = [
  {
    id: 101,
    name: "Women's Designer Handloom Silk Kurti",
    category: "women",
    brand: "Local Guru Ethnic",
    description: "Handcrafted pure silk kurti with delicate gold zari embroidery. Lightweight and breathable fabric perfect for festive occasions, weddings, and casual elegant gatherings.",
    price: 1499,
    discountPercent: 20,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Royal Blue", hex: "#1e3a8a" },
      { name: "Blush Pink", hex: "#f472b6" },
      { name: "Jet Black", hex: "#0f172a" }
    ],
    stock: 45,
    rating: 4.8,
    reviewsCount: 124,
    isTrending: true,
    isFeatured: true,
    isNewArrival: true,
    images: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800",
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800"
    ]
  },
  {
    id: 102,
    name: "Banarasi Art Silk Printed Saree",
    category: "sarees",
    brand: "Local Guru Silks",
    description: "Exquisite Banarasi silk saree featuring traditional floral motifs and an unstitched matching blouse piece. Elevate your traditional elegance.",
    price: 2499,
    discountPercent: 30,
    sizes: ["Free Size"],
    colors: [
      { name: "Maroon Red", hex: "#991b1b" },
      { name: "Mustard Gold", hex: "#eab308" },
      { name: "Emerald Green", hex: "#065f46" }
    ],
    stock: 28,
    rating: 4.9,
    reviewsCount: 89,
    isTrending: true,
    isFeatured: true,
    isNewArrival: false,
    images: [
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800",
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800"
    ]
  },
  {
    id: 103,
    name: "Men's Premium Linen Mandarin Shirt",
    category: "men",
    brand: "Local Guru Apparel",
    description: "100% Organic breathable linen shirt designed with a sleek mandarin collar. Keeps you cool, confident, and stylish all day long.",
    price: 1299,
    discountPercent: 15,
    sizes: ["M", "L", "XL", "XXL"],
    colors: [
      { name: "Sky Blue", hex: "#38bdf8" },
      { name: "Off White", hex: "#f8fafc" },
      { name: "Olive Green", hex: "#4d7c0f" }
    ],
    stock: 60,
    rating: 4.6,
    reviewsCount: 56,
    isTrending: false,
    isFeatured: true,
    isNewArrival: true,
    images: [
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800"
    ]
  },
  {
    id: 104,
    name: "Kids Ethnic Festive Lehenga Anarkali",
    category: "kids",
    brand: "Local Guru Junior",
    description: "Soft skin-friendly cotton lining ethnic set for girls. Features glitter foil prints and comfortable stretch waist line.",
    price: 999,
    discountPercent: 25,
    sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y"],
    colors: [
      { name: "Sunburst Yellow", hex: "#f59e0b" },
      { name: "Coral Pink", hex: "#fb7185" }
    ],
    stock: 35,
    rating: 4.7,
    reviewsCount: 42,
    isTrending: true,
    isFeatured: false,
    isNewArrival: true,
    images: [
      "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=800"
    ]
  },
  {
    id: 105,
    name: "Women's Printed Cotton Straight Kurta",
    category: "women",
    brand: "Local Guru Ethnic",
    description: "Daily wear block-printed pure cotton kurta with 3/4th sleeves. Super soft and easy machine wash.",
    price: 899,
    discountPercent: 10,
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Indigo Blue", hex: "#1e1b4b" },
      { name: "Teal Green", hex: "#0d9488" }
    ],
    stock: 50,
    rating: 4.5,
    reviewsCount: 31,
    isTrending: false,
    isFeatured: false,
    isNewArrival: true,
    images: [
      "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=800"
    ]
  },
  {
    id: 106,
    name: "Men's Silk Blend Festive Kurta Pyjama Set",
    category: "men",
    brand: "Local Guru Apparel",
    description: "Traditional jacquard weave ethnic kurta with pyjama. Classic celebration outfit for Diwali, Eid, & Weddings.",
    price: 2199,
    discountPercent: 20,
    sizes: ["M", "L", "XL", "XXL"],
    colors: [
      { name: "Cream White", hex: "#fef3c7" },
      { name: "Wine Red", hex: "#881337" }
    ],
    stock: 22,
    rating: 4.9,
    reviewsCount: 67,
    isTrending: true,
    isFeatured: true,
    isNewArrival: false,
    images: [
      "https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?w=800"
    ]
  }
];

export const INITIAL_COUPONS = [
  { code: 'LOCALGURU20', discountType: 'percentage', value: 20, minAmount: 499, description: '20% OFF on orders above ₹499' },
  { code: 'WELCOME100', discountType: 'fixed', value: 100, minAmount: 799, description: 'Flat ₹100 Instant Discount' },
  { code: 'FESTIVE500', discountType: 'fixed', value: 500, minAmount: 2499, description: 'Flat ₹500 OFF on festive shopping' }
];

export const INITIAL_REVIEWS = [
  { id: 1, productId: 101, userName: "Priya Sharma", rating: 5, date: "2 days ago", comment: "Absolutely gorgeous kurti! The silk texture feels very high end and the stitching is perfect." },
  { id: 2, productId: 101, userName: "Rohan Verma", rating: 4, date: "1 week ago", comment: "Bought this as a gift for my sister. Delivery was fast and packaging was neat." },
  { id: 3, productId: 102, userName: "Ananya Reddy", rating: 5, date: "3 days ago", comment: "Beautiful Saree! Looks exactly like the picture. Highly recommended." }
];
