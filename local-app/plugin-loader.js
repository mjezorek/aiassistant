const fs = require('fs');
const path = require('path');

function loadPlugins(pluginsDir) {
  const pluginFolders = fs.readdirSync(pluginsDir).filter((file) => fs.lstatSync(path.join(pluginsDir, file)).isDirectory());

  const plugins = pluginFolders.map((folder) => {
    const pluginPath = path.join(pluginsDir, folder, 'index.js');
    const plugin = require(pluginPath);

    return {
      ...plugin,
      path: path.join(pluginsDir, folder),
    };
  });

  return plugins;
}

module.exports = { loadPlugins };
