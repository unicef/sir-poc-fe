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
import './button-styles.js'

const $_documentContainer = document.createElement('template');
$_documentContainer.innerHTML = `<dom-module id="shared-styles">
  <template>
    <style include="button-styles">
      .card {
        margin: 24px;
        padding: 16px;
        color: #757575;
        border-radius: 5px;
        background-color: #fff;
        box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
      }

      .circle {
        display: inline-block;
        width: 64px;
        height: 64px;
        text-align: center;
        color: #555;
        border-radius: 50%;
        background: #ddd;
        font-size: 30px;
        line-height: 64px;
      }

      h1 {
        margin: 16px 0;
        color: #212121;
        font-size: 22px;
      }

      *[hidden] {
        display: none;
      }

      paper-button {
        background-color: var(--app-primary-color, #4285f4);
        --paper-button: {
          color: var(--light-primary-text-color, #fff);
          font-weight: bold;
          padding: 5px 10px;
        };
      }

      .list {
        padding-bottom: 36px;
      }

      .search-input {
        max-width: 400px;
      }

      iron-icon {
        height: 16px;
      }

      a {
        text-decoration: none;
      }

      etools-dropdown-lite, etools-dropdown-multi-lite {
        width: 100%;
      }

      etools-dropdown-lite, etools-dropdown-multi-lite {
        width: 100%;
      }
    </style>
  </template>
</dom-module>`;

document.head.appendChild($_documentContainer.content);
