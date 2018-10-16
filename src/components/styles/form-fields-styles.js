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
documentContainer.innerHTML = `<dom-module id="form-fields-styles">
  <template>
    <style>
      paper-checkbox {
        line-height: 64px;
        --paper-checkbox-unchecked-color: var(--secondary-text-color);
      }

      paper-textarea {
        --paper-input-container-input: {
          display: block;
        }
      }

      etools-dropdown-lite, etools-dropdown-multi-lite {
        width: 100%;
      }

      paper-input,
      paper-textarea,
      datepicker-lite,
      time-input,
      etools-dropdown-lite,
      etools-dropdown-multi-lite {
        --paper-input-container-underline-focus: {
          box-shadow:
            0 2px 2px 0 rgba(0, 0, 0, 0.14),
            0 1px 5px 0 rgba(0, 0, 0, 0.12),
            0 3px 1px -2px rgba(0, 0, 0, 0.2);
        }
      }

      paper-input[readonly],
      time-input[readonly],
      paper-textarea[readonly],
      datepicker-lite[readonly],
      etools-dropdown-lite[readonly],
      etools-dropdown-multi-lite[readonly],
      paper-input[disabled],
      paper-textarea[disabled],
      datepicker-lite[disabled],
      etools-dropdown-lite[disabled],
      etools-dropdown-multi-lite[disabled] {

        --paper-input-container-label-focus: {
          color: var(--secondary-text-color, #737373);
        };

        --paper-input-container-underline: {
          border-bottom: 1px dashed var(--primary-text-color);
        }
        --paper-input-container-underline-focus: {
          border-bottom: 1px dashed var(--primary-text-color);
        }
        --paper-input-container-underline-disabled: {
          border-bottom: 1px dashed var(--primary-text-color);
        }
      }

    </style>
  </template>
</dom-module>`;

document.head.appendChild(documentContainer.content);
