
//submit
document.addEventListener("DOMContentLoaded", function () {
    console.log("Transport Price Management Loaded");

    const TransportPriceForm = document.getElementById("TransportPriceForm");

    if (!TransportPriceForm) {
        console.error("Form element not found");
        return;
    }

    TransportPriceForm.addEventListener("submit", async function (event) {
        event.preventDefault();
    
        const season_name = document.getElementById("transport_season")?.value?.trim();
        const transport_name = document.getElementById("transport_name")?.value?.trim();
        const location = document.getElementById("location")?.value?.trim();
        const price = document.getElementById("price")?.value?.trim();
    
        if (!season_name || !transport_name || !location || !price) {
            alert("⚠️ Please fill in all the fields before submitting!");
            return;
        }
    
        try {
            const response = await fetch("http://localhost:5000/api/Transport-add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ season_name, transport_name, location, price }),
            });
    
            if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    
            const data = await response.json();
            alert(data.message || "✅ Transport price added successfully!");
            TransportPriceForm.reset();
        } catch (error) {
            console.error("Error adding transport price:", error);
            alert("❌ Failed to add transport price.");
        }
    });
    
});



// ✅ Fetch Transport Prices First
document.addEventListener("DOMContentLoaded", function () {
    console.log("🔄 Fetching transport prices...");

    function fetchTransportPrices() {
        fetch("http://localhost:5000/api/Transport-prices")
            .then(response => {
                if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
                return response.json();
            })
            .then(data => {
                console.log("✅ Received transport prices:", data);
                if (!Array.isArray(data) || data.length === 0) {
                    console.warn("⚠️ No transport prices found.");
                } else {
                    updateTable(data);
                }
            })
            .catch(error => {
                console.error("❌ Error fetching transport prices:", error);
            });
    }
    

   function updateTable(prices) {
    const tableBody = document.querySelector("#TransportPriceTable tbody");
    tableBody.innerHTML = ""; // Clear table

    if (!Array.isArray(prices) || prices.length === 0) {
        console.warn("⚠️ No transport prices available.");
        tableBody.innerHTML = "<tr><td colspan='6'>No data available</td></tr>";
        return;
    }

    prices.forEach((item, index) => {
        console.log(`Adding row: ${item.season_name}, ${item.transport_name}, ${item.location}, ${item.price}`);
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${item.season_name}</td>
            <td>${item.Transport_name}</td>
            <td>${item.location}</td>
            <td>${item.price}</td>
            <td><button class="btn btn-danger btn-sm delete-btn" data-id="${item.id}">Delete</button></td>
        `;
        tableBody.appendChild(row);
    });
}


    function deleteTransportPrice(id) {
        if (!confirm("Are you sure you want to delete this transport price?")) return;

        fetch(`http://localhost:5000/api/Transport-delete/${id}`, {
            method: "DELETE"
        })
        .then(response => response.json())
        .then(result => {
            alert(result.message);
            fetchTransportPrices(); // Refresh table
        })
        .catch(error => console.error("❌ Error deleting transport price:", error));
    }

    // Fetch and display transport prices on page load
    fetchTransportPrices();
});



document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ DOM fully loaded");

    const transportSeasonDropdown = document.getElementById("transport_season");

    if (!transportSeasonDropdown) {
        console.error("🚨 Element #transport_season not found in HTML!");
        return;
    }

    fetchSeasons(); // Fetch seasons on page load
});

// Fetch all seasons from the API
function fetchSeasons() {
    const transportSeasonDropdown = document.getElementById("transport_season");

    console.log("🔍 Fetching all seasons...");

    fetch("http://localhost:5000/api/seasons/all")
        .then(response => {
            console.log("📩 Response status:", response.status);
            return response.json();
        })
        .then(seasons => {
            console.log("📩 Received Seasons:", seasons);

            if (!Array.isArray(seasons) || seasons.length === 0) {
                console.warn("⚠️ No seasons found.");
                transportSeasonDropdown.innerHTML = '<option value="">No Seasons Available</option>';
                return;
            }

            // Populate dropdown
            transportSeasonDropdown.innerHTML = '<option value="">Select Season</option>';
            seasons.forEach(season => {
                const option = document.createElement("option");
                option.value = season.season_name;
                option.textContent = season.season_name;
                transportSeasonDropdown.appendChild(option);
            });

            console.log("✅ Transport session dropdown updated.");
        })
        .catch(error => {
            console.error("❌ Error fetching seasons:", error);
        });
}

async function loadLocations() {
    const response = await fetch('/api/locations');
    const locations = await response.json();

    let locationDropdown = document.getElementById('location');
    locations.forEach(location => {
        let option = document.createElement('option');
        option.value = location.id;
        option.textContent = location.name;
        locationDropdown.appendChild(option);
    });
}
loadLocations();

async function fetchPrice() {
    const location_id = document.getElementById('location').value;
    const vehicle_type = document.getElementById('vehicle_type').value;

    const response = await fetch(`/api/transport-price?location_id=${location_id}&vehicle_type=${vehicle_type}`);
    const data = await response.json();

    if (data.price) {
        document.getElementById('price').textContent = `Price: ₹${data.price}`;
    } else {
        document.getElementById('price').textContent = "Price not found.";
    }
}



