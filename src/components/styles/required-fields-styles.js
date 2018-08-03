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

const $_documentContainer = document.createElement('template');
$_documentContainer.innerHTML = `<dom-module id="required-fields-styles">
  <template>
    <style>
      :host > * {
        --required-star-style: {
          background: url(../../../images/required.svg) no-repeat 99% 20%/8px;
          width: auto !important;
          max-width: 100%;
          right: auto;
          padding-right: 15px;
        };
      }

      paper-input[required],
      paper-textarea[required],
      paper-input-container[required],
      etools-date-input[required],
      etools-dropdown-lite[required],
      etools-dropdown-multi-lite[required],
      datepicker-lite[required] {
        --paper-input-container-label: {
          @apply --required-star-style;
          color: var(--secondary-text-color, #737373)
        };
        --paper-input-container-label-floating: {
          @apply --required-star-style;
          color: var(--secondary-text-color, #737373);
        }
      }
    </style>
  </template>
</dom-module>`;

document.head.appendChild($_documentContainer.content);
