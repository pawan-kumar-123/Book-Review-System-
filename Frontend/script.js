// understand the code
async function testAPI() {
    const res = await fetch("/api/books")
    const data = await res.json()
    console.log(data.message)
}
testAPI();
 

let currentUser = null;
let currentBookId = null;
let books = [];

document.addEventListener("DOMContentLoaded", () => {
    loadBooks();
    setupEventListeners();
});

// Load books from API
async function loadBooks() {
    try {
        const response = await fetch("/admin/books");
        const result = await response.json();

        if (response.ok && result.data) {
            books = result.data;
            renderBooks();
        } else {
            console.error("Failed to load books:", result.message);
            showError("Failed to load books. Please try again later.");
        }
    } catch (error) {
        console.error("Error loading books:", error);
        showError("Error connecting to server. Please try again.");
    }
}




function updateNavbar() {
    const storedUser = localStorage.getItem("currentUser");
    const registerLink = document.getElementById("registerLink");
    const loginLink = document.getElementById("loginLink");
    const profileLink = document.getElementById("profileLink");
    const logoutLink = document.getElementById("logoutLink");
    const cartLink = document.getElementById("cartLink");

    if (storedUser) {
        // User is logged in - show profile, logout, and cart
        if (registerLink) registerLink.style.display = "none";
        if (loginLink) loginLink.style.display = "none";
        if (profileLink) profileLink.style.display = "block";
        if (cartLink) cartLink.style.display = "block";
        if (logoutLink) {
            logoutLink.style.display = "block";
            logoutLink.addEventListener("click", (e) => {
                e.preventDefault();
                if (confirm("Are you sure you want to logout?")) {
                    localStorage.removeItem("currentUser");
                    currentUser = null;
                    window.location.reload();
                }
            });
        }
    } else {
        // User is not logged in - show register and login, hide cart
        if (registerLink) registerLink.style.display = "block";
        if (loginLink) loginLink.style.display = "block";
        if (profileLink) profileLink.style.display = "none";
        if (cartLink) cartLink.style.display = "none";
        if (logoutLink) logoutLink.style.display = "none";
    }
}

// Update the DOMContentLoaded section:
document.addEventListener("DOMContentLoaded", () => {
    loadBooks();
    setupEventListeners();
    updateNavbar(); // Add this line

    // Check if user is logged in for comments
    const storedUser = localStorage.getItem("currentUser");
    currentUser = storedUser ? JSON.parse(storedUser) : null;
    updateCartCount();
});





function renderBooks(limitBooks = true) {
    const booksGrid = document.getElementById("booksGrid");
    if (!booksGrid) return;

    booksGrid.innerHTML = "";

    // Limit books to 8 on home page
    const booksToRender = limitBooks ? books.slice(0, 8) : books;

    if (booksToRender.length === 0) {
        booksGrid.innerHTML = `
            <div class="no-books">
                <p>No books available at the moment.</p>
            </div>
        `;
        return;
    }

    booksToRender.forEach((book) => {
        const bookCard = document.createElement("div");
        bookCard.className = "book-card";
        bookCard.setAttribute("data-book-id", book._id);

        const imageUrl = book.image || "/images/default-book.jpg";
        const defaultImage = book.image ? "" : "background-color: #ddd;";

        // Generate star rating HTML
        const starRating = generateStarRating(book.averageRating || 0);

        bookCard.innerHTML = `
            <div class="book-image-container">
                <img src="${imageUrl}" alt="${escapeHtml(book.title)}" class="book-image"
                     style="${defaultImage}" onerror="this.src='/images/default-book.jpg'; this.style.backgroundColor='#ddd';">
            </div>
            <div class="book-info">
                <h3 class="book-title">${escapeHtml(book.title || "Untitled")}</h3>
                <p class="book-author">by ${escapeHtml(book.author || "Unknown")}</p>
                <div class="book-rating">
                    ${starRating}
                    <span class="rating-text">${book.averageRating ? book.averageRating.toFixed(1) : "No rating"}</span>
                </div>
                <p class="book-price">₹${book.price ? book.price.toFixed(2) : "0.00"}</p>
            </div>
        `;

        // Add click event to show book detail
        bookCard.addEventListener("click", () => {
            showBookDetail(book);
        });

        // Add event listener for Add to Cart button
        if (currentUser) {
            const addToCartBtn = bookCard.querySelector('.add-to-cart-btn');
            if (addToCartBtn) {
                addToCartBtn.addEventListener('click', (e) => {
                    e.stopPropagation(); // Prevent triggering book detail modal
                    addToCart(book);
                });
            }
        }

        booksGrid.appendChild(bookCard);
    });
}

// Function to generate star rating HTML
function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    let starsHtml = '';

    // Full stars
    for (let i = 0; i < fullStars; i++) {
        starsHtml += '<span class="star full">★</span>';
    }

    // Half star
    if (hasHalfStar) {
        starsHtml += '<span class="star half">★</span>';
    }

    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
        starsHtml += '<span class="star empty">★</span>';
    }

    return starsHtml;
}



