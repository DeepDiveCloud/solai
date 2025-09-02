async function checkAuth() {
  const token = localStorage.getItem("token");
  if (!token) return (window.location.href = "login.html");

  try {
    const res = await fetch("http://localhost:5000/api/auth/verify", {
      headers: { Authorization: "Bearer " + token },
    });

    if (!res.ok) throw new Error("Auth failed");
    const data = await res.json();

    const isSuperAdmin = data.super_admin;

    // Normal users: redirect if on wrong page
    if (!isSuperAdmin && data.assigned_url) {
      const currentPage = window.location.pathname.split("/").pop();
      if (currentPage !== data.assigned_url) {
        alert("Redirecting to your assigned page");
        window.location.href = data.assigned_url;
        return;
      }
    }

    // Optional welcome message
    const welcomeMsg = document.getElementById("welcomeMsg");
    if (welcomeMsg) welcomeMsg.innerText = `Welcome, ${data.role || "User"}`;
  } catch (err) {
    console.error("Auth failed:", err);
    // Auto logout only for non-super_admin
    localStorage.clear();
    window.location.href = "login.html";
  }
}

document.addEventListener("DOMContentLoaded", checkAuth);
