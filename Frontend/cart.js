document.addEventListener("DOMContentLoaded", () => {
    updateNavbar();
    const cartItemsContainer = document.getElementById("cartItems");
    const totalItemsEl = document.getElementById("totalItems");
    const totalPriceEl = document.getElementById("totalPrice");
    const checkoutBtn = document.getElementById("checkoutBtn");

    function renderCart() {
        const cart = getCart();
        cartItemsContainer.innerHTML = "";

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
            totalItemsEl.textContent = "Total Items: 0";
            totalPriceEl.textContent = "Total Price: ₹0";
            return;
        }

        let totalPrice = 0;

        cart.forEach((item) => {
            totalPrice += item.price;

            const div = document.createElement("div");
            div.classList.add("cart-item");
            div.innerHTML = `
                <img src="${item.image || '/images/default-book.jpg'}" alt="${item.title}" />
                <div class="cart-item-details">
                    <h3>${item.title}</h3>
                    <p>by ${item.author}</p>
                    <p>Price: ₹${item.price}</p>
                </div>
                <button class="remove-btn" data-id="${item._id}">Remove</button>
            `;
            cartItemsContainer.appendChild(div);
        });

        totalItemsEl.textContent = `Total Items: ${cart.length}`;
        totalPriceEl.textContent = `Total Price: ₹${totalPrice}`;
        attachRemoveListeners();
    }

    function attachRemoveListeners() {
        document.querySelectorAll(".remove-btn").forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const id = e.target.dataset.id;
                removeFromCart(id);
                renderCart();
            });
        });
    }

    checkoutBtn.addEventListener("click", () => {
        if (getCart().length === 0) {
            alert("Your cart is empty!");
            return;
        }
        alert("Proceeding to checkout...");
        // Implement checkout logic here
    });

    renderCart();
});

function updateNavbar() {
    const storedUser = localStorage.getItem("currentUser");
    const registerLink = document.getElementById("registerLink");
    const loginLink = document.getElementById("loginLink");
    const profileLink = document.getElementById("profileLink");
    const logoutLink = document.getElementById("logoutLink");

    if (storedUser) {
        // User is logged in - show profile and logout
        if (registerLink) registerLink.style.display = "none";
        if (loginLink) loginLink.style.display = "none";
        if (profileLink) profileLink.style.display = "block";
        if (logoutLink) {
            logoutLink.style.display = "block";
            logoutLink.addEventListener("click", (e) => {
                e.preventDefault();
                if (confirm("Are you sure you want to logout?")) {
                    localStorage.removeItem("currentUser");
                    window.location.reload();
                }
            });
        }
    } else {
        // User is not logged in - show register and login
        if (registerLink) registerLink.style.display = "block";
        if (loginLink) loginLink.style.display = "block";
        if (profileLink) profileLink.style.display = "none";
        if (logoutLink) logoutLink.style.display = "none";
    }
}
