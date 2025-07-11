document.addEventListener("DOMContentLoaded", () => {
    const addLocationButton = document.getElementById("addLocationButton");
    const locationInput = document.getElementById("locationInput");
    const locationList = document.getElementById("locationList");
    const locationCount = document.getElementById("locationCount");
    const locationDropdown = document.getElementById("locationDropdown");

    const API_URL = "http://localhost:5000/api/locations";

    if (!addLocationButton || !locationInput || !locationList || !locationDropdown) {
        console.error("❌ Required elements not found!");
        return;
    }

 // ✅ Fetch and display locations
 function fetchLocations() {
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            console.log("📥 Fetched locations from API:", data);

            // ✅ Clear old data
            locationList.innerHTML = ""; 

            // ✅ Update total count
            locationCount.textContent = data.length;

            // ✅ Add locations to table
            data.forEach((location, index) => {
                const row = document.createElement("tr");

                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${location.locationName}</td>
                    <td>
                        <button class="ui red button delete-btn" data-id="${location.id}">Delete</button>
                    </td>
                `;

                locationList.appendChild(row);
            });
        })
        .catch(error => console.error("❌ Error fetching locations:", error));
}

    // ✅ Load locations when page loads
    fetchLocations();

    addLocationButton.addEventListener("click",async () => {
        const locationName = locationInput.value.trim();
        if (locationName === "") {
            alert("Please enter a location name.");
            return;
        }
        console.log("📤 Sending location to API:", locationName);
        
        fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ locationName }),
        })
        .then(response => response.json())  // Convert response to JSON
        .then(data => {
           console.log("✅ Server Response:", data); // Log full response
       if (data.error) {
            alert("❌ Error: " + data.error); // Show error in popup
      } else {
        alert("✅ Location added successfully!"); // Success
        fetchLocations(); // Refresh list
    }
      })
        .catch(error => console.error("❌ Error:", error));
    });


// ✅ Delete location event using event delegation
locationList.addEventListener("click", (event) => {
    if (event.target.classList.contains("delete-btn")) {
        const id = event.target.dataset.id;
        if (confirm("Are you sure you want to delete this location?")) {
            fetch(`${API_URL}/${id}`, { method: "DELETE" })
                .then(response => response.json())
                .then(data => {
                    console.log("✅ Delete Response:", data);
                    alert("🚮 Location deleted successfully!");
                    fetchLocations(); // Refresh list
                })
                .catch(error => console.error("❌ Error deleting location:", error));
        }
    }
});
// ✅ Function to fetch locations and populate the dropdown
// ✅ Function to fetch locations and populate the dropdown
fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            console.log("📥 Locations fetched:", data);

            if (!Array.isArray(data)) {
                console.error("❌ Invalid response format. Expected an array:", data);
                return;
            }

            // ✅ Populate the dropdown
            locationDropdown.innerHTML = '<option value="">-- Select Location --</option>';
            data.forEach(location => {
                const option = document.createElement("option");
                option.value = location.id;  // Ensure `id` matches your DB
                option.textContent = location.locationName;
                locationDropdown.appendChild(option);
            });

            console.log("✅ Dropdown updated successfully!");
        })
        .catch(error => console.error("❌ Error fetching locations:", error));
});




