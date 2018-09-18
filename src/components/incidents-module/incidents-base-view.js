/**
 @license
 */
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-input/paper-textarea.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-checkbox/paper-checkbox.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import 'etools-info-tooltip/etools-info-tooltip.js';

import '../common/etools-dropdown/etools-dropdown-multi-lite.js';
import '../common/etools-dropdown/etools-dropdown-lite.js';
import '../common/datepicker-lite.js';
import '../common/errors-box.js';
import '../common/warn-message.js';
import { validateFields, resetFieldsValidations } from '../common/validations-helper.js';
import { store } from '../../redux/store.js';
import { IncidentModel } from './models/incident-model.js';
import { selectIncident } from '../../reducers/incidents.js';
import { fetchIncident } from '../../actions/incidents.js';
import { clearErrors } from '../../actions/errors.js';
import '../styles/shared-styles.js';
import '../styles/form-fields-styles.js';
import '../styles/grid-layout-styles.js';
import '../styles/required-fields-styles.js';

export class IncidentsBaseView extends connect(store)(PolymerElement) {
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

        fieldset .row-h:first-of-type {
          padding-top: 0px !important;
        }
      </style>

      <div class="card">
        ${this.getTitleTemplate}
        <div class="layout-horizontal">
          <errors-box></errors-box>
        </div>

        <fieldset>
          <legend><h3>Primary Person data</h3></legend>
          <div>
            <div class="row-h flex-c">
              <div class="col col-3">
                <etools-dropdown-lite id="primaryPerson"
                                      readonly="[[readonly]]"
                                      label="Primary person"
                                      trigger-value-change-event
                                      on-etools-selected-item-changed="_userSelected"
                                      options="[[staticData.users]]"
                                      selected="{{incident.primary_person.id}}"
                                      required auto-validate
                                      error-message="Primary person is required">
                </etools-dropdown-lite>
              </div>

              <div class="col col-3">
                <etools-dropdown-lite readonly="[[readonly]]"
                                      label="Agency"
                                      options="[[staticData.agencies]]"
                                      selected="{{incident.primary_person.agency}}">
                </etools-dropdown-lite>
              </div>

              <div class="col col-6">
                <paper-checkbox checked="{{incident.on_duty}}" disabled="[[readonly]]">On Duty</paper-checkbox>
              </div>

            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend><h3>When & Where</h3></legend>
          <div>
            <div class="row-h flex-c">
              <div class="col col-3">
                <datepicker-lite id="incidentDate"
                                value="{{incident.incident_date}}"
                                readonly="[[readonly]]"
                                label="Incident date"
                                required auto-validate
                                error-message="Incident date is required">
                </datepicker-lite>
              </div>
              <div class="col col-3">
                <paper-input id="incidentTime"
                            readonly$="[[readonly]]"
                            label="Incident time"
                            type="time"
                            value="{{incident.incident_time}}"
                            required auto-validate
                            error-message="Incident time is required">
                </paper-input>
              </div>
            </div>

          <div class="row-h flex-c">
            <div class="col col-3">
              <etools-dropdown-lite id="country"
                                    readonly="[[readonly]]"
                                    label="Country"
                                    options="[[staticData.countries]]"
                                    selected="{{incident.country}}"
                                    required auto-validate
                                    error-message="Country is required">
              </etools-dropdown-lite>
            </div>
            <div class="col col-3">
              <etools-dropdown-lite readonly="[[readonly]]"
                                    label="Region"
                                    options="[[staticData.regions]]"
                                    selected="{{incident.region}}">
              </etools-dropdown-lite>
            </div>

            <div class="col col-3">
              <paper-input id="city"
                          readonly$="[[readonly]]" label="City" type="text"
                          placeholder="&#8212;" value="{{incident.city}}"
                          required auto-validate
                          error-message="City is required"></paper-input>
            </div>

