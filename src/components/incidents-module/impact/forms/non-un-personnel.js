/**
@license
*/
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-input/paper-textarea.js';

import {
    addPersonnel,
    editPersonnel,
    syncPersonnel
  } from '../../../../actions/incident-impacts.js';
import { store } from '../../../../redux/store.js';
import { scrollToTop } from '../../../common/content-container-helper.js';
import { updatePath } from '../../../common/navigation-helper.js';
import {
    resetFieldsValidations,
    validateFields
  } from '../../../common/validations-helper.js';
import '../../../common/etools-dropdown/etools-dropdown-lite.js';
import '../../../common/datepicker-lite.js';

import '../../../styles/shared-styles.js';
import '../../../styles/grid-layout-styles.js';
import '../../../styles/required-fields-styles.js';
import '../../../styles/form-fields-styles.js';

/**
 * @polymer
 * @customElement
 */
export class NonUnPersonnelForm extends connect(store)(PolymerElement) {
  static get is() {
    return 'non-un-personnel-form';
  }
  static get template() {
    return html`
      <style include="shared-styles grid-layout-styles required-fields-styles  form-fields-styles">
        :host {
          @apply --layout-vertical;
        }
      </style>

      <div class="card">
        <h3> Impacted non-UN personnel </h3>

        <div class="layout-horizontal">
          <errors-box></errors-box>
        </div>

        <fieldset>
          <div class="row-h flex-c">
            <div class="col col-4">
                <paper-input id="firstName"
                            placeholder="&#8212;"
                            readonly$="[[readonly]]"
                            label="First name"
                            value="{{data.first_name}}"
                            required auto-validate
                            error-message="First name is required">
                </paper-input>
            </div>
            <div class="col col-4">
                <paper-input id="lastName"
                            placeholder="&#8212;"
                            readonly$="[[readonly]]"
                            label="Last name"
                            value="{{data.last_name}}"
                            required auto-validate
                            error-message="Last name is required">
                </paper-input>
            </div>
            <div class="col col-4">
              <etools-dropdown-lite
                        id="gender"
                        label="Gender"
                        readonly="[[readonly]]"
                        options="[[staticData.genders]]"
                        selected="{{data.gender}}"
                        required auto-validate
                        error-message="Gender is required">
              </etools-dropdown-lite>
            </div>
          </div>

          <div class="row-h flex-c">
            <div class="col col-4">
              <datepicker-lite id="birthDate"
                              value="{{data.date_of_birth}}"
                              readonly="[[readonly]]"
                              label="Date of birth">
              </datepicker-lite>
            </div>
            <div class="col col-4">
              <etools-dropdown-lite
                        id="nationality"
                        label="Nationality"
                        readonly="[[readonly]]"
                        options="[[staticData.nationalities]]"
                        selected="{{data.nationality}}">
              </etools-dropdown-lite>
            </div>
          </div>

          <div class="row-h flex-c">
            <div class="col col-12">
              <paper-input id="address"
                          placeholder="&#8212;"
                          readonly$="[[readonly]]"
                          label="Address"
                          value="{{data.address}}">
              </paper-input>
            </div>
          </div>
          <div class="row-h flex-c">
            <div class="col col-6">
              <etools-dropdown-lite
                          id="country"
                          label="Country"
                          readonly="[[readonly]]"
                          options="[[staticData.countries]]"
                          selected="{{data.country}}">
              </etools-dropdown-lite>
            </div>
            <div class="col col-6">
              <etools-dropdown-lite
                          id="city"
                          label="City"
                          readonly="[[readonly]]"
                          options="[[staticData.cities]]"
                          selected="{{data.city}}">
              </etools-dropdown-lite>
            </div>
          </div>
          <div class="row-h flex-c">
            <div class="col col-12">
              <paper-input id="email"
                          placeholder="&#8212;"
                          readonly$="[[readonly]]"
                          label="Email"
                          value="{{data.email}}">
              </paper-input>
            </div>
          </div>
          <div class="row-h flex-c">
            <div class="col col-12">
              <paper-textarea id="contact"
                          placeholder="&#8212;"
                          readonly$="[[readonly]]"
                          label="Contact"
                          value="{{data.conctact}}">
              </paper-textarea>
            </div>
          </div>

        </fieldset>
        <fieldset>
          <legend><h3>Impact details</h3></legend>
          <div>
            <div class="row-h flex-c">
              <div class="col col-4">
                <etools-dropdown-lite
                            id="category"
                            label="Impact"
                            readonly="[[readonly]]"
                            options="[[staticData.impacts.person]]"
                            selected="{{data.impact}}"
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
                                value="{{incident.description}}">
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
      selectedImpactType: Object,
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
      statuses: {
        type: Array,
        value: [
          {id: 'On duty', name: 'On duty'},
          {id: 'Off duty', name: 'Off duty'},
          {id: 'On mission', name: 'On mission'},
          {id: 'On leave', name: 'On leave'}
        ]
      },
      fieldsToValidateSelectors: {
        type: Array,
        value: [
          '#personnelType',
          '#agency',
          '#impact'
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
    this.personnelList = state.incidents.personnel;
    this.data.incident_id = state.app.locationInfo.incidentId;
  }

  async save() {
    let result;
    if (!validateFields(this, this.fieldsToValidateSelectors)) {
      return;
    }
    this.data.un = false;
    if (this.isNew) {
      result = await store.dispatch(addPersonnel(this.data));
    }
    else if (this.data.unsynced && !isNaN(this.data.incident_id) && !this.offline) {
      result = await store.dispatch(syncPersonnel(this.data));
    }
    else {
      result = await store.dispatch(editPersonnel(this.data));
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
    if(this.visible) {
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
    let workingItem = this.personnelList.find(item => '' + item.id === id);
    if (workingItem) {
      this.data = JSON.parse(JSON.stringify(workingItem)) || {};
      this.resetValidations();
    }
  }

}

window.customElements.define(NonUnPersonnelForm.is, NonUnPersonnelForm);
