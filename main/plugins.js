const fs = require('fs');
const path = require('path');

const pluginsPath = path.join(__dirname, '..', 'plugins');

// Load all plugins
const loadPlugins = () => {
  const pluginDirectories = fs.readdirSync(pluginsPath, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  const plugins = [];

  pluginDirectories.forEach((directory) => {
    const pluginPath = path.join(pluginsPath, directory);
    const indexPath = path.join(pluginPath, 'index.js');

    if (fs.existsSync(indexPath)) {
      const plugin = require(indexPath);
      plugins.push(plugin);
    } else {
      // do nothing
    }
  });

  return plugins;
};


// Export the loadPlugins function
module.exports = { loadPlugins };
