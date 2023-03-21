// You can add renderer code here or leave it empty
const inputText = document.getElementById('input-text');
const submitButton = document.getElementById('submit');
const settings = require('./settings');
const path = require('path');
const fs = require('fs');
const openai = require('openai');


submitButton.addEventListener('click', async () => {
  const userInput = inputText.value.trim();
  if (userInput) {
    console.log(userInput);
    // Process the user input, e.g., send to main process for further actions
    const apiKey = settings.load('openai-api-key');
    if (!apiKey) {
      // Display a message to the user to update settings
      const pluginContent = document.getElementById('plugin-content');
      pluginContent.innerHTML = `<p>Please enter your OpenAI API key in the settings.</p>`;
      return;
    }

    openai.apiKey = apiKey;
    try {
      const result = await openai.Completion.create({
        engine: "text-davinci-002", // or "text-curie-002" for GPT-3.5
        prompt: userInput,
        max_tokens: 100, // Adjust as needed
        n: 1,
        stop: null,
        temperature: 0.7,
      });

      if (result.choices && result.choices.length > 0) {
        const response = result.choices[0].text;
        // Display the response in the plugin content area
        const pluginContent = document.getElementById('plugin-content');
        pluginContent.innerHTML = `<p>${response}</p>`;
      }
    } catch (error) {
      console.error('Error using OpenAI API:', error.message);
    }
  }
});



const { loadPlugins } = require('./plugins');
const plugins = loadPlugins();

// Initialize all plugins
plugins.forEach((plugin) => {
  // Load the plugin CSS file
  const cssPath = path.join(__dirname, '..', 'plugins', plugin.name, `${plugin.name}.css`);
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = cssPath;
  document.head.appendChild(link);
  if (plugin.icon) {
    const iconContainer = document.getElementById('plugin-icons-container');
    const icon = document.createElement('i');
    icon.className = `fa fa-${plugin.icon}`;
    iconContainer.appendChild(icon);

    // Add a click event listener to show the plugin's content when clicked
    icon.addEventListener('click', () => {
      // Hide all other plugin content
      const pluginContent = document.querySelectorAll('.plugin-content');
      pluginContent.forEach((content) => {
        content.style.display = 'none';
      });

      // Show the content of the clicked plugin
      const pluginHtml = document.getElementById(`${plugin.name}-content`);
      pluginHtml.style.display = 'block';
    });
  }
  // Load the plugin HTML file
  const htmlPath = path.join(__dirname, '..', 'plugins', plugin.name, `${plugin.name}.html`);
  fs.readFile(htmlPath, 'utf-8', (err, data) => {
    if (err) {
      console.error(`Error reading plugin HTML file: ${err.message}`);
      return;
    }

    // Add the plugin HTML to the main application
    const pluginContainer = document.getElementById('plugins-container');
    pluginContainer.insertAdjacentHTML('beforeend', data);
  });

  // Initialize the plugin
  plugin.init();
});

  const settingsIcon = document.getElementById('settings-icon');
  settingsIcon.addEventListener('click', () => {
     const htmlPath = path.join(__dirname, 'settings.html');
  fs.readFile(htmlPath, 'utf-8', (err, data) => {
    if (err) {
      console.error(`Error reading settings HTML file: ${err.message}`);
      return;
    }

    // Add the settings HTML to the main application
    const settingsContainer = document.getElementById('plugins-container');
    settingsContainer.innerHTML = data;

    // Handle form submission
    const settingsForm = document.getElementById('settings-form');
    settingsForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const apiKey = document.getElementById('openai-api-key').value;
      settings.update('openai-api-key', apiKey);
    });
  });
  });

// Load and apply settings
const currentSettings = settings.load();
console.log(settings);
// Use currentSettings to apply the theme, font size, etc.
// Update settings
settings.update('theme', 'dark');
