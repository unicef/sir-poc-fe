/**
 * @license
 */
import {html} from '@polymer/polymer/polymer-element.js';
import {connect} from 'pwa-helpers/connect-mixin.js';
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
import {store} from '../../../../redux/store.js';
import {scrollToTop} from '../../../common/content-container-helper.js';
import {updatePath} from '../../../common/navigation-helper.js';
import {
  resetFieldsValidations,
  validateFields
} from '../../../common/validations-helper.js';
import '../../../common/etools-dropdown/etools-dropdown-lite.js';

import '../../../styles/shared-styles.js';
import '../../../styles/grid-layout-styles.js';
import '../../../styles/required-fields-styles.js';
import '../../../styles/form-fields-styles.js';
import {ImpactFormBase} from './impact-form-base.js';
import { clearErrors } from '../../../../actions/errors.js';

/**
 * @polymer
 * @customElement
 */
export class NonUnPersonnelForm extends connect(store)(ImpactFormBase) {
  static get is() {
    return 'non-un-personnel-form';
  }

  static get template() {
    // language=HTML
    return html`
      <style include="shared-styles grid-layout-styles required-fields-styles  form-fields-styles">
        :host {
          @apply --layout-vertical;
        }
      </style>

      <div class="card">
      
        <div class="layout-horizontal">
          <errors-box></errors-box>
        </div>

        <fieldset>
          <legend><h3>Impact details</h3></legend>
          <div>
            <div class="row-h flex-c">
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
            </div>
            <div class="row-h flex-c">
              <div class="col col-12">
                <paper-textarea id="description"
                                readonly$="[[readonly]]"
                                label="Description"
                                placeholder="&#8212;"
                                required auto-validate
                                value="{{data.description}}">
                </paper-textarea>
              </div>
            </div>
          </div>
        </fieldset>
        
        <fieldset>
          <legend><h3>Impacted Non-UN Personnel</h3></legend>

          <template is="dom-if" if="[[isSexualAssault(selectedImpactType)]]">
            <div class="row-h flex-c">
              <div class="alert-text">
                IMPORTANT: In an effort to protect the identity of victims, the ONLY required feilds for the sexual 
                assault subcategory are Impact, Description, and Country. The victim should be informed that 
                all other information is VOLUNTARY.
              </div>
            </div>
          </template>

          <div class="row-h flex-c">
            <div class="col col-3">
              <paper-input id="firstName"
                           placeholder="&#8212;"
                           readonly$="[[readonly]]"
                           label="First name"
                           value="{{data.person.first_name}}"
                           required$="[[!isSexualAssault(selectedImpactType)]]" auto-validate
                           error-message="First name is required">
              </paper-input>
            </div>
            <div class="col col-3">
              <paper-input id="lastName"
                           placeholder="&#8212;"
                           readonly$="[[readonly]]"
                           label="Last name"
                           value="{{data.person.last_name}}"
                           required$="[[!isSexualAssault(selectedImpactType)]]" auto-validate
                           error-message="Last name is required">
              </paper-input>
            </div>
            <div class="col col-3">
              <etools-dropdown-lite
                  id="gender"
                  label="Gender"
                  readonly="[[readonly]]"
                  options="[[staticData.genders]]"
                  selected="{{data.person.gender}}"
                  required$="[[!isSexualAssault(selectedImpactType)]]" auto-validate
                  error-message="Gender is required">
              </etools-dropdown-lite>
            </div>
            <div class="col col-3">
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
            <div class="col col-3">
              <datepicker-lite id="birthDate"
                               value="{{data.person.date_of_birth}}"
                               readonly="[[readonly]]"
                               label="Date of birth">
              </datepicker-lite>
            </div>
            <div class="col col-3">
              <paper-input id="email"
                           type="email"
                           placeholder="&#8212;"
                           readonly$="[[readonly]]"
                           label="Email"
                           value="{{data.person.email}}">
              </paper-input>
            </div>
            <div class="col col-3">
              <paper-textarea id="contact"
                              placeholder="&#8212;"
                              readonly$="[[readonly]]"
                              label="Contact"
                              value="{{data.person.contact}}">
              </paper-textarea>
            </div>
          </div>
          <div class="row-h flex-c">
            <div class="col col-6">
              <paper-input id="address"
                           placeholder="&#8212;"
                           readonly$="[[readonly]]"
                           label="Address"
                           value="{{data.person.address}}">
              </paper-input>
            </div>
            <div class="col col-3">
              <etools-dropdown-lite
                  id="country"
                  label="Country"
                  readonly="[[readonly]]"
                  options="[[staticData.countries]]"
                  selected="{{data.person.country}}">
              </etools-dropdown-lite>
            </div>
            <div class="col col-3">
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
            <div class="col col-3">
              <paper-input id="created_by"
                           label="Created by"
                           placeholder="&#8212;"
                           type="text"
                           value="[[_getUsername(data.created_by_user_id)]]"
                           readonly></paper-input>
            </div>
            <div class="col">
              <datepicker-lite id="created_on"
                               label="Created on"
                               value="[[data.created_on]]"
                               readonly></datepicker-lite>
            </div>
            <div class="col col-3">
              <paper-input id="last_edited_by"
                           label="Last edited by"
                           placeholder="&#8212;"
                           value="[[_getUsername(data.last_modify_user_id)]]"
                           type="text"
                           readonly></paper-input>
            </div>
            <div class="col">
              <datepicker-lite id="last_edited_on"
                               label="Last edited on"
                               value="[[data.last_modify_date]]"
                               readonly></datepicker-lite>
            </div>
          </div>
        </fieldset>
        <paper-button on-tap="save">Save</paper-button>
        <paper-button class="danger" raised on-tap="_goToIncidentImpacts">
          Cancel
        </paper-button>
      </div>
    `;
  }

  static get properties() {
    return {
      selectedImpactType: {
        type: Object,
        value: {}
      },
      staticData: Array,
      impactId: String,
      offline: Boolean,
      readonly: {
        type: Boolean,
        value: false
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
    // TODO: (future) we should only user data.incident_id for all impacts (API changed needed)
    this.incidentId = state.app.locationInfo.incidentId;
  }

  async save() {
    let result;
    if (!validateFields(this, this.fieldsToValidateSelectors)) {
      return;
    }
    this.data.person.un_official = false;

    if (this.isNew) {
      result = await store.dispatch(addPersonnel(this.data));
    } else if (this.data.unsynced && !isNaN(this.data.incident) && !this.offline) {
      result = await store.dispatch(syncPersonnel(this.data));
    } else {
      result = await store.dispatch(editPersonnel(this.data));
    }

    if (result === true) {
      this._goToIncidentImpacts();
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
  }

  isSexualAssault() {
    if (this.selectedImpactType) {
      return this.selectedImpactType.name === 'Sexually assaulted';
    } else {
      return false;
    }
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

  _getUsername(userId) {
    if (userId === null || userId === undefined) {
      return 'N/A';
    }

    let user = this.staticData.users.find(u => Number(u.id) === Number(userId));
    if (user) {
      return user.name;
    }
    return 'N/A';
  }

}

window.customElements.define(NonUnPersonnelForm.is, NonUnPersonnelForm);
