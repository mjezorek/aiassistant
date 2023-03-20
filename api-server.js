const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// Load plugins
const pluginFolderPath = path.join(__dirname, 'plugins');
const plugins = {};

fs.readdirSync(pluginFolderPath).forEach((folder) => {
  const pluginPath = path.join(pluginFolderPath, folder);
  if (fs.lstatSync(pluginPath).isDirectory()) {
    const pluginName = folder;
    plugins[pluginName] = require(path.join(pluginPath, 'backend.js'));
  }
});

// Set up plugin routes
Object.entries(plugins).forEach(([pluginName, plugin]) => {
  if (plugin.routes) {
    plugin.routes.forEach((route) => {
      app[route.method](`/api/${pluginName}${route.path}`, route.handler);
    });
  }
});

// API endpoint to get the list of available plugins
app.get('/api/plugins', (req, res) => {
  const pluginList = Object.keys(plugins);
  res.json({ plugins: pluginList });
});

// Test API endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Hello from API server!' });
});

// Start the server
app.listen(port, () => {
  console.log(`Local API server listening at http://localhost:${port}`);
});
