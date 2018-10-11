import '@polymer/polymer/polymer-element.js';
import '@polymer/polymer/lib/elements/custom-style.js';

const documentContainer = document.createElement('template');
documentContainer.innerHTML = `
  <custom-style>
    <style>
      html {
        --primary-color: #309ae0;

        --app-primary-color: #309ae0; /* TODO: we should switch to --primary-color as it's used by polymer elements */
        --primary-color-darker: #4f8fba;
        --app-secondary-color: black;

        --light-primary-text-color: #fff;
        --primary-text-color: rgba(0, 0, 0, 0.87);
        --secondary-text-color: rgba(0, 0, 0, 0.64);
        --lighter-than-secondary-text-color: rgba(0, 0, 0, 0.54);

        --primary-warning-color: #ff9044;
        --secondary-warning-color: #cebc06;
        --ternary-warning-color: #fef9cd;

        --primary-error-color: #ea4022;
        --secondary-error-color: #f8d7da;

        --menu-selected-bg-color: #e8e8e8;
        --unsynced-item-bg-color: var(--secondary-error-color);

        --paper-input-container-label: {
          color: var(--secondary-text-color, #737373);
        };
        --paper-input-container-label-floating: {
          color: var(--secondary-text-color, #737373);
        }

        --list-primary-color: var(--primary-color);

      }
    </style>
  </custom-style>`;

document.head.appendChild(documentContainer.content);
