/**
 * Authentication using microsoft account
 * MSAL - Microsoft authentication library (azure)
 *
 * https://github.com/azuread/microsoft-authentication-library-for-js/wiki/MSAL-basics
 * https://github.com/azuread/microsoft-authentication-library-for-js/wiki/Public-APIs
 */

const SIR_MSAL_CONF = {
  CLIENT_ID: '6f55045b-7da9-48df-9277-f2a170e60df0',
  TOKEN_L_STORAGE_KEY: 'sir-msal-token',
  REDIRECT_URI: 'http://localhost:8081/dashboard',
  CACHE_LOCATION: 'localStorage',
  MSAL_LOGGER_CORELATION_ID: 'SIR_APP'
};

class SirMsalAuthentication {

  constructor() {
    if (!SirMsalAuthentication._instance) {
      this.clientId = SIR_MSAL_CONF.CLIENT_ID;
      this.storeTokenKey = SIR_MSAL_CONF.TOKEN_L_STORAGE_KEY;
      this.token = this.getStoredToken();
      this.msal = this.configureMsal();
      SirMsalAuthentication._instance = this;
    }
    return SirMsalAuthentication._instance;
  }

  get token() {
    return this._token;
  }

  set token(token) {
    if (this._token !== token) {
      this._token = token;
      this.storeToken(this._token);
    }
  }

  configureMsal() {
    return new Msal.UserAgentApplication(this.clientId, null, this.authCallback, this.msalConfigOptions());
  }

  msalConfigOptions() {
    const logger = new Msal.Logger(this.loggerCallback,
        {level: Msal.LogLevel.Verbose, correlationId: SIR_MSAL_CONF.MSAL_LOGGER_CORELATION_ID});
    return {
      redirectUri: SIR_MSAL_CONF.REDIRECT_URI, // now the only URL configured to work for this
      cacheLocation: SIR_MSAL_CONF.CACHE_LOCATION,
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

  getRequestsAuthHeader() {
    if (!this.token) {
      return {};
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
    if (!decodedToken) {
      return false;
    }
    if (!navigator.onLine && decodedToken) {
      // if user is offline, but he was logged at least once,
      // then user should be able to access offline functionality
      return true;
    }
    return Date.now() < Number(decodedToken.exp + '000');
  }

  storeToken(token) {
    if (token === this.getStoredToken()) {
      return;
    }
    localStorage.setItem(this.storeTokenKey, token);
  }

  getStoredToken() {
    return localStorage.getItem(this.storeTokenKey);
  }

}

export const SirMsalAuth = new SirMsalAuthentication();
