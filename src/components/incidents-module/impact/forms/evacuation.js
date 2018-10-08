/**
@license
*/
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-input/paper-textarea.js';
import 'etools-date-time/datepicker-lite.js';

import {
    addEvacuation,
    editEvacuation,
    syncEvacuation
  } from '../../../../actions/incident-impacts.js';
import { clearErrors } from '../../../../actions/errors.js';
import { store } from '../../../../redux/store.js';
import { scrollToTop } from '../../../common/content-container-helper.js';
import { updatePath } from '../../../common/navigation-helper.js';
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

/**
 * @polymer
 * @customElement
 */
export class EvacuationForm extends connect(store)(PolymerElement) {
  static get is() {
    return 'evacuation-form';
  }

  static get template() {
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
        <h3> Evacuation </h3>

        <div class="layout-horizontal">
          <errors-box></errors-box>
        </div>

        <fieldset>
          <div class="row-h flex-c">
            <div class="col col-6">
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
            <div class="col col-6">
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
              <paper-input id="noPersInternational"
                          type="number"
                          min="0"
                          placeholder="&#8212;"
                          readonly$="[[readonly]]"
                          label="No. of persons international"
                          value="{{data.number_international}}"
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
                          label="No. of dependants international"
                          value="{{data.number_international_dependants}}"
                          required auto-validate
                          error-message="This is required">
              </paper-input>
            </div>
            <div class="col col-3">
              <etools-dropdown-lite id="fromCountry"
                                    label="From country"
                                    readonly="[[readonly]]"
                                    options="[[staticData.countries]]"
                                    selected="{{data.from_country}}"
                                    required auto-validate
                                    error-message="This is required">
              </etools-dropdown-lite>
            </div>
            <div class="col col-3">
              <etools-dropdown-lite id="fromCity"
                                    label="From city"
                                    readonly="[[readonly]]"
                                    options="[[staticData.cities]]"
                                    selected="{{data.from_city}}"
                                    required auto-validate
                                    error-message="This is required">
              </etools-dropdown-lite>
            </div>
          </div>
          <div class="row-h flex-c">
            <div class="col col-3">
              <paper-input id="noPersNational"
                          type="number"
                          min="0"
                          placeholder="&#8212;"
                          readonly$="[[readonly]]"
                          label="No. of persons national"
                          value="{{data.number_national}}"
                          required auto-validate
                          error-message="This is required">
              </paper-input>
            </div>
            <div class="col col-3">
              <paper-input id="noDepNational"
                          type="number"
                          min="0"
                          placeholder="&#8212;"
                          readonly$="[[readonly]]"
                          label="No. of dependants national"
                          value="{{data.number_national_dependants}}"
                          required auto-validate
                          error-message="This is required">
              </paper-input>
            </div>
            <div class="col col-3">
              <etools-dropdown-lite id="toCountry"
                                    label="To country"
                                    readonly="[[readonly]]"
                                    options="[[staticData.countries]]"
                                    selected="{{data.to_country}}"
                                    required auto-validate
                                    error-message="This is required">
              </etools-dropdown-lite>
            </div>
            <div class="col col-3">
              <etools-dropdown-lite id="toCity"
                                    label="To city"
                                    readonly="[[readonly]]"
                                    options="[[staticData.cities]]"
                                    selected="{{data.to_city}}"
                                    required auto-validate
                                    error-message="This is required">
              </etools-dropdown-lite>
            </div>
          </div>
        </fieldset>
        <fieldset>
          <legend><h3>Impact details</h3></legend>
          <div>
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
          </div>
        </fieldset>
        <paper-button on-click="saveEvacuation">Save</button>
      </div>
    `;
  }

  static get properties() {
    return {
      staticData: Array,
      impactId: String,
      visible: {
        type: Boolean,
        observer: '_visibilityChanged'
      },
      offline: Boolean,
      readonly: {
        type: Boolean,
        value: false
      },
      data: {
        type: Object,
        value: {}
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
          '#fromCountry',
          '#fromCity',
          '#noPersNational',
          '#noDepNational',
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
  }

  async saveEvacuation() {
    let result;
    if (!validateFields(this, this.fieldsToValidateSelectors)) {
      return;
    }
    if (this.isNew) {
      result = await store.dispatch(addEvacuation(this.data));
    }
    else if (this.data.unsynced && !isNaN(this.data.incident_id) && !this.offline) {
      result = await store.dispatch(syncEvacuation(this.data));
    }
    else {
      result = await store.dispatch(editEvacuation(this.data));
    }

    if (result === true) {
      updatePath(`incidents/impact/${this.data.incident_id}/`);
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
      this.resetValidations();
      return;
    }

    let currentEvacuation = this.evacuations.find(ev => '' + ev.id === id);
    if (currentEvacuation) {
      this.data = JSON.parse(JSON.stringify(currentEvacuation)) || {};
      this.resetValidations();
    }
  }

  _visibilityChanged(visible) {
    if (visible === false) {
      store.dispatch(clearErrors());
    }
  }

}

window.customElements.define(EvacuationForm.is, EvacuationForm);
