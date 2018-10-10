import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';

/**
 * @customElement
 * @polymer
 *
 * MSAL - Microsoft authentication library (azure)
 */
class JWTLoginMSAL extends PolymerElement {
  static get template() {
    return html`
      <div>User: [[myUser]]</div>
     `;
  }

  static get properties() {
    return {
      msal: {
        type: Object,
        value: {}
      },
      config: {
        type: Object,
        value: {
          clientId: "6f55045b-7da9-48df-9277-f2a170e60df0",
          redirectUri: "http://localhost:8081/",
          popUp: true,
          response_type: 'code',
          cacheLocation: 'localStorage'
        }
      },
      myUser: {
        type: String,
        value: "Unknown User"
      }
    }
  }

  ready() {
    super.ready();
    console.log('WOOOO my jwt element is here - MSAL');
    const logger = new Msal.Logger(this.loggerCallback,
        { level: Msal.LogLevel.Verbose, correlationId: 'SIR_APP' });
    this.set("msal", new Msal.UserAgentApplication(
        this.config.clientId, null, this.authCallback,
        {
          redirectUri: "http://localhost:8081/dashboard", // now the only URL configured to work for this
          cacheLocation: 'localStorage',
          logger: logger
        }));
  }

  loggerCallback(logLevel, message, piiEnabled) {
    console.log(message);
  }

  authCallback(errorDesc, token, error, tokenType) {
    //This function is called after loginRedirect and acquireTokenRedirect. Not called with loginPopup
    // msal object is bound to the window object after the constructor is called.
    if (token) {
      console.log(token);
    }
    else {
      console.log(error + ":" + errorDesc);
    }
  }

  login() {
    self = this;
    this.msal.loginPopup().then(self.onSignin.bind(this));
  }

  onSignin(idToken) {
    // Check Login Status, Update UI
    console.log("onSignin() called");
    console.log(idToken);
    console.log(this);
    let user = this.msal.getUser();
    if (user) {
      this.set('myUser', user.name);
    } else {
      this.set('myUser', "No User");
    }
  }

  logout() {
    this.msal.logout();
    this.set('myUser', 'Unknown User')
  }

  getUser() {
    let user;
    user = this.msal.getUser();
    console.log(user);
    if (user) {
      this.set('myUser', user.name);
      return user;
    } else {
      return null;
    }
  }

  aquireTokenSilent() {
    this.msal.acquireTokenSilent([this.config.clientId])
        .then(token => console.log(token))
        .catch(error => console.log(error));
  }

  acquireTokenPopup() {
    this.msal.acquireTokenPopup([this.config.clientId])
        .then(token => console.log(token))
        .catch(error => console.log(error));
  }
}

window.customElements.define('jwt-login-msal', JWTLoginMSAL);
