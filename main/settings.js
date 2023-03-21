const settings = {
  // Default settings
  default: {
    theme: 'light',
    fontSize: 14,
  },

  // Load settings from localStorage or use default settings
  load: function () {
    const storedSettings = localStorage.getItem('aiassistant-settings');
    return storedSettings ? JSON.parse(storedSettings) : this.default;
  },

  // Save settings to localStorage
  save: function (newSettings) {
    localStorage.setItem('aiassistant-settings', JSON.stringify(newSettings));
  },

  // Update settings and save to localStorage
  update: function (key, value) {
    const currentSettings = this.load();
    currentSettings[key] = value;
    this.save(currentSettings);
  },
};

// Export the settings object
module.exports = settings;
