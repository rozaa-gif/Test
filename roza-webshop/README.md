# 🌹 ROZA - Luxury Fashion Online Web Shop

Welcome to **ROZA** - A fully functional, professionally designed luxury fashion e-commerce platform.

## 📋 Domain
**Website:** rozathelable.com

## ✨ Features

### 🛍️ Shopping Experience
- **Product Catalog**: 8 premium fashion items across multiple categories
- **Category Filtering**: Browse by Blazers, Dresses, Trousers, and Accessories
- **Search Functionality**: Real-time product search
- **Product Cards**: Beautiful card layouts with images, descriptions, and prices

### 🛒 Shopping Cart
- **Add to Cart**: One-click product addition
- **Cart Management**: Adjust quantities, remove items
- **Cart Persistence**: Your cart saves automatically
- **Real-time Updates**: Instant subtotal and shipping calculations

### 💳 Checkout & Payment
- **Secure Checkout Form**: Shipping and payment information collection
- **Shipping Options**: 
  - Standard Shipping: $15
  - Free Shipping: Orders over $200
- **Order Confirmation**: Purchase completion notifications

### 🌍 Multi-Language Support
- **English** (Default)
- **Spanish** (Español)
- **French** (Français)

### 📱 Responsive Design
- **Mobile-Optimized**: Perfect on phones, tablets, and desktops
- **Modern UI**: Clean, professional luxury aesthetic
- **Fast Loading**: Optimized for all devices

### 📬 Newsletter Subscription
- **Email Signup**: Exclusive offers and new collections
- **Easy Subscription**: Quick email capture

## 📁 File Structure

```
roza-webshop/
├── index.html      # Main HTML structure
├── styles.css      # Complete styling
├── script.js       # JavaScript functionality
└── README.md       # This file
```

## 🚀 How to Use

### 1. **Setup**
- Upload all files to your web hosting
- Point your domain `rozathelable.com` to the hosting

### 2. **Customize Products**
Edit the `products` array in `script.js`:

```javascript
const products = [
    {
        id: 1,
        name: "Your Product Name",
        category: "blazers", // or dresses, trousers, accessories
        price: 299,
        description: "Your product description",
        image: "your-image-url"
    }
];
```

### 3. **Modify Translations**
Add or update translations in the `translations` object in `script.js`:

```javascript
const translations = {
    en: { /* English translations */ },
    es: { /* Spanish translations */ },
    fr: { /* French translations */ }
};
```

### 4. **Customize Colors**
Edit CSS variables in `styles.css`:

```css
:root {
    --primary: #1a1a1a;      /* Main dark color */
    --secondary: #f5f5f5;    /* Light background */
    --accent: #d4af37;       /* Gold accent */
    --text: #333;
    --light-text: #666;
}
```

## 🎨 Design Features

- **Luxury Aesthetic**: Minimalist, elegant design
- **Color Scheme**: Dark primary with gold accents
- **Typography**: Professional serif and sans-serif fonts
- **Spacing**: Generous whitespace for premium feel
- **Hover Effects**: Smooth transitions and interactions

## 📊 Product Categories

1. **Blazers**: Structured tailoring pieces
2. **Dresses**: Evening and everyday wear
3. **Trousers**: Premium bottoms
4. **Accessories**: Scarves, belts, and more

## 💾 Data Storage

- **Cart Persistence**: Uses browser's localStorage
- **No Backend Required**: Pure frontend functionality
- **Real-time Updates**: Instant calculations

## 🔒 Security Notes

- **Payment Form**: Currently frontend-only (add payment gateway for live deployment)
- **Recommended**: Integrate with Stripe, PayPal, or similar for real transactions
- **HTTPS**: Always use SSL/TLS on production

## 📈 Future Enhancements

- Payment gateway integration (Stripe, PayPal)
- User accounts and order history
- Admin dashboard for product management
- Inventory management
- Email notifications
- Analytics tracking

## 🌐 Browser Compatibility

- Chrome ✅
- Firefox ✅
- Safari ✅
- Edge ✅
- Mobile browsers ✅

## 📞 Support

For customization or issues, ensure:
1. All three files (HTML, CSS, JS) are in the same directory
2. Domain is properly configured
3. JavaScript is enabled in browsers
4. Images are accessible (using external URLs)

## 📝 License

ROZA © 2026. All rights reserved.

---

**Built with ❤️ for luxury fashion**