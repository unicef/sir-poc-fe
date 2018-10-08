
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';


import '@polymer/polymer/polymer-element.js';
// import '@polymer/iron-ajax/iron-ajax.js';
// import '@polymer/paper-button/paper-button.js';
// import '@polymer/iron-localstorage/iron-localstorage.js'


class JWTLoginMSAL extends PolymerElement {
  static get template() {
    return html`
      <div>User: [[myUser]]</div>
     `;
  }
  static get is() { return 'jwt-login-msal'; }


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
            popUp: true
          }
        },
        myUser: {
            type: String,
            value: "Unknown User"
        }
    }
  }
  ready() {
    super.ready()
    console.log('WOOOO my jwt element is here');
    this.set("msal", new Msal.UserAgentApplication(this.config.clientId, null, this.authCallback));
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
    this.msal.loginPopup().then(self.onSignin.bind(this))
  }
  onSignin(idToken) {
        // Check Login Status, Update UI
        console.log("onsognin called");
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
    this.msal.logOut();
    this.set('myUser', 'Unknown User')
  }
  getUser() {
      let user;
      user = this.msal.getUser();
      console.log(user);
      if (user) {
        this.set('myUser', user.profile.name);
        return user
      } else {
        return null
      }


  }
}

window.customElements.define('jwt-login-msal', JWTLoginMSAL);
