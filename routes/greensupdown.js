const express = require("express");
const router = express.Router();
const db = require("../models/db"); 
const ExcelJS = require("exceljs");
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

// Function to convert Excel serial date to YYYY-MM-DD
function excelSerialToDate(value) {
    if (!value) return null;

    // ✅ If already in "YYYY-MM-DD" format, return as is
    if (typeof value === "string" && value.match(/^\d{4}-\d{2}-\d{2}$/)) {
        return value;
    }

    // ✅ If in "DD-MM-YYYY" format, convert to "YYYY-MM-DD"
    if (typeof value === "string" && value.match(/^\d{2}-\d{2}-\d{4}$/)) {
        const [day, month, year] = value.split("-");
        return `${year}-${month}-${day}`;
    }

    // ✅ Convert Excel serial number to date
    if (!isNaN(value)) {
        const excelStartDate = new Date(1899, 11, 30);
        return new Date(excelStartDate.getTime() + value * 86400000)
            .toISOString()
            .split("T")[0];
    }

    return null;
}



// 📌 Upload Greens Data (Prevent Duplicate Entries)
router.post("/greens/upload", async (req, res) => {
    try {
        console.log("Received Data:", req.body);

        const greensData = req.body;

        if (!greensData || greensData.length === 0) {
            return res.status(400).json({ message: "No data received." });
        }

        for (const entry of greensData) {
            const DcNumber = entry.DcNumber || "";
            const Vendor = entry.vendor ? entry.vendor.trim().toUpperCase() : ""; // ✅ Normalize case & trim spaces

            // ✅ Check if the DC Number & Vendor already exist in the database
            const checkDuplicateQuery = `SELECT COUNT(*) AS count FROM greens_arrival WHERE dc_number = ? AND UPPER(TRIM(vendor)) = ?`;
            const [result] = await db.query(checkDuplicateQuery, [DcNumber, Vendor]);

            if (result.count > 0) {
                console.log(`⚠️ Duplicate Found: DC ${DcNumber}, Vendor ${Vendor}`);
                return res.status(409).json({ message: `Duplicate entry found for DC ${DcNumber} and Vendor ${Vendor}.` });
            }

            // ✅ Insert if no duplicate found
            const sql = `INSERT INTO greens_arrival 
            (dc_number, dc_date, factory_arrival_date, vendor, location, pattern, 
             d_160_plus, d_100_plus, d_30_plus, d_30_minus, total_dc_weight, vehicle_no, 
             f_160_plus, f_100_plus, f_30_plus, f_30_minus, total_factory_weight, shortage_excess) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

            const values = [
                entry.DcNumber || "",  
                entry.DcDate || null,  
                entry.FactoryArrivalDate || null,
                Vendor, // ✅ Save vendor in normalized format
                entry.location || "",
                entry.pattern || "",
                parseInt(entry.D160plus) || 0,
                parseInt(entry.D100plus) || 0,
                parseInt(entry.D30plus) || 0,
                parseInt(entry.D30minus) || 0,
                parseInt(entry.TotalDCWeight) || 0,
                entry.VehicleNo || "",
                parseInt(entry.F160plus) || 0,
                parseInt(entry.F100plus) || 0,
                parseInt(entry.F30plus) || 0,
                parseInt(entry.F30minus) || 0,
                parseInt(entry.TotalFactoryWeight) || 0,  
                parseInt(entry.Shortage_Excess) || 0
            ];

            await db.query(sql, values);
            console.log(`✅ Entry Inserted: DC ${DcNumber}, Vendor ${Vendor}`);
        }

        res.json({ message: "Excel data uploaded successfully!" });

    } catch (error) {
        console.error("Upload Error:", error);
        res.status(500).json({ message: "Server error during upload." });
    }
});




module.exports = router;
