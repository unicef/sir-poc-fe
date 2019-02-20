import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import '../common/etools-dropdown/etools-dropdown-lite.js';
import { validateAllRequired, resetRequiredValidations } from '../common/validations-helper.js';
import { makeRequest } from '../common/request-helper.js';
import { Endpoints } from '../../config/endpoints.js';

/**
 * @customElement
 * @polymer
 */
class RequestAccessForm extends PolymerElement {

  // Define optional shadow DOM template
  static get template() {
    // language=HTML
    return html`
      <style>
        paper-button {
          margin: 0;
          background-color: #1CABE2;
          color: #fff;
          font-weight: bold;
          padding: 5px 10px;
        }

        paper-input, etools-dropdown-lite {
          margin-bottom: 16px;
        }

        *[hidden] {
          display: none!important;
        }

        .error-box {
          width: 100%;
          display: block;
          padding: 16px;
          margin-bottom: 24px;
          border-radius: 5px;
          color: red;
          background-color: pink;
          box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
                      0 1px 5px 0 rgba(0, 0, 0, 0.12),
                      0 3px 1px -2px rgba(0, 0, 0, 0.2);

        }
      </style>

      <h3> Tell us more about you </h3>
      <paper-input label="Full name"
                  auto-validate
                  placeholder="&#8212;"
                  value="{{requester.name}}"
                  required
                  error-message="This is required">
      </paper-input>

      <paper-input label="Email"
                  auto-validate
                  placeholder="&#8212;"
                  value="{{requester.email}}"
                  required
                  error-message="This is required">
        <span  slot="suffix">@unicef.org</span>
      </paper-input>

      <paper-input label="Job title"
                  auto-validate
                  placeholder="&#8212;"
                  value="{{requester.job_title}}"
                  required
                  error-message="This is required">
      </paper-input>

      <etools-dropdown-lite label="Region"
                            options="[[regions]]"
                            required auto-validate
                            error-message="This is required"
                            selected="{{requester.region}}">
      </etools-dropdown-lite>

      <etools-dropdown-lite label="Country"
                            disabled$="[[!requester.region]]"
                            options="[[getCountriesForRegion(requester.region, countries)]]"
                            selected="{{requester.country}}"
                            error-message="This is required">
      </etools-dropdown-lite>

      <div class="error-box" hidden$="[[!errorMessage.length]]">
        <p>[[errorMessage]]</p>
      </div>

      <paper-button id="submitBtn" raised on-tap="_requestAccess"> Request access </paper-button>
      <paper-button raised on-tap="_goBack"> Back to log in </paper-button>

    `;

  }

  static get properties() {
    return {
      requester: {
        type: Object,
        value: {}
      },
      visible: {
        type: Boolean,
        observer: '_onVisibleChanged'
      },
      errorMessage: {
        type: String,
        value: ''
      },
      countries: Array,
      regions: Array,
    }
  }

  _onVisibleChanged() {
    if (this.visible) {
      this._fetchCountries();
      this._fetchRegions();
    } else {
      this.set('errorMessage', '');
      resetRequiredValidations(this)
    }
  }

  async _fetchCountries() {
    this.countries = this.countries || await makeRequest(Endpoints.countries);
  }

  async _fetchRegions() {
    this.regions = this.regions || await makeRequest(Endpoints.regions);
  }

  _goBack() {
    let goBackEvent = new CustomEvent('navigate-back', {
      detail: this.attachment,
      bubbles: true,
      composed: true

    });
    this.dispatchEvent(goBackEvent);
  }

  _showSuccessMessage() {
    let showSuccessEvent = new CustomEvent('submit-success', {
      detail: this.attachment,
      bubbles: true,
      composed: true

    });
    this.dispatchEvent(showSuccessEvent);
  }

  _showErrorMessage(response) {
    this.set('errorMessage', response || 'There was an error while processing your request');
  }

  _requestAccess() {
    if (!validateAllRequired(this)) {
      return;
    }

    this._disableSubmitButton();
    this.submitAccessRequest();
  }

  _disableSubmitButton() {
    this.$.submitBtn.disabled = true;
    setTimeout(() => {
      this.$.submitBtn.disabled = false;
    }, 10000);
  }

  getCountriesForRegion(regionId) {
  if (!regionId) {
    return null;
  }

    return this.countries.filter(country => Number(country.region) === Number(regionId));
  }

  submitAccessRequest() {
    makeRequest(Endpoints.requestAccess, this.requester).then((result) => {
        this._showSuccessMessage();
      }).catch((err) => {
        this._showErrorMessage(err.response);
      });
  }
}

window.customElements.define('request-access-form', RequestAccessForm);
