import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

import '@polymer/iron-collapse/iron-collapse.js';

class CollapsibleMenu extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          cursor: pointer;
        }
        .menu-category {
          display: block;
          padding: 0 16px;
          text-decoration: none;
          color: var(--app-secondary-color);
          line-height: 40px;
        }
        iron-collapse {
          padding-left: 21px;
        }
      </style>
      <div class="menu-category" on-click="toggle"> [[label]] </div>
        <iron-collapse id="collapse" opened="{{opened}}">
          <slot></slot>
        </iron-collapse>
    `;
  }

  static get properties() {
    return {
      items: Array,
      label: String,
      opened: {
        type: Boolean,
        value: true
      },
      readonly: {
        type: Boolean,
        value: false
      },
      selected: {
        type: Number,
        notify: true
      },
      selectedItem: Object
    };
  }

  static get properties() {
    return {
      label: String,
      opened: {
        type: Boolean,
        value: false,
        notify: true
      }
    };
  }

  toggle() {
    this.$.collapse.toggle();
  }

}

window.customElements.define('collapsible-menu', CollapsibleMenu);
