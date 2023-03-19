async function loadPlugins() {
  const response = await fetch('/remote-apis/plugins');
  const plugins = await response.json();

  const tabs = document.getElementById('plugin-tabs');
  const container = document.getElementById('plugin-container');

  plugins.forEach((plugin) => {
    const tab = document.createElement('li');
    tab.className = 'nav-item';
    tab.innerHTML = `<a class="nav-link" href="#" data-plugin="${plugin.route}">${plugin.name}</a>`;
    tabs.appendChild(tab);
  });

  tabs.addEventListener('click', async (event) => {
    event.preventDefault();
    const target = event.target.closest('[data-plugin]');
    if (!target) return;

    const pluginRoute = target.getAttribute('data-plugin');
    const pluginResponse = await fetch(`/plugins${pluginRoute}`);
    const plugin = await pluginResponse.json();

    container.innerHTML = plugin.component;
  });
}

loadPlugins();
