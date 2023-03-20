import React, { useState, useEffect } from "react";
import "./App.css";
import SettingsPlugin from "./plugins/settings";
import CodeManagementPlugin from "./plugins/code-management";

function App() {
  const [plugins, setPlugins] = useState([]);

  useEffect(() => {
    async function fetchPlugins() {
      const response = await fetch("http://localhost:3000/api/plugins");
      const pluginData = await response.json();
      setPlugins(pluginData.plugins);
    }

    fetchPlugins();
  }, []);

  return (
    <div className="App">
      <div className="sidebar">
        <ul className="menu">
          {plugins.map((plugin) => (
            <li key={plugin.name} className="menu-item">
              <i className={plugin.icon}></i> {plugin.name}
            </li>
          ))}
        </ul>
      </div>
      <div className="main-content">
        <SettingsPlugin />
        <CodeManagementPlugin />
      </div>
    </div>
  );
}

export default App;
