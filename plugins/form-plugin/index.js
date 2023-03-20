export default {
  name: 'form-plugin',
  displayName: 'Form Plugin',
  description: 'This is a form plugin.',
  icon: 'fas fa-list-alt',
  style: 'style.css',
  init: () => {
    console.log('Form Plugin initialized.');
  },
  render: () => {
    const container = document.createElement('div');
    container.classList.add('form-plugin-container');
    
    const title = document.createElement('h2');
    title.classList.add('form-plugin-title');
    title.innerText = 'Form Plugin';
    container.appendChild(title);
    
    const form = document.createElement('form');
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Enter some text';
    form.appendChild(input);
    
    const button = document.createElement('button');
    button.type = 'submit';
    button.innerText = 'Submit';
    form.appendChild(button);
    
    container.appendChild(form);
    return container;
  }
};
