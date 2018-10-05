
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';


import '@polymer/polymer/polymer-element.js';
// import '@polymer/iron-ajax/iron-ajax.js';
// import '@polymer/paper-button/paper-button.js';
// import '@polymer/iron-localstorage/iron-localstorage.js'


class JWTLogin extends PolymerElement {
  static get template() {
    return html`
      <div>User: [[myUser]]</div>
     `;
  }
  static get is() { return 'jwt-login'; }


  static get properties() {
    return {
       adal: {
          type: Object,
          value: {}
        },
        prop1: {
          type: String,
          value: 'Booo'
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
    this.set("adal", new window.AuthenticationContext(
      {
          instance: 'https://login.microsoftonline.com/',
          tenant: "77410195-14e1-4fb8-904b-ab1892023667",
          clientId: "d1bd79b5-29c6-472e-8f66-f2c145b6aa5d",
          redirectUri: "http://localhost:8081/",
          postLogoutRedirectUri: "http://localhost:8082/login/", //# window.location.origin,
          cacheLocation: 'localStorage',
          popUp: true
      }));
     // this.adal.handleWindowCallback();
  }
  login() {
    this.adal.login()
  }
  logout() {
    this.adal.logOut();
    this.set('myUser', 'Unknown User')
  }
  getUser() {
      let user;
      user = this.adal.getCachedUser();
      console.log(user);
      if (user) {
        this.set('myUser', user.profile.name);
        return user
      } else {
        return null
      }
      
      
  }
}

window.customElements.define('jwt-login', JWTLogin);
