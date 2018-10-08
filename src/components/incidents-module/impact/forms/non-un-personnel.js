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
    addPersonnel,
    editPersonnel,
    syncPersonnel
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
                            value="{{data.person.first_name}}"
                            required auto-validate
                            error-message="First name is required">
                </paper-input>
            </div>
            <div class="col col-4">
                <paper-input id="lastName"
                            placeholder="&#8212;"
                            readonly$="[[readonly]]"
                            label="Last name"
                            value="{{data.person.last_name}}"
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
                        selected="{{data.person.gender}}"
                        required auto-validate
                        error-message="Gender is required">
              </etools-dropdown-lite>
            </div>
          </div>

          <div class="row-h flex-c">
            <div class="col col-4">
              <datepicker-lite id="birthDate"
                              value="{{data.person.date_of_birth}}"
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
                        selected="{{data.person.nationality}}">
              </etools-dropdown-lite>
            </div>
          </div>

          <div class="row-h flex-c">
            <div class="col col-12">
              <paper-input id="address"
                          placeholder="&#8212;"
                          readonly$="[[readonly]]"
                          label="Address"
                          value="{{data.person.address}}">
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
                          selected="{{data.person.country}}">
              </etools-dropdown-lite>
            </div>
            <div class="col col-6">
              <etools-dropdown-lite
                          id="city"
                          label="City"
                          readonly="[[readonly]]"
                          options="[[staticData.cities]]"
                          selected="{{data.person.city}}">
              </etools-dropdown-lite>
            </div>
          </div>
          <div class="row-h flex-c">
            <div class="col col-12">
              <paper-input id="email"
                          placeholder="&#8212;"
                          readonly$="[[readonly]]"
                          label="Email"
                          value="{{data.person.email}}">
              </paper-input>
            </div>
          </div>
          <div class="row-h flex-c">
            <div class="col col-12">
              <paper-textarea id="contact"
                          placeholder="&#8212;"
                          readonly$="[[readonly]]"
                          label="Contact"
                          value="{{data.person.contact}}">
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
                            id="impact"
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
                                value="{{data.description}}">
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
        value: {
          person: {}
        }
      },
      modelForNew: {
        type: Object,
        value: {
          person: {}
        }
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
          '#firstName',
          '#lastName',
          '#gender',
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
    this.data.incident = state.app.locationInfo.incidentId;
  }

  async save() {
    let result;
    if (!validateFields(this, this.fieldsToValidateSelectors)) {
      return;
    }
    this.data.person.un_official = false;

    if (this.isNew) {
      result = await store.dispatch(addPersonnel(this.data));
    }
    else if (this.data.unsynced && !isNaN(this.data.incident) && !this.offline) {
      result = await store.dispatch(syncPersonnel(this.data));
    }
    else {
      result = await store.dispatch(editPersonnel(this.data));
    }

    if (result === true) {
      updatePath(`incidents/impact/${this.data.incident}/`);
      this.resetData();
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

  resetData() {
    this.data = JSON.parse(JSON.stringify(this.modelForNew));
  }

  _computeIsNew(id) {
    return id === 'new';
  }

  _idChanged(id) {
    if (!id || this.isNew) {
      this.resetData();
      this.resetValidations();
      return;
    }
    let workingItem = this.personnelList.find(item => '' + item.id === id);
    if (workingItem) {
      this.data = JSON.parse(JSON.stringify(workingItem));
      this.resetValidations();
    }
  }

  _visibilityChanged(visible) {
    if (visible === false) {
      store.dispatch(clearErrors());
    }
  }

}

window.customElements.define(NonUnPersonnelForm.is, NonUnPersonnelForm);
