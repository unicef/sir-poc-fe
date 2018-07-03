/**
@license
*/

import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { connect } from 'pwa-helpers/connect-mixin.js';

// import '@polymer/paper-input/paper-textarea.js';
import '@polymer/paper-input/paper-input.js';

import { addEvent } from '../../actions/events.js';
import { store } from '../store.js';
import '../common/errors-box.js';
import '../styles/shared-styles.js';

export class EventsBaseView extends connect(store)(PolymerElement) {
 static get template() {
    return html`
      <style include="shared-styles">
        :host {
          display: block;

          padding: 10px;
        }
      </style>
      <div class="card">
          <h2> [[title]] </h2>
          <errors-box></errors-box>
          <paper-input label="Start date" type="date" readonly="[[readonly]]" value="{{event.start_date}}"></paper-input>
          <paper-input label="End date" type="date" readonly="[[readonly]]" value="{{event.end_date}}"></paper-input>

          <paper-input label="Description" type="text" readonly="[[readonly]]" value="{{event.description}}"></paper-input>
          <paper-input label="Note" readonly="[[readonly]]" type="text" value="{{event.note}}"></paper-input>
          <paper-input label="Location" type="text" readonly="[[readonly]]" value="{{event.location}}"></paper-input>

          <template is="dom-if" if="[[!readonly]]">
            <paper-button on-click="save"> Save </paper-button>
          </template>
      </div>
    `;
  }

  static get properties() {
    return {
      state: Object,
      event: {
        type: Object,
        value: {}
      },
      readonly: {
        type: Boolean,
        value: false
      },
      title: String,
      state: Object,
      store: Object
    };
  }
  connectedCallback() {
    super.connectedCallback();
    this.store = store;
  }

  _stateChanged(state) {
    this.state = state;
  }

  save() {
  }
}
