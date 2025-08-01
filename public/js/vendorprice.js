document.addEventListener("DOMContentLoaded", function () {
  console.log("Vendor Price Management Loaded");

  const vendorPriceForm = document.getElementById("vendorPriceForm");
  const vendorPriceTable = document.getElementById("vendorPriceTable");

  const vendorFilter = document.getElementById("vendorFilter");
  const seasonFilter = document.getElementById("seasonFilter");
  const areaFilter = document.getElementById("areaFilter");

  let allVendorData = [];

  if (!vendorPriceForm || !vendorPriceTable) {
    console.error("Form or table element not found");
    return;
  }

  async function fetchVendorPrices() {
    try {
      const response = await fetch("http://localhost:5000/api/prices");
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
      const data = await response.json();
      console.log("Vendor Prices:", data);
      allVendorData = data;
      populateFilterDropdowns(data);
      displayVendorPrices(data);
    } catch (error) {
      console.error("Error fetching vendor prices:", error);
    }
  }

  function displayVendorPrices(vendors) {
    vendorPriceTable.innerHTML = "";
    vendors.forEach((vendor, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${vendor.season_name}</td>
        <td>${vendor.from_date.split("T")[0]} - ${vendor.to_date.split("T")[0]}</td>
        <td>${vendor.vendor_name}</td>
        <td>${vendor.greens_location}</td>
        <td>${vendor.greens_pattern}</td>
        <td>${vendor.price_160_plus}</td>
        <td>${vendor.price_100_plus}</td>
        <td>${vendor.price_60_plus}</td>
        <td>${vendor.price_30_plus}</td>
        <td>${vendor.price_30_minus}</td>
        <td>
          <button class="btn btn-danger btn-sm" onclick="deleteVendorPrice(${vendor.id})">Delete</button>
        </td>
      `;
      vendorPriceTable.appendChild(row);
    });
  }

  function populateFilterDropdowns(data) {
    const vendors = [...new Set(data.map(item => item.vendor_name))];
    const seasons = [...new Set(data.map(item => item.season_name))];
    const areas = [...new Set(data.map(item => item.greens_location))];

    vendorFilter.innerHTML = `<option value="">-- All Vendors --</option>` +
      vendors.map(v => `<option value="${v}">${v}</option>`).join("");

    seasonFilter.innerHTML = `<option value="">-- All Seasons --</option>` +
      seasons.map(s => `<option value="${s}">${s}</option>`).join("");

    areaFilter.innerHTML = `<option value="">-- All Locations --</option>` +
      areas.map(a => `<option value="${a}">${a}</option>`).join("");
  }

  function filterTable() {
    const vendor = vendorFilter.value;
    const season = seasonFilter.value;
    const location = areaFilter.value;

    const filtered = allVendorData.filter(v =>
      (!vendor || v.vendor_name === vendor) &&
      (!season || v.season_name === season) &&
      (!location || v.greens_location === location)
    );

    displayVendorPrices(filtered);
  }

  vendorPriceForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const season_name = document.getElementById("season_name").value.trim();
    const from_date = document.getElementById("from_date").value;
    const to_date = document.getElementById("to_date").value;
    const vendor_name = document.getElementById("vendor_name").value.trim();
    const greens_location = document.getElementById("greens_location").value.trim();
    const greens_pattern = document.getElementById("greens_pattern").value.trim();
    const price_160_plus = document.getElementById("price_160_plus").value;
    const price_100_plus = document.getElementById("price_100_plus").value;
    const price_60_plus = document.getElementById("price_60_plus").value;
    const price_30_plus = document.getElementById("price_30_plus").value;
    const price_30_minus = document.getElementById("price_30_minus").value;

    if (
      !season_name || !from_date || !to_date || !vendor_name ||
      !greens_location || !greens_pattern ||
      !price_160_plus || !price_100_plus || !price_60_plus || !price_30_plus || !price_30_minus
    ) {
      alert("Please fill all fields");
      return;
    }

    if (new Date(from_date) > new Date(to_date)) {
      alert("From Date cannot be after To Date");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          season_name, from_date, to_date, vendor_name,
          greens_location, greens_pattern,
          price_160_plus, price_100_plus, price_60_plus,
          price_30_plus, price_30_minus
        })
      });

      if (!response.ok) throw new Error("Error saving vendor price");
      alert("Vendor price added successfully!");
      vendorPriceForm.reset();
      fetchVendorPrices();
    } catch (error) {
      console.error("Error adding vendor price:", error);
      alert(error.message);
    }
  });

  window.deleteVendorPrice = async function (id) {
    if (!confirm("Are you sure you want to delete this vendor price?")) return;

    try {
      const response = await fetch(`http://localhost:5000/api/delete/${id}`, {
        method: "DELETE"
      });
      if (!response.ok) throw new Error("Failed to delete");
      alert("Deleted successfully!");
      fetchVendorPrices();
    } catch (error) {
      console.error("Error deleting vendor price:", error);
    }
  };

  // Event listeners for filters
  vendorFilter.addEventListener("change", filterTable);
  seasonFilter.addEventListener("change", filterTable);
  areaFilter.addEventListener("change", filterTable);

  fetchVendorPrices();
});
