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
// language=HTML
documentContainer.innerHTML = `
  <dom-module id="shared-styles">
    <template>
      <style include="button-styles">
        .card {
          margin: 24px;
          padding: 24px;
          color: var(--primary-text-color);
          border-radius: 5px;
          background-color: #fff;
          box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 
                      0 1px 5px 0 rgba(0, 0, 0, 0.12), 
                      0 3px 1px -2px rgba(0, 0, 0, 0.2);
        }

        fieldset {
          border: none;
          margin: 0 0;
          padding: 0 0;
        }

        fieldset > div {
          padding-left: 10px;
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

        h3 {
          color: var(--primary-color-darker);
        }

        a {
          text-decoration: none;
        }

        *[hidden] {
          display: none !important;
        }

        .list {
          padding-bottom: 36px;
        }

        .warning {
          color: var(--warning-text-color, orange);
        }

        etools-info-tooltip.info {
          --etools-tooltip-trigger-icon: {
            color: var(--primary-color);
          };
        }

        etools-data-table-row[unsynced] {
          --list-bg-color: var(--unsynced-item-bg-color);
        }

        etools-info-tooltip {
          --tooltip-box-style: {
            white-space: normal !important;
          };
        }

        datepicker-lite,
        time-input {
          max-width: 200px;
        }

        .p-relative {
          position: relative;
        }

        @media screen and (max-width: 767px) {
          /* !!! Keep this at the end of the file !!! */
          /* mobile, under 768px */
          .card {
            margin: 16px;
            padding: 16px;
          }
        }
      </style>
    </template>
  </dom-module>`;

document.head.appendChild(documentContainer.content);
