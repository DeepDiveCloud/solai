document.addEventListener("DOMContentLoaded", async function () {
  // Sidebar Toggle
  const sidebarToggle = document.getElementById("sidebarCollapse");
  if (sidebarToggle) {
    sidebarToggle.addEventListener("click", function () {
      document.getElementById("sidebar").classList.toggle("collapsed");
      document.getElementById("content").classList.toggle("expanded");
    });
  } else {
    console.error("❌ sidebarCollapse element not found!");
  }

  // Fetch Total Greens
  const totalGreensElement = document.getElementById("greensTotal");
  if (totalGreensElement) {
    try {
      const response = await fetch("http://localhost:5000/api/totalgreens");
      const data = await response.json();
      totalGreensElement.innerText = data.totalGreens + " kg";
    } catch (error) {
      console.error("❌ Error fetching total greens:", error);
    }
  } else {
    console.error("❌ greensTotal element not found in HTML!");
  }

  // Fetch Total Greens Price
  const totalGreensPriceElement = document.getElementById("greensValue");
  if (totalGreensPriceElement) {
    try {
      const response = await fetch("http://localhost:5000/api/totalgreensprice");
      const data = await response.json();
      totalGreensPriceElement.innerText = "₹ " + data.totalGreensprice;
    } catch (error) {
      console.error("❌ Error fetching total greens price:", error);
    }
  } else {
    console.error("❌ greensValue element not found in HTML!");
  }

  // ✅ Call production summary
  loadSummary();
});

// ✅ Production summary fetch
function loadSummary() {
  fetch("/api/production-summary")
    .then((res) => res.json())
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
      console.error("Summary fetch failed", err);
    });
}
