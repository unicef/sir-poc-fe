import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-button/paper-button.js';
import { SirMsalAuth } from './jwt/msal-authentication.js';

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
      </style>

      <div class="icons">
        <img src="../../../images/unicef_logo_round.png" id="unicef-icon"></img>
        <img src="../../../images/manifest/icon-96x96.png" id="sir-icon"></img>
        <iron-icon id="login-icon" icon="account-circle"></iron-icon>
      </div>
      <div id="login-area">
        <h1>Welcome to UNICEF SIR</h1>
        <p>Sign into your Microsoft Account</p>
        <paper-button raised on-tap="_login">Sign In <iron-icon icon="arrow-forward"></iron-icon></paper-button>
      </div>
    `;
  }

  _login() {
    SirMsalAuth.login().then(() => {
      window.location.reload();
    });
  }
}

window.customElements.define('sir-login', SirLogin);
