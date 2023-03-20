import React from 'react';
import './settings.css';

const Settings = () => {
  return (
    <div className="settings">
      <h1>Settings</h1>
      <p>This is the settings plugin.</p>
    </div>
  );
};

export default {
  name: 'settings',
  icon: 'fas fa-cog',
  render: () => <Settings />,
  init: () => {}
};
