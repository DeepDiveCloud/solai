const express = require('express');
const db = require('../models/db'); // Assumes you have a db.js exporting a promise-based query function
const router = express.Router();

// Create Group - POST /api/groups
router.post('/groups', async (req, res) => {
  const { name, assigned_url } = req.body;

  // Log request body for debugging
  console.log('Received group data:', { name, assigned_url });

  if (!name || !assigned_url) {
    return res.status(400).json({ error: 'Group name and assigned URL are required.' });
  }

  try {
    // Insert new group into the database
    const result = await db.query(
      'INSERT INTO user_groups (name, assigned_url) VALUES (?, ?)',
      [name, assigned_url]
    );
    
    console.log('Group created with ID:', result.insertId);
    res.status(201).json({ message: 'Group created successfully', id: result.insertId });
  } catch (err) {
    console.error('Error creating group:', err);
    res.status(500).json({ error: 'Error creating group.' });
  }
});

// Get All Groups - GET /api/groups
// Get All Groups - GET /api/groups
// GET /api/groups
router.get('/groups', async (req, res) => {
    try {
      // Must include assigned_url here
      const [rows] = await db.query(
        'SELECT id, name, assigned_url FROM user_groups'
      );
      console.log('Fetched groups:', rows);
      res.json(rows);
    } catch (err) {
      console.error('GET /api/groups error:', err);
      res.status(500).json({ error: 'Database error', details: err.message });
    }
  });
  
  

// Delete Group - DELETE /api/groups/:id
router.delete('/groups/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const result = await db.query('DELETE FROM user_groups WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Group not found.' });
    }

    console.log('Deleted group ID:', id);
    res.json({ message: 'Group deleted successfully.' });
  } catch (err) {
    console.error('Error deleting group:', err);
    res.status(500).json({ error: 'Error deleting group.' });
  }
});

module.exports = router;
