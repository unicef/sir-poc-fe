import '@polymer/polymer/polymer-element.js';
import '@polymer/polymer/lib/elements/custom-style.js';

const $_documentContainer = document.createElement('template');
$_documentContainer.innerHTML = `
  <custom-style>
    <style>
      html {
        --primary-color: #0099ff;
        
        --app-primary-color: #0099ff; /* TODO: we should switch to --promary-color as it's used by polymer elements */
        --app-secondary-color: black;
        
        --light-primary-text-color: #fff;
        --primary-text-color: rgba(0, 0, 0, 0.87);
        --secondary-text-color: rgba(0, 0, 0, 0.54);
        
        --primary-warning-color: #ff9044;
        --secondary-warning-color: #cebc06;
        --ternary-warning-color: #fef9cd;
        
        --primary-error-color: #ea4022;
        --secondary-error-color: #f8d7da;
        
        --menu-selected-bg-color: #e8e8e8;
        --unsynced-item-bg-color: var(--secondary-error-color);
        
      }
    </style>
  </custom-style>`;

document.head.appendChild($_documentContainer.content);
