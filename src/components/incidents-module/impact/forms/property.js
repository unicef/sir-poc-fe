/**
@license
*/
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-input/paper-textarea.js';

import {
    addProperty,
    editProperty,
    syncProperty
  } from '../../../../actions/incident-impacts.js';
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
export class PropertyForm extends connect(store)(PolymerElement) {
  static get is() {
    return 'property-form';
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
            <div class="col col-12">
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
            <div class="col col-6">
              <etools-dropdown-lite
                        id="property_type"
                        label="Property type"
                        readonly="[[readonly]]"
                        options="[[staticData.propertyTypes]]"
                        selected="{{data.property_type}}"
                        required auto-validate
                        error-message="This is required">
              </etools-dropdown-lite>
            </div>

            <div class="col col-6">
              <paper-input id="value"
                              readonly$="[[readonly]]"
                              label="Value"
                              type="number"
                              placeholder="&#8212;"
                              value="{{data.value}}"
                              required auto-validate
                              error-message="This is required">
              </paper-input>
            </div>

          </div>
        </filedset>
        <fieldset>
          <legend><h3>Impact details</h3></legend>
          <div>
            <div class="row-h flex-c">
              <div class="col col-3">
                <etools-dropdown-lite
                            id="category"
                            label="Impact"
                            readonly="[[readonly]]"
                            options="[[staticData.impacts.property]]"
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
        <paper-button on-click="save">Save</button>
      </div>
    `;
  }

  static get properties() {
    return {
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
          '#agency',
          '#property_type',
          '#value',
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
    this.propertiesList = state.incidents.properties;
    this.data.incident_id = state.app.locationInfo.incidentId;
  }

  async save() {
    let result;
    if (!validateFields(this, this.fieldsToValidateSelectors)) {
      return;
    }
    if (this.isNew) {
      result = await store.dispatch(addProperty(this.data));
    }
    else if (this.data.unsynced && !this.offline) {
      result = await store.dispatch(syncProperty(this.data));
    }
    else {
      result = await store.dispatch(editProperty(this.data));
    }

    if (result === true) {
      updatePath(`incidents/impact/${this.data.incident_id}/`);
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

    let workingItem = this.propertiesList.find(item => '' + item.id === id);
    if (workingItem) {
      this.data = JSON.parse(JSON.stringify(workingItem)) || {};
      this.resetValidations();
    }
  }

}

window.customElements.define(PropertyForm.is, PropertyForm);
