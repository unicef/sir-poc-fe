/**
@license
*/

import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { connect } from 'pwa-helpers/connect-mixin.js';

// import '@polymer/paper-input/paper-textarea.js';
import '@polymer/paper-input/paper-input.js';
import '../common/datepicker-lite.js';

import { fetchEvent } from '../../actions/events.js';
import { selectEvent } from '../../reducers/events.js';
import { store } from '../../redux/store.js';
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
            <datepicker-lite label="Start date" readonly="[[readonly]]" value="{{event.start_date}}"></datepicker-lite>
          </div>
          <div class="col col-6">
            <datepicker-lite label="End date" readonly="[[readonly]]" value="{{event.end_date}}"></datepicker-lite>
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
          <div class="row-h flex-c">
            <div class="col col-12">
              <paper-button raised on-click="save"> Save </paper-button>
            </div>
          </div>
        </template>
      </div>
    `;
  }

  static get properties() {
    return {
      event: {
        type: Object,
      },
      readonly: {
        type: Boolean,
        value: false
      },
      title: String,
      state: Object,
      store: Object,
      eventId: {
        type: Number,
        computed: '_setEventId(state.app.locationInfo.eventId)',
        observer: '_idChanged'
      }
    };
  }

  connectedCallback() {
    this.store = store;
    super.connectedCallback();
  }

  _setEventId(id) {
    return id;
  }

  _idChanged(newId) {
    if (!newId || !this.isOnExpectedPage(this.state)) {
      return;
    }
    if (!this.state.app.offline) {
      this.store.dispatch(fetchEvent(this.eventId));
    }
  }

  _stateChanged(state) {
    this.state = state;

    if (!this.isOnExpectedPage(this.state)) {
      return;
    }

    // *The event is loaded from Redux until the GET finishes and refreshes it
    this.set('event', selectEvent(this.state));
  }

  isVisible() {
    return this.classList.contains('iron-selected');
  }
}
