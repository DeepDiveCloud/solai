document.addEventListener("DOMContentLoaded", () => {
	console.log("✅ DOM fully loaded");

	// Initial load
	fetchEntries();
	initVendorDropdown();
	initEventListeners();
});


//vendor dropdown

async function fetchVendors() {
	const date = document.getElementById("DcDate")?.value;
	const vendorDropdown = document.getElementById("vendor_name");
	if (!vendorDropdown) return;

	try {
		let url = "http://localhost:5000/api/vendors";
		if (date) url += `?date=${encodeURIComponent(date)}`;

		const response = await fetch(url);
		if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

		const vendors = await response.json();
		vendorDropdown.innerHTML = '<option value="">Select Vendor</option>';
		vendors.forEach(vendor => {
			const option = document.createElement("option");
			option.value = vendor.id;
			option.textContent = vendor.vendor_name;
			vendorDropdown.appendChild(option);
		});
	} catch (error) {
		console.error("Error fetching vendors:", error);
	}
}


// ✅ Fetch all entries
async function fetchEntries() {
	try {
		const response = await fetch("http://localhost:5000/api/greens");
		if (!response.ok) throw new Error(`Server Error: ${response.status}`);

		const data = await response.json();
		// ✅ Sort entries by created_at (latest first)
		data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
		console.log("Fetched Entries:", data); // 🔥 Debugging
		displayEntries(data);
	}
	catch (error) {
		console.error("Error fetching data:", error);
	}
}


// ✅ Display entries in table
function displayEntries(entries) {
	console.log("Entries to Display:", entries); // Debugging Log
	const tableBody = document.getElementById("greensTableBody");
	if (!tableBody) return console.error("❌ Table body not found!");
	
	tableBody.innerHTML = entries.map(entry => `
        <tr>
            <td>${entry.dc_number}</td>
            <td>${new Date(entry.dc_date).toLocaleDateString()}</td>
            <td>${entry.vendor}</td>
            <td>${entry.location}</td>
            <td>${entry.pattern}</td>
            <td>${entry.d_160_plus || 0}</td>
            <td>${entry.d_100_plus || 0}</td>
            <td>${entry.d_30_plus || 0}</td>
            <td>${entry.d_30_minus || 0}</td>
            <td>${entry.total_dc_weight}</td>
            <td>${entry.f_160_plus || 0}</td>
            <td>${entry.f_100_plus || 0}</td>
            <td>${entry.f_30_plus || 0}</td>
            <td>${entry.f_30_minus || 0}</td>
            <td>${entry.total_factory_weight}</td>
            <td>${entry.shortage_excess}</td>
            <td>
                <button class="btn btn-warning btn-sm edit-btn" data-id="${entry.id}">Edit</button>
                <button class="btn btn-danger btn-sm delete-btn" data-id="${entry.id}">Delete</button>
            </td>
        </tr>
    `).join("");

	attachDeleteEventListeners();
	attachEditEventListeners();
}


// ✅ Delete Entry
function attachDeleteEventListeners() {
	document.querySelectorAll(".delete-btn").forEach(button => {
		button.addEventListener("click", async function () {
			const entryId = this.getAttribute("data-id");

			if (confirm("Are you sure you want to delete this entry?")) {
				try {
					const response = await fetch(`http://localhost:5000/api/greens/${entryId}`, {
						method: "DELETE"
					});
					if (!response.ok) throw new Error("Failed to delete entry.");

					alert("Entry deleted successfully!");
					fetchEntries();
				}
				catch (error) {
					console.error("Error deleting entry:", error);
				}
			}
		});
	});
}

  // ✅ Edit Entry 
function attachEditEventListeners() {
	document.querySelectorAll(".edit-btn").forEach(button => {
		button.addEventListener("click", async function () {
			const entryId = this.getAttribute("data-id");

			try {
				const response = await fetch(`http://localhost:5000/api/greens/${entryId}`);
				if (!response.ok) throw new Error("Failed to fetch entry details");
				const entry = await response.json();
				populateForm(entry);
			}
			catch (error) {
				console.error("Error fetching entry:", error);
			}
		});
	});
}

