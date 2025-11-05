document.addEventListener("DOMContentLoaded", () => {

  const adminRedirect = "adminPanel.html"
  const userRedirect = "adminPanel.html"

  const form = document.getElementById("loginForm")
  const userNameInput = document.getElementById("userName")
  const passwordInput = document.getElementById("password")
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault()

    const userName = userNameInput?.value.trim();
    const password = passwordInput?.value.trim();

    if (!userName || !password) {
      alert("Please enter user name and password")
      return;
    }

    try {
      const res = await fetch("/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName, password })
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok && data?.message === "Admin logged in successfully") {
        window.location.href = adminRedirect;
        return;
      }
      window.location.href = userRedirect

    } catch (error) {
      console.error("Login error:", error)
      alert("Error connecting  to server .Please try again.")
    }
  });
});