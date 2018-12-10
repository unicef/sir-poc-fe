/**
 * @license
 */
import { html } from '@polymer/polymer/polymer-element.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-input/paper-textarea.js';
import 'etools-date-time/datepicker-lite.js';
import { showSnackbar } from '../../../../actions/app.js';

import {
  addEvacuation,
  editEvacuation,
  syncEvacuation
} from '../../../../actions/incident-impacts.js';
import { store } from '../../../../redux/store.js';
import { scrollToTop } from '../../../common/content-container-helper.js';
import {
  resetFieldsValidations,
  validateFields
} from '../../../common/validations-helper.js';
import '../../../common/etools-dropdown/etools-dropdown-lite.js';
import '../../../common/errors-box.js';
import '../../../styles/shared-styles.js';
import '../../../styles/grid-layout-styles.js';
import '../../../styles/form-fields-styles.js';
import '../../../styles/required-fields-styles.js';
import { ImpactFormBase } from './impact-form-base.js';
import '../../../common/review-fields.js';
/**
 * @polymer
 * @customElement
 */
export class EvacuationForm extends connect(store)(ImpactFormBase) {
  static get is() {
    return 'evacuation-form';
  }

  static get template() {
    // language=HTML
    return html`
      <style include="shared-styles grid-layout-styles required-fields-styles form-fields-styles">
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

        <fieldset>
          <div class="row-h flex-c">
            <div class="col col-3">
              <etools-dropdown-lite
                      id="agency"
                      label="Agency"
                      readonly="[[readonly]]"
                      options="[[staticData.agencies]]"
                      selected="{{data.agency}}"
                      required auto-validate
                      error-message="This is required">
              </etools-dropdown-lite>
            </div>
            <div class="col col-3">
              <datepicker-lite id="date"
                               value="{{data.date}}"
                               readonly="[[readonly]]"
                               label="Date"
                               required auto-validate
                               error-message="This is required">
              </datepicker-lite>
            </div>
          </div>
          <div class="row-h flex-c">
            <div class="col col-3">
              <paper-input id="noPersNational"
                           type="number"
                           min="0"
                           placeholder="&#8212;"
                           readonly$="[[readonly]]"
                           label="No. of Persons National"
                           value="{{data.number_national}}"
                           required auto-validate
                           error-message="This is required">
              </paper-input>
            </div>
            <div class="col col-3">
              <paper-input id="noPersInternational"
                           type="number"
                           min="0"
                           placeholder="&#8212;"
                           readonly$="[[readonly]]"
                           label="No. of Persons International"
                           value="{{data.number_international}}"
                           required auto-validate
                           error-message="This is required">
              </paper-input>
            </div>
          </div>
          <div class="row-h flex-c">
            <div class="col col-3">
              <paper-input id="noDepNational"
                           type="number"
                           min="0"
                           placeholder="&#8212;"
                           readonly$="[[readonly]]"
                           label="No. of Dependants National"
                           value="{{data.number_national_dependants}}"
                           required auto-validate
                           error-message="This is required">
              </paper-input>
            </div>
            <div class="col col-3">
              <paper-input id="noDepInternational"
                           type="number"
                           min="0"
                           placeholder="&#8212;"
                           readonly$="[[readonly]]"
                           label="No. of Dependants International"
                           value="{{data.number_international_dependants}}"
                           required auto-validate
                           error-message="This is required">
              </paper-input>
            </div>
          </div>

          <div class="row-h flex-c">
            <div class="col col-3">
              <etools-dropdown-lite
                  required
                  id="fromRegion"
                  label="From Region"
                  readonly="[[readonly]]"
                  options="[[staticData.regions]]"
                  selected="{{data.from_region}}"
                  auto-validate
                  error-message="From region is required">
              </etools-dropdown-lite>
            </div>
            <div class="col col-3">
              <etools-dropdown-lite id="fromCountry"
                                    label="From Country"
                                    readonly="[[readonly]]"
                                    options="[[getCountriesForRegion(data.from_region)]]"
                                    selected="{{data.from_country}}"
                                    required auto-validate
                                    error-message="This is required">
              </etools-dropdown-lite>
            </div>
            <div class="col col-3">
              <paper-input
                      id="fromCity"
                      label="From City"
                      placeholder="&#8212;"
                      readonly$="[[readonly]]"
                      value="{{data.from_city}}"
                      required
                      auto-validate
                      error-message="From city is required">
              </paper-input>
            </div>
          </div>
          <div class="row-h flex-c">
            <div class="col col-3">
              <etools-dropdown-lite
                  required
                  id="toRegion"
                  label="To Region"
                  readonly="[[readonly]]"
                  options="[[staticData.regions]]"
                  selected="{{data.to_region}}"
                  auto-validate
                  error-message="To region is required">
              </etools-dropdown-lite>
            </div>
            <div class="col col-3">
              <etools-dropdown-lite id="toCountry"
                                    label="To Country"
                                    readonly="[[readonly]]"
                                    options="[[getCountriesForRegion(data.to_region)]]"
                                    selected="{{data.to_country}}"
                                    required auto-validate
                                    error-message="This is required">
              </etools-dropdown-lite>
            </div>
            <div class="col col-3">
              <paper-input
                      id="toCity"
                      label="To City"
                      placeholder="&#8212;"
                      value="{{data.to_city}}"
                      readonly$="[[readonly]]"
                      required
                      auto-validate
                      error-message="To city is required">
              </paper-input>
            </div>
          </div>
        </fieldset>
        <fieldset>
          <legend><h3>Impact Details</h3></legend>
          <div class="row-h flex-c">
            <div class="col col-3">
              <etools-dropdown-lite
                      id="category"
                      label="Impact"
                      readonly="[[readonly]]"
                      options="[[staticData.impacts.evacuation]]"
                      selected="{{data.impact}}"
                      selected-item="{{selectedImpactType}}"
                      required auto-validate
                      error-message="Impact is required">
              </etools-dropdown-lite>
            </div>
          </div>
          <div class="row-h flex-c">
            <div class="col col-12">
              <paper-textarea id="description"
                              readonly$="[[readonly]]"
                              label="Description"
                              placeholder="&#8212;"
                              value="{{data.description}}"
                              required auto-validate
                              error-message="Description is required">
              </paper-textarea>
            </div>
          </div>
        </fieldset>

        <fieldset hidden$="[[isNew]]">
          <review-fields data="[[data]]" hidden$="[[useBasicLayout]]"></review-fields>
        </fieldset>

        <paper-button on-tap="saveEvacuation"
                      hidden$="[[readonly]]">
          Save
        </paper-button>
        <paper-button raised
                      class="danger"
                      hidden$="[[useBasicLayout]]"
                      on-tap="_goToIncidentImpacts">
          Cancel
        </paper-button>
      </div>
    `;
  }