            <div class="col col-3">
              <paper-input id="street"
                          readonly$="[[readonly]]" label="Street" type="text"
                          placeholder="&#8212;" value="{{incident.street}}"
                          required auto-validate
                          error-message="Street is required"></paper-input>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend><h3>Incident details</h3></legend>
          <div>
            <div class="row-h flex-c">
              <div class="col col-3">
                <etools-info-tooltip class="info" open-on-click form-field-align
                                    hide-tooltip$="[[!selectedEvent.note]]">
                  <etools-dropdown-lite slot="field" readonly="[[readonly]]"
                                        label="Event"
                                        options="[[events]]"
                                        selected="{{incident.event}}"
                                        selected-item="{{selectedEvent}}">
                  </etools-dropdown-lite>
                  <span slot="message">[[selectedEvent.note]]</span>
                </etools-info-tooltip>
              </div>
              <div class="col col-3">
                <etools-info-tooltip class="info" open-on-click form-field-align
                                    hide-tooltip$="[[!selectedThreatCategory.description]]">
                  <etools-dropdown-lite id="threatCategory"
                                        slot="field"
                                        readonly="[[readonly]]"
                                        label="Threat category"
                                        options="[[staticData.threatCategories]]"
                                        selected="{{incident.threat_category}}"
                                        selected-item="{{selectedThreatCategory}}"
                                        required auto-validate
                                        error-message="Threat category is required">
                  </etools-dropdown-lite>
                  <span slot="message">[[selectedThreatCategory.description]]</span>
                </etools-info-tooltip>
              </div>
              <div class="col col-3">
                <etools-info-tooltip class="info" open-on-click form-field-align
                                    hide-tooltip$="[[!selectedTarget.description]]">
                  <etools-dropdown-lite id="target"
                                        slot="field"
                                        readonly="[[readonly]]"
                                        label="Target"
                                        options="[[staticData.targets]]"
                                        selected="{{incident.target}}"
                                        selected-item="{{selectedTarget}}"
                                        required auto-validate
                                        error-message="Target is required">
                  </etools-dropdown-lite>
                  <span slot="message">[[selectedTarget.description]]</span>
                </etools-info-tooltip>
              </div>
            </div>

