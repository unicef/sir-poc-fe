/**
 * Authentication using microsoft account
 * MSAL - Microsoft authentication library (azure)
 *
 * https://github.com/azuread/microsoft-authentication-library-for-js/wiki/MSAL-basics
 * https://github.com/azuread/microsoft-authentication-library-for-js/wiki/Public-APIs
 */

const SIR_MSAL_CONF = {
  dev: {
    client_id: '6f55045b-7da9-48df-9277-f2a170e60df0',
    token_l_storage_key: 'sir-msal-token-dev',
    logger_config: {
      log_level: 'dev',
      msal_logger_corelation_id: 'SIR_APP_DEV'
    },
    authority: null,
    user_agent_app_config: {
      redirectUri: 'http://localhost:8081/dashboard', // just for testing
      cacheLocation: 'localStorage'
    }
  },
  prod: {
    client_id: '7ccab667-58ff-44de-b8fa-4e90c0ec6fde',
    token_l_storage_key: 'sir-msal-token',
    logger_config: {
      log_level: 'prod',
      msal_logger_corelation_id: 'SIR_APP'
    },
    authority: 'https://login.microsoftonline.com/unicef.org',
    user_agent_app_config: {
      redirectUri: window.location.origin + '/dashboard',
      cacheLocation: 'localStorage'
    }
  }
};

class SirMsalAuthentication {

  constructor() {
    if (!SirMsalAuthentication._instance) {
      this.config = this.isDevEnv() ? SIR_MSAL_CONF.dev : SIR_MSAL_CONF.prod;
      this.token = this.getStoredToken();
      this.msal = this.configureMsal();
      SirMsalAuthentication._instance = this;
    }
    return SirMsalAuthentication._instance;
  }

  isDevEnv() {
    return window.location.href.indexOf('localhost') > -1;
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
    return new Msal.UserAgentApplication(this.config.client_id, this.config.authority,
        this.authCallback, this.msalConfigOptions());
  }

  msalConfigOptions() {
    const logger = this.getLogger();
    return Object.assign({}, this.config.user_agent_app_config, {logger: logger});
  }

  /**
   * possible values: Error, Warning, Info, Verbose
   * level:
   *    - dev = Msal.LogLevel.Verbose
   *    - prod = Msal.LogLevel.Warning
   * @returns {Msal.Logger}
   */
  getLogger() {
    return new Msal.Logger(this.loggerCallback, {
      level: this.config.logger_config.log_level === 'dev' ? Msal.LogLevel.Verbose : Msal.LogLevel.Warning,
      correlationId: this.config.logger_config.msal_logger_corelation_id
    });
  }

  loggerCallback(logLevel, message, piiEnabled) {
    // eslint-disable-next-line
    console.log(message);
  }

  authCallback(errorDesc, token, error, tokenType) {
    // This function is called after loginRedirect and acquireTokenRedirect. Not called with loginPopup
    // msal object is bound to the window object after the constructor is called.
    if (token) {
      this.token = token;
    }
    else {
      // eslint-disable-next-line
      console.error(error + ':' + errorDesc);
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
          // eslint-disable-next-line
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
    return this.msal.acquireTokenSilent([this.config.client_id])
        .then((token) => {
          this.token = token;
          return token;
        });
  }

  acquireTokenRedirect() {
    // authCallback will run as a callback to this method
    return this.msal.acquireTokenRedirect([this.config.client_id]);
  }

  getUser() {
    return this.msal.getUser();
  }

  getRequestsAuthHeader() {
    return {'Authorization': 'JWT ' + (this.token ? this.token : this.getStoredToken())};
  }

  decodeBase64Token(token) {
    if (!token) {
      return null;
    }
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
  }

  tokenIsValid() {
    let decodedToken = this.decodeBase64Token(this.token);
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
    localStorage.setItem(this.config.token_l_storage_key, token);
  }

  getStoredToken() {
    return localStorage.getItem(this.config.token_l_storage_key);
  }

}

export const SirMsalAuth = new SirMsalAuthentication();
