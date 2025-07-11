const express = require("express");
const router = express.Router();
const db = require("../models/db"); // Ensure this points to your MySQL connection
const multer = require('multer');
const path = require('path');
const xlsx = require('xlsx');
const fs = require('fs');

// Configure multer for Excel file uploads
const excelStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/invoices/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `invoice_${Date.now()}${path.extname(file.originalname)}`);
  }
});

const excelUpload = multer({ 
  storage: excelStorage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.includes('excel') || file.mimetype.includes('spreadsheetml')) {
      cb(null, true);
    } else {
      cb(new Error('Only Excel files are allowed'));
    }
  }
});

const upload = multer(); // for parsing multipart/form-data
const { generateInvoicePDFPreview } = require("../utils/pdfGenerator");
const PDFDocument = require("pdfkit");


// Save Export Invoice
router.post("/invoices", (req, res) => {
  const data = req.body;

  const {
    exporter_name, gst_no, iec_no, exporter_address,
    invoice_number, invoice_date, buyers_order,
    origin_country, destination_country,
    consignee_name, consignee_address,
    notify1_name, notify1_address,
    notify2_name, notify2_address,
    bank_name, bank_account, bank_ifsc, bank_swift, bank_address,
    pre_carriage_by, place_of_receipt,
    vessel_no, port_of_loading, port_of_discharge, final_destination,
    total_drums, total_qty, total_value,
    amount_in_words, declaration, net_drained_weight,
    net_weight, gross_weight, lut_reference, fssai_no, remarks
  } = data;

  // Combine containers and products as JSON
  const containers = JSON.stringify(data.vehicle_no.map((_, i) => ({
    vehicle_no: data.vehicle_no[i],
    container_no: data.container_no[i],
    rfid_seal_no: data.rfid_seal_no[i],
    liner_seal_no: data.liner_seal_no[i]
  })));

  const products = JSON.stringify(data.description.map((_, i) => ({
    description: data.description[i],
    hs_code: data.hs_code[i],
    drums: data.drums[i],
    price_per_kg: data.price_per_kg[i],
    qty: data.qty[i]
  })));

  const sql = `INSERT INTO export_invoices (
    exporter_name, gst_no, iec_no, exporter_address,
    invoice_number, invoice_date, buyers_order,
    origin_country, destination_country,
    consignee_name, consignee_address,
    notify1_name, notify1_address,
    notify2_name, notify2_address,
    bank_name, bank_account, bank_ifsc, bank_swift, bank_address,
    pre_carriage_by, place_of_receipt,
    vessel_no, port_of_loading, port_of_discharge, final_destination,
    total_drums, total_qty, total_value,
    amount_in_words, declaration, net_drained_weight,
    net_weight, gross_weight, lut_reference, fssai_no, remarks,
    containers, products
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const values = [
    exporter_name, gst_no, iec_no, exporter_address,
    invoice_number, invoice_date, buyers_order,
    origin_country, destination_country,
    consignee_name, consignee_address,
    notify1_name, notify1_address,
    notify2_name, notify2_address,
    bank_name, bank_account, bank_ifsc, bank_swift, bank_address,
    pre_carriage_by, place_of_receipt,
    vessel_no, port_of_loading, port_of_discharge, final_destination,
    total_drums, total_qty, total_value,
    amount_in_words, declaration, net_drained_weight,
    net_weight, gross_weight, lut_reference, fssai_no, remarks,
    containers, products
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.json({ message: 'Invoice saved successfully', id: result.insertId });
  });
});
  

//

router.post("/export-invoice/pdf/preview", upload.none(), async (req, res) => {
  try {
    const doc = new PDFDocument();
    
    // Set response headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline; filename=invoice-preview.pdf");

    // Pipe PDF stream to response
    doc.pipe(res);

    // Example content
    doc.fontSize(16).text("Export Invoice Preview", { align: "center" });
    doc.moveDown();

    // Use form values
    doc.fontSize(12).text(`Exporter Name: ${req.body.exporter_name || ""}`);
    doc.text(`Invoice No: ${req.body.invoice_number || ""}`);
    doc.text(`Consignee Name: ${req.body.consignee_name || ""}`);
    
    // Loop through dynamic product rows (arrays)
    const descriptions = Array.isArray(req.body.description) ? req.body.description : [req.body.description];
    const hsCodes = Array.isArray(req.body.hs_code) ? req.body.hs_code : [req.body.hs_code];

    descriptions.forEach((desc, i) => {
      doc.moveDown(0.5).text(`HS Code: ${hsCodes[i] || ""} - Description: ${desc || ""}`);
    });

    doc.end(); // Finalize PDF
  } catch (err) {
    console.error("PDF generation error:", err);
    res.status(500).json({ message: "PDF generation failed" });
  }
});



// Generate PDF from template
router.post("/generate-pdf", async (req, res) => {
  try {
    const { 
      invoice_number,
      consignee_name,
      consignee_address,
      destination,
      quantity,
      total_value,
      amount_in_words,
      product_description,
      drums_count,
      price_per_kg,
      hs_code
    } = req.body;

    const pdf = await generateInvoicePDFPreview({
      invoice_number,
      consignee_name,
      consignee_address,
      destination,
      quantity,
      total_value,
      amount_in_words,
      product_description,
      drums_count,
      price_per_kg,
      hs_code
    });
    
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=invoice_${invoice_number}.pdf`
    });
    res.send(pdf);
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).send("Error generating PDF");
  }
});

// Handle Excel file upload and generate invoice
router.post('/upload-excel', excelUpload.single('invoiceFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Read the Excel file
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const excelData = xlsx.utils.sheet_to_json(worksheet);

    // Process Excel data into template format
    const invoiceData = {
      invoice_number: excelData[0]['Invoice No'] || '',
      invoice_date: excelData[0]['Date'] || '',
      buyers_order: excelData[0]['Buyers Order'] || '',
      origin_country: excelData[0]['Origin Country'] || 'India',
      exporter_name: excelData[0]['Exporter'] || 'SOLAI AGRO FRESH PRIVATE LIMITED',
      gst_no: excelData[0]['GST No'] || '',
      iec_no: excelData[0]['IEC No'] || '',
      exporter_address: excelData[0]['Exporter Address'] || '',
      consignee_name: excelData[0]['Consignee'] || '',
      consignee_address: excelData[0]['Consignee Address'] || '',
      description: excelData.map(row => row['Description'] || ''),
      hs_code: excelData.map(row => row['HS Code'] || ''),
      quantity_kg: excelData.map(row => row['Quantity (kg)'] || 0),
      price_per_kg: excelData.map(row => row['Price/kg'] || 0),
      total_value_usd: excelData.map(row => row['Total Value'] || 0),
      total_qty: excelData.reduce((sum, row) => sum + (row['Quantity (kg)'] || 0), 0),
      total_value: excelData.reduce((sum, row) => sum + (row['Total Value'] || 0), 0),
      amount_in_words: excelData[0]['Amount in Words'] || '',
      declaration: excelData[0]['Declaration'] || '',
      remarks: excelData[0]['Remarks'] || ''
    };

    // Generate PDF from the template
    const pdf = await generateInvoicePDFPreview(invoiceData);
    
    // Set response headers
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=invoice_${invoiceData.invoice_number}.pdf`
    });
    res.send(pdf);

    // Clean up - delete the uploaded file after processing
    fs.unlinkSync(req.file.path);
  } catch (error) {
    console.error("Error processing Excel file:", error);
    res.status(500).json({ message: 'Error processing Excel file' });
  }
});

// Export the router
module.exports = router;
