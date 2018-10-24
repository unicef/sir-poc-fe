/**
 @license
 */
import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import {connect} from 'pwa-helpers/connect-mixin.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-input/paper-textarea.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-checkbox/paper-checkbox.js';
import '@polymer/iron-icons/device-icons.js';
import '@polymer/iron-media-query/iron-media-query.js';

import 'etools-upload/etools-upload-multi.js';
import 'etools-data-table/etools-data-table.js';
import 'etools-info-tooltip/etools-info-tooltip.js';
import 'etools-date-time/datepicker-lite.js';
import 'etools-date-time/time-input.js';

import '../common/etools-dropdown/etools-dropdown-multi-lite.js';
import '../common/etools-dropdown/etools-dropdown-lite.js';
import '../common/errors-box.js';
import '../common/warn-message.js';
import '../common/review-fields.js';
import {validateAllRequired, resetRequiredValidations} from '../common/validations-helper.js';
import {makeRequest, handleBlobDataReceivedAndStartDownload } from '../common/request-helper.js';
import {store} from '../../redux/store.js';
import {selectIncident} from '../../reducers/incidents.js';

import {fetchIncident} from '../../actions/incidents.js';
import {clearErrors, serverError} from '../../actions/errors.js';
import '../styles/shared-styles.js';
import '../styles/form-fields-styles.js';
import '../styles/grid-layout-styles.js';
import '../styles/required-fields-styles.js';
import {Endpoints} from '../../config/endpoints';
import {updatePath} from '../common/navigation-helper';
import {showSnackbar} from '../../actions/app.js';
import {SirMsalAuth} from '../auth/jwt/msal-authentication';

