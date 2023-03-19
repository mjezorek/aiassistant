const fs = require('fs');
const path = require('path');

function getPluginsAPI() {
  const pluginsPath = path.join(__dirname, '../plugins');
  const pluginDirs = fs.readdirSync(pluginsPath).filter((file) => fs.statSync(path.join(pluginsPath, file)).isDirectory());

  const api = [];

  for (const dir of pluginDirs) {
    const pluginPath = path.join(pluginsPath, dir, 'index.js');
    if (fs.existsSync(pluginPath)) {
      const plugin = require(`../../plugins${dir}/index.js`);
      api.push(plugin);
    }
  }

  return api;
}

module.exports = { getPluginsAPI };
