class SirMsalAuthentication {

  constructor() {
    if (!SirMsalAuthentication._instance) {
      this.configureMsal();
      SirMsalAuthentication._instance = this;
    }
    return SirMsalAuthentication._instance;
  }

  static get clientId() {
    return "6f55045b-7da9-48df-9277-f2a170e60df0";
  }

  configureMsal() {
    console.log('Configure MSAL');
    this.msal = new Msal.UserAgentApplication(this.clientId, null, this.authCallback, this.msalConfigOptions());
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

}

export const SirMsalAuth = new SirMsalAuthentication();
