/**
 * @license
 */
import { html } from '@polymer/polymer/polymer-element.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-input/paper-textarea.js';
import '@polymer/paper-checkbox/paper-checkbox.js';
import '@unicef-polymer/etools-date-time/datepicker-lite.js';
import '@unicef-polymer/etools-info-tooltip/etools-info-tooltip.js';
import '@unicef-polymer/etools-dropdown/etools-dropdown.js';
import { showSnackbar } from '../../../../actions/app.js';

import {
  addPersonnel,
  editPersonnel,
  syncPersonnel
 } from '../../../../actions/incident-impacts.js';
import { store } from '../../../../redux/store.js';
import { scrollToTop } from '../../../common/content-container-helper.js';
import {
  resetFieldsValidations,
  validateFields
 } from '../../../common/validations-helper.js';

import '../../../styles/shared-styles.js';
import '../../../styles/grid-layout-styles.js';
import '../../../styles/required-fields-styles.js';
import '../../../styles/form-fields-styles.js';
import { ImpactFormBase } from './impact-form-base.js';
import '../../../common/review-fields.js';

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
        ${this.getTitleTemplate}
        <div class="layout-horizontal">
          <errors-box></errors-box>
        </div>

        <fieldset>
          <legend><h3>Impact Details</h3></legend>
          <div>
            <div class="row-h flex-c">
              <div class="col col-3">
                <etools-info-tooltip class="info"  form-field-align
                                     hide-tooltip$="[[_hideInfoTooltip(selectedImpactType.description)]]">
                  <etools-dropdown id="impact"
                                    slot="field"
                                    label="Impact"
                                    readonly="[[readonly]]"
                                    option-label="name"
                                    option-value="id"
                                    options="[[staticData.impacts.person]]"
                                    selected="{{data.impact}}"
                                    selected-item="{{selectedImpactType}}"
                                    required auto-validate
                                    error-message="Impact is required">
                  </etools-dropdown>
                  <span slot="message">[[selectedImpactType.description]]
                  </span>
                </etools-info-tooltip>
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
          <legend><h3>Impacted Non-UNICEF Personnel</h3></legend>

          <template is="dom-if" if="[[isSpecialConditionImpact(selectedImpactType)]]">
            <div class="row-h flex-c" hidden$="[[useBasicLayout]]">
              <div class="alert-text">
                IMPORTANT: In an effort to protect the identity of victims, the ONLY required fields for the
                [[selectedImpactType.name]] category are Impact, Description, Region, and Country.
                The victim should be informed that all other information is VOLUNTARY.
              </div>
            </div>
          </template>

          <div class="row-h flex-c">
            <div class="col col-3">
              <paper-input id="firstName"
                           placeholder="&#8212;"
                           readonly$="[[readonly]]"
                           label="First Name"
                           value="{{data.person.first_name}}"
                           required$="[[!isSpecialConditionImpact(selectedImpactType)]]" auto-validate
                           error-message="First name is required">
              </paper-input>
            </div>
            <div class="col col-3">
              <paper-input id="lastName"
                           placeholder="&#8212;"
                           readonly$="[[readonly]]"
                           label="Last Name"
                           value="{{data.person.last_name}}"
                           required$="[[!isSpecialConditionImpact(selectedImpactType)]]" auto-validate
                           error-message="Last name is required">
              </paper-input>
            </div>
            <div class="col col-3">
              <etools-dropdown id="gender"
                                label="Gender"
                                readonly="[[readonly]]"
                                hide-search
                                option-label="name"
                                option-value="id"
                                options="[[staticData.gender]]"
                                selected="{{data.person.gender}}"
                                >
              </etools-dropdown>
            </div>

            <div class="col col-3">
            <etools-dropdown id="sex"
                              label="Sex"
                              readonly="[[readonly]]"
                              hide-search
                              option-label="name"
                              option-value="id"
                              options="[[staticData.sex]]"
                              selected="{{data.person.sex}}"
                              required$="[[!isSpecialConditionImpact(selectedImpactType)]]" auto-validate
                              error-message="Sex is required">
            </etools-dropdown>
          </div>
          </div>
          <div class="row-h flex-c">
          <div class="col col-3">
          <etools-dropdown id="nationality"
                            label="Nationality"
                            readonly="[[readonly]]"
                            option-label="name"
                            option-value="id"
                            options="[[staticData.nationalities]]"
                            selected="{{data.person.nationality}}">
          </etools-dropdown>
        </div>
            <div class="col col-3">
              <datepicker-lite id="birthDate"
                               value="{{data.person.date_of_birth}}"
                               readonly="[[readonly]]"
                               label="Date of Birth">
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
                              label="Phone"
                              value="{{data.person.contact}}">
              </paper-textarea>
            </div>
          </div>
          <div class="row-h flex-c">
            <div class="col col-3">
              <paper-input id="address"
                           placeholder="&#8212;"
                           readonly$="[[readonly]]"
                           label="Address"
                           value="{{data.person.address}}">
              </paper-input>
            </div>
            <div class="col col-3">
              <etools-dropdown id="region"
                                label="Region"
                                readonly="[[readonly]]"
                                options="[[staticData.regions]]"
                                selected="{{data.person.region}}"
                                option-label="name"
                                option-value="id"
                                required auto-validate
                                error-message="Duty station region is required">
              </etools-dropdown>
            </div>
            <div class="col col-3">
              <etools-dropdown id="country"
                                label="Country"
                                readonly="[[readonly]]"
                                required
                                option-label="name"
                                option-value="id"
                                options="[[getCountriesForRegion(data.person.region)]]"
                                selected="{{data.person.country}}"
                                disabled$="[[!data.person.region]]">
              </etools-dropdown>
            </div>
            <div class="col col-3">
              <paper-input
                      id="city"
                      label="City"
                      placeholder="&#8212;"
                      value="{{data.person.city}}"
                      readonly$="[[readonly]]">
              </paper-input>
            </div>
          </div>
        </fieldset>

        <fieldset hidden$="[[isNew]]">
          <review-fields data="[[data]]" hidden$="[[useBasicLayout]]"></review-fields>
        </fieldset>
        <paper-button on-tap="save"
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
    return html``;
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
          '#sex',
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
      store.dispatch(showSnackbar('Please check the highlighted fields'));
      return;
    }
    this.data.person.un_official = false;
    this.data.person.gender = this.data.person.gender || null;

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

}

window.customElements.define(NonUnPersonnelForm.is, NonUnPersonnelForm);
