async function loadPlugins() {
  const response = await fetch('http://localhost:3000/api/plugins');
  const pi = await response.json();
  console.log(pi.plugins);
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

function createPluginIcon(iconClass) {
  const iconElement = document.createElement('i');
  iconElement.className = `${iconClass} text-xl`;
  return iconElement;
}

function createSideBarItem(plugin) {
  const item = document.createElement('li');
  item.className = 'cursor-pointer p-4 hover:bg-gray-200';

  const iconElement = createPluginIcon(plugin.icon);
  item.appendChild(iconElement);

  item.addEventListener('click', () => {
    const pluginContent = document.getElementById(plugin.name);
    const visibleContent = document.querySelector('.plugin-content:not(.hidden)');
    if (visibleContent && visibleContent !== pluginContent) {
      visibleContent.classList.add('hidden');
    }
    pluginContent.classList.toggle('hidden');
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
    plugin.init();

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
