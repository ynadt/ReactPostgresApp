const express = require('express');
const pool = require('../db/db');
const { performTransaction } = require('../utils/transactionUtils');
const authenticateUser = require('../middleware/authenticateUser');

const SORTING_ORDER = 'desc';

const router = express.Router();

router.get('/', authenticateUser, async (req, res) => {
  const { orderBy = SORTING_ORDER } = req.query;
  if (!['asc', 'desc'].includes(orderBy)) {
    return res.status(400).json({ error: 'Invalid sorting order' });
  }

  try {
    const result = await pool.query(
      `SELECT id, name, email, last_login, status FROM users ORDER BY last_login ${orderBy.toUpperCase()}`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/update-status', authenticateUser, async (req, res) => {
  const { ids, status } = req.body;
  if (!ids || ids.length === 0) {
    return res.status(400).json({ error: 'No user IDs provided' });
  }

  try {
    await performTransaction(pool, async () => {
      await pool.query('UPDATE users SET status = $1 WHERE id = ANY($2)', [status, ids]);
    });
    res.json({ message: `${ids.length} user(s) updated successfully` });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/', authenticateUser, async (req, res) => {
  const { ids } = req.body;
  if (!ids || ids.length === 0) {
    return res.status(400).json({ error: 'No user IDs provided' });
  }

  try {
    await performTransaction(pool, async () => {
      await pool.query('DELETE FROM users WHERE id = ANY($1)', [ids]);
    });
    res.json({ message: `${ids.length} user(s) deleted successfully` });
  } catch (error) {
    console.error('Error deleting users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
