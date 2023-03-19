const express = require('express');
const path = require('path');
const fs = require('fs/promises');
const app = express();

// Serve static files from the 'local-app' and 'remote-apis' directories
app.use('/local-app', express.static(path.join(__dirname, 'local-app')));
app.use('/remote-apis', express.static(path.join(__dirname, 'remote-apis')));

// Serve the index.html file for the root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'local-app', 'index.html'));
});

// Fetch plugin list
app.get('/remote-apis/plugins', async (req, res) => {
  try {
    const pluginDir = path.join(__dirname, 'remote-apis', 'plugins');
    const pluginNames = await fs.readdir(pluginDir);
    const pluginList = pluginNames.map((name) => ({
      id: name,
      name: name
    }));

    res.json(pluginList);
  } catch (error) {
    console.error('Error fetching plugin list:', error);
    res.status(500).json({ error: 'Error fetching plugin list' });
  }
});

// Serve plugin UI components
app.get('/remote-apis/plugins/:pluginId/ui', async (req, res) => {
  try {
    const pluginId = req.params.pluginId;
    const uiFilePath = path.join(__dirname, 'remote-apis', 'plugins', pluginId, 'ui.html');
    res.sendFile(uiFilePath);
  } catch (error) {
    console.error('Error fetching plugin UI component:', error);
    res.status(500).json({ error: 'Error fetching plugin UI component' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
