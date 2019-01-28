/**
 @license
 */

import { html } from '@polymer/polymer/polymer-element.js';
import { getCountriesForRegion } from '../common/utils.js';
import { PermissionsBase } from '../common/permissions-base-class';
import { connect } from 'pwa-helpers/connect-mixin.js';

import '@polymer/paper-input/paper-textarea.js';
import '@polymer/paper-input/paper-input.js';
import 'etools-date-time/datepicker-lite.js';

import { selectEvent } from '../../reducers/events.js';
import { store } from '../../redux/store.js';
import '../common/etools-dropdown/etools-dropdown-lite.js';
import '../common/errors-box.js';
import '../common/warn-message.js';
import '../common/review-fields.js';
import '../styles/shared-styles.js';
import '../styles/form-fields-styles.js';
import '../styles/grid-layout-styles.js';
import '../styles/required-fields-styles.js';
import { validateAllRequired, resetRequiredValidations } from '../common/validations-helper.js';
import DateMixin from '../common/date-mixin.js';

export class EventsBaseView extends connect(store)(DateMixin(PermissionsBase)) {
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
          <div class="col">
            <datepicker-lite id="startDate"
                             label="Start date"
                             value="{{event.start_date}}"
                             max-date="[[toDate(event.end_date)]]"
                             readonly="[[readonly]]"
                             required auto-validate
                             error-message="Start Date is required"></datepicker-lite>
          </div>
          <div class="col">
            <datepicker-lite id="endDate"
                             label="End date"
                             value="{{event.end_date}}"
                             min-date="[[toDate(event.start_date)]]"
                             readonly="[[readonly]]"
                             required auto-validate
                             error-message="End Date is required"></datepicker-lite>
          </div>
        </div>
        <div class="row-h flex-c">
          <div class="col col-3">
            <etools-dropdown-lite id="region"
                                  readonly="[[readonly]]"
                                  required auto-validate
                                  label="Region"
                                  options="[[state.staticData.regions]]"
                                  selected="{{event.region}}">
            </etools-dropdown-lite>
          </div>

          <div class="col col-3">
            <etools-dropdown-lite id="country"
                                  readonly="[[readonly]]"
                                  disabled$="[[!event.region]]"
                                  label="Country"
                                  options="[[getCountriesForRegion(event.region, state.staticData.countries)]]"
                                  selected="{{event.country}}"
                                  required auto-validate
                                  error-message="Country is required">
            </etools-dropdown-lite>
          </div>

          <div class="col col-3">
            <paper-input  id="city"
                          label="City"
                          auto-validate
                          placeholder="&#8212;"
                          readonly$="[[readonly]]"
                          value="{{event.city}}"
                          required
                          error-message="City is required">
            </paper-input>
          </div>

          <div class="col col-3">
            <paper-input id="address"
                        type="text"
                        value="{{event.address}}"
                        readonly$="[[readonly]]"
                        label="Address"
                        placeholder="&#8212;">
            </paper-input>
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

        <div hidden$="[[useBasicLayout]]">
          <review-fields data="[[event]]" hidden$="[[hideReviewFields]]"></review-fields>
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
                            disabled$="[[!canSave(eventId, state.app.offline)]]">Save</paper-button>
              ${this.actionButtonsTemplate}
              <paper-button class="danger" raised on-tap="_navigateBack">
                Cancel
              </paper-button>
            </div>
          </div>
        </template>
        ${this.goToEditBtnTmpl}
      </div>
    `;
  }

  static get actionButtonsTemplate() {
    return html``;
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
      hideReviewFields: {
        type: Boolean,
        value: false
      },
      state: Object,
      store: Object,
      title: String,
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
      useBasicLayout: {
        type: Boolean,
        value: false
      },
      getCountriesForRegion: {
        type: Function,
        value: () => getCountriesForRegion
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
      return;
    }

    this.set('event', JSON.parse(JSON.stringify(selectEvent(this.state))));
  }

  // It was created offline and not yet saved on server or new
  _eventHasTempIdOrNew(eventId) {
    if (!eventId) {
      return true;
    }
    return isNaN(eventId);
  }

  // Only edit of unsynced and add new is possible offline
  canSave(eventId, offline) {
    return !offline || !eventId || isNaN(eventId);
  }


  _visibilityChanged(visible) {
    if (visible) {
      this.resetValidations();
    }
  }

  _stateChanged(state) {
    this.state = state;
  }

  validate() {
    return validateAllRequired(this);
  }

  resetValidations() {
    resetRequiredValidations(this);
  }

  _navigateBack() {
    window.history.back();
  }
}
