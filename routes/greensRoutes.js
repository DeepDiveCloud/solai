const express = require("express");
const router = express.Router();
const db = require("../models/db");

// ✅ GET all entries
router.get("/greens", async (req, res) => {
    try {
        const [results] = await db.query("SELECT * FROM greens_arrival");
        res.json(results);
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ error: "Database error" });
    }
});

// ✅ GET single entry by ID
router.get("/greens/:id", async (req, res) => {
    try {
        const [results] = await db.query("SELECT * FROM greens_arrival WHERE id = ?", [req.params.id]);
        if (results.length === 0) return res.status(404).json({ error: "Entry not found" });
        res.json(results[0]);
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ error: "Database error" });
    }
});

// ✅ POST - Add new entry
router.post("/greens", async (req, res) => {
    try {
        const {
            DcNumber, DcDate, FactoryArrivalDate, Vendor, Location, Pattern,
            D160plus, D100plus, D30plus, D30minus, TotalDCWeight, VehicleNo,
            F160plus, F100plus, F30plus, F30minus
        } = req.body;

        if (!DcNumber || !DcDate || !FactoryArrivalDate || !Vendor || !Pattern || !Location) {
            return res.status(400).json({ error: "Missing required fields!" });
        }

        const F160plusNum = Number(F160plus) || 0;
        const F100plusNum = Number(F100plus) || 0;
        const F30plusNum = Number(F30plus) || 0;
        const F30minusNum = Number(F30minus) || 0;
        const D160plusNum = Number(D160plus) || 0;
        const D100plusNum = Number(D100plus) || 0;
        const D30plusNum = Number(D30plus) || 0;
        const D30minusNum = Number(D30minus) || 0;

        const TotalFactoryWeight = F160plusNum + F100plusNum + F30plusNum + F30minusNum;
        const Shortage_Excess = TotalDCWeight - TotalFactoryWeight;

        const priceQuery = `
            SELECT price_160_plus, price_100_plus, price_30_plus, price_30_minus 
            FROM vendor_prices 
            WHERE vendor_name = ? AND greens_pattern = ? AND greens_location = ? AND ? BETWEEN from_date AND to_date
            LIMIT 1`;

        const [vendorPrices] = await db.query(priceQuery, [Vendor, Pattern, Location, DcDate]);

        if (vendorPrices.length === 0) {
            return res.status(404).json({ error: "Vendor price not found for this pattern, location, and date" });
        }

        const { price_160_plus, price_100_plus, price_30_plus, price_30_minus } = vendorPrices[0];

        const F160plusprice = price_160_plus * F160plusNum;
        const F100plusprice = price_100_plus * F100plusNum;
        const F30plusprice = price_30_plus * F30plusNum;
        const F30minusprice = price_30_minus * F30minusNum;
        const FTotalgreensAmount = F160plusprice + F100plusprice + F30plusprice + F30minusprice;

        const D160plusprice = price_160_plus * D160plusNum;
        const D100plusprice = price_100_plus * D100plusNum;
        const D30plusprice = price_30_plus * D30plusNum;
        const D30minusprice = price_30_minus * D30minusNum;
        const DTotalgreensAmount = D160plusprice + D100plusprice + D30plusprice + D30minusprice;

        const sql = `
            INSERT INTO greens_arrival 
            (dc_number, dc_date, factory_arrival_date, vendor, location, pattern, 
            d_160_plus, d_100_plus, d_30_plus, d_30_minus, total_dc_weight, vehicle_no, 
            f_160_plus, f_100_plus, f_30_plus, f_30_minus, total_factory_weight, 
            shortage_excess, F_price_160_plus, F_price_100_plus, F_price_30_plus, F_price_30_minus, F_total_greens_amount, 
            dc_price_160_plus, dc_price_100_plus, dc_price_30_plus, dc_price_30_minus, dc_total_greens_amount) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const [result] = await db.query(sql, [
            DcNumber, DcDate, FactoryArrivalDate, Vendor, Location, Pattern,
            D160plusNum, D100plusNum, D30plusNum, D30minusNum, TotalDCWeight, VehicleNo,
            F160plusNum, F100plusNum, F30plusNum, F30minusNum, TotalFactoryWeight, Shortage_Excess,
            F160plusprice, F100plusprice, F30plusprice, F30minusprice, FTotalgreensAmount,
            D160plusprice, D100plusprice, D30plusprice, D30minusprice, DTotalgreensAmount
        ]);

        res.status(201).json({
            message: "Entry added successfully",
            id: result.insertId,
            F_total_greens_amount: FTotalgreensAmount,
            dc_total_greens_amount: DTotalgreensAmount
        });

    } catch (err) {
        console.error("❌ Insert error:", err);
        res.status(500).json({ error: "Failed to insert data" });
    }
});

// ✅ PUT - Update an entry
router.put("/greens/:id", async (req, res) => {
    try {
        const entryId = req.params.id;
        const {
            DcNumber, DcDate, FactoryArrivalDate, Vendor, Location, Pattern,
            D160plus, D100plus, D30plus, D30minus, TotalDCWeight,
            VehicleNo, F160plus, F100plus, F30plus, F30minus
        } = req.body;

        const F160plusNum = Number(F160plus) || 0;
        const F100plusNum = Number(F100plus) || 0;
        const F30plusNum = Number(F30plus) || 0;
        const F30minusNum = Number(F30minus) || 0;
        const D160plusNum = Number(D160plus) || 0;
        const D100plusNum = Number(D100plus) || 0;
        const D30plusNum = Number(D30plus) || 0;
        const D30minusNum = Number(D30minus) || 0;

        const TotalFactoryWeight = F160plusNum + F100plusNum + F30plusNum + F30minusNum;
        const Shortage_Excess = TotalFactoryWeight - TotalDCWeight;

        const priceQuery = `
            SELECT price_160_plus, price_100_plus, price_30_plus, price_30_minus
            FROM vendor_prices
            WHERE vendor_name = ? AND greens_pattern = ? AND greens_location = ? AND ? BETWEEN from_date AND to_date
            LIMIT 1`;

        const [vendorPrices] = await db.query(priceQuery, [Vendor, Pattern, Location, DcDate]);

        if (vendorPrices.length === 0) {
            return res.status(404).json({ error: "Vendor price not found for this pattern, location, and date" });
        }

        const { price_160_plus, price_100_plus, price_30_plus, price_30_minus } = vendorPrices[0];

        const F160plusprice = price_160_plus * F160plusNum;
        const F100plusprice = price_100_plus * F100plusNum;
        const F30plusprice = price_30_plus * F30plusNum;
        const F30minusprice = price_30_minus * F30minusNum;
        const FTotalgreensAmount = F160plusprice + F100plusprice + F30plusprice + F30minusprice;

        const D160plusprice = price_160_plus * D160plusNum;
        const D100plusprice = price_100_plus * D100plusNum;
        const D30plusprice = price_30_plus * D30plusNum;
        const D30minusprice = price_30_minus * D30minusNum;
        const DTotalgreensAmount = D160plusprice + D100plusprice + D30plusprice + D30minusprice;

        const sql = `
            UPDATE greens_arrival SET
                dc_number=?, dc_date=?, factory_arrival_date=?, vendor=?, location=?, pattern=?,
                d_160_plus=?, d_100_plus=?, d_30_plus=?, d_30_minus=?, total_dc_weight=?, vehicle_no=?,
                f_160_plus=?, f_100_plus=?, f_30_plus=?, f_30_minus=?, total_factory_weight=?, shortage_excess=?,
                F_price_160_plus=?, F_price_100_plus=?, F_price_30_plus=?, F_price_30_minus=?, F_total_greens_amount=?,
                dc_price_160_plus=?, dc_price_100_plus=?, dc_price_30_plus=?, dc_price_30_minus=?, dc_total_greens_amount=?
            WHERE id=?`;

        const [result] = await db.query(sql, [
            DcNumber, DcDate, FactoryArrivalDate, Vendor, Location, Pattern,
            D160plusNum, D100plusNum, D30plusNum, D30minusNum, TotalDCWeight, VehicleNo,
            F160plusNum, F100plusNum, F30plusNum, F30minusNum, TotalFactoryWeight, Shortage_Excess,
            F160plusprice, F100plusprice, F30plusprice, F30minusprice, FTotalgreensAmount,
            D160plusprice, D100plusprice, D30plusprice, D30minusprice, DTotalgreensAmount,
            entryId
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Entry not found" });
        }

        res.json({ message: "Entry updated successfully" });

    } catch (err) {
        console.error("❌ Update error:", err);
        res.status(500).json({ error: "Failed to update entry" });
    }
});

// ✅ DELETE
router.delete("/greens/:id", async (req, res) => {
    try {
        const [result] = await db.query("DELETE FROM greens_arrival WHERE id = ?", [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: "Entry not found" });
        res.json({ message: "Entry deleted successfully" });
    } catch (err) {
        console.error("Delete error:", err);
        res.status(500).json({ error: "Failed to delete entry" });
    }
});

// ✅ Get vendors by date
router.get("/vendors/by-date", async (req, res) => {
    const { entry_date } = req.query;
    if (!entry_date) return res.status(400).json({ error: "entry_date is required" });

    try {
        const [results] = await db.query(
            `SELECT DISTINCT vendor_name FROM vendor_prices WHERE ? BETWEEN from_date AND to_date`,
            [entry_date]
        );
        res.json(results);
    } catch (err) {
        console.error("Vendor query error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// ✅ Get patterns by date + vendor + location
router.get("/patterns/by-date-vendor", async (req, res) => {
    const { entry_date, vendor_name, location } = req.query;
    if (!entry_date || !vendor_name || !location) {
        return res.status(400).json({ error: "entry_date, vendor_name, and location are required" });
    }

    const [results] = await db.query(`
        SELECT DISTINCT greens_pattern FROM vendor_prices 
        WHERE vendor_name = ? AND greens_location = ? AND ? BETWEEN from_date AND to_date`,
        [vendor_name, location, entry_date]
    );

    res.json(results);
});


// ✅ Get locations by date + vendor
router.get("/locations/by-date-vendor", async (req, res) => {
    const { entry_date, vendor_name } = req.query;
    if (!entry_date || !vendor_name) {
        return res.status(400).json({ error: "entry_date and vendor_name are required" });
    }

    const [results] = await db.query(`
        SELECT DISTINCT greens_location FROM vendor_prices 
        WHERE vendor_name = ? AND ? BETWEEN from_date AND to_date`,
        [vendor_name, entry_date]
    );

    res.json(results);
});

module.exports = router;
