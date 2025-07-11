document.addEventListener("DOMContentLoaded", async function () {
    // Sidebar Toggle
    const sidebarToggle = document.getElementById("sidebarToggle");
    if (sidebarToggle) {
        sidebarToggle.addEventListener("click", function () {
            document.getElementById("sidebar").classList.toggle("collapsed");
            document.getElementById("content").classList.toggle("expanded");
        });
    } else {
        console.error("❌ sidebarToggle element not found!");
    }

    // Fetch Total Greens
    const totalGreensElement = document.getElementById("totalGreens");
    if (totalGreensElement) {
        try {
            const response = await fetch("http://localhost:5000/api/totalgreens");
            const data = await response.json();
            totalGreensElement.innerText = data.totalGreens + " kg";
        } catch (error) {
            console.error("❌ Error fetching total greens:", error);
        }
    } else {
        console.error("❌ totalGreens element not found in HTML!");
    }

    // Fetch Total Greens Price
    const totalGreensPriceElement = document.getElementById("totalGreensprice");
    if (totalGreensPriceElement) {
        try {
            const response = await fetch("http://localhost:5000/api/totalgreensprice");
            const data = await response.json();
            totalGreensPriceElement.innerText = data.totalGreensprice;
        } catch (error) {
            console.error("❌ Error fetching total greens price:", error);
        }
    } else {
        console.error("❌ totalGreensprice element not found in HTML!");
    }
});
