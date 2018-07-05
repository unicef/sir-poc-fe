
import '@polymer/polymer/polymer-element.js';
import '@polymer/polymer/lib/elements/custom-style.js';

const $_documentContainer = document.createElement('template');
$_documentContainer.innerHTML = `
  <custom-style>
    <style>
      html {

        --app-primary-color: #4285f4;
        --app-secondary-color: black;
        --light-primary-text-color: #fff;
      }
    </style>
  </custom-style>`;

document.head.appendChild($_documentContainer.content);
