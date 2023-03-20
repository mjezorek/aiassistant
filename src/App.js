import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import Settings from './plugins/settings/settings';
import CodeManagement from './plugins/code-management/code-management';

const App = () => {
  const [plugins, setPlugins] = useState([]);

  useEffect(() => {
    async function loadPlugins() {
      // You can add more plugins here, make sure to import them at the top of the file
      const pluginModules = [Settings, CodeManagement];
      setPlugins(pluginModules);
    }
    loadPlugins();
  }, []);

  return (
    <div id="app">
      <ul className="fixed top-0 left-0 h-screen w-16 bg-gray-100 border-r border-gray-200">
        {plugins.map((plugin) => (
          <li
            key={plugin.name}
            className="cursor-pointer p-4 hover:bg-gray-200"
            onClick={() => {
              // Implement the functionality for loading the plugin here
            }}
          >
            <i className={`${plugin.icon} text-xl`}></i>
          </li>
        ))}
      </ul>
      <div className="main-area ml-16 p-8">
        {plugins.map((plugin) => (
          <div key={plugin.name} id={plugin.name} className="plugin-content hidden">
            {plugin.render()}
          </div>
        ))}
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
