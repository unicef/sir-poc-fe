/**
@license
*/
import { html } from '@polymer/polymer/polymer-element.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-input/paper-textarea.js';
import '@polymer/paper-checkbox/paper-checkbox.js';
import 'etools-date-time/datepicker-lite.js';

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

import '../../../styles/shared-styles.js';
import '../../../styles/grid-layout-styles.js';
import '../../../styles/required-fields-styles.js';
import '../../../styles/form-fields-styles.js';
import { ImpactFormBase } from './impact-form-base.js';

/**
 * @polymer
 * @customElement
 */
export class UnPersonnelForm extends connect(store)(ImpactFormBase) {
  static get is() {
    return 'un-personnel-form';
  }

  static get template() {
    return html`
      <style include="shared-styles grid-layout-styles required-fields-styles  form-fields-styles">
        :host {
          @apply --layout-vertical;
        }
      </style>

      <div class="card">
        <h3> Impacted UN personnel </h3>

        <div class="layout-horizontal">
          <errors-box></errors-box>
        </div>

        <fieldset>
          <div class="row-h flex-c">
            <div class="col col-6">
                <etools-dropdown-lite
                        id="autoCompleteUser"
                        label="Auto complete staff member"
                        trigger-value-change-event
                        on-etools-selected-item-changed="_userSelected"
                        options="[[staticData.users]]">
                </etools-dropdown-lite>
            </div>
          </div>
          <div class="row-h flex-c">
            <div class="col col-3">
              <etools-dropdown-lite
                        id="unEmployer"
                        label="Employer"
                        readonly="[[readonly]]"
                        options="[[staticData.agencies]]"
                        selected="{{data.person.agency}}"
                        required auto-validate
                        error-message="Employer is required">
              </etools-dropdown-lite>
            </div>
            <div class="col col-3">
                <paper-input id="firstName"
                            placeholder="&#8212;"
                            readonly$="[[readonly]]"
                            label="First name"
                            value="{{data.person.first_name}}"
                            required auto-validate
                            error-message="First name is required">
                </paper-input>
            </div>
            <div class="col col-3">
                <paper-input id="lastName"
                            placeholder="&#8212;"
                            readonly$="[[readonly]]"
                            label="Last name"
                            value="{{data.person.last_name}}"
                            required auto-validate
                            error-message="Last name is required">
                </paper-input>
            </div>
            <div class="col col-3">
              <etools-dropdown-lite
                        id="nationality"
                        label="Nationality"
                        readonly="[[readonly]]"
                        options="[[staticData.nationalities]]"
                        selected="{{data.person.nationality}}"
                        required auto-validate
                        error-message="Nationality is required">
              </etools-dropdown-lite>
            </div>
          </div>

          <div class="row-h flex-c">
            <div class="col col-3">
              <datepicker-lite id="birthDate"
                              value="{{data.person.date_of_birth}}"
                              readonly="[[readonly]]"
                              label="Date of birth">
              </datepicker-lite>
            </div>
            <div class="col col-3">
              <etools-dropdown-lite
                        id="gender"
                        label="Gender"
                        required
                        auto-validate
                        readonly="[[readonly]]"
                        options="[[staticData.genders]]"
                        selected="{{data.person.gender}}">
              </etools-dropdown-lite>
            </div>
            <div class="col col-3">
              <paper-input id="email"
                          placeholder="&#8212;"
                          readonly$="[[readonly]]"
                          label="Email"
                          value="{{data.person.email}}">
              </paper-input>
            </div>
            <div class="col col-3">
              <paper-input id="index"
                          placeholder="&#8212;"
                          readonly$="[[readonly]]"
                          label="Index number"
                          value="{{data.person.index_number}}">
              </paper-input>
            </div>
          </div>

          <div class="row-h flex-c">
            <div class="col col-3">
              <etools-dropdown-lite
                          id="category"
                          label="Category"
                          readonly="[[readonly]]"
                          options="[[staticData.personnelCategories]]"
                          selected="{{data.person.category}}"
                          required auto-validate
                          error-message="Category is required">
              </etools-dropdown-lite>
            </div>
            <div class="col col-3">
              <etools-dropdown-lite
                          id="dutyStationCountry"
                          label="Duty station country"
                          readonly="[[readonly]]"
                          options="[[staticData.countries]]"
                          selected="{{data.person.country}}"
                          required auto-validate
                          error-message="Duty station country is required">
              </etools-dropdown-lite>
            </div>
            <div class="col col-3">
              <etools-dropdown-lite
                          id="dutyStationCity"
                          label="Duty station city"
                          readonly="[[readonly]]"
                          options="[[staticData.cities]]"
                          selected="{{data.person.city}}"
                          required auto-validate
                          error-message="Duty station city is required">
              </etools-dropdown-lite>
            </div>
            <div class="col col-3">
              <paper-input id="index"
                          placeholder="&#8212;"
                          readonly$="[[readonly]]"
                          label="Job title"
                          value="{{data.person.job_title}}">
              </paper-input>
            </div>
          </div>
        </fieldset>
        <fieldset>
          <legend><h3>Impact details</h3></legend>
          <div>
            <div class="row-h flex-c">
              <div class="col col-3">
                <etools-dropdown-lite
                            id="status"
                            label="Status"
                            readonly="[[readonly]]"
                            options="[[statuses]]"
                            selected="{{data.status}}"
                            required auto-validate
                            error-message="Status is required">
                </etools-dropdown-lite>
              </div>
              <div class="col col-3">
                <etools-dropdown-lite
                            id="impact"
                            label="Impact"
                            readonly="[[readonly]]"
                            options="[[staticData.impacts.person]]"
                            selected="{{data.impact}}"
                            selected-item="{{selectedImpactType}}"
                            required auto-validate
                            error-message="Impact is required">
                </etools-dropdown-lite>
              </div>
              <template is="dom-if" if="[[_shouldShowNextOfKinCheckbox(selectedImpactType.name)]]">
                <div class="col col-3">
                  <paper-checkbox checked="{{data.next_of_kin_notified}}">Next of Kin Notified?</paper-checkbox>
                </div>
              </template>
              <template is="dom-if" if="[[_shouldShowCaptureForm(selectedImpactType.name)]]">
                <div class="col col-3">
                  <datepicker-lite id="captureDate"
                              value="{{data.capture_date}}"
                              readonly="[[readonly]]"
                              label="Captured on">
                  </datepicker-lite>
                </div>
                <div class="col col-3">
                  <datepicker-lite id="releaseDate"
                              value="{{data.release_date}}"
                              readonly="[[readonly]]"
                              label="Released on">
                  </datepicker-lite>
                </div>
              </template>
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
        <paper-button on-click="save">Save</paper-button>
      </div>
    `;
  }

