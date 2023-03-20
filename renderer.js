async function loadPlugins() {
  const response = await fetch('http://localhost:3000/api/plugins');
  const pi = await response.json();
  const pluginModules = await Promise.all(pi.plugins.map(async plugin => {
    const modulePath = `./plugins/${plugin}/index.js`;
    const module = await import(modulePath);
    return module.default || module;
  }));

  return pluginModules;
}

function applyPluginStyles(plugin) {
  const style = document.createElement('link');
  style.rel = 'stylesheet';
  style.href = `./plugins/${plugin.name}/${plugin.style}`;
  document.head.appendChild(style);
}

function createSideBarItem(plugin) {
  const item = document.createElement('li');
  item.className = 'cursor-pointer p-4 hover:bg-gray-200';

  const menuItem = document.createElement("li");
  menuItem.innerHTML = `<i class="${plugin.icon}"></i> ${plugin.name}`;
  menuItem.classList.add("plugin-menu-item");
  item.appendChild(menuItem);

  item.addEventListener('click', () => {
    const pluginContents = document.querySelectorAll('.plugin-content');
    pluginContents.forEach(content => {
      content.classList.add('hidden');
    });

    const pluginContent = document.getElementById(plugin.name);
    pluginContent.classList.remove('hidden');
  });

  return item;
}

async function renderPlugins() {
  const plugins = await loadPlugins();

  const appContainer = document.getElementById('app');
  const sideBar = document.createElement('ul');
  sideBar.className = 'fixed top-0 left-0 h-screen w-16 bg-gray-100 border-r border-gray-200';

  appContainer.appendChild(sideBar);

  const mainArea = document.createElement('div');
  mainArea.className = 'main-area ml-16 p-8';
  appContainer.appendChild(mainArea);

  plugins.forEach(plugin => {
    //plugin.init();

    applyPluginStyles(plugin);

    const pluginUI = plugin.render();
    pluginUI.id = plugin.name;
    pluginUI.className = 'plugin-content hidden';
    mainArea.appendChild(pluginUI);

    const sideBarItem = createSideBarItem(plugin);
    sideBar.appendChild(sideBarItem);
  });
}

renderPlugins();
