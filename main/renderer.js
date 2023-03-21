const path = require('path');
const fs = require('fs');
const { loadPlugins } = require('./plugins');
const settings = require('./settings');
const { ipcRenderer } = require("electron");

let conversationHistory = [
  { role: "system", content: "User starts the assistant." },
];
init();

function init() {
  setupInputHandler();
  loadSettings();
  initPlugins();
}




async function handleClick(transcription = null) {
  const inputText = document.getElementById('input-text');
  const submitButton = document.getElementById('submit');
  const submitText = document.getElementById('submit-text');
  const spinner = document.getElementById('spinner');

  const userInput = transcription || inputText.value.trim();
  if (userInput) {
  	console.log('there is input');
    submitButton.disabled = true;
    submitText.style.display = "none";
    spinner.style.display = "inline-block";
    displayMessage(userInput, transcription ? "voice" : "text", "user");
    await processInput(userInput, transcription ? "voice" : "text");
    inputText.value = transcription ? inputText.value : ""; // Clear the input field
    spinner.style.display = "none";
    submitText.style.display = "inline";
    submitButton.disabled = false;
  }
}

function setupInputHandler() {
  const inputText = document.getElementById('input-text');
  const submitButton = document.getElementById('submit');
  const newConvo = document.getElementById('new');

  inputText.addEventListener('keydown', async (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleClick();
    }
  });

  function newConvoClick() {
    conversationHistory = [
      { role: "system", content: "User starts the assistant." },
    ];
  }

  newConvo.addEventListener('click', newConvoClick);
  submitButton.addEventListener('click', () => handleClick());
}

// The rest of the file remains the same...




async function processInput(userInput, type, sender = "assistant") {
  conversationHistory.push({ role: "user", content: userInput });

  try {
    const response = await fetch("http://localhost:3000/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages: conversationHistory }),
    });

    const result = await response.json();
    if (result.response) {
      const responseText = result.response;
      conversationHistory.push({ role: "assistant", content: responseText });
      displayMessage(responseText, type, sender);
    }
  } catch (error) {
    console.error("Error using OpenAI API:", error.message);
  }
}

function displayMessage(message, type, sender = "assistant") {
  const conversationHistory = document.getElementById("conversation-history");
  const messageElement = document.createElement("div");

  messageElement.classList.add("message", sender);
  messageElement.innerText = message;

  conversationHistory.appendChild(messageElement);
  conversationHistory.scrollTop = conversationHistory.scrollHeight;
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
	const cloudCreds = settings.get('google-cloud-credentials');
    if (apiKey) document.getElementById('google-cloud-credentials').value = cloudCreds;

    document.getElementById('settings-form').addEventListener('submit', (event) => {
      event.preventDefault();
      settings.set('openai-api-key', document.getElementById('openai-api-key').value);
      settings.set('google-cloud-credentials', document.getElementById('google-cloud-credentials').value); // Add this line
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