// ✅ Handle Form Submission
document.getElementById("greensForm").addEventListener("submit", function (event) {
	event.preventDefault(); // Stop default form submission

	const vendorDropdown = document.getElementById("vendor_name");
	const patternDropdown = document.getElementById("pattern");
	const vendor = vendorDropdown.value.trim();
	const pattern = patternDropdown.value.trim();

	// 🔹 Validate required fields before sending
	const getValue = (id) => {
		const el = document.getElementById(id);
		if (!el) {
		  console.warn(`⚠️ Element with ID '${id}' not found.`);
		  return "";
		}
		return el.value.trim();
	  };
	  
	  const getNumber = (id) => {
		const el = document.getElementById(id);
		if (!el) {
		  console.warn(`⚠️ Element with ID '${id}' not found.`);
		  return 0;
		}
		return parseFloat(el.value) || 0;
	  };
	  
	  const formData = {
		DcNumber: getValue("DcNumber"),
		DcDate: getValue("DcDate"),
		FactoryArrivalDate: getValue("FactoryArrivalDate"),
		Vendor: vendor || "", // make sure this is assigned correctly before this block
		Location: getValue("location"),
		Pattern: pattern || "", // make sure pattern is defined too
		D30minus: getNumber("D30minus"),
		D30plus: getNumber("D30plus"),
		D100plus: getNumber("D100plus"),
		D160plus: getNumber("D160plus"),
		TotalDCWeight: getNumber("TotalDCWeight"),
		VehicleNo: getValue("VehicleNo"),
		F30minus: getNumber("F30minus"),
		F30plus: getNumber("F30plus"),
		F100plus: getNumber("F100plus"),
		F160plus: getNumber("F160plus"),
	  };
	  
	console.log("📩 Submitting form data:", formData);

	fetch("http://localhost:5000/api/greens", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(formData)
		})
		.then(response => {
			if (!response.ok) throw new Error("Failed to save entry.");
			return response.json();
		})
		.then(data => {
			console.log("✅ Form submitted successfully:", data);
			alert("Entry saved successfully!");
			// Clear the form after saving
			document.getElementById("greensForm").reset();
			// Automatically fetch and display new data after the form submission
			fetchEntries(); // Refresh entries
			
		})
		.catch(error => {
			console.error("❌ Error submitting form:", error);
			alert("Error saving entry. Please check the form data .");
		});
});


function populateForm(entry) {
	document.getElementById("entryId").value = entry.id || "";
	document.getElementById("DcNumber").value = entry.dc_number || "";
	document.getElementById("DcDate").value = entry.dc_date ? entry.dc_date.split("T")[0] : "";
	document.getElementById("FactoryArrivalDate").value = entry.factory_arrival_date ? entry.factory_arrival_date.split("T")[0] : "";
	document.getElementById("Vendor").value = entry.vendor || "";
	document.getElementById("location").value = entry.location || "";
	document.getElementById("Pattern").value = entry.pattern || "";

	const d160plus = parseFloat(entry.d_160_plus) || 0;
	const d100plus = parseFloat(entry.d_100_plus) || 0;
	const d30plus = parseFloat(entry.d_30_plus) || 0;
	const d30minus = parseFloat(entry.d_30_minus) || 0;

	document.getElementById("D160plus").value = d160plus;
	document.getElementById("D100plus").value = d100plus;
	document.getElementById("D30plus").value = d30plus;
	document.getElementById("D30minus").value = d30minus;

	// ✅ Auto-calculate Total DC Weight
	const totalDCWeight = d160plus + d100plus + d30plus + d30minus;
	document.getElementById("TotalDCWeight").value = totalDCWeight;

	document.getElementById("VehicleNo").value = entry.vehicle_no || "";
	document.getElementById("F160plus").value = entry.f_160_plus ?? "";
	document.getElementById("F100plus").value = entry.f_100_plus ?? "";
	document.getElementById("F30plus").value = entry.f_30_plus ?? "";
	document.getElementById("F30minus").value = entry.f_30_minus ?? "";
	document.getElementById("TotalFactoryWeight").value = entry.total_factory_weight ?? "";
	document.getElementById("Shortage_Excess").value = entry.shortage_excess ?? "";
}


function calculateTotalDCWeight() {
	const D160plus = parseFloat(document.getElementById("D160plus").value) || 0;
	const D100plus = parseFloat(document.getElementById("D100plus").value) || 0;
	const D30plus = parseFloat(document.getElementById("D30plus").value) || 0;
	const D30minus = parseFloat(document.getElementById("D30minus").value) || 0;

	const totalDCWeight = D160plus + D100plus + D30plus + D30minus;
	document.getElementById("TotalDCWeight").value = totalDCWeight;
}
document.getElementById("D160plus").addEventListener("input", calculateTotalDCWeight);
document.getElementById("D100plus").addEventListener("input", calculateTotalDCWeight);
document.getElementById("D30plus").addEventListener("input", calculateTotalDCWeight);
document.getElementById("D30minus").addEventListener("input", calculateTotalDCWeight);

//
document.querySelectorAll("#F160plus, #F100plus, #F30plus, #F30minus, #TotalDCWeight")
	.forEach(input => input.addEventListener("input", () => {
		calculateTotalFactoryWeight();
		calculateShortage_Excess();
	}));


function calculateTotalFactoryWeight() {
	const F160plus = parseFloat(document.getElementById("F160plus").value) || 0;
	const F100plus = parseFloat(document.getElementById("F100plus").value) || 0;
	const F30plus = parseFloat(document.getElementById("F30plus").value) || 0;
	const F30minus = parseFloat(document.getElementById("F30minus").value) || 0;

	const TotalFactoryWeight = F160plus + F100plus + F30plus + F30minus;
	document.getElementById("TotalFactoryWeight").value = TotalFactoryWeight.toFixed(2);
}


