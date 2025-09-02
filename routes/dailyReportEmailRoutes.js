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
  if (error) console.error("❌ SMTP config failed:", error);
  else console.log("✅ SMTP ready to send mail");
});

// ------------------ Greens Table ------------------
function generateGreensTable(rows) {
  if (rows.length === 0) return "<p>No greens entry today.</p>";

  const tr = rows.map(row => `
    <tr>
      <td>${row.dc_number}</td>
      <td>${row.vendor_name}</td>
      <td>${row.pattern_name}</td>
      <td>${row.location}</td>
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
          <th>Location</th>
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


// ------------------ Production Table ------------------
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

// ------------------ Daily Email ------------------
async function sendDailyEmail(subject = "🌿 Solai Agro - Daily Report") {
  try {
    const [greens] = await db.query(`
      SELECT 
        dc_number,
        vendor AS vendor_name,
        pattern AS pattern_name,
        location,
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
      to: [
        'ranjith@sopostech.com',
        'ranjith@solaiagro.com',
        'operations@solaiagro.com',
        'girishmayur@solaiagro.com',
        'accounts@solaiagro.com'
      ].join(','),
      subject,
      html,
    });

    console.log("✅ Daily report email sent successfully.");
  } catch (err) {
    console.error("❌ Failed to send daily report:", err);
  }
}

// ------------------ Weekly Email ------------------
async function sendWeeklyEmail(subject = "🌿 Solai Agro - Weekly Report") {
  try {
    // Greens details for the week
    const [greens] = await db.query(`
      SELECT 
        dc_number,
        vendor AS vendor_name,
        pattern AS pattern_name,
        location,
        DATE_FORMAT(dc_date, '%Y-%m-%d') AS dc_date,
        total_dc_weight AS dc_weight,
        DATE_FORMAT(factory_arrival_date, '%Y-%m-%d') AS factory_date,
        total_factory_weight AS factory_weight,
        shortage_excess
      FROM greens_arrival
      WHERE factory_arrival_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
    `);
// Weekly totals
const [totals] = await db.query(`
  SELECT
    SUM(total_dc_weight) AS total_dc_weight,
    SUM(total_factory_weight) AS total_factory_weight,
    SUM(shortage_excess) AS total_shortage
  FROM greens_arrival
  WHERE factory_arrival_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
`);

const totalDC = Number(totals[0].total_dc_weight) || 0;
const totalFactory = Number(totals[0].total_factory_weight) || 0;
const totalShortage = Number(totals[0].total_shortage) || 0;

    // Production details for the week
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
      WHERE production_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
    `);

    const html = `
      <h2>📋 Solai Agro - Weekly Report</h2>
      <p><strong>Week Ending:</strong> ${new Date().toLocaleDateString()}</p>

      <h4>📊 Weekly Totals</h4>
      <ul>
        <li><strong>Total DC Weight:</strong> ${totalDC.toFixed(2)}</li>
        <li><strong>Total Factory Weight:</strong> ${totalFactory.toFixed(2)}</li>
        <li><strong>Total Shortage/Wasted:</strong> ${totalShortage.toFixed(2)}</li>
      </ul>

      ${generateGreensTable(greens)}
      ${generateProductionDetailTable(productionDetails)}
    `;

    await transporter.sendMail({
      from: `"Solai Agro Reports" <${process.env.SMTP_USER}>`,
      to: [
        'ranjith@sopostech.com',
        'ranjith@solaiagro.com',
        'operations@solaiagro.com',
        'girishmayur@solaiagro.com',
       'accounts@solaiagro.com'
      ].join(','),
      subject,
      html,
    });

    console.log("✅ Weekly report email sent successfully.");
  } catch (err) {
    console.error("❌ Failed to send weekly report:", err);
  }
}

// ------------------ Cron Jobs ------------------

// Daily at 4 PM
cron.schedule("0 16 * * *", async () => {
  console.log("📩 Sending Daily Greens Report at 4 PM...");
  await sendDailyEmail();
});

// Weekly on Monday at 9 AM
cron.schedule("0 9 * * 1", async () => {
  console.log("📩 Sending Weekly Greens & Production Report...");
  await sendWeeklyEmail();
});

// ✅ Manual trigger for testing
// (async () => { await sendDailyEmail("🌿 Manual Daily Trigger"); })();
//(async () => { await sendWeeklyEmail("🌿 Manual Weekly Trigger"); })();
