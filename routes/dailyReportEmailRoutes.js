const cron = require('node-cron');
const nodemailer = require('nodemailer');
const db = require('../models/db');
require('dotenv').config();

// ✅ Email Transport Setup
const transporter = nodemailer.createTransport({
  host: "premium221.web-hosting.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("❌ SMTP config failed:", error);
  } else {
    console.log("✅ SMTP ready to send mail");
  }
});

// ✅ HTML Table: Greens
function generateGreensTable(rows) {
  if (rows.length === 0) return "<p>No greens entry today.</p>";

  const tr = rows.map(row => `
    <tr>
      <td>${row.dc_number}</td>
      <td>${row.vendor_name}</td>
      <td>${row.pattern_name}</td>
      <td>${row.dc_date}</td>
      <td>${row.dc_weight}</td>
      <td>${row.factory_date}</td>
      <td>${row.factory_weight}</td>
      <td>${row.shortage_excess}</td>
    </tr>
  `).join('');

  return `
    <h4>🌿 Greens Entry Report</h4>
    <table border="1" cellpadding="6" cellspacing="0">
      <thead>
        <tr>
          <th>DC Number</th>
          <th>Vendor</th>
          <th>Pattern</th>
          <th>DC Date</th>
          <th>DC Weight</th>
          <th>Factory Date</th>
          <th>Factory Weight</th>
          <th>Shortage/Excess</th>
        </tr>
      </thead>
      <tbody>${tr}</tbody>
    </table>
  `;
}

// ✅ HTML Table: Production
function generateProductionDetailTable(rows) {
  if (rows.length === 0) return "<p>No production entry today.</p>";

  const tr = rows.map(row => `
    <tr>
      <td>${row.production_date}</td>
      <td>${row.factory_weight}</td>
      <td>${row.production_weight ?? '-'}</td>
      <td>${row.FF}</td>
      <td>${row.soft}</td>
      <td>${row.fungus_rotten}</td>
      <td>${row.shortage_weight_loss}</td>
      <td>${parseFloat(row.acetic_acid || 0).toFixed(2)}</td>
      <td>${parseFloat(row.vinegar || 0).toFixed(2)}</td>
      <td>${parseFloat(row.brine || 0).toFixed(2)}</td>
      <td>${row.remark || '-'}</td>
    </tr>
  `).join('');

  return `
    <h4>🏭 Production Entry Details</h4>
    <table border="1" cellpadding="6" cellspacing="0">
      <thead>
        <tr>
          <th>Production Date</th>
          <th>Factory Weight</th>
          <th>Production Weight</th>
          <th>FF</th>
          <th>Soft</th>
          <th>Fungus/Rotten</th>
          <th>Shortage/Loss</th>
          <th>Acetic Acid</th>
          <th>Vinegar</th>
          <th>Brine</th>
          <th>Remark</th>
        </tr>
      </thead>
      <tbody>${tr}</tbody>
    </table>
  `;
}

// ✅ Email Function
async function sendDailyEmail(subject = "🌿 Solai Agro - Daily Report") {
  try {
    const [greens] = await db.query(`
      SELECT 
        dc_number,
        vendor AS vendor_name,
        pattern AS pattern_name,
        DATE_FORMAT(dc_date, '%Y-%m-%d') AS dc_date,
        total_dc_weight AS dc_weight,
        DATE_FORMAT(factory_arrival_date, '%Y-%m-%d') AS factory_date,
        total_factory_weight AS factory_weight,
        shortage_excess
      FROM greens_arrival
      WHERE DATE(factory_arrival_date) = CURDATE()
    `);

    const [productionDetails] = await db.query(`
      SELECT 
        DATE_FORMAT(production_date, '%Y-%m-%d') AS production_date,
        factory_weight,
        production_weight,
        FF,
        soft,
        fungus_rotten,
        shortage_weight_loss,
        remark,
        JSON_UNQUOTE(JSON_EXTRACT(acetic_acid, '$[0].value')) AS acetic_acid,
        JSON_UNQUOTE(JSON_EXTRACT(vinegar, '$[0].value')) AS vinegar,
        JSON_UNQUOTE(JSON_EXTRACT(brine, '$[0].value')) AS brine
      FROM production
      WHERE DATE(production_date) = CURDATE()
    `);

    const html = `
      <h2>📋 Solai Agro - Daily Report</h2>
      <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
      ${generateGreensTable(greens)}
      ${generateProductionDetailTable(productionDetails)}
    `;

    await transporter.sendMail({
      from: `"Solai Agro Reports" <${process.env.SMTP_USER}>`,
      to: 'ranjith@sopostech.com',
      subject,
      html,
    });

    console.log("✅ Report email sent successfully.");
  } catch (err) {
    console.error("❌ Failed to send daily report:", err);
  }
}

// ✅ Daily Cron Job at 11 PM IST
cron.schedule('30 17 * * *', async () => {
  // Note: 17:30 UTC == 11:00 PM IST
  await sendDailyEmail("🌿 Daily Greens & Production Report");
});

// ✅ Manual Trigger (for test or server restart)
//(async () => {
 // await sendDailyEmail("🌿 Manual Trigger - Solai Agro Report");
//})();
