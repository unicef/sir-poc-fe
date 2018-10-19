/**
 * @license
 */
import {html} from '@polymer/polymer/polymer-element.js';
import {connect} from 'pwa-helpers/connect-mixin.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-input/paper-textarea.js';

import {
  addPremise,
  editPremise,
  syncPremise
} from '../../../../actions/incident-impacts.js';
import {store} from '../../../../redux/store.js';
import {scrollToTop} from '../../../common/content-container-helper.js';
import {updatePath} from '../../../common/navigation-helper.js';
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
import {ImpactFormBase} from './impact-form-base.js';

/**
 * @polymer
 * @customElement
 */
export class PremiseForm extends connect(store)(ImpactFormBase) {
  static get is() {
    return 'premise-form';
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
        <h3> UN Premises </h3>

        <div class="layout-horizontal">
          <errors-box></errors-box>
        </div>

        <fieldset>
          <div class="row-h flex-c">
            <div class="col col-3">
              <etools-dropdown-lite id="country"
                                    label="Country"
                                    readonly="[[readonly]]"
                                    options="[[staticData.countries]]"
                                    selected="{{data.country}}"
                                    required auto-validate
                                    error-message="This is required">
              </etools-dropdown-lite>
            </div>
            
            <div class="col col-3">
              <etools-dropdown-lite id="city"
                                    label="City"
                                    readonly="[[readonly]]"
                                    options="[[staticData.cities]]"
                                    selected="{{data.city}}"
                                    required auto-validate
                                    error-message="This is required">
              </etools-dropdown-lite>
            </div>

            <div class="col col-3">
              <etools-dropdown-lite
                  id="agency"
                  label="Owner"
                  readonly="[[readonly]]"
                  options="[[staticData.agencies]]"
                  selected="{{data.agency}}"
                  required auto-validate
                  error-message="This is required">
              </etools-dropdown-lite>
            </div>
            
          </div>
          
          <div class="row-h flex-c">
            <div class="col col-3">
              <etools-dropdown-lite id="location"
                                    label="UN Location"
                                    readonly="[[readonly]]"
                                    options="[[staticData.unLocations]]"
                                    selected="{{data.un_location}}">
              </etools-dropdown-lite>
            </div>

            <div class="col col-3">
              <etools-dropdown-lite id="premisesType"
                                    label="Premises type"
                                    readonly="[[readonly]]"
                                    options="[[staticData.premisesTypes]]"
                                    selected="{{data.premise_type}}"
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
                    id="impact"
                    label="Impact"
                    readonly="[[readonly]]"
                    options="[[staticData.impacts.property]]"
                    selected="{{data.impact}}"
                    selected-item="{{selectedImpactType}}"
                    required auto-validate
                    error-message="This is required">
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
                                error-message="This is required">
                </paper-textarea>
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
          </div>
        </fieldset>
        <paper-button on-tap="save">Save</paper-button>
        <paper-button class="cancelBtn" raised on-tap="_goToIncidentImpacts">
          Cancel
        </paper-button>
      </div>
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
          '#country',
          '#city',
          '#premisesType',
          '#agency',
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
    this.premisesList = state.incidents.premises;
    this.data.incident_id = state.app.locationInfo.incidentId;
  }

  async save() {
    let result;
    if (!validateFields(this, this.fieldsToValidateSelectors)) {
      return;
    }
    if (this.isNew) {
      result = await store.dispatch(addPremise(this.data));
    }
    else if (this.data.unsynced && !isNaN(this.data.incident_id) && !this.offline) {
      result = await store.dispatch(syncPremise(this.data));
    }
    else {
      result = await store.dispatch(editPremise(this.data));
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
    resetFieldsValidations(this, this.fieldsToValidateSelectors);
  }

  _computeIsNew(id) {
    return id === 'new';
  }

  _idChanged(id) {
    if (!id || this.isNew) {
      this.data = {};
      return;
    }
    let workingItem = this.premisesList.find(item => '' + item.id === id);
    if (workingItem) {
      this.data = JSON.parse(JSON.stringify(workingItem)) || {};
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

window.customElements.define(PremiseForm.is, PremiseForm);
