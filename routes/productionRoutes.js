const express = require('express');
const router = express.Router();
const db = require('../models/db'); // using mysql2/promise

// Safe JSON parser
const safeParse = (json) => {
  try {
    if (!json || json === '' || json === '""') return [];
    if (typeof json === 'string') return JSON.parse(json);
    return Array.isArray(json) ? json : [];
  } catch (e) {
    console.warn("⚠️ Failed to parse JSON:", json, e.message);
    return [];
  }
};

// ✅ Create new production entry
router.post('/production', async (req, res) => {
  const {
    productionDate,
    factoryWeight,
    productionWeight,
    FF,
    soft,
    fungus = 0,
    shortage = 0,
    remark = '',
    aceticAcid = [],
    vinegar = [],
    brine = []
  } = req.body;

  if (!productionDate) {
    return res.status(400).json({ message: 'Production date is required' });
  }

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const [result] = await conn.query(
      `INSERT INTO production (
        production_date, factory_weight, production_weight, FF, soft, fungus_rotten,
        shortage_weight_loss, remark, acetic_acid, vinegar, brine
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        productionDate,
        parseFloat(factoryWeight) || 0,
        parseFloat(productionWeight) || 0,
        parseFloat(FF) || 0,
        parseFloat(soft) || 0,
        parseFloat(fungus) || 0,
        parseFloat(shortage) || 0,
        remark,
        JSON.stringify(aceticAcid),
        JSON.stringify(vinegar),
        JSON.stringify(brine)
      ]
    );

    await conn.commit();
    res.status(201).json({ message: 'Production entry created', productionId: result.insertId });
  } catch (err) {
    await conn.rollback();
    console.error('❌ Error creating production entry:', err);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    conn.release();
  }
});

// ✅ Get all production entries
router.get('/production', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        id, production_date, factory_weight, production_weight, FF, soft,
        fungus_rotten, shortage_weight_loss, remark,
        acetic_acid, vinegar, brine, created_at
      FROM production
      ORDER BY production_date DESC, created_at DESC
    `);

    const formattedRows = rows.map(row => ({
      ...row,
      aceticAcid: safeParse(row.acetic_acid),
      vinegar: safeParse(row.vinegar),
      brine: safeParse(row.brine)
    }));

    res.json(formattedRows);
  } catch (err) {
    console.error('❌ Error fetching production entries:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ✅ Delete production entry
router.delete('/production/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query('DELETE FROM production WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Production entry not found' });
    }

    res.json({ message: 'Production entry deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting production entry:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ✅ Update production entry
router.put('/production/:id', async (req, res) => {
  const { id } = req.params;
  const {
    productionDate,
    factoryWeight,
    productionWeight,
    FF,
    soft,
    fungus = 0,
    shortage = 0,
    remark = '',
    aceticAcid = [],
    vinegar = [],
    brine = []
  } = req.body;

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const [result] = await conn.query(
      `UPDATE production SET
        production_date = ?, factory_weight = ?, production_weight = ?, FF = ?, soft = ?, 
        fungus_rotten = ?, shortage_weight_loss = ?, remark = ?, 
        acetic_acid = ?, vinegar = ?, brine = ?
       WHERE id = ?`,
      [
        productionDate,
        parseFloat(factoryWeight) || 0,
        parseFloat(productionWeight) || 0,
        parseFloat(FF) || 0,
        parseFloat(soft) || 0,
        parseFloat(fungus) || 0,
        parseFloat(shortage) || 0,
        remark,
        JSON.stringify(aceticAcid),
        JSON.stringify(vinegar),
        JSON.stringify(brine),
        id
      ]
    );

    await conn.commit();

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Production entry not found' });
    }

    res.json({ message: 'Production entry updated successfully' });
  } catch (err) {
    await conn.rollback();
    console.error('❌ Error updating production entry:', err);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    conn.release();
  }
});

// ✅ Filter Summary (Acid/Vinegar/Brine)
router.get('/production/acid-vinegar-summary', async (req, res) => {
  const { from, to, acid, vinegar, brine } = req.query;

  if (!from || !to) {
    return res.status(400).json({ error: 'From and To dates are required' });
  }

  try {
    const [rows] = await db.query(
      `SELECT acetic_acid, vinegar, brine 
       FROM production 
       WHERE production_date BETWEEN ? AND ?`,
      [from, to]
    );

    let acidTotal = 0, vinegarTotal = 0, brineTotal = 0;

    for (const row of rows) {
      const acids = safeParse(row.acetic_acid);
      const vinegars = safeParse(row.vinegar);
      const brines = safeParse(row.brine);

      acids.forEach(item => {
        if (!acid || item.name.toLowerCase() === acid.toLowerCase())
          acidTotal += Number(item.value || 0);
      });
      vinegars.forEach(item => {
        if (!vinegar || item.name.toLowerCase() === vinegar.toLowerCase())
          vinegarTotal += Number(item.value || 0);
      });
      brines.forEach(item => {
        if (!brine || item.name.toLowerCase() === brine.toLowerCase())
          brineTotal += Number(item.value || 0);
      });
    }

    res.json({ from, to, acidTotal, vinegarTotal, brineTotal });
  } catch (err) {
    console.error("❌ Error in acid-vinegar-brine summary:", err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ Report route with filters
router.get('/production/report', async (req, res) => {
  const { from, to, acid, vinegar, brine } = req.query;

  if (!from || !to) {
    return res.status(400).json({ error: 'From and To dates are required' });
  }

  try {
    const [rows] = await db.query(
      `SELECT
         id, production_date, factory_weight, production_weight,
         FF, soft, fungus_rotten, shortage_weight_loss, remark,
         acetic_acid, vinegar, brine
       FROM production
       WHERE production_date BETWEEN ? AND ?
       ORDER BY production_date DESC`,
      [from, to]
    );

    const filtered = rows.filter(r => {
      const acids = safeParse(r.acetic_acid);
      const vinegars = safeParse(r.vinegar);
      const brines = safeParse(r.brine);

      if (acid && !acids.some(x => x.name.toLowerCase() === acid.toLowerCase())) return false;
      if (vinegar && !vinegars.some(x => x.name.toLowerCase() === vinegar.toLowerCase())) return false;
      if (brine && !brines.some(x => x.name.toLowerCase() === brine.toLowerCase())) return false;

      return true;
    });

    res.json(filtered);
  } catch (err) {
    console.error('❌ Error in /production/report:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ Overall summary without filters
router.get("/production-summary", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT acetic_acid, vinegar, brine FROM production");

    let acidTotal = 0, vinegarTotal = 0, brineTotal = 0;

    for (const row of rows) {
      const acids = safeParse(row.acetic_acid);
      const vinegars = safeParse(row.vinegar);
      const brines = safeParse(row.brine);

      acidTotal += acids.reduce((sum, a) => sum + (+a.value || 0), 0);
      vinegarTotal += vinegars.reduce((sum, v) => sum + (+v.value || 0), 0);
      brineTotal += brines.reduce((sum, b) => sum + (+b.value || 0), 0);
    }

    res.json({ acidTotal, vinegarTotal, brineTotal });
  } catch (err) {
    console.error("Summary fetch error:", err);
    res.status(500).json({ error: "Failed to fetch summary." });
  }
});

module.exports = router;
