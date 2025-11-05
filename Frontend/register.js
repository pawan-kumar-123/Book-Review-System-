document.getElementById("register-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    const confirm_password = document.getElementById("confirm_password").value

    if (password !== confirm_password) {
        document.getElementById("password").style.border = "1px solid red"
        document.getElementById("confirm_password").style.border = "1px solid red"
        return
    }
    if (password.length < 8) {
        alert("Password must be at least 8 characters")
        return;
    }   

    try {
        const response = await fetch("/register.html",
            {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({
                    userName: username,
                    email: email,
                    password: password
                })
            }
        )

        const data = await response.json()
        console.log("📨 Response:", response.status, data);

        if (response.ok) {
            alert("Registeration successful")
            window.location.href = "login.html"
        }
        else {
            alert(`Registeration failed: ${data.message}`)
        }

    } catch (error) {
        console.error(`Error: ${error}`)
        alert("An error accurred during registration !!")
    }
})