document.addEventListener("DOMContentLoaded", function () {
  console.log("Vendor Price Management Loaded");

  const vendorPriceForm = document.getElementById("vendorPriceForm");
  const vendorPriceTable = document.getElementById("vendorPriceTable");

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
          displayVendorPrices(data);
      } catch (error) {
          console.error("Error fetching vendor prices:", error);
      }
  }

  function displayVendorPrices(vendors) {
    const vendorPriceTable = document.getElementById("vendorPriceTable");
    vendorPriceTable.innerHTML = ""; // Clear existing rows

    vendors.forEach((vendor, index) => {  // Add index here
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${index + 1}</td>  <!-- Fixed: Now index is defined -->
            <td>${vendor.season_name}</td>
            <td>${vendor.from_date} - ${vendor.to_date}</td>
            <td>${vendor.vendor_name}</td>
            <td>${vendor.pattern}</td>
            <td>${vendor.price_160_plus}</td>
            <td>${vendor.price_100_plus}</td>
            <td>${vendor.price_30_plus}</td>
            <td>${vendor.price_30_minus}</td>
            <td>
                <button class="btn btn-danger btn-sm" onclick="deleteVendorPrice(${vendor.id})">Delete</button>
            </td>
        `;
        vendorPriceTable.appendChild(row);
    });
}


  vendorPriceForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      const season_name = document.getElementById("season_name").value.trim();
      const from_date = document.getElementById("from_date").value;
      const to_date = document.getElementById("to_date").value;
      const vendor_name = document.getElementById("vendor_name").value.trim();
      const pattern = document.getElementById("pattern").value;
      const price_160_plus = document.getElementById("price_160_plus").value;
      const price_100_plus = document.getElementById("price_100_plus").value;
      const price_30_plus = document.getElementById("price_30_plus").value;
      const price_30_minus = document.getElementById("price_30_minus").value;

      if (!season_name || !from_date || !to_date || !vendor_name || !pattern || !price_160_plus || !price_100_plus || !price_30_plus || !price_30_minus) {
          alert("Please fill all fields");
          return;
      }

      const startDate = new Date(from_date);
      const endDate = new Date(to_date);

      if (startDate > endDate) {
          alert("From Date cannot be after To Date");
          return;
      }

      try {
          const response = await fetch("http://localhost:5000/api/add", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ season_name, from_date, to_date, vendor_name, pattern, price_160_plus, price_100_plus, price_30_plus, price_30_minus })
          });

          if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.error || `HTTP Error: ${response.status}`);
          }

          alert("Vendor price added successfully!");
          vendorPriceForm.reset();
          fetchVendorPrices();
      } catch (error) {
          alert(error.message);
          console.error("Error adding vendor price:", error);
      }
  });

  // Attach function to global scope
  window.deleteVendorPrice = async function (id) {
      if (!confirm("Are you sure you want to delete this vendor price?")) return;

      try {
          const response = await fetch(`http://localhost:5000/api/delete/${id}`, { method: "DELETE" });
          if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

          alert("Vendor price deleted successfully!");
          fetchVendorPrices();
      } catch (error) {
          console.error("Error deleting vendor price:", error);
      }
  };

  // Fetch vendor prices on load
  fetchVendorPrices();
});
