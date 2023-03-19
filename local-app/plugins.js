const fs = require('fs');
const path = require('path');

async function plugins(app) {
  const pluginsPath = path.join(__dirname, '../plugins');
  const pluginDirs = fs.readdirSync(pluginsPath).filter((file) => fs.statSync(path.join(pluginsPath, file)).isDirectory());

  for (const dir of pluginDirs) {
    const pluginPath = path.join(pluginsPath, dir, 'index.js');
    if (fs.existsSync(pluginPath)) {
      const plugin = require(pluginPath);
      app.use(plugin.route, plugin.router);

      const componentResponse = await fetch(`/plugins/${plugin.route}/ui.html`);
      const component = await componentResponse.text();
      
      app.get(`/plugins/${plugin.route}`, (req, res) => {
        res.status(200).json({ ...plugin, component });
      });
    }
  }
}

module.exports = { plugins };
