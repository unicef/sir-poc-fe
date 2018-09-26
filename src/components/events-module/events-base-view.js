/**
 @license
 */

import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { connect } from 'pwa-helpers/connect-mixin.js';

import '@polymer/paper-input/paper-textarea.js';
import '@polymer/paper-input/paper-input.js';
import '../common/datepicker-lite.js';

import { clearErrors } from '../../actions/errors.js';
import { fetchEvent } from '../../actions/events.js';
import { selectEvent } from '../../reducers/events.js';
import { store } from '../../redux/store.js';
import { EventModel } from './models/event-model.js';
import '../common/errors-box.js';
import '../common/warn-message.js';
import '../styles/shared-styles.js';
import '../styles/form-fields-styles.js';
import '../styles/grid-layout-styles.js';
import '../styles/required-fields-styles.js';
import { resetFieldsValidations, validateFields } from '../common/validations-helper';

export class EventsBaseView extends connect(store)(PolymerElement) {
  static get template() {
    // language=HTML
    return html`
      <style include="shared-styles form-fields-styles grid-layout-styles required-fields-styles">
        :host {
          @apply --layout-vertical;
        }

        errors-box {
          margin: 0 24px;
        }
      </style>

      <div class="card">
        ${this.getTitleTemplate}

        <div class="layout-horizontal">
          <errors-box></errors-box>
        </div>

        <div class="row-h flex-c">
          <div class="col col-3">
            <datepicker-lite id="startDate"
                             label="Start date"
                             readonly="[[readonly]]"
                             value="{{event.start_date}}"
                             required auto-validate
                             error-message="Start date is required"></datepicker-lite>
          </div>
          <div class="col col-3">
            <datepicker-lite id="endDate"
                             label="End date"
                             readonly="[[readonly]]"
                             value="{{event.end_date}}"
                             required auto-validate
                             error-message="End date is required"></datepicker-lite>
          </div>
          <div class="col col-6">
            <paper-input id="location"
                         label="Location"
                         placeholder="&#8212;"
                         type="text"
                         readonly$="[[readonly]]"
                         value="{{event.location}}"
                         required auto-validate
                         error-message="Location is required"></paper-input>
          </div>
        </div>

        <div class="row-h flex-c">
          <div class="col col-12">
            <paper-textarea label="Note" readonly$="[[readonly]]" placeholder="&#8212;"
                            value="{{event.note}}"></paper-textarea>
          </div>
        </div>

        <div class="row-h flex-c">
          <div class="col col-12">
            <paper-textarea id="description"
                            label="Description"
                            readonly$="[[readonly]]"
                            placeholder="&#8212;"
                            value="{{event.description}}"
                            required auto-validate
                            error-message="Description is required"></paper-textarea>
          </div>
        </div>

        <template is="dom-if" if="[[!readonly]]">
          <div class="row-h flex-c" hidden$="[[!state.app.offline]]">
            <warn-message hidden$="[[!_eventHasTempIdOrNew(eventId)]]"
                          message="Because there is no internet conenction the event will be saved offine for now,
                                    and you must sync it manually by saving it again when online">
            </warn-message>
            <warn-message hidden$="[[_eventHasTempIdOrNew(eventId)]]"
                        message="Can't edit a synced event while offline">
            </warn-message>
          </div>

          <div class="row-h flex-c">
            <div class="col col-12">
              <paper-button raised on-click="save"
                            disabled$="[[canNotSave(eventId, state.app.offline)]]">Save</paper-button>
            </div>
          </div>
        </template>
        ${this.goToEditBtnTmpl}
      </div>
    `;
  }

  static get goToEditBtnTmpl() {
    return html``;
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
      visible: {
        type: Boolean,
        value: false,
        observer: '_visibilityChanged'
      },
      eventId: {
        type: Number,
        computed: '_setEventId(state.app.locationInfo.eventId)',
        observer: '_idChanged'
      },
      fieldsToValidateSelectors: {
        type: Array,
        value: ['#startDate', '#endDate', '#location', '#description']
      }
    };
  }

  static get getTitleTemplate() {
    return html`
      <h2>[[title]]</h2>
    `;
  }

  connectedCallback() {
    this.store = store;
    super.connectedCallback();
  }

  _setEventId(id) {
    return id;
  }

  _idChanged(newId) {
    if (!newId) {
      this.event = JSON.parse(JSON.stringify(EventModel));
      return;
    }

    this.set('event', JSON.parse(JSON.stringify(selectEvent(this.state))));
    if (!this.isOfflineOrUnsynced() && this.visible) {
      this.store.dispatch(fetchEvent(this.eventId));
    }
  }

  // It was created offline and not yet saved on server or new
  _eventHasTempIdOrNew(eventId) {
    if (!eventId) {
      return true;
    }
    return isNaN(eventId);
  }

  // Only edit of unsynced and add new is possible offline
  canNotSave(eventId, offline) {
    return (offline && !!eventId && !isNaN(eventId));
  }


  _visibilityChanged(visible) {
    if (visible) {
      this.resetValidations();
    }
    if (visible === false) {
      store.dispatch(clearErrors());
    }
  }

  _stateChanged(state) {
    this.state = state;
  }

  isOfflineOrUnsynced() {
    return this.state.app.offline || (this.event && this.event.unsynced);
  }

  validate() {
    return validateFields(this, this.fieldsToValidateSelectors);
  }

  resetValidations() {
    resetFieldsValidations(this, this.fieldsToValidateSelectors);
  }
}
