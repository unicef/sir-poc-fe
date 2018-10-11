/**
 * Authentication using microsoft account
 * MSAL - Microsoft authentication library (azure)
 *
 * https://github.com/azuread/microsoft-authentication-library-for-js/wiki/MSAL-basics
 * https://github.com/azuread/microsoft-authentication-library-for-js/wiki/Public-APIs
 */
class SirMsalAuthentication {

  constructor() {
    if (!SirMsalAuthentication._instance) {
      this.token = null;
      this.msal = this.configureMsal();
      SirMsalAuthentication._instance = this;
    }
    return SirMsalAuthentication._instance;
  }

  get clientId() {
    return "6f55045b-7da9-48df-9277-f2a170e60df0";
  }

  configureMsal() {
    return new Msal.UserAgentApplication(this.clientId, null, this.authCallback, this.msalConfigOptions());
  }

  msalConfigOptions() {
    const logger = new Msal.Logger(this.loggerCallback, {level: Msal.LogLevel.Verbose, correlationId: 'SIR_APP'});
    return {
      redirectUri: "http://localhost:8081/dashboard", // now the only URL configured to work for this
      cacheLocation: 'localStorage',
      logger: logger
    }
  }

  loggerCallback(logLevel, message, piiEnabled) {
    console.log(message);
  }

  authCallback(errorDesc, token, error, tokenType) {
    // This function is called after loginRedirect and acquireTokenRedirect. Not called with loginPopup
    // msal object is bound to the window object after the constructor is called.
    if (token) {
      this.token = token;
    }
    else {
      console.error(error + ":" + errorDesc);
    }
  }

  /**
   * Open login popup and set the token prop on success
   * @returns {Promise<T | never>}
   */
  login() {
    return this.msal.loginPopup()
        .then((token) => {
          this.token = token;
          return token;
        })
        .catch((error) => {
          console.error(error);
          throw new Error('Login failed!');
        });
  }

  logout() {
    this.msal.logout();
  }

  /**
   * Try to get logged user token. If no user is logged in or token expired, go to login
   * @returns {Promise<T | never>}
   */
  acquireTokenSilent() {
    return this.msal.acquireTokenSilent([this.clientId])
        .then((token) => {
          this.token = token;
          return token;
        });
  }

  acquireTokenRedirect() {
    // authCallback will run as a callback to this method
    return this.msal.acquireTokenRedirect([this.clientId]);
  }

  getUser() {
    return this.msal.getUser();
  }

  getToken() {
    return this.token;
  }

  getRequestsAuthHeader() {
    if (!this.token) {
      return null;
    }
    return {'Authorization': 'JWT ' + this.token};
  }

  decodeBase64Token() {
    if (!this.token) {
      return null;
    }
    let base64Url = this.token.split('.')[1];
    let base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
  }

  tokenIsValid() {
    let decodedToken = this.decodeBase64Token();
    if (!this.token || !decodedToken) {
      return false;
    }
    return Date.now() < Number(decodedToken.exp + '000');
  }

}

export const SirMsalAuth = new SirMsalAuthentication();