export class IncidentsBaseView extends connect(store)(PolymerElement) {
  static get template() {
    // language=HTML
    return html`
      <style include="shared-styles form-fields-styles grid-layout-styles required-fields-styles data-table-styles">
        :host {
          @apply --layout-vertical;
        }

        errors-box {
          margin: 0 24px;
        }

        fieldset .row-h:first-of-type {
          padding-top: 0px !important;
        }

        .padd-top {
          padding-top: 24px;
        }

        .margin-b {
          margin-bottom: 16px;
        }

        paper-input {
          width: 100%;
        }

        #get-location {
          margin-left: 16px;
        }

        .buttons-area paper-button:not(:first-child) {
          margin-left: 4px;
        }

      </style>

      <iron-media-query query="(max-width: 767px)" query-matches="{{lowResolutionLayout}}"></iron-media-query>

      <div class="card">
        ${this.getTitleTemplate}
        <div class="layout-horizontal">
          <errors-box></errors-box>
        </div>

        <div class="row-h flex-c">
          <div class="col col-12">
            ${this.saveBtnTmpl}
            ${this.submitBtnTmpl}
          </div>
        </div>

        <fieldset>
          <legend><h3>Incident Details</h3></legend>
          <div>
            <div class="row-h flex-c p-relative">
              <div class="col col-4">
                <etools-info-tooltip class="info" open-on-click form-field-align
                                    hide-tooltip$="[[!selectedEvent.note]]">
                  <etools-dropdown-lite slot="field" readonly="[[readonly]]"
                                        label="Event"
                                        options="[[events]]"
                                        selected="{{incident.event}}"
                                        enable-none-option
                                        selected-item="{{selectedEvent}}">
                  </etools-dropdown-lite>
                  <span slot="message">[[selectedEvent.note]]</span>
                </etools-info-tooltip>
              </div>
              <div class="col col-4">
                <etools-info-tooltip class="info" open-on-click form-field-align
                                    hide-tooltip$="[[!selectedThreatCategory.description]]">
                  <etools-dropdown-lite id="threatCategory"
                                        slot="field"
                                        readonly="[[readonly]]"
                                        label="Threat Category"
                                        options="[[staticData.threatCategories]]"
                                        selected="{{incident.threat_category}}"
                                        selected-item="{{selectedThreatCategory}}"
                                        required auto-validate
                                        error-message="Threat category is required">
                  </etools-dropdown-lite>
                  <span slot="message">[[selectedThreatCategory.description]]</span>
                </etools-info-tooltip>
              </div>
              <div class="col col-4">
                <etools-info-tooltip class="info" open-on-click form-field-align
                                    hide-tooltip$="[[!selectedTarget.description]]">
                  <etools-dropdown-lite id="target"
                                        slot="field"
                                        readonly="[[readonly]]"
                                        label="Target"
                                        options="[[staticData.targets]]"
                                        selected="{{incident.target}}"
                                        selected-item="{{selectedTarget}}"
                                        required$="[[!isSexualAssault(selectedIncidentSubcategory)]]" auto-validate
                                        error-message="Target is required">
                  </etools-dropdown-lite>
                  <span slot="message">[[selectedTarget.description]]</span>
                </etools-info-tooltip>
              </div>
            </div>

            <div class="row-h flex-c p-relative">
              <div class="col col-4">
                <etools-info-tooltip class="info" open-on-click form-field-align
                                    hide-tooltip$="[[_hideInfoTooltip(selectedIncidentCategory.description,
                                      selectedIncidentCategory.comment)]]">
                  <etools-dropdown-lite id="incidentCat"
                                        slot="field"
                                        readonly="[[readonly]]"
                                        label="Incident Category"
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

              <div class="col col-4">
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

            <template is="dom-if" if="[[isSexualAssault(selectedIncidentSubcategory)]]">
              <div class="row-h flex-c">
                <div class="alert-text">
                  ALERT: In an effort to protect the identity of victims, the ONLY required feilds for the
                  sexual assault subcategory are Threat Category, Incident Category, Incident Subcategory, Incident
                  Description, Region, Country, Incident Date, and Incident Time. The victim should be informed that
                  all other information is VOLUNTARY.
                </div>
              </div>
            </template>

            <template is="dom-if" if="[[isTrafficAccident(selectedIncidentSubcategory, staticData)]]" restamp>
              <div class="row-h flex-c">
                <div class="col col-4">
                  <etools-dropdown-lite readonly="[[readonly]]"
                                        label="Vehicle Type"
                                        options="[[staticData.vehicleTypes]]"
                                        required auto-validate
                                        selected="{{incident.vehicle_type}}">
                  </etools-dropdown-lite>
                </div>
                <div class="col col-4">
                  <etools-dropdown-lite readonly="[[readonly]]"
                                        label="Crash Type"
                                        options="[[staticData.crashTypes]]"
                                        required auto-validate
                                        selected="{{incident.crash_type}}">
                  </etools-dropdown-lite>
                </div>
                <div class="col col-4">
                  <etools-dropdown-lite readonly="[[readonly]]"
                                        hidden$="[[isCrashTypeOther(incident.crash_type)]]"
                                        label="Crash Subtype"
                                        options="[[showSubType(incident.crash_type)]]"
                                        option-value="name"
                                        required auto-validate
                                        selected="{{incident.crash_sub_type}}">
                  </etools-dropdown-lite>
                  <paper-input readonly="[[readonly]]"
                              label="Crash Subtype"
                              type="text"
                              placeholder="&#8212;"
                              value="{{incident.crash_sub_type}}"
                              hidden$="[[!isCrashTypeOther(incident.crash_type)]]"
                              required$="[[isCrashTypeOther(incident.crash_type)]]"
                              auto-validate>
                  </paper-input>
                </div>
              </div>
              <div class="row-h flex-c">
                <div class="col col-4">
                  <etools-dropdown-lite readonly="[[readonly]]"
                                        label="Contributing factor"
                                        options="[[staticData.factors]]"
                                        required auto-validate
                                        selected="{{incident.contributing_factor}}">
                  </etools-dropdown-lite>
                </div>
                <div class="col col-3">
                  <paper-checkbox checked="{{incident.near_miss}}"
                                  disabled="[[readonly]]">
                    Near miss
                  </paper-checkbox>
                </div>
              </div>
            </template>

            <div class="row-h flex-c">
              <div class="col col-12">
                <paper-textarea id="injuries" readonly$="[[readonly]]" label="Injuries"
                                placeholder="&#8212;"
                                value="{{incident.injuries}}"
                                required$="[[!isSexualAssault(selectedIncidentSubcategory)]]" auto-validate
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
              <div class="col col-3 p-relative">
                <etools-info-tooltip class="info" open-on-click form-field-align
                                    hide-tooltip$="[[!selectedCriticality.description]]">
                  <etools-dropdown-lite slot="field" readonly="[[readonly]]"
                                        label="Criticality"
                                        options="[[staticData.criticalities]]"
                                        selected="{{incident.criticality}}"
                                        enable-none-option
                                        selected-item="{{selectedCriticality}}">
                  </etools-dropdown-lite>
                  <span slot="message">[[selectedCriticality.description]]</span>
                </etools-info-tooltip>
              </div>
              <div class="col col-3" hidden$="[[isSafetyIncident(selectedIncidentCategory)]]">
                <etools-dropdown-multi-lite hidden$="[[isSafetyIncident(selectedIncidentCategory)]]"
                                            readonly="[[readonly]]"
                                            label="Weapons used"
                                            options="[[staticData.weapons]]"
                                            selected-values="{{incident.weapons_used}}">
                </etools-dropdown-multi-lite>
              </div>
              <div class="col col-3">
                <paper-checkbox checked="{{pressCoverageSelected}}" disabled="[[readonly]]">
                  Press Coverage?
                </paper-checkbox>
              </div>
              <div class="col col-3">
                <paper-input value="{{incident.press_coverage}}"
                             placeholder="&#8212;"
                             label="Press Coverage Description"
                             hidden$="[[!pressCoverageSelected]]"
                             readonly="[[readonly]]"
                             required$="[[pressCoverageSelected]]">
                </paper-input>
              </div>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend><h3>When & Where</h3></legend>
          <div>
            <div class="row-h flex-c">
              <div class="col col-3">
                <etools-dropdown-lite id="region"
                                      readonly="[[readonly]]"
                                      required auto-validate
                                      label="Region"
                                      options="[[staticData.regions]]"
                                      selected="{{incident.region}}">
                </etools-dropdown-lite>
              </div>

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
                <etools-dropdown-lite
                            id="city"
                            label="City"
                            auto-validate
                            readonly="[[readonly]]"
                            options="[[staticData.cities]]"
                            selected="{{incident.city}}"
                            required$="[[!isSexualAssault(selectedIncidentSubcategory)]]"
                            error-message="City is required">
                </etools-dropdown-lite>
              </div>

              <div class="col col-3">
                <paper-input id="street"
                            readonly$="[[readonly]]" label="Street" type="text"
                            placeholder="&#8212;" value="{{incident.street}}"
                            error-message="Street is required"></paper-input>
              </div>
            </div>
          </div>

          <div>
            <div class="row-h flex-c">
              <div class="col col-3">
                <datepicker-lite id="incidentDate"
                                value="{{incident.incident_date}}"
                                readonly="[[readonly]]"
                                label="Incident Date"
                                required
                                error-message="Incident date is required">
                </datepicker-lite>
              </div>

              <div class="col col-3">
                <time-input id="incidentTime"
                            readonly$="[[readonly]]"
                            label="Incident Time"
                            value="{{incident.incident_time}}"
                            required auto-validate
                            error-message="Incident time is required">
                </time-input>
              </div>

              <template is="dom-if" if="[[readonly]]">
                <div class="col col-3">
                  <paper-input label="Latitude"
                              readonly
                              value="[[incident.latitude]]"
                              placeholder="&#8212;">
                  </paper-input>
                </div>
                <div class="col col-3">
                  <paper-input label="Longitude"
                              readonly
                              value="[[incident.longitude]]"
                              placeholder="&#8212;" >
                  </paper-input>
                </div>
              </template>

              <template is="dom-if" if="[[!readonly]]">
                <div class="col col-3">
                  <paper-input label="Latitude"
                              type="number"
                              value="{{incident.latitude}}"
                              placeholder="&#8212;">
                  </paper-input>
                </div>
                <div class="col col-3 layout-horizontal layout-center justified">
                  <paper-input label="Longitude"
                              type="number"
                              value="{{incident.longitude}}"
                              placeholder="&#8212;">
                  </paper-input>

                  <paper-icon-button id="get-location"
                                     on-tap="getLocation"
                                     title="Use device location"
                                     icon="device:gps-fixed">
                  </paper-icon-button>
                </div>

              </template>

            </div>
          </div>

        </fieldset>
        <fieldset>
          <div hidden$="[[hideReviewFields]]">
            <review-fields data="[[incident]]"></review-fields>
          </div>
        </fieldset>

        <template is="dom-if" if="[[_showRelatedDocsSection(incidentId, readonly, incident)]]">
          <fieldset>
            <legend><h3>Related documents</h3></legend>
            <div class="margin-b" hidden$="[[hideUploadBtn(readonly, state.app.offline, incident.unsynced)]]">
              <etools-upload-multi
                  endpoint-info="[[getAttachmentInfo(incidentId)]]" on-upload-finished="handleUploadedFiles"
                  jwt-local-storage-key="[[jwtLocalStorageKey]]">
              </etools-upload-multi>
            </div>
            <div hidden$="[[hideAttachmentsList(incident, incident.attachments, incident.attachments.length)]]">
              <etools-data-table-header no-collapse no-title low-resolution-layout="[[lowResolutionLayout]]">

                <etools-data-table-column class="col-4">
                  File
                </etools-data-table-column>
                <etools-data-table-column class="col-7">
                  Note
                </etools-data-table-column>

              </etools-data-table-header>

              <template is="dom-repeat" items="[[incident.attachments]]">
                <etools-data-table-row no-collapse low-resolution-layout="[[lowResolutionLayout]]">
                  <div slot="row-data">
                    <span class="col-data col-4 break-word"
                          title="[[getFilenameFromURL(item.attachment)]]"
                          data-col-header-label="File">
                      <span>
                        <a href='' data-url$="[[item.attachment]]" on-click="dwRelatedDoc">
                           [[getFilenameFromURL(item.attachment)]]
                        </a>
                      </span>
                    </span>
                    <span class="col-data col-7" title="[[item.note]]" data-col-header-label="Note">
                      <paper-input no-label-float readonly$="[[readonly]]" value="{{item.note}}" placeholder="&#8212;">
                      </paper-input>
                    </span>
                  </div>
                </etools-data-table-row>
              </template>
            </div>
          </fieldset>
        </template>

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

        </template>

        <div class="row-h flex-c padd-top buttons-area">
          ${this.saveBtnTmpl}
          ${this.actionButtonsTemplate}
          ${this.goToEditBtnTmpl}
          ${this.submitIncidentTmpl}
          <paper-button class="danger" raised on-tap="_returnToIncidentsList">
            Cancel
          </paper-button>
        </div>
      </div>
    `;
  }

