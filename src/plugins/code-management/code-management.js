import React from 'react';
import './code-management.css';

const CodeManagement = () => {
  return (
    <div className="code-management">
      <h1>Code Management</h1>
      <p>This is the code management plugin.</p>
    </div>
  );
};

export default {
  name: 'code-management',
  icon: 'fas fa-code',
  render: () => <CodeManagement />,
  init: () => {}
};
