/**
 @license
 */

import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import {connect} from 'pwa-helpers/connect-mixin.js';

import '@polymer/paper-input/paper-textarea.js';
import '@polymer/paper-input/paper-input.js';
import '../common/datepicker-lite.js';

import {fetchEvent} from '../../actions/events.js';
import {selectEvent} from '../../reducers/events.js';
import {store} from '../../redux/store.js';
import {EventModel} from './models/event-model.js';
import '../common/errors-box.js';
import '../common/warn-message.js';
import '../styles/shared-styles.js';
import '../styles/grid-layout-styles.js';

export class EventsBaseView extends connect(store)(PolymerElement) {
  static get template() {
    // language=HTML
    return html`
      <style include="shared-styles grid-layout-styles">
        :host {
          @apply --layout-vertical;
        }

        errors-box {
          margin: 0 24px;
        }
      </style>

      <div class="card">
        <h2>[[title]]</h2>

        <div class="layout-horizontal">
          <errors-box></errors-box>
        </div>

        <div class="row-h flex-c">
          <div class="col col-3">
            <datepicker-lite label="Start date" readonly="[[readonly]]" value="{{event.start_date}}"></datepicker-lite>
          </div>
          <div class="col col-3">
            <datepicker-lite label="End date" readonly="[[readonly]]" value="{{event.end_date}}"></datepicker-lite>
          </div>
          <div class="col col-6">
            <paper-input label="Location" placeholder="&#8212;" type="text"
                         readonly="[[readonly]]" value="{{event.location}}"></paper-input>
          </div>
        </div>

        <div class="row-h flex-c">
          <div class="col col-12">
            <paper-textarea label="Note" readonly="[[readonly]]" placeholder="&#8212;"
                            value="{{event.note}}"></paper-textarea>
          </div>
        </div>

        <div class="row-h flex-c">
          <div class="col col-12">
            <paper-textarea label="Description" readonly="[[readonly]]" placeholder="&#8212;"
                            value="{{event.description}}"></paper-textarea>
          </div>
        </div>

        <template is="dom-if" if="[[!readonly]]">
          <div class="row-h flex-c" hidden$="[[!state.app.offline]]">
            <warn-message message="Because there is no internet conenction the event will be saved offine for now,
                                    and you must sync it manually by saving it again when online">
            </warn-message>
          </div>

          <div class="row-h flex-c">
            <div class="col col-12">
              <paper-button raised on-click="save">Save</paper-button>
            </div>
          </div>
        </template>
      </div>
    `;
  }

  static get properties() {
    return {
      event: {
        type: Object
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
    if (!this.isOnExpectedPage(this.state)) {
      return;
    }

    if (!newId) {
      this.event = JSON.parse(JSON.stringify(EventModel));
      return;
    }

    this.set('event', JSON.parse(JSON.stringify(selectEvent(this.state))));
    if (!this.isOfflineOrUnsynced()) {
      this.store.dispatch(fetchEvent(this.eventId));
    }
  }

  isOfflineOrUnsynced() {
    return this.state.app.offline || (this.event && this.event.unsynced);
  }

  _stateChanged(state) {
    this.state = state;
  }

  isVisible() {
    return this.classList.contains('iron-selected');
  }
}
