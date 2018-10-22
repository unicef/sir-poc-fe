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
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import './button-styles.js';

const documentContainer = document.createElement('template');
documentContainer.innerHTML = `<dom-module id="filters-styles">
  <template>
    <style>
      .filters {
        @apply --layout-horizontal;
        @apply --layout-center;
        @apply --layout-wrap;
      }

      .filters > *:not(:last-child) {
        margin-right: 24px;
      }

      .filters .filter {
        margin-bottom: 16px;
      }

      .search-input {
        max-width: 400px;
        @apply --layout-horizontal;
        --paper-input-container: {
          width: 100%;
        };
        --paper-input-prefix: {
          margin-right: 8px;
        };
        flex: 0 0 25%;
      }

      .sync-filter {
        min-width: 160px;
        width: auto;
      }

      .select {
        min-width: 220px;
        width: auto;
      }

      .export {
        padding: 0;
      }

      .export,
      .export paper-listbox {
        width: 110px;
      }

      .filters .filter:not(:first-of-type) {
          padding-left: 0;
      }

      .filters-button {
        width: 100%;
        text-align: center;
        font-size: 14px;
        color: var(--list-secondary-text-color, #757575);
        font-weight: bold;
        cursor: pointer;
      }

      #toggleIcon {
        --iron-icon-height: 32px;
        --iron-icon-width: 32px;
      }

      @media screen and (max-width: 768px) {
        .filter{
          width: 100%;
        }

        .search-input {
          display: block;
          max-width: 100%;
          flex: 0 0 100%;
        }

        .filters .filter:not(:last-child) {
          margin-right: 0px;
        }
      }
    </style>
  </template>
</dom-module>`;

document.head.appendChild(documentContainer.content);