            <div class="row-h flex-c">
              <div class="col col-3">
                <etools-info-tooltip class="info" open-on-click form-field-align
                                    hide-tooltip$="[[_hideInfoTooltip(selectedIncidentCategory.description,
                                      selectedIncidentCategory.comment)]]">
                  <etools-dropdown-lite id="incidentCat"
                                        slot="field"
                                        readonly="[[readonly]]"
                                        label="Incident category"
                                        options="[[staticData.incidentCategories]]"
                                        selected="{{incident.incident_category}}"
                                        selected-item="{{selectedIncidentCategory}}"
                                        required auto-validate
                                        error-message="Incident category is required">
                  </etools-dropdown-lite>
                  <span slot="message">[[selectedIncidentCategory.description]]<br>[[selectedIncidentCategory.comment]]
                  </span>
                </etools-info-tooltip>
              </div>

              <div class="col col-3">
                <etools-info-tooltip class="info" open-on-click form-field-align
                                    hide-tooltip$="[[_hideInfoTooltip(selectedIncidentSubcategory.description,
                                      selectedIncidentSubcategory.comment)]]">
                  <etools-dropdown-lite id="incidentSubcat"
                                        slot="field"
                                        readonly="[[readonly]]"
                                        label="Incident Subcategory"
                                        options="[[selectedIncidentCategory.subcategories]]"
                                        selected="{{incident.incident_subcategory}}"
                                        selected-item="{{selectedIncidentSubcategory}}"
                                        required auto-validate
                                        error-message="Incident subcategory is required">
                  </etools-dropdown-lite>
                  <span slot="message">
                    [[selectedIncidentSubcategory.description]]
                    <br>
                    [[selectedIncidentSubcategory.comment]]
                  </span>
                </etools-info-tooltip>
              </div>
            </div>

            <div class="row-h flex-c">
              <div class="col col-12">
                <paper-textarea id="injuries" readonly$="[[readonly]]" label="Injuries"
                                placeholder="&#8212;"
                                value="{{incident.injuries}}"
                                required auto-validate
                                error-message="Injuries details are required"></paper-textarea>
              </div>
            </div>

            <div class="row-h flex-c">
              <div class="col col-12">
                <paper-textarea id="description" readonly$="[[readonly]]" label="Incident Description"
                                placeholder="&#8212;"
                                value="{{incident.description}}"
                                required auto-validate
                                error-message="Description is required">
                </paper-textarea>
              </div>
            </div>

            <div class="row-h flex-c">
              <div class="col col-12">
                <paper-textarea readonly$="[[readonly]]" label="Incident Note"
                                placeholder="&#8212;"
                                value="{{incident.note}}"></paper-textarea>
              </div>
            </div>

            <div class="row-h flex-c">
              <div class="col col-3">
                <etools-info-tooltip class="info" open-on-click form-field-align
                                    hide-tooltip$="[[!selectedCriticality.description]]">
                  <etools-dropdown-lite slot="field" readonly="[[readonly]]"
                                        label="Criticality"
                                        options="[[staticData.criticalities]]"
                                        selected="{{incident.criticality}}"
                                        selected-item="{{selectedCriticality}}">
                  </etools-dropdown-lite>
                  <span slot="message">[[selectedCriticality.description]]</span>
                </etools-info-tooltip>
              </div>
              <div class="col col-9" hidden$="[[!incident.incident_category]]">
                <etools-dropdown-multi-lite hidden$="[[isAccident(incident.incident_category, staticData)]]"
                                            readonly="[[readonly]]"
                                            label="Weapons used"
                                            options="[[staticData.weapons]]"
                                            selected-values="{{incident.weapons_used}}">
                </etools-dropdown-multi-lite>
              </div>
            </div>

            <div class="row-h flex-c" hidden$="[[!isAccident(incident.incident_category, staticData)]]">
              <div class="col col-3">
                <etools-dropdown-lite readonly="[[readonly]]"
                                      label="Vehicle Type"
                                      options="[[staticData.vehicleTypes]]"
                                      selected="{{incident.vehicle_type}}">
                </etools-dropdown-lite>
              </div>
              <div class="col col-3">
                <etools-dropdown-lite readonly="[[readonly]]"
                                      label="Contributing factor"
                                      options="[[staticData.factors]]"
                                      selected="{{incident.contributing_factor}}">
                </etools-dropdown-lite>
              </div>
              <div class="col col-3">
                <etools-dropdown-lite readonly="[[readonly]]"
                                      label="Crash Type"
                                      options="[[staticData.crashTypes]]"
                                      selected="{{incident.crash_type}}">
                </etools-dropdown-lite>
              </div>
              <div class="col col-3">
                <paper-checkbox hidden$="[[!isAccident(incident.incident_category)]]"
                                checked="{{incident.near_miss}}"
                                disabled="[[readonly]]">
                  Near miss
                </paper-checkbox>
              </div>
            </div>

            <div class="row-h flex-c">
              <div class="col col-3">
                <paper-checkbox checked="{{incident.reported}}" disabled="[[readonly]]">
                  Reported to police
                </paper-checkbox>
              </div>
              <div class="col col-3" hidden$="[[isNotReported(incident.reported)]]">
                <paper-input readonly$="[[readonly]]" label="Reported to"
                            type="text" value="{{incident.reported_to}}"
                            placeholder="&#8212;"></paper-input>
              </div>
              <div class="col col-3" hidden$="[[isNotReported(incident.reported)]]">
                <paper-input readonly$="[[readonly]]"
                            label="Responsible party" type="text" value="{{incident.responsible}}"
                            placeholder="&#8212;"></paper-input>
              </div>
            </div>
          </div>
        </fieldset>

        <template is="dom-if" if="[[!readonly]]">
          <div class="row-h flex-c" hidden$="[[!state.app.offline]]">
            <warn-message hidden$="[[!_incidentHasTempIdOrNew(incidentId)]]"
                          message="Because there is no internet connenction the incident will be saved offine for now,
                                   and you must sync it manually by saving it again when online">
            </warn-message>
            <warn-message hidden$="[[_incidentHasTempIdOrNew(incidentId)]]"
                          message="Can't edit a synced incident while offline">
            </warn-message>
          </div>

          <div class="row-h flex-c" hidden$="[[!eventNotOk(incident.event, state.app.offline)]]">
            <warn-message message="Can't save, selected event must be synced first"></warn-message>
          </div>

          <div class="row-h flex-c">
            <div class="col col-12">
              <paper-button raised
                            on-click="save"
                            disabled$="[[canNotSave(incident.event, state.app.offline, incidentId)]]">
                Save
              </paper-button>
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
      staticData: Object,
      title: String,
      state: Object,
      store: Object,
      incident: {
        type: Object,
        value: () => JSON.parse(JSON.stringify(IncidentModel))
      },
      incidentId: {
        type: Number,
        computed: '_setIncidentId(state.app.locationInfo.incidentId)',
        observer: '_idChanged'
      },
      onDuty: {
        type: Array,
        value: [
          {id: true, name: 'On Duty'},
          {id: false, name: 'Off Duty'}
        ]
      },
      reported: {
        type: Array,
        value: [
          {id: true, name: 'Reported'},
          {id: false, name: 'Not Reported'}
        ]
      },
      events: {
        type: Array,
        value: []
      },
      readonly: {
        type: Boolean,
        value: false
      },
      visible: {
        type: Boolean,
        value: false,
        observer: '_visibilityChanged'
      },
      selectedEvent: {
        type: Object,
        value: {}
      },
      selectedIncidentCategory: {
        type: Object,
        value: {},
        observer: 'selIncidentCategChanged'
      },
      selectedIncidentSubcategory: {
        type: Object,
        value: {}
      },
      selectedThreatCategory: {
        type: Object,
        value: {}
      },
      selectedTarget: {
        type: Object,
        value: {}
      },
      selectedCriticality: {
        type: Object,
        value: {}
      },
      fieldsToValidateSelectors: {
        type: Array,
        value: ['#primaryPerson', '#incidentDate', '#incidentTime', '#country', '#street',
          '#city', '#incidentCat', '#incidentSubcat', '#description', '#injuries', '#target', '#threatCategory']
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

  _setIncidentId(id) {
    return id;
  }

  _idChanged(newId) {
    if (!this.isOnExpectedPage(this.state)) {
      return;
    }

    if (!newId) {
      this.incident = JSON.parse(JSON.stringify(IncidentModel));
      return;
    }

    this.incident = JSON.parse(JSON.stringify(selectIncident(this.state)));


    if (!this.isOfflineOrUnsynced()) {
      this.store.dispatch(fetchIncident(this.incidentId));
    }
  }

  // It was created offline and not yet saved on server or new
  _incidentHasTempIdOrNew(incidentId) {
    if (!incidentId) {
      return true;
    }
    return isNaN(incidentId);
  }

  _visibilityChanged(visible) {
    if (visible) {
      this.resetValidations();
    }
    if (visible === false) {
      store.dispatch(clearErrors());
    }
  }

  isOfflineOrUnsynced() {
    return this.state.app.offline || (this.incident && this.incident.unsynced);
  }

  _userSelected(event) {
    if (!event.detail.selectedItem) {
      return;
    }
    this.incident.primary_person.id = event.detail.selectedItem.id;
    this.incident.primary_person.first_name = event.detail.selectedItem.first_name;
    this.incident.primary_person.last_name = event.detail.selectedItem.last_name;
  }

  _stateChanged(state) {
    this.state = state;

    if (!this.isOnExpectedPage(this.state)) {
      return;
    }

    this.staticData = state.staticData;

    this.events = state.events.list.map((elem) => {
      elem.name = elem.description;
      return elem;
    });
  }

  selIncidentCategChanged(incidentCategory) {
    if (!this.incident || !this.incident.incident_subcategory) {
      return;
    }
    let selSubcategIsValid = incidentCategory.subcategories.find(s => s.id == this.incident.incident_subcategory);
    if (!selSubcategIsValid) {
      this.set('incident.incident_subcategory', null);
    }
  }

  isNotReported(reported) {
    return reported === false;
  }

  isAccident(incidentCategoryId) {
    if (!this.staticData) {
      return false;
    }

    let incident = this.staticData.incidentCategories.find((elem) => {
      return elem.id === incidentCategoryId;
    });

    return incident && incident.name.startsWith('Accident');
  }

  eventNotOk(eventId, offline) {
    if (!eventId || !this.events) {
      return false;
    }
    let selectedEvent = this.events.find(event => event.id === eventId);

    return !offline && (selectedEvent && selectedEvent.unsynced);
  }

  // Only edit of unsynced and add new is possible offline
  canNotSave(eventId, offline, incidentId) {
    if (this.eventNotOk(eventId, offline)) {
      return true;
    }
    return (offline && !!incidentId && !isNaN(incidentId));
  }

  _hideInfoTooltip(...arg) {
    return !arg.some(a => typeof a === 'string' && a !== '');
  }

  validate() {
    return validateFields(this, this.fieldsToValidateSelectors);
  }

  resetValidations() {
    resetFieldsValidations(this, this.fieldsToValidateSelectors);
  }

}
