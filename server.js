require("dotenv").config();
console.log("✅ Loaded JWT_SECRET:", process.env.JWT_SECRET);

const express = require("express");
const mysql = require("mysql");           // or mysql2 (if using promises)
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Increase payload size limit if needed
app.use(express.json({ limit: "500mb" }));
app.use(express.urlencoded({ extended: true, limit: "500mb" }));

// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const greensRoutes = require("./routes/greensRoutes");       // Greens Entry API
const greensReport = require("./routes/greensReport");
const greensupdown = require("./routes/greensupdown");
const vendorPriceRoutes = require("./routes/vendorPriceRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const transportRoutes = require("./routes/transportRoutes");
const purchaseRoutes = require('./routes/purchase');
const customerRoutes = require('./routes/customerRoutes');
const invoiceRouters = require("./routes/invoiceRoutes")
const groupsRoutes = require("./routes/groupRoutes"); 
const productionRoutes = require("./routes/productionRoutes");
const productionExportRoutes = require("./routes/productionExportRoutes");
const rawMaterialRoutes = require("./routes/rawMaterialRoutes");
const dailyReportEmailRoutes = require("./routes/dailyReportEmailRoutes");
const greensLocationsRoutes = require("./routes/greensLocationsRoutes");

// Mount routes (order matters if endpoints overlap)
app.use("/api", invoiceRouters);
app.use("/api", customerRoutes);
app.use("/api", purchaseRoutes);
app.use("/api", transportRoutes);
app.use("/api", dashboardRoutes);
app.use("/api", vendorPriceRoutes);
app.use("/api", greensupdown);
app.use("/api", greensReport);
app.use("/api", greensRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);
app.use("/api", groupsRoutes);
app.use("/api", productionRoutes);
app.use("/api/production", productionExportRoutes);
app.use("/api", rawMaterialRoutes);
app.use("/api", greensLocationsRoutes);


// Redirect root URL to login page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "login.html"));
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
