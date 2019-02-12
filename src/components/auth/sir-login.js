import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import { SirMsalAuth } from './jwt/msal-authentication.js';
import { validateAllRequired } from '../common/validations-helper.js';

/**
 * @customElement
 * @polymer
 */
class SirLogin extends PolymerElement {

  // Define optional shadow DOM template
  static get template() {
    // language=HTML
    return html`
      <style>
        :host {
          @apply --layout-horizontal;
          @apply --layout-center;
          padding: 28px;
          margin: 12px;
          color: rgba(0, 0, 0, 0.87);
          flex-wrap: wrap;
          border-radius: 5px;
          background-color: #fff;
          box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
                      0 1px 5px 0 rgba(0, 0, 0, 0.12),
                      0 3px 1px -2px rgba(0, 0, 0, 0.2);
        }

        paper-button {
          margin: 0;
          background-color: #1CABE2;
          color: #fff;
          font-weight: bold;
          padding: 5px 10px;
        }

        paper-button iron-icon {
          width: 20px;
          height: 20px;
          margin-left: 8px;
        }

        #login-icon {
          margin-right: 48px;
          width: 100px;
          height: 100px;
          color: #1CABE2;
        }

        #unicef-icon {
          width: 83.3333px;
          height: 83.3333px;
        }

        #sir-icon {
          margin-left: 8.3333px;
          width: 83.3333px;
          height: 83.3333px;
        }

        .icons {
          @apply --layout-horizontal;
          @apply --layout-center;
          text-align: center;
        }

        paper-input {
          margin-bottom: 8px;
        }
      </style>

      <div class="icons">
        <img src="../../../images/unicef_logo_round.png" id="unicef-icon"></img>
        <img src="../../../images/manifest/icon-96x96.png" id="sir-icon"></img>
        <iron-icon id="login-icon" icon="account-circle"></iron-icon>
      </div>
      <div id="login-area">
        <div hidden$="[[hideLoginForm]]">
          <h1>Welcome to UNICEF SIR</h1>
          <p>Sign into your Microsoft Account</p>
          <paper-button raised on-tap="_login"> Sign In <iron-icon icon="arrow-forward"></iron-icon></paper-button>
          <paper-button raised on-tap="_showRequestAccessForm"> Request Access </paper-button>
        </div>
        <div hidden$="[[!hideLoginForm]]">
          <p> Tell us more about you </p>
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
                       value="{{requester.name}}"
                       required
                       error-message="This is required">
          </paper-input>
          <paper-input label="Duty station"
                       auto-validate
                       placeholder="&#8212;"
                       value="{{requester.city}}"
                       required
                       error-message="This is required">
          </paper-input>
          <br>
          <br>
          <paper-button raised on-tap="_requestAccess"> Request access </paper-button>
          <paper-button raised on-tap="_showLoginForm"> Back to log in </paper-button>
        </div>

      </div>
    `;

  }

  static get properties() {
    return {
      hideLoginForm: {
        type: Boolean,
        value: false
      },
      requester: {
        type: Object,
        value: {}
      }
    }
  }

  _validate() {
    return validateAllRequired(this);
  }

  _showRequestAccessForm() {
    this.hideLoginForm = true;
  }

  _showLoginForm() {
    this.hideLoginForm = false;
  }

  _login() {
    SirMsalAuth.login().then(() => {
      window.location.reload();
    });
  }

  _requestAccess() {
    console.log('Request access, show me a success message. Then take me back to the login form.');
  }
}

window.customElements.define('sir-login', SirLogin);