  static get saveBtnTmpl() {
    return html`
      <paper-button raised
                    on-tap="save"
                    hidden$="[[readonly]]"
                    disabled$="[[!canSave(incident.event, state.app.offline, incidentId)]]">
        Save as Draft
      </paper-button>
    `;
  }

  static get submitBtnTmpl() {
    return html``;
  }

  static get submitIncidentTmpl() {
    return html``;
  }

  static get goToEditBtnTmpl() {
    return html``;
  }

  static get actionButtonsTemplate() {
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
        observer: 'incidentChanged'
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
      events: {
        type: Array,
        value: []
      },
      readonly: {
        type: Boolean,
        value: false
      },
      hideReviewFields: {
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
      pressCoverageSelected: {
        type: Boolean,
        value: false,
        observer: 'pressCoverageChanged'
      },
      lowResolutionLayout: Boolean,
      jwtLocalStorageKey: {
        type: String,
        value: ''
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
    this.jwtLocalStorageKey = SirMsalAuth.config.token_l_storage_key;
  }

  incidentChanged() {
    if (this.incident.press_coverage) {
      this.set('pressCoverageSelected', true);
    }
  }

  _setIncidentId(id) {
    return id;
  }

  _idChanged(newId) {
    if (!newId) {
      return;
    }

    this.incident = JSON.parse(JSON.stringify(selectIncident(this.state)));
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

  }

  _stateChanged(state) {
    this.state = state;

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

  isTrafficAccident(incidentSubcategory) {
    if (!incidentSubcategory) {
      return false;
    }

    if (!this.staticData) {
      return false;
    }

    let incident = this.getSafetyCategory().subcategories.find(elem => elem.id === incidentSubcategory.id);

    return incident && incident.name === 'Road Traffic Accidents';
  }

  getSafetyCategory() {
    return this.staticData.incidentCategories.find(elem => elem.name === 'Safety');
  }

  showSubType(crashType) {
    return this.staticData.crashSubTypes.filter(subType => crashType === subType.crash_type);
  }

  isCrashTypeOther(crashType) {
    return crashType === 5;
  }

  isSafetyIncident(incidentCategory) {
    if (!incidentCategory) {
      return true;
    }

    return incidentCategory.name === 'Safety';
  }

  // clears press_coverage field if checkbox is unchecked
  pressCoverageChanged() {
    if (!this.incident) {
      return;
    }
    if (this.incident.press_coverage && !this.pressCoverageSelected) {
      this.set('incident.press_coverage', '');
    }
  }

  isSexualAssault(selectedIncidentSubcategory) {
    if (this.selectedIncidentSubcategory) {
      return selectedIncidentSubcategory.name === 'Sexual assault';
    }
  }

  eventNotOk(eventId, offline) {
    if (!eventId || !this.events) {
      return false;
    }
    let selectedEvent = this.events.find(event => event.id === eventId);

    return !offline && (selectedEvent && selectedEvent.unsynced);
  }

  // Only edit of unsynced and add new is possible offline
  canSave(eventId, offline, incidentId) {
    if (this.eventNotOk(eventId, offline)) {
      return false;
    }
    return !offline || !incidentId || isNaN(incidentId);
  }

  canEdit(offline, status, unsynced) {
    return !!unsynced || (status === 'created' && !offline);
  }

  _hideInfoTooltip(...arg) {
    return !arg.some(a => typeof a === 'string' && a !== '');
  }

  validate() {
    return validateAllRequired(this);
  }

  resetValidations() {
    resetRequiredValidations(this);
  }

  getFilenameFromURL(url) {
    if (!url) {
      return '';
    }
    return url.split('?')[0].split('/').pop();
  }

  getAttachmentInfo(incidentId) {
    return {
      endpoint: Endpoints.addIncidentAttachments.url,
      extraInfo: {
        incident: incidentId
      },
      rawFilePropertyName: 'attachment'
    };
  }

  hideUploadBtn(readonly, offline, unsynced) {
    return readonly || offline || unsynced;
  }

  hideAttachmentsList(incident, att, attLenght) {
    if (!incident) {
      return true;
    }

    if (!att || !att.length) {
      return true;
    }
    return false;
  }

  handleUploadedFiles(ev) {
    if (!ev.detail) {
      return;
    }
    if (ev.detail.error) {
      this.store.dispatch(serverError(ev.detail.error));
    }
    if (!ev.detail.success || !ev.detail.success.length) {
      return;
    }
    let uploadedFiles = ev.detail.success;
    if (!this.incident.attachments) {
      this.incident.attachments = [];
    }
    uploadedFiles.forEach((fileinfo) => {
      this.push('incident.attachments', JSON.parse(fileinfo));
    });

    this.store.dispatch(fetchIncident(this.incidentId));
  }

  getLocation() {
    navigator.geolocation.getCurrentPosition((position) => {
      let latitude = Math.round(position.coords.latitude * 1000000) / 1000000;
      let longitude = Math.round(position.coords.longitude * 1000000) / 1000000;

      this.set('incident.latitude', String(latitude));
      this.set('incident.longitude', String(longitude));
    }, (error) => {
      console.warn('location fetch error:', error);
    });
  }

  _showRelatedDocsSection(incidentId, readonly, incident) {
    if (!incidentId || isNaN(incidentId)) {
      return false;
    }
    return !(readonly && (!this.incident || !this.incident.attachments || !this.incident.attachments.length));
  }

  _returnToIncidentsList() {
    updatePath('/incidents/list/');
  }

  dwRelatedDoc(e) {
    e.preventDefault();
    let url = e.target.getAttribute('data-url');
    if (!url) {
      return;
    }
    let reqOptions = {
      url: url,
      handleAs: 'blob',
      method: 'GET'
    };
    makeRequest(reqOptions).then((blob) => {
      handleBlobDataReceivedAndStartDownload(blob, this.getFilenameFromURL(url));
    }).catch((error) => {
      // eslint-disable-next-line
      console.error(error);
      store.dispatch(showSnackbar('An error occurred on downloading!'));
    });
  }

}
