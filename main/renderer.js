const path = require('path');
const fs = require('fs');
const { loadPlugins } = require('./plugins');
const settings = require('./settings');

init();

function init() {
  setupInputHandler();
  loadSettings();
  initPlugins();
}

function setupInputHandler() {
  const inputText = document.getElementById('input-text');
  const submitButton = document.getElementById('submit');
  const spinner = document.getElementById('spinner');

  inputText.addEventListener('keydown', async (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const userInput = inputText.value.trim();
      if (userInput) {
        spinner.style.display = 'inline-block';
        await processUserInput(userInput);
        spinner.style.display = 'none';
      }
    }
  });

  submitButton.addEventListener('click', async () => {
    const userInput = inputText.value.trim();
    if (userInput) {
      spinner.style.display = 'inline-block';
      await processUserInput(userInput);
      spinner.style.display = 'none';
    }
  });
}


async function processUserInput(userInput) {
  try {
    const response = await fetch('http://localhost:3000/api/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userInput }),
    });

    const result = await response.json();
    if (result.choices && result.choices.length > 0) {
      displayMessage(result.choices[0].text);
    }
  } catch (error) {
    console.error('Error using OpenAI API:', error.message);
  }
}

function displayMessage(message) {
  document.getElementById('plugins-container').innerHTML = `<p>${message}</p>`;
}

function loadSettings() {
  document.getElementById('settings-icon').addEventListener('click', () => {
    openSettings();
  });
}

function openSettings() {
  const htmlPath = path.join(__dirname, 'settings.html');
  fs.readFile(htmlPath, 'utf-8', (err, data) => {
    if (err) return console.error(`Error reading settings HTML file: ${err.message}`);

    document.getElementById('plugins-container').innerHTML = data;
    const apiKey = settings.get('openai-api-key');
    if (apiKey) document.getElementById('openai-api-key').value = apiKey;

    document.getElementById('settings-form').addEventListener('submit', (event) => {
      event.preventDefault();
      settings.set('openai-api-key', document.getElementById('openai-api-key').value);
    });
  });
}

function initPlugins() {
  loadPlugins().forEach((plugin) => {
    loadPluginCss(plugin);
    createPluginIcon(plugin);
    loadPluginHtml(plugin);
    plugin.init();
  });
}

function loadPluginCss(plugin) {
  const cssPath = path.join(__dirname, '..', 'plugins', plugin.name, `${plugin.name}.css`);
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = cssPath;
  document.head.appendChild(link);
}

function createPluginIcon(plugin) {
  if (plugin.icon) {
    const icon = document.createElement('i');
    icon.className = `fa fa-${plugin.icon}`;
    document.getElementById('plugin-icons-container').appendChild(icon);
    icon.addEventListener('click', () => displayPluginContent(plugin));
  }
}

function loadPluginHtml(plugin) {
  const htmlPath = path.join(__dirname, '..', 'plugins', plugin.name, `${plugin.name}.html`);
  fs.readFile(htmlPath, 'utf-8', (err, data) => {
    if (err) return console.error(`Error reading plugin HTML file: ${err.message}`);
    document.getElementById('plugins-container').insertAdjacentHTML('beforeend', data);
  });
}

function displayPluginContent(plugin) {
	console.log(plugin);
  document.querySelectorAll('.plugin-content').forEach((content) => {
    content.style.display = 'none';
  });

  document.getElementById(`${plugin.name}-content`).style.display = 'block';
}

console.log(settings.store);
