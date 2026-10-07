import json
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    mobile = db.Column(db.String(20), nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), default='user') # 'user' or 'admin'
    is_mobile_verified = db.Column(db.Boolean, default=False)
    is_email_verified = db.Column(db.Boolean, default=False)
    status = db.Column(db.String(20), default='Active') # 'Active' or 'Blocked'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    addresses = db.relationship('Address', backref='user', lazy=True, cascade='all, delete-orphan')
    orders = db.relationship('Order', backref='user', lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self.id,
            'full_name': self.full_name,
            'email': self.email,
            'mobile': self.mobile,
            'role': self.role,
            'is_mobile_verified': self.is_mobile_verified,
            'is_email_verified': self.is_email_verified,
            'status': self.status,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S') if self.created_at else None
        }

class Address(db.Model):
    __tablename__ = 'addresses'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    recipient_name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    house_no = db.Column(db.String(100), default='')
    street = db.Column(db.String(255), nullable=False)
    landmark = db.Column(db.String(100), default='')
    city = db.Column(db.String(100), nullable=False)
    state = db.Column(db.String(100), nullable=False)
    pincode = db.Column(db.String(10), nullable=False)
    address_type = db.Column(db.String(20), default='Home') # 'Home', 'Work', 'Other'
    is_default = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'recipient_name': self.recipient_name,
            'phone': self.phone,
            'house_no': self.house_no or '',
            'street': self.street,
            'landmark': self.landmark or '',
            'city': self.city,
            'state': self.state,
            'pincode': self.pincode,
            'address_type': self.address_type or 'Home',
            'is_default': self.is_default
        }

class Product(db.Model):
    __tablename__ = 'products'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    brand = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, default='')
    price = db.Column(db.Float, nullable=False)
    discount_percent = db.Column(db.Float, default=0.0)
    stock = db.Column(db.Integer, default=10)
    rating = db.Column(db.Float, default=4.8)
    reviews_count = db.Column(db.Integer, default=1)
    is_trending = db.Column(db.Boolean, default=False)
    is_featured = db.Column(db.Boolean, default=False)
    is_new_arrival = db.Column(db.Boolean, default=True)
    sizes_json = db.Column(db.Text, default='["S", "M", "L", "XL"]')
    colors_json = db.Column(db.Text, default='[{"name": "Default", "hex": "#4f46e5"}]')
    images_json = db.Column(db.Text, default='[]')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        try:
            sizes = json.loads(self.sizes_json) if self.sizes_json else ["S", "M", "L", "XL"]
        except Exception:
            sizes = ["S", "M", "L", "XL"]

        try:
            colors = json.loads(self.colors_json) if self.colors_json else [{"name": "Default", "hex": "#4f46e5"}]
        except Exception:
            colors = [{"name": "Default", "hex": "#4f46e5"}]

        try:
            images = json.loads(self.images_json) if self.images_json else []
        except Exception:
            images = []

        return {
            'id': self.id,
            'name': self.name,
            'category': self.category,
            'brand': self.brand,
            'description': self.description or '',
            'price': self.price,
            'discountPercent': self.discount_percent,
            'stock': self.stock,
            'rating': self.rating,
            'reviewsCount': self.reviews_count,
            'isTrending': self.is_trending,
            'isFeatured': self.is_featured,
            'isNewArrival': self.is_new_arrival,
            'sizes': sizes,
            'colors': colors,
            'images': images
        }

class Order(db.Model):
    __tablename__ = 'orders'
    
    id = db.Column(db.Integer, primary_key=True)
    order_number = db.Column(db.String(50), unique=True, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    user_email = db.Column(db.String(120), nullable=False)
    items_json = db.Column(db.Text, nullable=False)
    address_json = db.Column(db.Text, nullable=False)
    total_amount = db.Column(db.Float, nullable=False)
    payment_method = db.Column(db.String(50), default='Razorpay UPI')
    payment_status = db.Column(db.String(50), default='Paid')
    order_status = db.Column(db.String(50), default='Confirmed')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        try:
            items = json.loads(self.items_json) if self.items_json else []
        except Exception:
            items = []

        try:
            address = json.loads(self.address_json) if self.address_json else {}
        except Exception:
            address = {}

        return {
            'id': self.id,
            'order_number': self.order_number,
            'user_id': self.user_id,
            'user_email': self.user_email,
            'items': items,
            'address': address,
            'total_amount': self.total_amount,
            'payment_method': self.payment_method,
            'payment_status': self.payment_status,
            'order_status': self.order_status,
            'date': self.created_at.strftime('%Y-%m-%d %H:%M') if self.created_at else ''
        }

class ActivityLog(db.Model):
    __tablename__ = 'activity_logs'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=True)
    user_name = db.Column(db.String(100), default='Guest')
    user_email = db.Column(db.String(120), nullable=False)
    role = db.Column(db.String(20), default='user')
    action = db.Column(db.String(50), nullable=False) # 'LOGIN', 'LOGOUT', 'REGISTER', 'STATUS_CHANGE', 'PRODUCT_ADD', etc.
    ip_address = db.Column(db.String(50), default='127.0.0.1')
    user_agent = db.Column(db.String(255), default='')
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'user_name': self.user_name,
            'user_email': self.user_email,
            'role': self.role,
            'action': self.action,
            'ip_address': self.ip_address,
            'user_agent': self.user_agent,
            'timestamp': self.timestamp.strftime('%Y-%m-%d %H:%M:%S') if self.timestamp else ''
        }
