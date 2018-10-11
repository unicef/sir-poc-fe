import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-button/paper-button.js';

import {SirMsalAuth} from './jwt/msal-authentication.js';
import {updatePath} from "../common/navigation-helper";

class SirLogin extends PolymerElement {

  // Define optional shadow DOM template
  static get template() {
    // language=HTML
    return html`
      <style>
        :host {
          @apply --layout-horizontal;
          @apply --layout-center;
          /*@apply --layout-center-justified;*/

          padding: 24px;
          margin: 24px;
          color: var(--primary-text-color);
          border-radius: 5px;
          background-color: #fff;
          box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
                      0 1px 5px 0 rgba(0, 0, 0, 0.12),
                      0 3px 1px -2px rgba(0, 0, 0, 0.2);
        }

        paper-button {
          margin: 0;
          background-color: var(--primary-color);
          color: var(--light-primary-text-color, #fff);
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
          color: var(--primary-color);
        }
      </style>

      <iron-icon id="login-icon" icon="account-circle"></iron-icon>
      <div id="login-area">
        <h1>Hello, there</h1>
        <p>Sign into your Microsoft Account</p>
        <paper-button raised on-tap="_login">Sign In <iron-icon icon="arrow-forward"></iron-icon></paper-button>
      </div>
    `;
  }

  static get properties() {
    return {}
  }

  connectedCallback() {
    super.connectedCallback()
  }

  _login() {
    SirMsalAuth.login().then(() => {
      this._goToLandingPage();
    });
  }

  _goToLandingPage() {
    updatePath('dashboard');
  }

}

window.customElements.define('sir-login', SirLogin);
