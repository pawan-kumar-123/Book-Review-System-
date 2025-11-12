function getCart() {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user) return [];
    
    const carts = JSON.parse(localStorage.getItem("userCarts")) || {};
    return carts[user._id] || [];
}

function saveCart(cart) {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user) return;
    
    const carts = JSON.parse(localStorage.getItem("userCarts")) || {};
    carts[user._id] = cart;
    localStorage.setItem("userCarts", JSON.stringify(carts));
    updateCartCount();
}

function addToCart(book) {
    const cart = getCart();
    const existingItem = cart.find(item => item._id === book._id);
    
    if (existingItem) {
        alert("Book already in cart!");
        return;
    }
    
    cart.push({
        _id: book._id,
        title: book.title,
        author: book.author,
        price: book.price,
        image: book.image
    });
    
    saveCart(cart);
    alert("Book added to cart!");
}

function removeFromCart(bookId) {
    const cart = getCart().filter(item => item._id !== bookId);
    saveCart(cart);
}

function updateCartCount() {
    const cart = getCart();
    const cartCounts = document.querySelectorAll("#cartCount");
    cartCounts.forEach(count => count.textContent = cart.length);
}

function clearCart() {
    saveCart([]);
}
