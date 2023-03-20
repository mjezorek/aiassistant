const express = require('express');
const app = express();
const cors = require('cors');
const fs = require('fs');
const path = require('path');

app.use(cors());
app.use(express.json());

const pluginDir = path.join(__dirname, 'src', 'plugins');

fs.readdirSync(pluginDir).forEach((plugin) => {
  const backendPath = path.join(pluginDir, plugin, 'backend.js');
  if (fs.existsSync(backendPath)) {
    const pluginRoutes = require(backendPath);
    app.use(pluginRoutes);
  }
});
app.get('/api/plugins', (req, res) => {
  const plugins = fs.readdirSync(pluginDir).map((plugin) => plugin);
  res.json({ plugins });
});

app.listen(3000, () => console.log('API server listening on port 3000!'));
