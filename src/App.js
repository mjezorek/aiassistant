import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [plugins, setPlugins] = useState([]);

  useEffect(() => {
    const loadPlugins = async () => {
      const response = await fetch('http://localhost:3000/api/plugins');
      const pluginInfo = await response.json();
      const loadedPlugins = await Promise.all(
        pluginInfo.plugins.map(async (plugin) => {
          const { default: PluginComponent } = await import(`./plugins/${plugin}`);
          return <PluginComponent key={plugin} />;
        })
      );
      setPlugins(loadedPlugins);
    };
    loadPlugins();
  }, []);

  return (
    <div className="App">
      {plugins}
    </div>
  );
}

export default App;
