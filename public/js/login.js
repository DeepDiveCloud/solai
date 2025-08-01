$(document).ready(() => {
  // Handle login form submission
  $("#loginForm").submit((event) => {
    event.preventDefault();

    const email = $("#email").val().trim();
    const password = $("#password").val().trim();

    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    $.ajax({
      url: "http://localhost:5000/api/auth/login",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({ email, password }),
      success: (response) => {
        const { user, token } = response;

        if (!token || !user) {
          alert("Login failed: Invalid response.");
          return;
        }

        localStorage.setItem("token", token);
        localStorage.setItem("email", user.email);
        localStorage.setItem("role", user.role);
        localStorage.setItem("groups", JSON.stringify(user.groups));

        // Redirect by role or group
        if (user.role === "admin" || user.role === "superuser") {
          window.location.href = "dashboard.html";
        } else if (user.groups.includes("Production")) {
          window.location.href = "production.html";
        } else if (user.groups.includes("Sales")) {
          window.location.href = "sales.html";
        } else if (user.groups.includes("Quality")) {
          window.location.href = "quality.html";
        } else {
          window.location.href = "unauthorized.html"; // fallback page
        }
      },
      error: (xhr) => {
        console.error("Login error:", xhr.responseText);
        alert("Invalid email or password.");
      }
    });
  });

  // 🔐 Auto protection for non-public pages
  const page = window.location.pathname.split("/").pop();
  const publicPages = ["login.html", "register.html", "unauthorized.html"];
  const token = localStorage.getItem("token");

  if (!token && !publicPages.includes(page)) {
    window.location.href = "login.html";
  }
});