// Show book detail modal
function showBookDetail(book) {
    const modal = document.getElementById("bookDetailModal");
    const wrapper = document.getElementById("bookDetailWrapper");

    if (!modal || !wrapper) return;

    currentBookId = book._id;
    const imageUrl = book.image || "/images/default-book.jpg";

    // Check if user is logged in
    const storedUser = localStorage.getItem("currentUser");
    currentUser = storedUser ? JSON.parse(storedUser) : null;

    wrapper.innerHTML = `
        <div class="book-detail-image">
            <img src="${imageUrl}" alt="${escapeHtml(book.title)}" 
                 onerror="this.src='/images/default-book.jpg'; this.style.backgroundColor='#ddd';">
        </div>
        <div class="book-detail-info">
            <h1 class="detail-title">${escapeHtml(book.title || "Untitled")}</h1>
            <p class="detail-author">by <strong>${escapeHtml(book.author || "Unknown")}</strong></p>
            ${book.genre ? `<p class="detail-genre"><span class="genre-label">Genre:</span> ${escapeHtml(book.genre)}</p>` : ""}
            <div class="detail-description">
                <h3>Description</h3>
                <p>${escapeHtml(book.description || "No description available.")}</p>
            </div>
            ${book.averageRating ? `
                <div class="detail-rating">
                    <span class="rating-label">Average Rating:</span>
                    <span class="rating-value">${book.averageRating.toFixed(1)} / 5.0</span>
                    <div class="star-rating-display">
                        ${generateStarRating(book.averageRating)}
                    </div>
                </div>
            ` : `
                <div class="detail-rating">
                    <span class="rating-label">Average Rating:</span>
                    <span class="rating-value">No ratings yet</span>
                </div>
            `}
            ${currentUser ? `<button class="add-to-cart-btn" id="modalAddToCartBtn" data-book-id="${book._id}">Add to Cart</button>` : ""}

            <!-- Comments Section -->
            <div class="comments-section">
                <h3 class="comments-title">Comments & Ratings</h3>
                ${currentUser ? `
                    <div class="add-comment-form">
                        <div class="rating-input">
                            <label>Your Rating:</label>
                            <div class="star-rating-input" id="ratingStars">
                                <span class="star-input" data-rating="1">★</span>
                                <span class="star-input" data-rating="2">★</span>
                                <span class="star-input" data-rating="3">★</span>
                                <span class="star-input" data-rating="4">★</span>
                                <span class="star-input" data-rating="5">★</span>
                            </div>
                            <span class="rating-value-display" id="ratingValue">0</span>
                        </div>
                        <textarea id="commentInput" placeholder="Write your comment here..." rows="4"></textarea>
                        <button id="submitCommentBtn" class="submit-comment-btn">Add Comment & Rating</button>
                    </div>
                ` : `
                    <p class="login-prompt">Please <a href="login.html">login</a> to add a comment and rating.</p>
                `}
                <div id="commentsList" class="comments-list">
                    <!-- Comments will be loaded here -->
                </div>
            </div>
        </div>
    `;

    modal.style.display = "flex";
    document.body.style.overflow = "hidden";

    // Load comments
    loadComments(book._id);

    // Setup comment event listeners
    if (currentUser) {
        setupRatingInput();
        const submitBtn = document.getElementById("submitCommentBtn");
        if (submitBtn) {
            submitBtn.addEventListener("click", () => addComment(book._id));
        }

        // Add event listener for modal Add to Cart button
        const modalAddToCartBtn = document.getElementById("modalAddToCartBtn");
        if (modalAddToCartBtn) {
            modalAddToCartBtn.addEventListener("click", () => addToCart(book));
        }
    }
}


// Setup star rating input
function setupRatingInput() {
    const stars = document.querySelectorAll('.star-input');
    const ratingValue = document.getElementById('ratingValue');
    let selectedRating = 0;

    // Initialize global rating
    window.selectedRating = selectedRating;

    stars.forEach(star => {
        star.addEventListener('click', () => {
            selectedRating = parseInt(star.dataset.rating);
            ratingValue.textContent = selectedRating;
            updateStarDisplay(stars, selectedRating);
            // Update global rating
            window.selectedRating = selectedRating;
        });

        star.addEventListener('mouseover', () => {
            const hoverRating = parseInt(star.dataset.rating);
            updateStarDisplay(stars, hoverRating);
        });

        star.addEventListener('mouseout', () => {
            updateStarDisplay(stars, selectedRating);
        });
    });
}

function updateStarDisplay(stars, rating) {
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('selected');
        } else {
            star.classList.remove('selected');
        }
    });
}



