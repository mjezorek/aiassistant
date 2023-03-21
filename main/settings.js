// main/settings.js

const Store = require('electron-store');

const settings = new Store({
  defaults: {
    theme: 'light',
    fontSize: 14,
    
  },
});

module.exports = settings;
