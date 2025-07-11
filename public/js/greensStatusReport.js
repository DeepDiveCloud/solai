document.addEventListener("DOMContentLoaded", function () {
    loadDropdowns();
});

// Function to load vendors and locations into dropdowns
function loadDropdowns() {
    // Load Vendors
    fetch("http://localhost:5000/api/greens/vendors")
        .then(response => response.json())
        .then(data => {
            let vendorDropdown = document.getElementById("vendorDropdown");
            vendorDropdown.innerHTML = '<option value="">All Vendors</option>'; // Reset dropdown

            data.forEach(vendor => {
                let option = document.createElement("option");
                option.value = vendor;
                option.textContent = vendor;
                vendorDropdown.appendChild(option);
            });
        })
        .catch(error => console.error("Error loading vendors:", error));

    // Load Locations
    fetch("http://localhost:5000/api/greens/locations")
        .then(response => response.json())
        .then(data => {
            let locationDropdown = document.getElementById("locationDropdown");
            locationDropdown.innerHTML = '<option value="">All Locations</option>'; // Reset dropdown

            data.forEach(location => {
                let option = document.createElement("option");
                option.value = location;
                option.textContent = location;
                locationDropdown.appendChild(option);
            });
        })
        .catch(error => console.error("Error loading locations:", error));
}

// Function to fetch and display the Greens Status Report
function fetchGreensReport() {
    const vendor = document.getElementById("vendorDropdown").value;
    const location = document.getElementById("locationDropdown").value;
    const dateFrom = document.getElementById("dateFrom").value;
    const dateTo = document.getElementById("dateTo").value;

    let url = "http://localhost:5000/api/greens/status?";
    if (vendor) url += `vendor=${vendor}&`;
    if (location) url += `location=${location}&`;
    if (dateFrom && dateTo) url += `dateFrom=${dateFrom}&dateTo=${dateTo}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log("Fetched Data:", data); // Debugging: Check API response in console

            const tableBody = document.getElementById("reportTableBody");
            tableBody.innerHTML = ""; // Clear previous data

            tableBody.innerHTML = `
                <tr>
                    <td>${data.totalDCWeight}</td>
                    <td>${data.totalFactoryWeight}</td>
                    <td>${data.totalShortage}</td>
                    <td>${data.total160plus}</td>
                    <td>${data.total100plus}</td>
                    <td>${data.total30plus}</td>
                    <td>${data.total30minus}</td>
                </tr>
            `;

            // Save report data globally for download
            window.reportData = data;
        })
        .catch(error => console.error("Error fetching report:", error));
}

// 1️⃣ Download Report as Excel
function downloadExcel() {
    const vendor = document.getElementById("vendorDropdown").value || "All Vendors";
    const location = document.getElementById("locationDropdown").value || "All Locations";
    const dateFrom = document.getElementById("dateFrom").value || "N/A";
    const dateTo = document.getElementById("dateTo").value || "N/A";

    let table = document.getElementById("reportTableBody").innerHTML;
    
    let data = `
        <table border="1">
            <tr>
                <th colspan="7" style="text-align:center; font-size:18px;">
                    <img src=<img src="./images/solai logo.png" width="50" height="50"> Solai Agro
                </th>
            </tr>
            <tr><th colspan="7" style="text-align:center; font-size:16px;">Greens Status Report</th></tr>
            <tr><td colspan="7"><b>Vendor:</b> ${vendor} &nbsp;&nbsp; <b>Location:</b> ${location} &nbsp;&nbsp; <b>Date:</b> ${dateFrom} to ${dateTo}</td></tr>
            <tr>
                <th>Total DC Weight</th>
                <th>Total Factory Weight</th>
                <th>Total Shortage</th>
                <th>Total 160+</th>
                <th>Total 100+</th>
                <th>Total 30+</th>
                <th>Total 30-</th>
            </tr>
            ${table}
        </table>`;

    let blob = new Blob([data], { type: "application/vnd.ms-excel" });
    let a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "Greens_Status_Report.xls";
    a.click();
}

// 1️⃣ Download Report as pdf
function downloadPDF() {
    const vendor = document.getElementById("vendorDropdown").value || "All Vendors";
    const location = document.getElementById("locationDropdown").value || "All Locations";
    const dateFrom = document.getElementById("dateFrom").value || "N/A";
    const dateTo = document.getElementById("dateTo").value || "N/A";

    const { jsPDF } = window.jspdf;
    let doc = new jsPDF();

    // Add Logo
    let img = new Image();
    img.src = "./images/solai logo.png";
    img.onload = function () {
        doc.addImage(img, "PNG", 10, 5, 30, 30); // X, Y, Width, Height
        doc.setFontSize(20);
        doc.text("Solai Agro", 80, 23);
        
        // Report Title
        doc.setFontSize(16);
        doc.text("Greens Status Report", 80, 40);

        // Report Filters
        doc.setFontSize(12);
        doc.text(`Vendor: ${vendor}`, 10, 50);
        doc.text(`Location: ${location}`, 10, 60);
        doc.text(`Date: ${dateFrom} to ${dateTo}`, 10, 70);

        let rows = [];
        document.querySelectorAll("#reportTableBody tr").forEach(tr => {
            let row = [];
            tr.querySelectorAll("td").forEach(td => row.push(td.innerText));
            rows.push(row);
        });

        // Table with Data
        doc.autoTable({
            startY: 80,
            head: [["Total DC Weight", "Total Factory Weight", "Total Shortage", "Total 160+", "Total 100+", "Total 30+", "Total 30-"]],
            body: rows
        });

        doc.save("Greens_Status_Report.pdf");
    };
}



