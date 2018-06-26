import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/neon-animation/neon-animations.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import 'web-animations-js/web-animations-next-lite.min.js';

class SimpleDropdown extends PolymerElement {
  static get template() {
    return html`
      <style>
        paper-input {
          width: 242px;
        }
      </style>
      <template is="dom-if" if="[[!readonly]]">
        <paper-dropdown-menu label="[[label]]">
          <paper-listbox slot="dropdown-content" class="dropdown-content" attr-for-selected="id" selected="{{selected}}">
            <template is="dom-repeat" items="[[items]]">
              <paper-item id="[[item.id]]">[[item.name]]</paper-item>
            </template>
          </paper-listbox>
        </paper-dropdown-menu>
      </template>
      <template is="dom-if" if="[[readonly]]">
        <paper-input readonly label="[[label]]" type="text" value="[[selectedItem.name]]"></paper-input>
      </template>
    `;
  }

  static get properties() {
    return {
      items: Array,
      label: String,
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

  static get observers() {
    return ['findSelectedItem(readonly)'];
  }

  findSelectedItem(readonly) {
    if (!readonly) {
      return;
    }

    this.selectedItem = this.items.find(elem => elem.id == this.selected);
  }

}

window.customElements.define('simple-dropdown', SimpleDropdown);
