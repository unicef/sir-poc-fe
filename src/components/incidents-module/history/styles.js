import '@polymer/polymer/polymer-element.js';

const documentContainer = document.createElement('template');
documentContainer.innerHTML = `
  <dom-module id="history-common-styles">
    <template>
      <style>
        a {
          color: var(--primary-color);
        }
        .nav-buttons {
          display: inline-flex;
          align-items: center;
        }
      </style>
    </template>
  </dom-module>
`;

document.head.appendChild(documentContainer.content);


