/**
@license
*/
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { store } from '../../../../redux/store.js';
import '../../../styles/shared-styles.js';
import '../../../styles/grid-layout-styles.js';
import '../../../styles/required-fields-styles.js';

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
            <div class="col col-4">
              <etools-dropdown-lite
                          id="country"
                          label="Country"
                          readonly="[[readonly]]"
                          options="[[staticData.countries]]"
                          selected="{{data.country}}">
              </etools-dropdown-lite>
            </div>
            <div class="col col-4">
              <etools-dropdown-lite
                          id="region"
                          label="Region"
                          readonly="[[readonly]]"
                          options="[[staticData.regions]]"
                          selected="{{data.region}}">
              </etools-dropdown-lite>
            </div>
            <div class="col col-4">
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
                            selected="{{data.impact_type}}"
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
  }
}

window.customElements.define(NonUnPersonnelForm.is, NonUnPersonnelForm);
