document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Login failed");
      return;
    }

    // Save to localStorage
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.role);
    localStorage.setItem("super_admin", data.super_admin);

    // Redirect
    if (data.super_admin) {
      window.location.href = "dashboard.html"; // Super admin default page
    } else if (data.assigned_url) {
      window.location.href = data.assigned_url;
    } else {
      alert("No assigned page for your role. Contact Admin.");
    }
  } catch (err) {
    console.error("Login failed:", err);
    alert("Login failed. Please try again.");
  }
});
