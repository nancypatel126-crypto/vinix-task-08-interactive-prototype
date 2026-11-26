
// Product Data
const products = [
    {
        id: 1,
        name: "Casual T-Shirt",
        category: "Fashion",
        price: 499,
        emoji: "👕",
        description: "Comfortable cotton casual t-shirt."
    },
    {
        id: 2,
        name: "Wireless Headphones",
        category: "Electronics",
        price: 1499,
        emoji: "🎧",
        description: "Enjoy high-quality wireless sound."
    },
    {
        id: 3,
        name: "Smart Watch",
        category: "Electronics",
        price: 1999,
        emoji: "⌚",
        description: "Smart fitness and lifestyle watch."
    },
    {
        id: 4,
        name: "Sports Shoes",
        category: "Fashion",
        price: 1299,
        emoji: "👟",
        description: "Lightweight and comfortable shoes."
    },
    {
        id: 5,
        name: "Backpack",
        category: "Accessories",
        price: 899,
        emoji: "🎒",
        description: "Stylish backpack for everyday use."
    },
    {
        id: 6,
        name: "Sunglasses",
        category: "Accessories",
        price: 599,
        emoji: "🕶️",
        description: "Modern sunglasses for your style."
    },
    {
        id: 7,
        name: "Table Lamp",
        category: "Home",
        price: 799,
        emoji: "💡",
        description: "Elegant lamp for your home."
    },
    {
        id: 8,
        name: "Coffee Mug",
        category: "Home",
        price: 299,
        emoji: "☕",
        description: "Beautiful ceramic coffee mug."
    }
];

// Shopping Cart
let cart = [];

// HTML Elements
const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");

// Display Products
function displayProducts(list) {
    productGrid.innerHTML = "";

    document.getElementById("productCount").textContent =
        `${list.length} Products`;

    if (list.length === 0) {
        productGrid.innerHTML =
            '<p class="no-results">No products found.</p>';
        return;
    }

    list.forEach(product => {
        const card = document.createElement("article");
        card.className = "product-card";

        const image = document.createElement("div");
        image.className = "product-image";
        image.textContent = product.emoji;

        const info = document.createElement("div");
        info.className = "product-info";

        const category = document.createElement("small");
        category.textContent = product.category;

        const name = document.createElement("h3");
        name.textContent = product.name;

        const description = document.createElement("p");
        description.textContent = product.description;

        const bottom = document.createElement("div");
        bottom.className = "product-bottom";

        const price = document.createElement("strong");
        price.textContent = `₹${product.price}`;

        const addButton = document.createElement("button");
        addButton.className = "add-btn";
        addButton.textContent = "Add +";
        addButton.addEventListener("click", () => {
            addToCart(product.id);
        });

        const detailsButton = document.createElement("button");
        detailsButton.className = "details-btn";
        detailsButton.textContent = "View Details";
        detailsButton.addEventListener("click", () => {
            showProductDetails(product.id);
        });

        bottom.append(price, addButton);
        info.append(category, name, description, bottom, detailsButton);
        card.append(image, info);
        productGrid.appendChild(card);
    });
}

// Add to Cart
function addToCart(id) {
    const product = products.find(item => item.id === id);

    const existing = cart.find(item => item.id === id);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    updateCart();
}

// Change Quantity
function changeQuantity(id, amount) {
    const item = cart.find(product => product.id === id);

    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {
        cart = cart.filter(product => product.id !== id);
    }

    updateCart();
}

// Remove Product
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
}

