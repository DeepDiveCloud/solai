// routes/productionExport.js
const express = require('express');
const router = express.Router();
const db = require('../models/db');
const ExcelJS = require('exceljs');

router.get('/export', async (req, res) => {
  const { from, to, acid, vinegar, brine } = req.query;

  if (!from || !to) return res.status(400).send("Missing 'from' or 'to' date");

  let query = `SELECT * FROM production WHERE production_date BETWEEN ? AND ?`;
  let params = [from, to];

  if (acid) {
    query += ` AND JSON_CONTAINS(acetic_acid, JSON_OBJECT("name", ?))`;
    params.push(acid);
  }
  if (vinegar) {
    query += ` AND JSON_CONTAINS(vinegar, JSON_OBJECT("name", ?))`;
    params.push(vinegar);
  }
  if (brine) {
    query += ` AND JSON_CONTAINS(brine, JSON_OBJECT("name", ?))`;
    params.push(brine);
  }

  try {
    const [rows] = await db.query(query, params);

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Production Report");

    sheet.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "Date", key: "production_date", width: 15 },
      { header: "Factory Wt", key: "factory_weight", width: 15 },
      { header: "Prod Wt", key: "production_weight", width: 15 },
      { header: "Acid", key: "acetic_acid", width: 30 },
      { header: "Vinegar", key: "vinegar", width: 30 },
      { header: "Brine", key: "brine", width: 30 }
    ];

    rows.forEach(row => {
      sheet.addRow({
        id: row.id,
        production_date: row.production_date.toISOString().split('T')[0],
        factory_weight: row.factory_weight,
        production_weight: row.production_weight,
        acetic_acid: formatArray(row.acetic_acid),
        vinegar: formatArray(row.vinegar),
        brine: formatArray(row.brine)
      });
    });

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=production_report.xlsx");
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to generate report");
  }
});

function formatArray(jsonString) {
  try {
    const arr = typeof jsonString === 'string' ? JSON.parse(jsonString) : jsonString;
    return Array.isArray(arr)
      ? arr.map(i => `${i.name}: ${i.value}`).join(", ")
      : '-';
  } catch {
    return '-';
  }
}

module.exports = router;