  static get getTitleTemplate() {
    return html`
      <h3> Evacuation or Relocation </h3>
    `;
  }

  static get properties() {
    return {
      staticData: Array,
      impactId: String,
      offline: Boolean,
      readonly: {
        type: Boolean,
        value: false
      },
      isNew: {
        type: Boolean,
        computed: '_computeIsNew(impactId)'
      },
      fieldsToValidateSelectors: {
        type: Array,
        value: [
          '#agency',
          '#date',
          '#noPersInternational',
          '#noDepInternational',
          '#noPersNational',
          '#noDepNational',
          '#fromRegion',
          '#toRegion',
          '#fromCountry',
          '#fromCity',
          '#toCountry',
          '#toCity',
          '#category',
          '#description'
        ]
      }
    };
  }

  static get observers() {
    return [
      '_idChanged(impactId)'
    ];
  }

  _stateChanged(state) {
    this.offline = state.app.offline;
    this.staticData = state.staticData;
    this.evacuations = state.incidents.evacuations;
    this.data.incident_id = state.app.locationInfo.incidentId;
    // TODO: (future) we should only user data.incident_id for all impacts (API changed needed)
    this.incidentId = state.app.locationInfo.incidentId;
  }

  async saveEvacuation() {
    let result;
    if (!validateFields(this, this.fieldsToValidateSelectors)) {
      store.dispatch(showSnackbar('Please check the highlighted fields'));
      return;
    }
    if (this.isNew) {
      result = await store.dispatch(addEvacuation(this.data));
    } else if (this.data.unsynced && !isNaN(this.data.incident_id) && !this.offline) {
      result = await store.dispatch(syncEvacuation(this.data));
    } else {
      result = await store.dispatch(editEvacuation(this.data));
    }

    if (result === true) {
      this._goToIncidentImpacts();
      this.data = {};
    }
    if (result === false) {
      scrollToTop();
    }
  }

  resetValidations() {
    if (this.visible) {
      resetFieldsValidations(this, this.fieldsToValidateSelectors);
    }
  }

  _computeIsNew(id) {
    return id === 'new';
  }

  _idChanged(id) {
    if (!id || this.isNew) {
      this.data = {};
      return;
    }

    let currentEvacuation = this.evacuations.find(ev => '' + ev.id === id);
    if (currentEvacuation) {
      this.data = JSON.parse(JSON.stringify(currentEvacuation)) || {};
      this.resetValidations();
    }
  }

}

window.customElements.define(EvacuationForm.is, EvacuationForm);
