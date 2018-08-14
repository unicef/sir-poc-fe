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
documentContainer.innerHTML = `<dom-module id="button-styles">
  <template>
    <style>
      paper-button {
        margin: 8px 0;
        padding: 8px;
      }
    </style>
  </template>
</dom-module>`;

document.head.appendChild(documentContainer.content);
