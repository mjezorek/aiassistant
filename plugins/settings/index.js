const express = require('express');

const router = express.Router();

router.post('/save', (req, res) => {
  res.status(200).json({ message: 'Settings saved successfully.' });
});

module.exports = {
  name: 'Settings',
  route: '/settings',
  router: router,
  icon: 'fas fa-cog',
  componentPath: 'plugins/settings/ui.html',
};
