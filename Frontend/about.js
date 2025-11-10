document.addEventListener("DOMContentLoaded", () => {
    updateNavbar();
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
