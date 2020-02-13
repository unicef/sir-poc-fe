/**
 @license
 */

import { html } from '@polymer/polymer/polymer-element.js';
import { getCountriesForRegion } from '../common/utils.js';
import { PermissionsBase } from '../common/permissions-base-class';
import { connect } from 'pwa-helpers/connect-mixin.js';

import '@polymer/paper-input/paper-textarea.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/iron-icons/device-icons.js';
import '@unicef-polymer/etools-date-time/datepicker-lite.js';
import '@unicef-polymer/etools-dropdown/etools-dropdown.js';
import '@unicef-polymer/etools-info-tooltip/etools-info-tooltip.js';

import { selectEvent } from '../../reducers/events.js';
import { store } from '../../redux/store.js';
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

        paper-input {
          width: 100%;
        }

        #get-location {
          margin-left: 16px;
        }
      </style>

      <div class="card">
        ${this.getTitleTemplate}

        <div class="layout-horizontal">
          <errors-box></errors-box>
        </div>

        <div class="row-h flex-c">
          <div class="col col-4">
            <etools-info-tooltip class="info" open-on-click form-field-align
                                hide-tooltip$="[[_hideInfoTooltip(selectedEventCategory.description,
                                  selectedEventCategory.comment)]]">
              <etools-dropdown id="eventCat"
                                slot="field"
                                readonly="[[readonly]]"
                                label="Event Category"
                                option-label="name"
                                option-value="id"
                                options="[[staticData.incidentCategories]]"
                                selected="{{event.event_category}}"
                                selected-item="{{selectedEventCategory}}">
              </etools-dropdown>
              <span slot="message">[[selectedEventCategory.description]]<br>[[selectedEventCategory.comment]]
              </span>
            </etools-info-tooltip>
          </div>

          <div class="col col-4">
            <etools-info-tooltip class="info" open-on-click form-field-align
                                hide-tooltip$="[[_hideInfoTooltip(selectedEventSubcategory.description,
                                  selectedEventSubcategory.comment)]]">
              <etools-dropdown id="eventSubcat"
                                slot="field"
                                readonly="[[readonly]]"
                                label="Event Subcategory"
                                option-label="name"
                                option-value="id"
                                options="[[selectedEventCategory.subcategories]]"
                                selected="{{event.event_subcategory}}"
                                selected-item="{{selectedEventSubcategory}}">
              </etools-dropdown>
              <span slot="message">
                [[selectedEventSubcategory.description]]
                <br>
                [[selectedEventSubcategory.comment]]
              </span>
            </etools-info-tooltip>
          </div>

          <div class="col col-4">
            <etools-info-tooltip class="info" open-on-click form-field-align
                                hide-tooltip$="[[!selectedThreatCategory.description]]">
              <etools-dropdown id="threatCategory"
                                slot="field"
                                readonly="[[readonly]]"
                                label="Threat Category"
                                option-label="name"
                                option-value="id"
                                options="[[staticData.threatCategories]]"
                                selected="{{event.threat_category}}"
                                selected-item="{{selectedThreatCategory}}">
              </etools-dropdown>
              <span slot="message">[[selectedThreatCategory.description]]</span>
            </etools-info-tooltip>
          </div>
        </div>

        <template is="dom-if" if="[[isSpecialConditionSubcategory(selectedEventSubcategory)]]">
          <div class="row-h flex-c" hidden$="[[useBasicLayout]]">
            <div class="alert-text">
              ALERT: In an effort to protect the identity of victims, the ONLY required fields for the
              [[selectedEventSubcategory.name]] subcategory are Event Description, Region, Event Date, and Event Time.
              All other information is VOLUNTARY.
            </div>
          </div>
        </template>

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

        <div class="row-h flex-c">
          <div class="col col-12">
            <paper-textarea label="Note" readonly$="[[readonly]]" placeholder="&#8212;"
                            value="{{event.note}}"></paper-textarea>
          </div>
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
          <div class="col col-3">
            <etools-dropdown id="region"
                              readonly="[[readonly]]"
                              required auto-validate
                              label="Region"
                              option-label="name"
                              option-value="id"
                              options="[[state.staticData.regions]]"
                              selected="{{event.region}}">
            </etools-dropdown>
          </div>
          <div class="col col-3">
            <etools-dropdown id="country"
                              readonly="[[readonly]]"
                              disabled$="[[!event.region]]"
                              label="Country"
                              option-label="name"
                              option-value="id"
                              options="[[getCountriesForRegion(event.region, state.staticData.countries)]]"
                              selected="{{event.country}}"
                              auto-validate
                              error-message="Country is required">
            </etools-dropdown>
          </div>
        </div>

        <div class="row-h flex-c">
          <div class="col col-3">
            <paper-input  id="city"
                          label="City"
                          auto-validate
                          placeholder="&#8212;"
                          readonly$="[[readonly]]"
                          value="{{event.city}}"
                          error-message="City is required">
            </paper-input>
          </div>

          <div class="col col-3">
            <paper-input id="address"
                        type="text"
                        value="{{event.location}}"
                        readonly$="[[readonly]]"
                        label="Address"
                        placeholder="&#8212;">
            </paper-input>
          </div>

          <template is="dom-if" if="[[readonly]]">
            <div class="col col-3">
              <paper-input label="Latitude"
                          readonly
                          value="[[event.latitude]]"
                          placeholder="&#8212;">
              </paper-input>
            </div>
            <div class="col col-3">
              <paper-input label="Longitude"
                          readonly
                          value="[[event.longitude]]"
                          placeholder="&#8212;" >
              </paper-input>
            </div>
          </template>

          <template is="dom-if" if="[[!readonly]]">
            <div class="col col-2">
              <paper-input label="Latitude"
                          type="number"
                          value="{{event.latitude}}"
                          placeholder="&#8212;">
              </paper-input>
            </div>
            <div class="col col-2">
              <paper-input label="Longitude"
                          type="number"
                          value="{{event.longitude}}"
                          placeholder="&#8212;">
              </paper-input>
            </div>
            <div class="col col-2">
              <paper-button id="locationButton" raised on-tap="getLocation" class="white no-t-transform">
                <iron-icon icon="device:gps-fixed">
                </iron-icon>
                Use device location
              </paper-button>
            </div>
          </template>
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
      staticData: Object,
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
      },
      selectedEventCategory: {
        type: Object,
        value: {},
        observer: 'selEventCategChanged'
      },
      selectedEventSubcategory: {
        type: Object,
        value: {}
      },
      selectedThreatCategory: {
        type: Object,
        value: {}
      },
      specialConditionSubcategories: {
        type: Array,
        value: ['Sexual assault', 'Sexual harassment', 'Rape']
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

  selEventCategChanged(eventCategory) {
    if (!this.event || !this.event.event_subcategory) {
      return;
    }
    let selSubcategIsValid = eventCategory.subcategories.find(s => s.id == this.event.event_subcategory);
    if (!selSubcategIsValid) {
      this.set('event.event_subcategory', null);
    }
  }

  _visibilityChanged(visible) {
    if (visible) {
      this.resetValidations();
    }
  }

  _stateChanged(state) {
    this.state = state;
    this.staticData = state.staticData;
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

  _hideInfoTooltip(...arg) {
    return !arg.some(a => typeof a === 'string' && a !== '');
  }

  getLocation() {
    navigator.geolocation.getCurrentPosition((position) => {
      let latitude = Math.round(position.coords.latitude * 1000000) / 1000000;
      let longitude = Math.round(position.coords.longitude * 1000000) / 1000000;

      this.set('event.latitude', String(latitude));
      this.set('event.longitude', String(longitude));
    }, (error) => {
      console.warn('location fetch error:', error);
    });
  }

  isSpecialConditionSubcategory(selectedEventSubcategory) {
    if (!this.selectedEventSubcategory) {
      return false;
    }
    return this.specialConditionSubcategories.indexOf(selectedEventSubcategory.name) > -1;
  }
}
