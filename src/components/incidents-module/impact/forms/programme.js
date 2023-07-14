/**
 @license
 */
import { html } from '@polymer/polymer/polymer-element.js';
import { ImpactFormBase } from './impact-form-base.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-input/paper-textarea.js';
import '@unicef-polymer/etools-date-time/datepicker-lite.js';
import '@unicef-polymer/etools-info-tooltip/etools-info-tooltip.js';
import '@unicef-polymer/etools-dropdown/etools-dropdown.js';
import { showSnackbar } from '../../../../actions/app.js';

import {
  addProgramme,
  editProgramme,
  syncProgramme
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
import DateMixin from '../../../common/date-mixin.js';
import '../../../common/review-fields.js';

/**
 * @polymer
 * @customElement
 */
export class ProgrammeForm extends connect(store)(DateMixin(ImpactFormBase)) {
  static get is() {
    return 'programme-form';
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
              <etools-dropdown id="country"
                                label="Country of Impact"
                                readonly$="[[readonly]]"
                                option-label="name"
                                option-value="id"
                                options="[[staticData.countries]]"
                                selected="{{data.country}}"
                                required auto-validate
                                error-message="This is required">
              </etools-dropdown>
            </div>

            <div class="col col-3">
              <etools-dropdown id="scope"
                                label="Geographical Scope"
                                readonly$="[[readonly]]"
                                option-label="name"
                                option-value="id"
                                options="[[staticData.programmeScopes]]"
                                selected="{{data.scope}}"
                                required auto-validate
                                error-message="This is required">
              </etools-dropdown>
            </div>
            <div class="col col-3">
              <paper-input label="Area Impacted"
                            placeholder="&#8212;"
                            value="{{data.area}}"
                            readonly$="[[readonly]]">
              </paper-input>
            </div>
          </div>

          <div class="row-h flex-c">

            <div class="col col-3">
              <datepicker-lite id="startDate"
                               value="{{data.start_date}}"
                               max-date="[[toDate(data.end_date)]]"
                               readonly$="[[readonly]]"
                               label="Start of Impact">
              </datepicker-lite>
            </div>
            <div class="col col-3">
              <datepicker-lite id="endDate"
                               value="{{data.end_date}}"
                               min-date="[[toDate(data.start_date)]]"
                               readonly$="[[readonly]]"
                               label="End of Impact">
              </datepicker-lite>
            </div>

          </div>
          <div class="row-h flex-c">
            <div class="col col-3">
              <etools-info-tooltip class="info"  form-field-align
                                   hide-tooltip$="[[_hideInfoTooltip(selectedImpactType.description)]]">
                <etools-dropdown id="impact"
                                  slot="field"
                                  label="Impact Type"
                                  readonly$="[[readonly]]"
                                  option-label="name"
                                  option-value="id"
                                  options="[[staticData.impacts.programme]]"
                                  selected="{{data.impact}}"
                                  selected-item="{{selectedImpactType}}"
                                  required auto-validate
                                  error-message="This is required">
                </etools-dropdown>
                <span slot="message">[[selectedImpactType.description]]
                </span>
              </etools-info-tooltip>
            </div>

            <div class="col col-3">
              <etools-dropdown id="agency"
                                label="Agency"
                                readonly$="[[readonly]]"
                                option-label="name"
                                option-value="id"
                                options="[[staticData.agencies]]"
                                selected="{{data.agency}}"
                                required auto-validate
                                error-message="This is required">
              </etools-dropdown>
            </div>

            <div class="col col-3">
              <etools-dropdown id="programmeType"
                                label="Programme Type"
                                readonly$="[[readonly]]"
                                option-label="name"
                                option-value="id"
                                options="[[staticData.programmeTypes]]"
                                selected="{{data.programme_type}}"
                                required auto-validate
                                error-message="This is required">
              </etools-dropdown>
            </div>
          </div>

        </fieldset>

        <fieldset>
          <legend><h3>Impact Details</h3></legend>
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
      <h3> UNICEF Programmes </h3>
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
          '#scope',
          '#impact',
          '#agency',
          '#programmeType',
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
    this.programmesList = state.incidents.programmes;
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
      result = await store.dispatch(addProgramme(this.data));
    } else if (this.data.unsynced && !isNaN(this.data.incident_id) && !this.offline) {
      result = await store.dispatch(syncProgramme(this.data));
    } else {
      result = await store.dispatch(editProgramme(this.data));
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
    let workingItem = this.programmesList.find(item => '' + item.id === id);
    if (workingItem) {
      this.data = JSON.parse(JSON.stringify(workingItem)) || {};
      this.resetValidations();
    }
  }
}

window.customElements.define(ProgrammeForm.is, ProgrammeForm);
