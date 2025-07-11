const express = require('express');
const router = express.Router();
const db = require('../models/db'); // using mysql2/promise

// ✅ Create new production entry
router.post('/production', async (req, res) => {
  const {
    productionDate,
    factoryWeight,
    productionWeight ,
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
        production_date, factory_weight, production_weight , FF, soft, fungus_rotten,
        shortage_weight_loss, remark, acetic_acid, vinegar, brine
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        productionDate,
        parseFloat(factoryWeight) || 0,
        parseFloat(productionWeight ) || 0,
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
        id, production_date, factory_weight, production_weight , FF, soft,
        fungus_rotten, shortage_weight_loss, remark,
        acetic_acid, vinegar, brine, created_at
      FROM production
      ORDER BY production_date DESC, created_at DESC
    `);

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

// ✅ Delete production entry by ID
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

// ✅ Update production entry by ID
router.put('/production/:id', async (req, res) => {
  const { id } = req.params;
  const {
    productionDate,
    factoryWeight,
    productionWeight ,
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
        production_date = ?, factory_weight = ?, production_weight  = ?, FF = ?, soft = ?, 
        fungus_rotten = ?, shortage_weight_loss = ?, remark = ?, 
        acetic_acid = ?, vinegar = ?, brine = ?
       WHERE id = ?`,
      [
        productionDate,
        parseFloat(factoryWeight) || 0,
        parseFloat(productionWeight ) || 0,
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
// Report Filter Route
// Acid/Vinegar/Brine Summary Filter (with individual filters)
router.get('/production/acid-vinegar-summary', async (req, res) => {
  const { from, to, acid, vinegar, brine } = req.query;

  if (!from || !to) {
    return res.status(400).json({ error: 'From and To dates are required' });
  }

  try {
    // pull only dates first
    const [rows] = await db.query(
      `SELECT acetic_acid, vinegar, brine 
       FROM production 
       WHERE production_date BETWEEN ? AND ?`,
      [from, to]
    );

    let acidTotal   = 0;
    let vinegarTotal = 0;
    let brineTotal  = 0;

    const safeParse = str => {
      try {
        return typeof str === 'string' ? JSON.parse(str) : Array.isArray(str) ? str : [];
      } catch {
        return [];
      }
    };

    for (const row of rows) {
      const acids    = safeParse(row.acetic_acid);
      const vinegars = safeParse(row.vinegar);
      const brines   = safeParse(row.brine);

      // only sum items that match the filter (or all if blank)
      acids.forEach(item => {
        if (!acid || item.name === acid) acidTotal += Number(item.value || 0);
      });
      vinegars.forEach(item => {
        if (!vinegar || item.name === vinegar) vinegarTotal += Number(item.value || 0);
      });
      brines.forEach(item => {
        if (!brine || item.name === brine) brineTotal += Number(item.value || 0);
      });
    }

    res.json({ from, to, acidTotal, vinegarTotal, brineTotal });
  } catch (err) {
    console.error("❌ Error in acid-vinegar-brine summary:", err);
    res.status(500).json({ error: 'Server error' });
  }
});

// … your existing requires, safeParse helper, etc

// —————————————————————————————
//  report: return filtered rows
// —————————————————————————————
router.get('/production/report', async (req, res) => {
  const { from, to, acid, vinegar, brine } = req.query;
  if (!from || !to) {
    return res.status(400).json({ error: 'From and To dates are required' });
  }

  try {
    // 1) grab everything in date‐range
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

    // 2) client wants only rows that match ANY of the three filters:
    const filtered = rows.filter(r => {
      const acids   = safeParse(r.acetic_acid);
      const vinegars= safeParse(r.vinegar);
      const brines  = safeParse(r.brine);

      // if acid filter set, require row contains that acid
      if (acid) {
        if (!acids.some(x => x.name.toLowerCase() === acid.toLowerCase()))
          return false;
      }
      // if vinegar filter set, require row contains that vinegar
      if (vinegar) {
        if (!vinegars.some(x => x.name.toLowerCase() === vinegar.toLowerCase()))
          return false;
      }
      // if brine filter set, require row contains that brine
      if (brine) {
        if (!brines.some(x => x.name.toLowerCase() === brine.toLowerCase()))
          return false;
      }
      // passed all active filters:
      return true;
    });

    // 3) send them back (raw JSON arrays; front‑end will format columns)
    res.json(filtered);

  } catch (err) {
    console.error('❌ Error in /production/report:', err);
    res.status(500).json({ error: 'Server error' });
  }
});






module.exports = router;
