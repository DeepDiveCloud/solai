$(document).ready(() => {
  // Handle login form submission
  $("#loginForm").submit((event) => {
    event.preventDefault(); // Prevent form from reloading the page

    const email = $("#email").val().trim();
    const password = $("#password").val().trim();

    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    // Send login request
    $.ajax({
      url: "http://localhost:5000/api/auth/login", // Your backend login route
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({ email, password }),
      success: (response) => {
        if (response.token) {
          // Save login details in localStorage
          localStorage.setItem("token", response.token);
          localStorage.setItem("role", response.role);
          localStorage.setItem("user", email);

          // Redirect based on role
          if (response.role === "admin") {
            window.location.href = "dashboard.html";
          } else {
            window.location.href = "production.html"; // or user_dashboard.html
          }
        } else {
          alert("Login failed: No token received.");
        }
      },
      error: (xhr) => {
        console.error("Login error:", xhr.responseText);
        alert("Invalid email or password. Please try again.");
      }
    });
  });

  // Auto logout protection (for pages that include this login.js)
  const page = window.location.pathname.split("/").pop();
  const publicPages = ["login.html", "register.html"];
  const token = localStorage.getItem("token");

  if (!token && !publicPages.includes(page)) {
    // If not logged in and on a protected page
    window.location.href = "login.html";
  }
});
