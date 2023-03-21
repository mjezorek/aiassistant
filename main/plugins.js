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
      console.log(plugins);
    } else {
      console.warn(`Plugin directory "${directory}" does not have an index.js file, skipping.`);
    }
  });

  return plugins;
};


// Export the loadPlugins function
module.exports = { loadPlugins };
