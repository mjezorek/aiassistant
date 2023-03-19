const fs = require('fs');
const path = require('path');

const pluginDirectory = path.join(__dirname , '../plugins/');
const pluginFolders = fs.readdirSync(pluginDirectory).filter(file => file !== 'index.js');
console.log(pluginFolders);
const plugins = pluginFolders.map(folder => {
  const pluginPath = path.join(pluginDirectory, folder);
  const plugin = require(pluginPath);
  return plugin;
});

module.exports = plugins;
