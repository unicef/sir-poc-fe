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
import '../styles/grid-layout-styles.js';

export class EventsBaseView extends connect(store)(PolymerElement) {
 static get template() {
    return html`
      <style include="shared-styles grid-layout-styles">
        :host {
          @apply --layout-vertical;
        }
        paper-button {
          margin: 8px 0 8px 24px;
          padding: 8px;
        }
        paper-button + paper-button {
          margin-left: 0;
        }
      </style>
      <div class="card">
        <div class="row-h">
          <h2> [[title]] </h2>
        </div>

        <div class="row-h">
          <errors-box></errors-box>
        </div>

        <div class="row-h flex-c">
          <div class="col col-6">
            <paper-input label="Start date" type="date" readonly="[[readonly]]" value="{{event.start_date}}"></paper-input>
          </div>
          <div class="col col-6">
            <paper-input label="End date" type="date" readonly="[[readonly]]" value="{{event.end_date}}"></paper-input>
          </div>
        </div>

        <div class="row-h flex-c">
          <div class="col col-6">
            <paper-input label="Location" type="text" readonly="[[readonly]]" value="{{event.location}}"></paper-input>
          </div>
          <div class="col col-6">
            <paper-input label="Note" readonly="[[readonly]]" type="text" value="{{event.note}}"></paper-input>
          </div>
        </div>

        <div class="row-h flex-c">
          <div class="col col-12">
            <paper-input label="Description" type="text" readonly="[[readonly]]" value="{{event.description}}"></paper-input>
          </div>
        </div>

        <template is="dom-if" if="[[!readonly]]">
          <template is="dom-if" if="[[showSyncButton]]">
            <paper-button raised on-click="save"> Edit </paper-button>
            <paper-button raised on-click="sync"> Sync </paper-button>
          </template>

          <paper-button raised on-click="save" hidden$="[[showSyncButton]]"> Save </paper-button>
        </template>
      </div>
    `;
  }

  static get properties() {
    return {
      event: {
        type: Object,
        value: {}
      },
      readonly: {
        type: Boolean,
        value: false
      },
      showSyncButton: {
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
    this.showSyncButton = this.event && !this.state.app.offline && this.event.unsynced;
  }

  isVisible() {
    return this.classList.contains('iron-selected');
  }
}
