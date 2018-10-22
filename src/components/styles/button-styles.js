/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import '@polymer/polymer/polymer-element.js';

const documentContainer = document.createElement('template');
// language=HTML
documentContainer.innerHTML = `
  <dom-module id="button-styles">
    <template>
      <style>
        paper-button {
          margin: 8px 0;
          padding: 8px;
          background-color: var(--button-primary-bg-color, #4285f4);
          color: var(--button-primary-text-color, #fff);
          font-weight: bold;
        }
        
        paper-button.secondary {
          background-color: var(--button-secondary-bg-color, #4285f4);
        }

        paper-button.danger {
          background-color: var(--primary-error-color);
        }

        paper-button iron-icon {
          margin-right: 8px;
        }

        .white-bg {
          background-color: white;
          color: var(--primary-color, #309ae0);
        }

        .smaller {
          font-size: 14px;
          padding: 0 8px;
        }
      </style>
    </template>
  </dom-module>`;

document.head.appendChild(documentContainer.content);
