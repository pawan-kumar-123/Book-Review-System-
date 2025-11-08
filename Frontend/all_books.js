// Create new file: Frontend/all_books.js

let currentUser = null;
let currentBookId = null;
let books = [];

document.addEventListener("DOMContentLoaded", () => {
    loadBooks();
    setupEventListeners();
    updateNavbar();
  
    // Check if user is logged in for comments
    const storedUser = localStorage.getItem("currentUser");
    currentUser = storedUser ? JSON.parse(storedUser) : null;
});

// Load books from API
async function loadBooks() {
    try {
        const response = await fetch("/admin/books");
        const result = await response.json();

        if (response.ok && result.data) {
            books = result.data;
            renderBooks(false); // false = show all books, not limited
        } else {
            console.error("Failed to load books:", result.message);
            showError("Failed to load books. Please try again later.");
        }
    } catch (error) {
        console.error("Error loading books:", error);
        showError("Error connecting to server. Please try again.");
    }
}

// Render books in grid (show all books)
function renderBooks() {
    const booksGrid = document.getElementById("booksGrid");
    if (!booksGrid) return;

    booksGrid.innerHTML = "";

    if (books.length === 0) {
        booksGrid.innerHTML = `
            <div class="no-books">
                <p>No books available at the moment.</p>
            </div>
        `;
        return;
    }

    books.forEach((book) => {
        const bookCard = document.createElement("div");
        bookCard.className = "book-card";
        bookCard.setAttribute("data-book-id", book._id);

        const imageUrl = book.image || "/images/default-book.jpg";
        const defaultImage = book.image ? "" : "background-color: #ddd;";

        bookCard.innerHTML = `
            <div class="book-image-container">
                <img src="${imageUrl}" alt="${escapeHtml(book.title)}" class="book-image" 
                     style="${defaultImage}" onerror="this.src='/images/default-book.jpg'; this.style.backgroundColor='#ddd';">
            </div>
            <div class="book-info">
                <h3 class="book-title">${escapeHtml(book.title || "Untitled")}</h3>
                <p class="book-author">by ${escapeHtml(book.author || "Unknown")}</p>
            </div>
        `;

        // Add click event to show book detail
        bookCard.addEventListener("click", () => {
            showBookDetail(book);
        });

        booksGrid.appendChild(bookCard);
    });
}

// Show book detail modal (same as index page)
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
                    <span class="rating-label">Rating:</span>
                    <span class="rating-value">${book.averageRating.toFixed(1)} / 5.0</span>
                </div>
            ` : ""}
            
            <!-- Comments Section -->
            <div class="comments-section">
                <h3 class="comments-title">Comments</h3>
                ${currentUser ? `
                    <div class="add-comment-form">
                        <textarea id="commentInput" placeholder="Write your comment here..." rows="4"></textarea>
                        <button id="submitCommentBtn" class="submit-comment-btn">Add Comment</button>
                    </div>
                ` : `
                    <p class="login-prompt">Please <a href="login.html">login</a> to add a comment.</p>
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
        const submitBtn = document.getElementById("submitCommentBtn");
        if (submitBtn) {
            submitBtn.addEventListener("click", () => addComment(book._id));
        }
    }
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
    if (!comment) {
        alert("Please enter a comment");
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
                userId: currentUser._id
            })
        });

        const result = await response.json();

        if (response.ok) {
            commentInput.value = "";
            await loadComments(bookId);
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

// Close modal
function closeBookDetail() {
    const modal = document.getElementById("bookDetailModal");
    if (modal) {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
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

// Update navbar
function updateNavbar() {
    const storedUser = localStorage.getItem("currentUser");
    const registerLink = document.getElementById("registerLink");
    const loginLink = document.getElementById("loginLink");
    const profileLink = document.getElementById("profileLink");
    const logoutLink = document.getElementById("logoutLink");

    if (storedUser) {
        if (registerLink) registerLink.style.display = "none";
        if (loginLink) loginLink.style.display = "none";
        if (profileLink) profileLink.style.display = "block";
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
        if (registerLink) registerLink.style.display = "block";
        if (loginLink) loginLink.style.display = "block";
        if (profileLink) profileLink.style.display = "none";
        if (logoutLink) logoutLink.style.display = "none";
    }
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

// Make functions global for onclick handlers
window.editComment = editComment;
window.deleteComment = deleteComment;