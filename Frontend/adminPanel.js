
document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const logoutBtn = document.getElementById("logoutBtn");
    const statsSection = document.querySelector(".stats");
    const booksTable = document.querySelector(".add-books table tbody");
    const sidebarItems = document.querySelectorAll(".sidebar ul li");

    // State
    let books = [];
    let users = [];

    // Initialize
    loadDashboardData();
    setupEventListeners();

    // Load all dashboard data
    async function loadDashboardData() {
        try {
            await Promise.all([loadUsers(), loadBooks()]);
            updateStats();
            renderBooksTable();
        } catch (error) {
            console.error("Error loading dashboard data:", error);
            alert("Failed to load dashboard data. Please refresh the page.");
        }
    }

    // Load users from API
    async function loadUsers() {
        try {
            const response = await fetch("/admin/users");
            const result = await response.json();

            if (response.ok && result.data) {
                users = result.data;
                return users;
            } else {
                throw new Error(result.message || "Failed to load users");
            }
        } catch (error) {
            console.error("Error loading users:", error);
            users = [];
            return [];
        }
    }

    // Load books from API
    async function loadBooks() {
        try {
            const response = await fetch("/admin/books");
            const result = await response.json();

            if (response.ok && result.data) {
                books = result.data;
                return books;
            } else {
                throw new Error(result.message || "Failed to load books");
            }
        } catch (error) {
            console.error("Error loading books:", error);
            books = [];
            return [];
        }
    }

    // Update stats display
    function updateStats() {
        const userCountEl = statsSection.querySelector(".stat-box:first-child p");
        const bookCountEl = statsSection.querySelector(".stat-box:last-child p");

        if (userCountEl) {
            userCountEl.textContent = users.length;
        }
        if (bookCountEl) {
            bookCountEl.textContent = books.length;
        }
    }

    // Render books table
    // In Frontend/adminPanel.js
    // Update the renderBooksTable function to show images:

    function renderBooksTable() {
        if (!booksTable) return;

        booksTable.innerHTML = "";

        if (books.length === 0) {
            const row = document.createElement("tr");
            row.innerHTML = `
            <td colspan="6" style="text-align: center; padding: 20px;">
                No books found. Add a book to get started.
            </td>
        `;
            booksTable.appendChild(row);
            return;
        }

        books.forEach((book) => {
            const row = document.createElement("tr");
            const imageCell = book.image
                ? `<td><img src="${book.image}" alt="${book.title}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;"></td>`
                : `<td>No image</td>`;

            row.innerHTML = `
            <td>${escapeHtml(book.title || "")}</td>
            <td>${escapeHtml(book.author || "")}</td>
            <td>${escapeHtml(book.description || "").substring(0, 50)}${book.description?.length > 50 ? "..." : ""}</td>
            <td>${escapeHtml(book.genre || "N/A")}</td>
            ${imageCell}
            <td>
                <button class="edit-btn" data-book-id="${book._id}">Edit</button>
                <button class="delete-btn" data-book-id="${book._id}">Delete</button>
            </td>
        `;
            booksTable.appendChild(row);
        });

        attachBookEventListeners();
    }

    // Attach event listeners to book action buttons
    function attachBookEventListeners() {
        // Edit buttons
        document.querySelectorAll(".edit-btn").forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const bookId = e.target.getAttribute("data-book-id");
                const book = books.find((b) => b._id === bookId);
                if (book) {
                    openEditBookModal(book);
                }
            });
        });

        // Delete buttons
        document.querySelectorAll(".delete-btn").forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const bookId = e.target.getAttribute("data-book-id");
                handleDeleteBook(bookId);
            });
        });
    }

    // Handle delete book
    async function handleDeleteBook(bookId) {
        if (!confirm("Are you sure you want to delete this book?")) {
            return;
        }

        try {
            const response = await fetch(`/admin/books/${bookId}`, {
                method: "DELETE",
            });

            const result = await response.json();

            if (response.ok) {
                alert("Book deleted successfully!");
                await loadBooks();
                updateStats();
                renderBooksTable();
            } else {
                alert(result.message || "Failed to delete book");
            }
        } catch (error) {
            console.error("Error deleting book:", error);
            alert("Error deleting book. Please try again.");
        }
    }

    // Open edit book modal/form
    function openEditBookModal(book) {
        const newTitle = prompt("Enter new title:", book.title || "");
        if (newTitle === null) return; // User cancelled

        const newAuthor = prompt("Enter new author:", book.author || "");
        if (newAuthor === null) return;

        const newDescription = prompt("Enter new description:", book.description || "");
        if (newDescription === null) return;

        const newGenre = prompt("Enter new genre:", book.genre || "");
        if (newGenre === null) return;

        updateBook(book._id, {
            title: newTitle,
            author: newAuthor,
            description: newDescription,
            genre: newGenre,
        });
    }

    // Update book
    async function updateBook(bookId, bookData) {
        try {
            const response = await fetch(`/admin/books/${bookId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(bookData),
            });

            const result = await response.json();

            if (response.ok) {
                alert("Book updated successfully!");
                await loadBooks();
                renderBooksTable();
            } else {
                alert(result.message || "Failed to update book");
            }
        } catch (error) {
            console.error("Error updating book:", error);
            alert("Error updating book. Please try again.");
        }
    }

    // Add new book (you can trigger this with a button or form)
    // In Frontend/adminPanel.js
    // Replace the addNewBook function (around line 214-254) with:

    async function addNewBook() {
        // Create a simple form for book input
        const title = prompt("Enter book title:");
        if (!title || !title.trim()) return;

        const author = prompt("Enter book author:");
        if (!author || !author.trim()) return;

        const description = prompt("Enter book description:");
        if (!description || !description.trim()) return;

        const genre = prompt("Enter book genre (optional):") || "";

        // Create file input for image
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = "image/*";
        fileInput.style.display = "none";

        // Create a label/button to trigger file selection
        const selectImage = confirm("Do you want to add an image? Click OK to select an image.");

        let imageFile = null;
        if (selectImage) {
            // Use a simple approach - create a form element
            const form = document.createElement("form");
            form.innerHTML = `
            <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                        background: white; padding: 20px; border: 2px solid #333; z-index: 10000; border-radius: 8px;">
                <p style="margin-bottom: 10px;">Select book image:</p>
                <input type="file" id="bookImageInput" accept="image/*" style="margin-bottom: 10px;">
                <div style="display: flex; gap: 10px;">
                    <button type="button" id="cancelImageBtn" style="padding: 8px 16px; background: #ccc; border: none; border-radius: 4px; cursor: pointer;">Cancel</button>
                    <button type="button" id="confirmImageBtn" style="padding: 8px 16px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">Confirm</button>
                </div>
            </div>
        `;
            document.body.appendChild(form);

            imageFile = await new Promise((resolve) => {
                const input = form.querySelector("#bookImageInput");
                const cancelBtn = form.querySelector("#cancelImageBtn");
                const confirmBtn = form.querySelector("#confirmImageBtn");

                cancelBtn.onclick = () => {
                    document.body.removeChild(form);
                    resolve(null);
                };

                confirmBtn.onclick = () => {
                    const file = input.files[0];
                    document.body.removeChild(form);
                    resolve(file);
                };
            });
        }

        // Create FormData for multipart/form-data
        const formData = new FormData();
        formData.append("title", title.trim());
        formData.append("author", author.trim());
        formData.append("description", description.trim());
        if (genre.trim()) {
            formData.append("genre", genre.trim());
        }
        if (imageFile) {
            formData.append("image", imageFile);
        }

        try {
            const response = await fetch("/admin/books", {
                method: "POST",
                body: formData, // Don't set Content-Type header, browser will set it with boundary
            });

            const result = await response.json();
            console.log("Add book response status:", response.status);
            console.log("Add book response data:", result);

            if (response.ok) {
                alert("Book added successfully!");
                await loadBooks();
                updateStats();
                renderBooksTable();
            } else {
                console.error("Error response:", result);
                const errorMsg = result.message || result.massage || "Failed to add book";
                alert(`Failed to add book: ${errorMsg}`);
            }
        } catch (error) {
            console.error("Network error adding book:", error);
            alert(`Error adding book: ${error.message}. Please check console for details.`);
        }
    }

    // Setup event listeners
    function setupEventListeners() {
        // Logout button
        if (logoutBtn) {
            logoutBtn.addEventListener("click", () => {
                if (confirm("Are you sure you want to logout?")) {
                    window.location.href = "login.html";
                }
            });
        }

        // Sidebar navigation (basic implementation)
        sidebarItems.forEach((item, index) => {
            item.addEventListener("click", () => {
                sidebarItems.forEach((li) => li.classList.remove("active"));
                item.classList.add("active");

                // Handle different sections
                if (index === 0) {
                    // Dashboard - show stats and books
                    document.querySelector(".stats").style.display = "flex";
                    document.querySelector(".add-books").style.display = "block";
                } else if (index === 1) {
                    // Manage Books
                    document.querySelector(".stats").style.display = "none";
                    document.querySelector(".add-books").style.display = "block";
                    // Add "Add Book" button if not exists
                    addAddBookButton();
                } else if (index === 2) {
                    // Manage Users
                    document.querySelector(".stats").style.display = "none";
                    document.querySelector(".add-books").style.display = "none";
                    showUsersSection();
                }
            });
        });

        // Add "Add Book" button to the books section
        const booksSection = document.querySelector(".add-books");
        if (booksSection) {
            const existingBtn = document.querySelector("#addBookBtn");
            if (!existingBtn) {
                const addBtn = document.createElement("button");
                addBtn.id = "addBookBtn";
                addBtn.textContent = "Add New Book";
                addBtn.style.cssText = "margin: 10px 0; padding: 10px 20px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;";
                addBtn.addEventListener("click", addNewBook);
                booksSection.insertBefore(addBtn, booksSection.querySelector("table"));
            }
        }
    }

    // Add "Add Book" button
    function addAddBookButton() {
        const booksSection = document.querySelector(".add-books");
        if (!booksSection) return;

        let addBtn = document.getElementById("addBookBtn");
        if (!addBtn) {
            addBtn = document.createElement("button");
            addBtn.id = "addBookBtn";
            addBtn.textContent = "Add New Book";
            addBtn.style.cssText = "margin: 10px 0; padding: 10px 20px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;";
            addBtn.addEventListener("click", addNewBook);
            booksSection.insertBefore(addBtn, booksSection.querySelector("table"));
        }
        addBtn.style.display = "block";
    }

    // Show users management section
    function showUsersSection() {
        let usersSection = document.getElementById("usersSection");
        if (!usersSection) {
            usersSection = document.createElement("section");
            usersSection.id = "usersSection";
            usersSection.className = "users-section";
            usersSection.innerHTML = `
                <h2>Manage Users</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="usersTableBody"></tbody>
                </table>
            `;
            document.querySelector(".main-content").appendChild(usersSection);
        }

        renderUsersTable();
        usersSection.style.display = "block";
    }

    // Render users table
    function renderUsersTable() {
        const usersTableBody = document.getElementById("usersTableBody");
        if (!usersTableBody) return;

        usersTableBody.innerHTML = "";

        if (users.length === 0) {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td colspan="4" style="text-align: center; padding: 20px;">
                    No users found.
                </td>
            `;
            usersTableBody.appendChild(row);
            return;
        }

        users.forEach((user) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${escapeHtml(user.userName || "")}</td>
                <td>${escapeHtml(user.email || "")}</td>
                <td>${escapeHtml(user.role || "user")}</td>
                <td>
                    <button class="delete-user-btn" data-user-id="${user._id}">Delete</button>
                </td>
            `;
            usersTableBody.appendChild(row);
        });

        // Attach delete listeners
        document.querySelectorAll(".delete-user-btn").forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const userId = e.target.getAttribute("data-user-id");
                handleDeleteUser(userId);
            });
        });
    }

    // Handle delete user
    async function handleDeleteUser(userId) {
        if (!confirm("Are you sure you want to delete this user?")) {
            return;
        }

        try {
            const response = await fetch(`/admin/users/${userId}`, {
                method: "DELETE",
            });

            const result = await response.json();

            if (response.ok) {
                alert("User deleted successfully!");
                await loadUsers();
                updateStats();
                renderUsersTable();
            } else {
                alert(result.message || "Failed to delete user");
            }
        } catch (error) {
            console.error("Error deleting user:", error);
            alert("Error deleting user. Please try again.");
        }
    }

    // Utility function to escape HTML
    function escapeHtml(text) {
        const div = document.createElement("div");
        div.textContent = text;
        return div.innerHTML;
    }
});