// Update Cart
function updateCart() {
    const count = cart.reduce(
        (total, item) => total + item.quantity, 0
    );

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
    );

    document.getElementById("cartCount").textContent = count;
    document.getElementById("cartTotal").textContent = `₹${total}`;

    const cartItems = document.getElementById("cartItems");

    cartItems.innerHTML = "";

    if (cart.length === 0) {
        cartItems.innerHTML =
            '<p class="empty-cart">Your cart is empty. Start shopping!</p>';
    }

    cart.forEach(item => {
        const row = document.createElement("div");
        row.className = "cart-row";

        const details = document.createElement("div");
        const title = document.createElement("strong");
        title.textContent = item.name;

        const subtotal = document.createElement("p");
        subtotal.textContent = `₹${item.price * item.quantity}`;

        details.append(title, subtotal);

        const controls = document.createElement("div");
        controls.className = "quantity";

        const minus = document.createElement("button");
        minus.textContent = "−";
        minus.addEventListener("click", () => {
            changeQuantity(item.id, -1);
        });

        const quantity = document.createElement("span");
        quantity.textContent = item.quantity;

        const plus = document.createElement("button");
        plus.textContent = "+";
        plus.addEventListener("click", () => {
            changeQuantity(item.id, 1);
        });

        const remove = document.createElement("button");
        remove.className = "remove-btn";
        remove.textContent = "✕";
        remove.setAttribute("aria-label", `Remove ${item.name}`);
        remove.addEventListener("click", () => {
            removeFromCart(item.id);
        });

        controls.append(minus, quantity, plus, remove);
        row.append(details, controls);
        cartItems.appendChild(row);
    });
}

// Search and Category Filter
function filterProducts() {
    const search = searchInput.value.toLowerCase();
    const category = categoryFilter.value;

    const filtered = products.filter(product => {
        const matchesSearch =
            product.name.toLowerCase().includes(search) ||
            product.category.toLowerCase().includes(search);

        const matchesCategory =
            category === "All" || product.category === category;

        return matchesSearch && matchesCategory;
    });

    displayProducts(filtered);
}

searchInput.addEventListener("input", filterProducts);
categoryFilter.addEventListener("change", filterProducts);

// Product Details
function showProductDetails(id) {
    const product = products.find(item => item.id === id);

    document.getElementById("productDetails").innerHTML = `
        <div class="detail-emoji">${product.emoji}</div>
        <h2>${product.name}</h2>
        <p class="muted">${product.category}</p>
        <p>${product.description}</p>
        <h3>₹${product.price}</h3>
        <br>
        <button class="primary-btn full" id="detailAddButton">
            Add to Cart
        </button>
    `;

    document.getElementById("detailModal").classList.add("show");

    document.getElementById("detailAddButton")
        .addEventListener("click", () => {
            addToCart(product.id);
            closeModal("detailModal");
        });
}

// Modal Functions
function openModal(id) {
    document.getElementById(id).classList.add("show");
}

function closeModal(id) {
    document.getElementById(id).classList.remove("show");
}

document.getElementById("openCart").addEventListener("click", () => {
    openModal("cartModal");
});

document.getElementById("closeCart").addEventListener("click", () => {
    closeModal("cartModal");
});

document.getElementById("closeDetails").addEventListener("click", () => {
    closeModal("detailModal");
});

document.getElementById("closeCheckout").addEventListener("click", () => {
    closeModal("checkoutModal");
});

// Close modal by clicking outside
document.querySelectorAll(".modal").forEach(modal => {
    modal.addEventListener("click", event => {
        if (event.target === modal) {
            modal.classList.remove("show");
        }
    });
});

// Checkout
document.getElementById("checkoutBtn").addEventListener("click", () => {
    if (cart.length === 0) {
        alert("Your shopping cart is empty!");
        return;
    }

    closeModal("cartModal");
    openModal("checkoutModal");
});

document.getElementById("checkoutForm")
    .addEventListener("submit", event => {
        event.preventDefault();

        if (cart.length === 0) {
            return;
        }

        const customerName =
            document.getElementById("customerName").value.trim();

        if (!customerName) return;

        const orderId = "SE" + Date.now().toString().slice(-6);

        document.getElementById("orderMessage").textContent =
            `Thank you, ${customerName}! Demo order ${orderId} placed successfully.`;

        cart = [];
        updateCart();

        document.getElementById("checkoutForm").reset();
    });

// Initial Display
displayProducts(products);
updateCart();
