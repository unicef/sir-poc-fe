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
import './button-styles.js';

const documentContainer = document.createElement('template');
documentContainer.innerHTML = `<dom-module id="filters-styles">
  <template>
    <style>
      .filters .filter:not(:last-child) {
        margin-right: 24px;
      }
      .sync-filter {
        min-width: 250px;
        width: auto;
      }
      .search-input {
        @apply --layout-horizontal;
        --paper-input-container: {
          width: 100%;
        };
        --paper-input-prefix: {
          margin-right: 8px;
        };
        flex: 0 0 25%;
        max-width: 25%;
      }

      @media screen and (max-width: 768px) {
        .search-input {
          display: block;
          max-width: 100%;
        }
        .filters .filter:not(:last-child) {
          margin-right: 0;
        }
        .sync-filter {
          min-width: 0;
          max-width: 100%;
        }
      }
    </style>
  </template>
</dom-module>`;

document.head.appendChild(documentContainer.content);
