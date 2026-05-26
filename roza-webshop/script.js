// Product Database
const products = [
    {
        id: 1,
        name: "Structured Blazer",
        category: "blazers",
        price: 349,
        description: "Premium tailored blazer with structured shoulders",
        image: "https://images.unsplash.com/photo-1551028719-00167b16ebc5?w=400&h=500&fit=crop"
    },
    {
        id: 2,
        name: "Evening Dress",
        category: "dresses",
        price: 599,
        description: "Elegant evening gown with flowing fabric",
        image: "https://images.unsplash.com/photo-1595777712802-e6b3b63c2ebb?w=400&h=500&fit=crop"
    },
    {
        id: 3,
        name: "Tailored Trousers",
        category: "trousers",
        price: 249,
        description: "High-waisted tailored trousers for perfect fit",
        image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&h=500&fit=crop"
    },
    {
        id: 4,
        name: "Silk Scarf",
        category: "accessories",
        price: 129,
        description: "Premium silk scarf in various colors",
        image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&h=500&fit=crop"
    },
    {
        id: 5,
        name: "Classic Blazer Dress",
        category: "dresses",
        price: 479,
        description: "Sophisticated blazer-style dress",
        image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=500&fit=crop"
    },
    {
        id: 6,
        name: "Premium Wool Blazer",
        category: "blazers",
        price: 399,
        description: "Italian wool blazer with perfect drape",
        image: "https://images.unsplash.com/photo-1591028318595-09bbf3d5d122?w=400&h=500&fit=crop"
    },
    {
        id: 7,
        name: "Wide-Leg Trousers",
        category: "trousers",
        price: 279,
        description: "Contemporary wide-leg cut trousers",
        image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=500&fit=crop"
    },
    {
        id: 8,
        name: "Leather Belt",
        category: "accessories",
        price: 179,
        description: "Premium leather belt with gold buckle",
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=500&fit=crop"
    }
];

// Shopping Cart
let cart = JSON.parse(localStorage.getItem('rozaCart')) || [];

// Current Language
let currentLanguage = 'en';

// Translations
const translations = {
    en: {
        featured: "Featured Collection",
        all: "All",
        blazers: "Blazers",
        dresses: "Dresses",
        trousers: "Trousers",
        accessories: "Accessories",
        addToCart: "Add to Cart",
        cart: "Shopping Cart",
        subtotal: "Subtotal",
        shipping: "Shipping",
        total: "Total",
        checkout: "Proceed to Checkout",
        shippingInfo: "Shipping Information",
        paymentInfo: "Payment Information",
        completePurchase: "Complete Purchase",
        newsletter: "Join Our Mailing List",
        subscribeText: "Get exclusive access to new collections and special offers",
        subscribe: "Subscribe",
        about: "About ROZA",
        aboutText: "ROZA is a luxury fashion brand specializing in structured tailoring and premium clothing. Our commitment to quality and elegance defines every piece we create."
    },
    es: {
        featured: "Colección Destacada",
        all: "Todos",
        blazers: "Blazers",
        dresses: "Vestidos",
        trousers: "Pantalones",
        accessories: "Accesorios",
        addToCart: "Añadir al Carrito",
        cart: "Carrito de Compras",
        subtotal: "Subtotal",
        shipping: "Envío",
        total: "Total",
        checkout: "Proceder al Pago",
        shippingInfo: "Información de Envío",
        paymentInfo: "Información de Pago",
        completePurchase: "Completar Compra",
        newsletter: "Únete a Nuestra Lista de Correo",
        subscribeText: "Obtén acceso exclusivo a nuevas colecciones y ofertas especiales",
        subscribe: "Suscribirse",
        about: "Acerca de ROZA",
        aboutText: "ROZA es una marca de moda de lujo especializada en confección estructurada y ropa premium."
    },
    fr: {
        featured: "Collection Vedette",
        all: "Tous",
        blazers: "Blazers",
        dresses: "Robes",
        trousers: "Pantalons",
        accessories: "Accessoires",
        addToCart: "Ajouter au Panier",
        cart: "Panier d'Achat",
        subtotal: "Sous-total",
        shipping: "Livraison",
        total: "Total",
        checkout: "Procéder à la Caisse",
        shippingInfo: "Informations de Livraison",
        paymentInfo: "Informations de Paiement",
        completePurchase: "Finaliser l'Achat",
        newsletter: "Rejoignez Notre Liste de Diffusion",
        subscribeText: "Accédez exclusivement aux nouvelles collections et offres spéciales",
        subscribe: "S'abonner",
        about: "À Propos de ROZA",
        aboutText: "ROZA est une marque de mode de luxe spécialisée dans la couture structurée et les vêtements premium."
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderProducts(products);
    updateCart();
    setupEventListeners();
});