// Load comments for a book
async function loadComments(bookId) {
    try {
        const response = await fetch(`/books/${bookId}/reviews`);
        const result = await response.json();

        const commentsList = document.getElementById("commentsList");
        if (!commentsList) return;

        if (response.ok && result.data) {
            renderComments(result.data);
        } else {
            commentsList.innerHTML = `<p class="no-comments">No comments yet.</p>`;
        }
    } catch (error) {
        console.error("Error loading comments:", error);
    }
}

// Render comments
function renderComments(comments) {
    const commentsList = document.getElementById("commentsList");
    if (!commentsList) return;

    if (comments.length === 0) {
        commentsList.innerHTML = `<p class="no-comments">No comments yet. Be the first to comment!</p>`;
        return;
    }

    commentsList.innerHTML = comments.map(comment => {
        const isOwnComment = currentUser && comment.reviewByUser._id === currentUser._id;
        const date = new Date(comment.createdAt).toLocaleDateString();

        return `
            <div class="comment-item" data-comment-id="${comment._id}">
                <div class="comment-header">
                    <strong class="comment-author">${escapeHtml(comment.reviewByUser.userName)}</strong>
                    <span class="comment-date">${date}</span>
                </div>
                <div class="comment-content" id="comment-content-${comment._id}">
                    <p>${escapeHtml(comment.comment)}</p>
                </div>
                ${isOwnComment ? `
                    <div class="comment-actions">
                        <button class="edit-comment-btn" onclick="editComment('${comment._id}', '${escapeHtml(comment.comment)}')">Edit</button>
                        <button class="delete-comment-btn" onclick="deleteComment('${comment._id}')">Delete</button>
                    </div>
                ` : ""}
            </div>
        `;
    }).join("");
}

// Add comment
async function addComment(bookId) {
    const commentInput = document.getElementById("commentInput");
    if (!commentInput || !currentUser) return;

    const comment = commentInput.value.trim();
    const rating = window.selectedRating || 0;

    if (!comment) {
        alert("Please enter a comment");
        return;
    }

    if (rating === 0) {
        alert("Please select a rating");
        return;
    }

    try {
        const response = await fetch(`/books/${bookId}/reviews`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                comment: comment,
                rating: rating,
                userId: currentUser._id
            })
        });

        const result = await response.json();

        if (response.ok) {
            commentInput.value = "";
            window.selectedRating = 0;
            document.getElementById('ratingValue').textContent = '0';
            updateStarDisplay(document.querySelectorAll('.star-input'), 0);
            await loadComments(bookId);
            // Reload books to update average rating
            await loadBooks();
            if (window.location.pathname.includes('all_books.html')) {
                await loadBooks();
            }
        } else {
            alert(result.message || "Failed to add comment");
        }
    } catch (error) {
        console.error("Error adding comment:", error);
        alert("Error adding comment. Please try again.");
    }
}


// Edit comment
async function editComment(commentId, currentComment) {
    const newComment = prompt("Edit your comment:", currentComment);
    if (!newComment || !newComment.trim() || newComment === currentComment) return;

    if (!currentUser) return;

    try {
        const response = await fetch(`/reviews/${commentId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                comment: newComment.trim(),
                userId: currentUser._id
            })
        });

        const result = await response.json();

        if (response.ok) {
            await loadComments(currentBookId);
        } else {
            alert(result.message || "Failed to update comment");
        }
    } catch (error) {
        console.error("Error updating comment:", error);
        alert("Error updating comment. Please try again.");
    }
}

// Delete comment
async function deleteComment(commentId) {
    if (!confirm("Are you sure you want to delete this comment?")) return;
    if (!currentUser) return;

    try {
        const response = await fetch(`/reviews/${commentId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userId: currentUser._id
            })
        });

        const result = await response.json();

        if (response.ok) {
            await loadComments(currentBookId);
        } else {
            alert(result.message || "Failed to delete comment");
        }
    } catch (error) {
        console.error("Error deleting comment:", error);
        alert("Error deleting comment. Please try again.");
    }
}

// Make functions global for onclick handlers
window.editComment = editComment;
window.deleteComment = deleteComment;

// Close modal
function closeBookDetail() {
    const modal = document.getElementById("bookDetailModal");
    if (modal) {
        modal.style.display = "none";
        document.body.style.overflow = "auto"; // Restore scrolling
    }
}

// Setup event listeners
function setupEventListeners() {
    // Close modal on X button
    const closeBtn = document.getElementById("closeModal");
    if (closeBtn) {
        closeBtn.addEventListener("click", closeBookDetail);
    }

    // Close modal when clicking outside
    const modal = document.getElementById("bookDetailModal");
    if (modal) {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                closeBookDetail();
            }
        });
    }

    // Close modal on Escape key
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeBookDetail();
        }
    });
}

// Utility function to escape HTML
function escapeHtml(text) {
    if (!text) return "";
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

// Show error message
function showError(message) {
    const booksGrid = document.getElementById("booksGrid");
    if (booksGrid) {
        booksGrid.innerHTML = `
            <div class="error-message">
                <p>${message}</p>
            </div>
        `;
    }
}