/**
@license
*/
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-input/paper-textarea.js';

import { addEvacuationOnline } from '../../../../actions/incidents.js';
import { store } from '../../../../redux/store.js';
import '../../../common/etools-dropdown/etools-dropdown-lite.js';
import '../../../common/datepicker-lite.js';
import '../../../styles/shared-styles.js';
import '../../../styles/grid-layout-styles.js';
import '../../../styles/form-fields-styles.js';
import '../../../styles/required-fields-styles.js';

/**
 * @polymer
 * @customElement
 */
export class EvacuationForm extends connect(store)(PolymerElement) {
  static get is() {
    return 'evacuation-form';
  }
  static get template() {
    return html`
      <style include="shared-styles grid-layout-styles required-fields-styles form-fields-styles">
        :host {
          @apply --layout-vertical;
        }
      </style>

      <div class="card">
        <h3> Evacuation </h3>

        <div class="layout-horizontal">
          <errors-box></errors-box>
        </div>

        <fieldset>
          <div class="row-h flex-c">
            <div class="col col-6">
              <etools-dropdown-lite
                        id="agency"
                        label="Agency"
                        readonly="[[readonly]]"
                        options="[[staticData.agencies]]"
                        selected="{{data.agency}}"
                        required auto-validate
                        error-message="Agency is required">
              </etools-dropdown-lite>
            </div>
            <div class="col col-6">
              <datepicker-lite id="date"
                              value="{{data.date}}"
                              readonly="[[readonly]]"
                              label="Date">
              </datepicker-lite>
            </div>
          </div>
          <div class="row-h flex-c">
            <div class="col col-3">
              <paper-input id="noPersInternational"
                          type="number"
                          min="0"
                          placeholder="&#8212;"
                          readonly$="[[readonly]]"
                          label="No. of persons international"
                          value="{{data.number_international}}">
              </paper-input>
            </div>
            <div class="col col-3">
              <paper-input id="noDepInternational"
                          type="number"
                          min="0"
                          placeholder="&#8212;"
                          readonly$="[[readonly]]"
                          label="No. of dependants international"
                          value="{{data.number_international_dependants}}">
              </paper-input>
            </div>
            <div class="col col-3">
              <etools-dropdown-lite id="fromCountry"
                                    label="From country"
                                    readonly="[[readonly]]"
                                    options="[[staticData.countries]]"
                                    selected="{{data.from_country}}">
              </etools-dropdown-lite>
            </div>
            <div class="col col-3">
              <etools-dropdown-lite id="fromCity"
                                    label="From city"
                                    readonly="[[readonly]]"
                                    options="[[staticData.cities]]"
                                    selected="{{data.from_city}}">
              </etools-dropdown-lite>
            </div>
          </div>
          <div class="row-h flex-c">
            <div class="col col-3">
              <paper-input id="noPersNational"
                          type="number"
                          min="0"
                          placeholder="&#8212;"
                          readonly$="[[readonly]]"
                          label="No. of persons national"
                          value="{{data.number_national}}">
              </paper-input>
            </div>
            <div class="col col-3">
              <paper-input id="noDepNational"
                          type="number"
                          min="0"
                          placeholder="&#8212;"
                          readonly$="[[readonly]]"
                          label="No. of dependants national"
                          value="{{data.number_national_dependants}}">
              </paper-input>
            </div>
            <div class="col col-3">
              <etools-dropdown-lite id="toCountry"
                                    label="To country"
                                    readonly="[[readonly]]"
                                    options="[[staticData.countries]]"
                                    selected="{{data.to_country}}">
              </etools-dropdown-lite>
            </div>
            <div class="col col-3">
              <etools-dropdown-lite id="toCity"
                                    label="To city"
                                    readonly="[[readonly]]"
                                    options="[[staticData.cities]]"
                                    selected="{{data.to_city}}">
              </etools-dropdown-lite>
            </div>
          </div>
        <filedset>
        <fieldset>
          <legend><h3>Impact details</h3></legend>
          <div>
            <div class="row-h flex-c">
              <div class="col col-3">
                <etools-dropdown-lite
                            id="category"
                            label="Impact"
                            readonly="[[readonly]]"
                            options="[[staticData.impacts.evacuation]]"
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
        <paper-button on-click="saveEvacuation">Save</button>
      </div>
    `;
  }

  static get properties() {
    return {
      staticData: Array,
      readonly: {
        type: Boolean,
        value: false
      },
      data: {
        type: Object,
        value: {}
      },
    };
  }

  _stateChanged(state) {
    this.staticData = state.staticData;
    this.data.incident_id = state.app.locationInfo.incidentId;
  }

  saveEvacuation() {
    store.dispatch(addEvacuationOnline(this.data));
  }
}

window.customElements.define(EvacuationForm.is, EvacuationForm);
