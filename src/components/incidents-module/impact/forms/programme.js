/**
@license
*/
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-input/paper-textarea.js';
import '../../../common/datepicker-lite.js';

import {
    addProgramme,
    editProgramme,
    syncProgramme
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
export class ProgrammeForm extends connect(store)(PolymerElement) {
  static get is() {
    return 'programme-form';
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
        <h3> Un Programmes </h3>

        <div class="layout-horizontal">
          <errors-box></errors-box>
        </div>

        <fieldset>
          <div class="row-h flex-c">
            <div class="col col-6">
              <etools-dropdown-lite id="country"
                                    label="Country of impact"
                                    readonly="[[readonly]]"
                                    options="[[staticData.countries]]"
                                    selected="{{data.country}}"
                                    required auto-validate
                                    error-message="This is required">
              </etools-dropdown-lite>
            </div>
            <div class="col col-6">
              <etools-dropdown-lite id="scope"
                                    label="Geographical Scope"
                                    readonly="[[readonly]]"
                                    options="[[staticData.programmeScopes]]"
                                    selected="{{data.scope}}"
                                    selected-item="{{selectedScope}}"
                                    required auto-validate
                                    error-message="This is required">
              </etools-dropdown-lite>
            </div>
          </div>

          <div class="row-h flex-c">
            <div class="col col-6">
              <template is="dom-if" if="[[scopeIsCity(selectedScope)]]">
                <etools-dropdown-lite label="Area impacted"
                                      enable-none-option
                                      readonly="[[readonly]]"
                                      options="[[selectableCities]]"
                                      selected="{{data.area}}">
                </etools-dropdown-lite>
              </template>
              <template is="dom-if" if="[[scopeIsCountry(selectedScope)]]">
                <etools-dropdown-lite label="Area impacted"
                                      enable-none-option
                                      readonly="[[readonly]]"
                                      options="[[staticData.countries]]"
                                      selected="{{data.area}}">
                </etools-dropdown-lite>
              </template>
              <template is="dom-if" if="[[scopeIsOther(selectedScope)]]">
                <etools-dropdown-lite label="Area impacted"
                                      enable-none-option
                                      readonly="[[readonly]]"
                                      options="[[staticData.programmeAreas]]"
                                      selected="{{data.area}}">
                </etools-dropdown-lite>
              </template>
            </div>
            <div class="col col-3">
              <datepicker-lite id="startDate"
                              value="{{data.start_date}}"
                              readonly="[[readonly]]"
                              label="Start of impact">
              </datepicker-lite>
            </div>
            <div class="col col-3">
              <datepicker-lite id="endDate"
                              value="{{data.end_date}}"
                              readonly="[[readonly]]"
                              label="End of impact">
              </datepicker-lite>
            </div>
          </div>
          <div class="row-h flex-c">
            <div class="col col-12">
              <etools-dropdown-lite id="impact"
                                    label="Impact type"
                                    readonly="[[readonly]]"
                                    options="[[staticData.impacts.property]]"
                                    selected="{{data.impact}}"
                                    required auto-validate
                                    error-message="This is required">
              </etools-dropdown-lite>
            </div>
          </div>

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
              <etools-dropdown-lite id="programmeType"
                                    label="Programmes type"
                                    readonly="[[readonly]]"
                                    options="[[staticData.programmeTypes]]"
                                    selected="{{data.programme_type}}"
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
              <div class="col col-12">
                <paper-textarea id="description"
                                readonly$="[[readonly]]"
                                label="Description"
                                placeholder="&#8212;"
                                value="{{data.description}}"
                                required auto-validate
                                error-message="This is required">
                </paper-textarea>
              </div>
            </div>
          </div>
        </fieldset>
        <paper-button on-click="save">Save</paper-button>
      </div>
    `;
  }

  static get properties() {
    return {
      selectedScope: Object,
      staticData: Array,
      impactId: String,
      visible: Boolean,
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
        ]
      }
    };
  }

  static get observers() {
    return [
      '_idChanged(impactId)',
      '_updateSelectableCities(data.country)'
    ];
  }

  _stateChanged(state) {
    this.offline = state.app.offline;
    this.staticData = state.staticData;
    this.programmesList = state.incidents.programmes;
    this.data.incident_id = state.app.locationInfo.incidentId;
  }

  _updateSelectableCities(country) {
    this.selectableCities = this.staticData.cities.filter(elem => elem.country === country);
  }

  async save() {
    let result;
    if (!validateFields(this, this.fieldsToValidateSelectors)) {
      return;
    }
    if (this.isNew) {
      result = await store.dispatch(addProgramme(this.data));
    }
    else if (this.data.unsynced && !isNaN(this.data.incident_id) && !this.offline) {
      result = await store.dispatch(syncProgramme(this.data));
    }
    else {
      result = await store.dispatch(editProgramme(this.data));
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
    let workingItem = this.programmesList.find(item => '' + item.id === id);
    if (workingItem) {
      this.data = JSON.parse(JSON.stringify(workingItem)) || {};
      this.resetValidations();
    }
  }

  scopeIsCity(scope) {
    return scope && scope.name === 'City';
  }
  scopeIsCountry(scope) {
    return scope && scope.name === 'Security level area';
  }
  scopeIsOther(scope) {
    return !this.scopeIsCity(scope) && !this.scopeIsCountry(scope);
  }

  _visibilityChanged(visible) {
    if (visible === false) {
      store.dispatch(clearErrors());
    }
  }

}

window.customElements.define(ProgrammeForm.is, ProgrammeForm);
