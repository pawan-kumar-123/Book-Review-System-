// Create new file: Frontend/profile.js

let currentUser = null;
let userComments = [];

document.addEventListener("DOMContentLoaded", () => {
    checkUserLogin();
    setupEventListeners();
});

// Check if user is logged in
function checkUserLogin() {
    const storedUser = localStorage.getItem("currentUser");
    if (!storedUser) {
        alert("Please login to view your profile");
        window.location.href = "login.html";
        return;
    }

    currentUser = JSON.parse(storedUser);
    loadUserProfile();
    loadUserComments();
}

// Load user profile information
function loadUserProfile() {
    if (!currentUser) return;

    document.getElementById("userName").textContent = currentUser.userName || "User";
    document.getElementById("userEmail").textContent = currentUser.email || "";
    document.getElementById("displayUserName").textContent = currentUser.userName || "-";
    document.getElementById("displayUserEmail").textContent = currentUser.email || "-";

    if (currentUser.createdAt) {
        const date = new Date(currentUser.createdAt);
        document.getElementById("memberSince").textContent = date.toLocaleDateString();
    } else {
        document.getElementById("memberSince").textContent = "N/A";
    }
}

// Load user's comments
async function loadUserComments() {
    if (!currentUser) return;

    try {
        // Get all books first
        const booksResponse = await fetch("/admin/books");
        const booksResult = await booksResponse.json();

        if (!booksResponse.ok || !booksResult.data) {
            console.error("Failed to load books");
            return;
        }

        const books = booksResult.data;
        const allComments = [];

        // Fetch comments for each book
        for (const book of books) {
            try {
                const commentsResponse = await fetch(`/books/${book._id}/reviews`);
                const commentsResult = await commentsResponse.json();

                if (commentsResponse.ok && commentsResult.data) {
                    // Filter comments by current user
                    const userBookComments = commentsResult.data
                        .filter(comment => comment.reviewByUser._id === currentUser._id)
                        .map(comment => ({
                            ...comment,
                            bookTitle: book.title,
                            bookId: book._id
                        }));

                    allComments.push(...userBookComments);
                }
            } catch (error) {
                console.error(`Error loading comments for book ${book._id}:`, error);
            }
        }

        userComments = allComments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        renderUserComments();

    } catch (error) {
        console.error("Error loading user comments:", error);
    }
}

// Render user comments
function renderUserComments() {
    const commentsList = document.getElementById("userComments");
    if (!commentsList) return;

    if (userComments.length === 0) {
        commentsList.innerHTML = `
            <div class="no-comments">
                <p>You haven't commented on any books yet.</p>
                <p><a href="index.html" style="color: #4CAF50;">Browse books</a> and add your first comment!</p>
            </div>
        `;
        return;
    }

    commentsList.innerHTML = userComments.map(comment => {
        const date = new Date(comment.createdAt).toLocaleDateString();

        return `
            <div class="comment-item" data-comment-id="${comment._id}">
                <div class="comment-header">
                    <span class="comment-book">${escapeHtml(comment.bookTitle)}</span>
                    <span class="comment-date">${date}</span>
                </div>
                <div class="comment-content">
                    <p>${escapeHtml(comment.comment)}</p>
                </div>
                <div class="comment-actions">
                    <button class="edit-comment-btn" onclick="editComment('${comment._id}', '${escapeHtml(comment.comment)}', '${comment.bookId}')">Edit</button>
                    <button class="delete-comment-btn" onclick="deleteComment('${comment._id}', '${comment.bookId}')">Delete</button>
                </div>
            </div>
        `;
    }).join("");
}

// Edit comment
async function editComment(commentId, currentComment, bookId) {
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
            alert("Comment updated successfully!");
            await loadUserComments();
        } else {
            alert(result.message || "Failed to update comment");
        }
    } catch (error) {
        console.error("Error updating comment:", error);
        alert("Error updating comment. Please try again.");
    }
}

// Delete comment
async function deleteComment(commentId, bookId) {
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
            alert("Comment deleted successfully!");
            await loadUserComments();
        } else {
            alert(result.message || "Failed to delete comment");
        }
    } catch (error) {
        console.error("Error deleting comment:", error);
        alert("Error deleting comment. Please try again.");
    }
}

// Setup event listeners
function setupEventListeners() {
    const logoutLink = document.getElementById("logoutLink");
    if (logoutLink) {
        logoutLink.addEventListener("click", (e) => {
            e.preventDefault();
            if (confirm("Are you sure you want to logout?")) {
                localStorage.removeItem("currentUser");
                window.location.href = "index.html";
            }
        });
    }
}

// Utility function to escape HTML
function escapeHtml(text) {
    if (!text) return "";
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

// Make functions global for onclick handlers
window.editComment = editComment;
window.deleteComment = deleteComment;