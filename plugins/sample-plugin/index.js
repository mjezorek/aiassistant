export default {
  name: 'sample-plugin',
  displayName: 'Sample Plugin',
  description: 'This is a sample plugin.',
  icon: 'fas fa-robot',
  style: 'style.css',
  init: () => {
    console.log('Sample Plugin initialized.');
  },
  render: () => {
    const container = document.createElement('div');
    container.classList.add('sample-plugin-container');
    
    const title = document.createElement('h2');
    title.classList.add('sample-plugin-title');
    title.innerText = 'Sample Plugin';
    container.appendChild(title);
    
    const description = document.createElement('p');
    description.classList.add('sample-plugin-description');
    description.innerText = 'This is a sample plugin.';
    container.appendChild(description);

    return container;
  }
};