  static get properties() {
    return {
      selectedImpactType: Object,
      staticData: Array,
      impactId: String,
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
          '#unEmployer',
          '#firstName',
          '#lastName',
          '#nationality',
          '#gender',
          '#category',
          '#dutyStationCountry',
          '#dutyStationCity',
          '#status',
          '#impact',
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
    this.personnelList = state.incidents.personnel;
    this.data.incident = state.app.locationInfo.incidentId;
  }

  async save() {
    let result;
    if (!validateFields(this, this.fieldsToValidateSelectors)) {
      return;
    }
    this.data.person.un_official = true;

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
    resetFieldsValidations(this, this.fieldsToValidateSelectors);
  }

  resetData() {
    this.data = JSON.parse(JSON.stringify(this.modelForNew));
    this.$.autoCompleteUser.selected = null;
  }

  _computeIsNew(id) {
    return id === 'new';
  }

  _idChanged(id) {
    if (!id || this.isNew) {
      this.resetData();
      return;
    }
    let workingItem = this.personnelList.find(item => '' + item.id === id);
    if (workingItem) {
      this.data = JSON.parse(JSON.stringify(workingItem));
      this.resetValidations();
    }
  }

  _userSelected(event) {
    if (!event.detail.selectedItem) {
      return;
    }

    this.set('data.person.first_name', event.detail.selectedItem.first_name);
    this.set('data.person.last_name', event.detail.selectedItem.last_name);
    this.set('data.person.email', event.detail.selectedItem.email);
  }

  _shouldShowCaptureForm(impactName) {
    if (!impactName) {
      return false;
    }
    let name = impactName.toLowerCase();
    let keyWords = [
      'abducted',
      'hostage',
      'arrested',
      'detained'
    ];

    for (let index = 0; index < keyWords.length; index ++) {
      if (name.search(keyWords[index]) > -1) {
        return true;
      }
    }

    return false;
  }

  _shouldShowNextOfKinCheckbox(impactName) {
    return impactName === 'Death';
  }

  _visibilityChanged(visible) {
    if (visible === false) {
      store.dispatch(clearErrors());
    }
  }

}

window.customElements.define(UnPersonnelForm.is, UnPersonnelForm);
