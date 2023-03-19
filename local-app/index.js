const express = require('express');
const path = require('path');
const { loadPlugins } = require('./plugin-loader');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

const plugins = loadPlugins(path.join(__dirname, '../plugins'));

plugins.forEach((plugin) => {
  app.use(plugin.route, plugin.router);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
