

import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/neon-animation/neon-animations.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import 'web-animations-js/web-animations-next-lite.min.js';

class SimpleDropdown extends PolymerElement {
  static get template() {
    return html`
      <paper-dropdown-menu label="[[label]]">
        <paper-listbox slot="dropdown-content" class="dropdown-content" attr-for-selected="id" selected="{{selected}}">
          <template is="dom-repeat" items="[[items]]">
            <paper-item id="[[item.id]]">[[item.name]]</paper-item>
          </template>
        </paper-listbox>
      </paper-dropdown-menu>`;
  }

  static get properties() {
    return {
      items: Array,
      label: String,
      selected: {
        type: Number,
        notify: true
      }
    };
  }

}

window.customElements.define('simple-dropdown', SimpleDropdown);
