document.addEventListener("DOMContentLoaded", async () => {
  // Sidebar Toggle
  const sidebarToggle = document.getElementById("sidebarCollapse");
  if (sidebarToggle) {
    sidebarToggle.addEventListener("click", () => {
      document.getElementById("sidebar").classList.toggle("collapsed");
      document.getElementById("content").classList.toggle("expanded");
    });
  } else {
    console.error("❌ sidebarCollapse element not found!");
  }

  // Check token
  const token = localStorage.getItem("token");
  console.log("📦 Token being used:", token);

  if (!token) {
    console.error("❌ No auth token found. Redirecting to login.");
    window.location.href = "login.html";
    return;
  }

  // Helper: handle 401 Unauthorized
  function checkUnauthorized(response) {
    if (response.status === 401) {
      alert("Session expired or unauthorized. Please login again.");
      localStorage.removeItem("token");
      window.location.href = "login.html";
      throw new Error("Unauthorized");
    }
    return response;
  }

  // ✅ Fetch user profile
  try {
    const res = await fetch("http://localhost:5000/api/auth/verify", {
      method: "GET",
      headers: { Authorization: "Bearer " + token },
    });

    checkUnauthorized(res);
    if (!res.ok) throw new Error("Failed to fetch profile");

    const user = await res.json();
    if (document.getElementById("welcomeUser")) {
      document.getElementById("welcomeUser").innerText = "Welcome, " + user.email;
    }
  } catch (err) {
    console.error("⚠️ Auth check failed:", err.message);
    localStorage.removeItem("token");
    window.location.href = "login.html";
    return;
  }

  // ✅ Fetch Total Greens
  const greensEl = document.getElementById("greensTotal");
  if (greensEl) {
    try {
      const res = await fetch("http://localhost:5000/api/totalgreens", {
        headers: { Authorization: "Bearer " + token },
      });
      checkUnauthorized(res);
      const data = await res.json();
      greensEl.innerText = (data.totalGreens || 0) + " kg";
    } catch (err) {
      console.error("❌ Error fetching total greens:", err);
    }
  }

  // ✅ Fetch Greens Price (FIXED)
  const greensValueEl = document.getElementById("greensValue");
  if (greensValueEl) {
    try {
      const res = await fetch("http://localhost:5000/api/totalgreensprice", {
        headers: { Authorization: "Bearer " + token },
      });
      checkUnauthorized(res);
      const data = await res.json();

      const totalCost = (parseFloat(data.grandTotal) || 0).toFixed(2);
      greensValueEl.innerText = "₹ " + totalCost;
    } catch (err) {
      console.error("❌ Error fetching total greens price:", err);
      greensValueEl.innerText = "₹ 0.00";
    }
  }

  // ✅ Fetch Production Summary
  loadSummary(token);
});

// Separate function for summary
function loadSummary(token) {
  fetch("http://localhost:5000/api/production-summary", {
    headers: { Authorization: "Bearer " + token },
  })
    .then((res) => {
      if (res.status === 401) {
        alert("Session expired or unauthorized. Please login again.");
        localStorage.removeItem("token");
        window.location.href = "login.html";
        throw new Error("Unauthorized");
      }
      if (!res.ok) throw new Error("Failed to fetch production summary");
      return res.json();
    })
    .then((data) => {
      const acid = parseFloat(data.acidTotal) || 0;
      const vinegar = parseFloat(data.vinegarTotal) || 0;
      const brine = parseFloat(data.brineTotal) || 0;

      const acidEl = document.getElementById("acidTotal");
      const vinegarEl = document.getElementById("vinegarTotal");
      const brineEl = document.getElementById("brineTotal");
      const totalEl = document.getElementById("totalSolutionUsed");

      if (acidEl) acidEl.textContent = acid + " kg";
      if (vinegarEl) vinegarEl.textContent = vinegar + " kg";
      if (brineEl) brineEl.textContent = brine + " kg";
      if (totalEl) totalEl.textContent = acid + vinegar + brine + " kg";
    })
    .catch((err) => {
      console.error("❌ Summary fetch failed:", err);
    });
}