function calculateShortage_Excess() {
	const TotalDCWeight = parseFloat(document.getElementById("TotalDCWeight").value) || 0;
	const TotalFactoryWeight = parseFloat(document.getElementById("TotalFactoryWeight").value) || 0;

	const Shortage_Excess = TotalFactoryWeight - TotalDCWeight;
	document.getElementById("Shortage_Excess").value = Shortage_Excess.toFixed(2);
}


// Attach event listeners
document.addEventListener("DOMContentLoaded", () => {
	console.log("✅ DOM fully loaded");

	const entryDateInput = document.getElementById("DcDate");
	const vendorDropdown = document.getElementById("vendor_name");

	if (entryDateInput) {
		entryDateInput.addEventListener("change", fetchVendors);
	}
	else {
		console.error("🚨 Element #DcDate not found!");
	}

	if (vendorDropdown) {
		vendorDropdown.addEventListener("change", fetchPatterns);
	}
	else {
		console.error("🚨 Element #vendor_name not found!");
	}
});
// Fetch vendors based on selected date
function fetchVendors() {
	const entryDateInput = document.getElementById("DcDate");
	const vendorDropdown = document.getElementById("vendor_name");
	const patternDropdown = document.getElementById("pattern");

	if (!entryDateInput || !vendorDropdown || !patternDropdown) {
		console.error("❌ Vendor, Date, or Pattern dropdown not found.");
		return;
	}

	const entry_date = entryDateInput.value.trim();

	// 🔹 Prevent API call if no date is selected
	if (!entry_date) {
		console.warn("⚠️ No date selected. Resetting vendor & pattern dropdowns.");
		vendorDropdown.innerHTML = '<option value="">Select Date First</option>';
		patternDropdown.innerHTML = '<option value="">Select Vendor First</option>';
		return; // ⛔ Stop execution here
	}

	console.log(`🔍 Fetching vendors for date: ${entry_date}`);

	fetch(`http://localhost:5000/api/vendors/by-date?entry_date=${entry_date}`)
		.then(response => {
			console.log("📩 Response status:", response.status);
			return response.json();
		})
		.then(vendors => {
			console.log("📩 Vendor API Response:", vendors);

			if (!Array.isArray(vendors) || vendors.length === 0) {
				console.warn("⚠️ No vendors found.");
				vendorDropdown.innerHTML = '<option value="">No Vendors Available</option>';
				patternDropdown.innerHTML = '<option value="">Select Vendor First</option>';
				return;
			}

			vendorDropdown.innerHTML = '<option value="">Select Vendor</option>';
			vendors.forEach(vendor => {
				const option = document.createElement("option");
				option.value = vendor.vendor_name;
				option.textContent = vendor.vendor_name;
				vendorDropdown.appendChild(option);
			});

			// Reset pattern dropdown
			patternDropdown.innerHTML = '<option value="">Select Vendor First</option>';
			console.log("✅ Vendor dropdown updated.");
		})
		.catch(error => {
			console.error("❌ Error fetching vendors:", error);
		});
}


// Fetch patterns based on selected vendor and date
function fetchPatterns() {
	const vendorDropdown = document.getElementById("vendor_name");
	const entryDateInput = document.getElementById("DcDate");
	const patternDropdown = document.getElementById("pattern");

	if (!vendorDropdown || !entryDateInput || !patternDropdown) {
		console.error("❌ One or more elements not found.");
		return;
	}

	const vendor_name = vendorDropdown.value.trim();
	const entry_date = entryDateInput.value.trim();

	if (!vendor_name) {
		console.warn("⚠️ No vendor selected. Clearing pattern dropdown.");
		patternDropdown.innerHTML = '<option value="">Select Vendor First</option>';
		return;
	}

	console.log(`🔍 Fetching patterns for vendor: ${vendor_name}, date: ${entry_date}`);

	fetch(`http://localhost:5000/api/patterns/by-date-vendor?entry_date=${entry_date}&vendor_name=${encodeURIComponent(vendor_name)}`)
		.then(response => response.json())
		.then(patterns => {
			console.log("📩 Pattern API Response:", patterns);

			if (!Array.isArray(patterns) || patterns.length === 0) {
				console.warn("⚠️ No patterns found.");
				patternDropdown.innerHTML = '<option value="">No Patterns Available</option>';
				return;
			}

			patternDropdown.innerHTML = '<option value="">Select Pattern</option>';
			patterns.forEach(patternObj => {
				const option = document.createElement("option");
				option.value = patternObj.pattern;
				option.textContent = patternObj.pattern;
				patternDropdown.appendChild(option);
			});

			console.log("✅ Pattern dropdown updated.");
		})
		.catch(error => {
			console.error("❌ Error fetching patterns:", error);
		});
}

//location transport
async function loadLocations() {
	try {
	  const res = await fetch("/api/locations");
	  const locations = await res.json();
  
	  const dropdown = document.getElementById("locationDropdown");
	  locations.forEach(loc => {
		const option = document.createElement("option");
		option.value = loc.location;
		option.textContent = loc.location;
		dropdown.appendChild(option);
	  });
	} catch (err) {
	  console.error("Failed to load locations:", err);
	}
  }
  
  loadLocations();
  


