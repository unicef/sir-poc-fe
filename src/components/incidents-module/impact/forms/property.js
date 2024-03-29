/**
 * @license
 */
import { ImpactFormBase } from './impact-form-base.js';
import { html } from '@polymer/polymer/polymer-element.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-input/paper-textarea.js';
import '@unicef-polymer/etools-info-tooltip/etools-info-tooltip.js';
import '@unicef-polymer/etools-dropdown/etools-dropdown.js';
import { showSnackbar } from '../../../../actions/app.js';
import {
  addProperty,
  editProperty,
  syncProperty
} from '../../../../actions/incident-impacts.js';
import { store } from '../../../../redux/store.js';
import { scrollToTop } from '../../../common/content-container-helper.js';
import {
  resetFieldsValidations,
  validateFields
} from '../../../common/validations-helper.js';
import '../../../common/errors-box.js';
import '../../../styles/shared-styles.js';
import '../../../styles/grid-layout-styles.js';
import '../../../styles/form-fields-styles.js';
import '../../../styles/required-fields-styles.js';
import '../../../common/review-fields.js';

/**
 * @polymer
 * @customElement
 */
export class PropertyForm extends connect(store)(ImpactFormBase) {
  static get is() {
    return 'property-form';
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
              <etools-dropdown id="agency"
                                label="Owner"
                                readonly="[[readonly]]"
                                option-label="name"
                                option-value="id"
                                options="[[staticData.agencies]]"
                                selected="{{data.agency}}"
                                required auto-validate
                                error-message="Owner is required"
                                >
              </etools-dropdown>
            </div>
            <div class="col col-2">
              <etools-dropdown id="property_type"
                                label="Property Type"
                                readonly="[[readonly]]"
                                option-label="name"
                                option-value="id"
                                options="[[staticData.propertyTypes]]"
                                selected="{{data.property_type}}">
              </etools-dropdown>
            </div>
            <div class="col col-2">
              <paper-input id="value"
                           readonly$="[[readonly]]"
                           label="Value in USD"
                           type="number"
                           placeholder="&#8212;"
                           value="{{data.value}}"
                           required auto-validate
                           error-message="Value is required">
                <span  slot="prefix">$</span>
              </paper-input>
            </div>
          </div>

        </fieldset>
        <fieldset>
          <legend><h3>Impact Details</h3></legend>
          <div class="row-h flex-c">
            <div class="col col-3">
              <etools-info-tooltip class="info"  form-field-align
                                   hide-tooltip$="[[_hideInfoTooltip(selectedImpactType.description)]]">
                <etools-dropdown id="category"
                                  slot="field"
                                  label="Impact"
                                  readonly="[[readonly]]"
                                  option-label="name"
                                  option-value="id"
                                  options="[[staticData.impacts.property]]"
                                  selected="{{data.impact}}"
                                  selected-item="{{selectedImpactType}}"
                                  required auto-validate
                                  error-message="Impact is required">
                </etools-dropdown>
                <span slot="message">[[selectedImpactType.description]]
                </span>
              </etools-info-tooltip>
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
    return html`
      <h3> UNICEF Property </h3>
    `;
  }

  static get properties() {
    return {
      staticData: Array,
      impactId: String,
      selectedImpactType: {
        type: Object,
        value: {}
      },
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
          '#category',
          '#description',
          '#value',
          '#agency'
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
    // TODO: (future) we should only user data.incident_id for all impacts (API changed needed)
    this.incidentId = state.app.locationInfo.incidentId;
  }

  async save() {
    let result;
    if (!validateFields(this, this.fieldsToValidateSelectors)) {
      store.dispatch(showSnackbar('Please check the highlighted fields'));
      return;
    }
    if (this.isNew) {
      result = await store.dispatch(addProperty(this.data));
    } else if (this.data.unsynced && !isNaN(this.data.incident_id) && !this.offline) {
      result = await store.dispatch(syncProperty(this.data));
    } else {
      result = await store.dispatch(editProperty(this.data));
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

    let workingItem = this.propertiesList.find(item => '' + item.id === id);
    if (workingItem) {
      this.data = JSON.parse(JSON.stringify(workingItem)) || {};
      this.resetValidations();
    }
  }

}

window.customElements.define(PropertyForm.is, PropertyForm);
