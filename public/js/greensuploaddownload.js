document.addEventListener("DOMContentLoaded", function () {
    const fileInput = document.getElementById("excelFileInput");
    
    if (fileInput) {
        fileInput.addEventListener("change", uploadExcel);
    } else {
        console.error("Error: Element with ID 'excelFileInput' not found.");
    }
});


function excelSerialToDate(serial) {
    if (!serial || isNaN(serial)) return null; // If invalid, return null
    const excelStartDate = new Date(1899, 11, 30); // Excel's start date
    return new Date(excelStartDate.getTime() + serial * 86400000) // Convert serial to date
        .toISOString()
        .split("T")[0]; // Format as YYYY-MM-DD
}
// ✅ Upload Excel data (Bulk Insert)
async function uploadExcel() {
    const fileInput = document.getElementById("excelFileInput");
    if (!fileInput.files.length) {
        alert("Please select an Excel file first.");
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = async function (e) { // ✅ Make this async
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        // Assuming data is in the first sheet
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Convert sheet data to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        console.log("Converted Excel Data:", jsonData); // Debugging Output

        if (!jsonData.length) {
            alert("Excel file is empty or not formatted correctly.");
            return;
        }
        // Convert column names if needed
         // **Fixing data mapping before sending to server**
         const formattedData = jsonData.map(row => {
            const D160plus = parseInt(row["D160+"]) || 0;
            const D100plus = parseInt(row["D100+"]) || 0;
            const D30plus = parseInt(row["D30+"]) || 0;
            const D30minus = parseInt(row["D30-"]) || 0;
            const F160plus = parseInt(row["F160+"]) || 0;
            const F100plus = parseInt(row["F100+"]) || 0;
            const F30plus = parseInt(row["F30+"]) || 0;
            const F30minus = parseInt(row["F30-"]) || 0;
            const TotalFactoryWeight = F160plus +  F100plus + F30plus + F30minus;// ✅ Fix calculation
            const TotalDCWeight = D160plus +  D100plus + D30plus + D30minus;
            const Shortage_Excess = TotalFactoryWeight - TotalDCWeight ;       // ✅ Calculate Shortage/Excess
            return {
                DcNumber: row["DcNumber"] || "",  
                DcDate: excelSerialToDate(row["DcDate"]) || null,  
                FactoryArrivalDate: excelSerialToDate(row["Factory Arrival Date"]) || null,
                vendor: row["Vendor"] || "",
                location: row["Location"] || "",
                pattern: row["Pattern"] || "",
                D160plus,
                D100plus,
                D30plus,
                D30minus, 
                TotalDCWeight,
                VehicleNo: row["Vehicle_No"] || "",
                F160plus,
                F100plus,
                F30plus,
                F30minus,
                TotalFactoryWeight,
                Shortage_Excess
                // ✅ Fixed calculation
               
                
            };
        });
        
        console.log("Formatted Data Before Sending:", formattedData);
        

        // 🚀 Send in smaller batches of 100 entries each
        const chunkSize = 100;
        for (let i = 0; i < formattedData.length; i += chunkSize) {
            const chunk = formattedData.slice(i, i + chunkSize);
            await sendChunk(chunk); // ✅ Ensure await is inside async function
        }

        alert("Excel data uploaded successfully!");
        fetchEntries();
    };

    reader.readAsArrayBuffer(file);
}

// 🔹 Helper function to send a chunk of data
async function sendChunk(chunk) {
    try {
        const response = await fetch("http://localhost:5000/api/greens/upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(chunk),
        });

        const result = await response.json();

        if (response.status === 409) { // ⚠️ If duplicate detected
            alert(result.message); // 🚨 Show alert to the user
            console.warn("Duplicate Record:", result.message);
            return; // Stop further processing
        }

        console.log("Server Response:", result);
    } catch (error) {
        console.error("Error uploading data:", error);
    }
}

