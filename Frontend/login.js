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
      // Try admin login first
      const adminRes = await fetch("/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName, password })
      });

      const adminData = await adminRes.json().catch(() => ({}));

      if (adminRes.ok && adminData?.message === "Admin logged in successfully") {
        window.location.href = adminRedirect;
        return;
      }

      // Try normal user login (correct route)
      const userRes = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName, password })
      });

      const userData = await userRes.json().catch(() => ({}));


      if (userRes.ok && userData?.data?.user) {
        localStorage.setItem("currentUser", JSON.stringify(userData.data.user));
        alert("Login successful!");
        window.location.href = "index.html";
      } else {
        alert(userData.message || "Login failed. Please check your credentials.");
      }

    } catch (error) {
      console.error("Login error:", error)
      alert("Unable to reach server. Please try again.");
    }
  });
});