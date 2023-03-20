const express = require('express');
const router = express.Router();

// Add your routes for the settings plugin here
router.get('/api/settings', (req, res) => {
  res.json({ message: 'Get settings' });
});

router.post('/api/settings', (req, res) => {
  res.json({ message: 'Update settings' });
});

module.exports = router;
