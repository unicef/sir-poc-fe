
import '@polymer/polymer/polymer-element.js';
import '@polymer/polymer/lib/elements/custom-style.js';

const $_documentContainer = document.createElement('template');
$_documentContainer.innerHTML = `
  <custom-style>
    <style>
      html {
        --app-primary-color: #0099ff;
        --app-secondary-color: black;
        --light-primary-text-color: #fff;
        
        --primary-text-color: rgba(0, 0, 0, 0.87);
        --secondary-text-color: rgba(0, 0, 0, 0.54);
        
        --menu-selected-bg-color: #e8e8e8;
      }
    </style>
  </custom-style>`;

document.head.appendChild($_documentContainer.content);