// Setup Event Listeners
function setupEventListeners() {
    document.getElementById('searchBox').addEventListener('input', (e) => {
        filterBySearch(e.target.value);
    });
}

// Render Products
function renderProducts(productsToRender) {
    const grid = document.getElementById('productGrid');
    grid.innerHTML = '';
    
    productsToRender.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <p class="product-category">${product.category}</p>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <p class="product-price">$${product.price}</p>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                    ${translations[currentLanguage].addToCart}
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Filter Products by Category
function filterProducts(category) {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    if (category === 'all') {
        renderProducts(products);
    } else {
        const filtered = products.filter(p => p.category === category);
        renderProducts(filtered);
    }
}

// Search Products
function filterBySearch(searchTerm) {
    const filtered = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    renderProducts(filtered);
}

// Add to Cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    saveCart();
    updateCart();
    showNotification(`${product.name} added to cart!`);
}

// Remove from Cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCart();
}

// Update Quantity
function updateQuantity(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = Math.max(1, quantity);
        saveCart();
        updateCart();
    }
}

// Save Cart to LocalStorage
function saveCart() {
    localStorage.setItem('rozaCart', JSON.stringify(cart));
}

// Update Cart Display
function updateCart() {
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = cartCount;
    
    const cartItemsContainer = document.getElementById('cartItems');
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align: center; padding: 2rem;">Your cart is empty</p>';
    } else {
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-info">
                    <p class="cart-item-name">${item.name}</p>
                    <p class="cart-item-price">$${item.price}</p>
                    <div class="cart-item-qty">
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                    </div>
                </div>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
            `;
            cartItemsContainer.appendChild(cartItem);
        });
    }
    
    updateCartSummary();
}

// Update Cart Summary
function updateCartSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal >= 200 ? 0 : 15;
    const total = subtotal + shipping;
    
    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('shipping').textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
}

// Toggle Cart
function toggleCart() {
    document.getElementById('cartSidebar').classList.toggle('active');
    document.getElementById('cartOverlay').classList.toggle('active');
}

// Go to Checkout
function goToCheckout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!');
        return;
    }
    document.getElementById('checkoutModal').classList.add('active');
    toggleCart();
}

// Complete Checkout
function completeCheckout(e) {
    e.preventDefault();
    showNotification('Order placed successfully! Thank you for shopping with ROZA.');
    cart = [];
    saveCart();
    updateCart();
    closeCheckout();
    document.getElementById('checkoutForm').reset();
}

// Close Checkout
function closeCheckout() {
    document.getElementById('checkoutModal').classList.remove('active');
}

// Subscribe to Newsletter
function subscribeNewsletter(e) {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    showNotification(`Thank you for subscribing with ${email}!`);
    e.target.reset();
}

// Show Notification
function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Change Language
function changeLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('rozaLanguage', lang);
    renderProducts(products);
    updateCart();
}

// Load saved language
const savedLanguage = localStorage.getItem('rozaLanguage') || 'en';
currentLanguage = savedLanguage;
document.getElementById('languageSelector').value = savedLanguage;