// Function to fetch the list of available plugins from the API
async function fetchPlugins() {
  const response = await fetch('/remote-apis/plugins');
  const plugins = await response.json();
  return plugins;
}

// Fetch the component HTML from the given URL
async function fetchComponentHTML(url) {
  const response = await fetch(url);
  const html = await response.text();
  return html;
}

// Function to load and display plugins in the UI
async function loadPlugins() {
  const pluginButtonsContainer = document.getElementById('plugin-buttons');
  const pluginContainer = document.getElementById('plugin-container');

  const plugins = await fetchPlugins();

  plugins.forEach((plugin) => {
    // Create plugin button
    const button = document.createElement('button');
    button.innerHTML = `<i class="${plugin.icon}"></i> ${plugin.name}`;
    button.classList.add('btn', 'btn-primary', 'me-2');
    button.addEventListener('click', async () => {
      // Load plugin component
      const componentHTML = await fetchComponentHTML(plugin.componentUrl);
      pluginContainer.innerHTML = componentHTML;

      // Handle plugin events
      const pluginModule = await import(plugin.moduleUrl);
      pluginModule.handleEvent(pluginContainer);
    });

    // Add plugin button to the UI
    pluginButtonsContainer.appendChild(button);
  });
}

loadPlugins();
