import '@polymer/iron-ajax/iron-request.js';
import { SirMsalAuth } from '../auth/jwt/msal-authentication';

class SirRequestError {
  constructor(error, statusCode, statusText, response) {
    this.error = error;
    this.status = statusCode;
    this.statusText = statusText;
    this.response = this._prepareResponse(response);
  }

  _prepareResponse(response) {
    try {
      return JSON.parse(response);
    } catch (e) {
      return response;
    }
  }
}

const createIronRequestElement = () => {
  let ironRequestElem = document.createElement('iron-request');
  return ironRequestElem;
};

const generateRequestConfigOptions = (endpoint, data) => {
  let config = {
      url: endpoint.url,
      method: endpoint.method,
      async: true,
      handleAs: endpoint.handleAs || 'json',
      headers: _getRequestHeaders({}),
      body: data,
      withCredentials: endpoint.auth
  };
  return config;
};

export const makeRequest = (endpoint, data = {}) => {
  if (endpoint.cachingPeriod) {
    return makeCachedRequest(endpoint, data);
  }

  return makeUncachedRequest(endpoint, data);
};

const makeCachedRequest = (endpoint, data) => {
  if (endpoint._cachedData) {
    return Promise.resolve(JSON.parse(JSON.stringify(endpoint._cachedData)));
  }

  return makeUncachedRequest(endpoint, data).then((result) => {
    endpoint._cachedData = JSON.parse(JSON.stringify(result));
    setTimeout(() => delete endpoint._cachedData, endpoint.cachingPeriod);
    return result;
  });
};

const makeUncachedRequest = function(endpoint, data) {
  let reqConfig = generateRequestConfigOptions(endpoint, data);
  let requestElem = createIronRequestElement();
  requestElem.send(reqConfig);
  return requestElem.completes.then((result) => {
    return result.response;
  }).catch((error) => {
    throw new SirRequestError(error, requestElem.xhr.status, requestElem.xhr.statusText, requestElem.xhr.response);
  });
};

const _getCSRFCookie = () => {
  // check for a csrftoken cookie and return its value
  let csrfCookieName = 'csrftoken';
  let csrfToken = null;
  if (document.cookie && document.cookie !== '') {
    let cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, csrfCookieName.length + 1) === (csrfCookieName + '=')) {
        csrfToken = decodeURIComponent(cookie.substring(csrfCookieName.length + 1));
        break;
      }
    }
  }
  return csrfToken;
};

const _getCsrfHeader = (csrfCheck) => {
  let csrfHeaders = {};
  if (csrfCheck !== 'disabled') {
    let csrfToken = _getCSRFCookie();

    if (csrfToken) {
      csrfHeaders['x-csrftoken'] = csrfToken;
    }
  }
  return csrfHeaders;
};


const _getRequestHeaders = (reqConfig) => {
  let headers = {};

  headers['content-type'] = 'application/json';

  if (reqConfig.downloadCsv) {
    headers['accept'] = 'text/csv';
    headers['content-type'] = 'text';
  }

  const authorizationHeader = SirMsalAuth.tokenIsValid()
      ? SirMsalAuth.getRequestsAuthHeader()
      : {};

  let clientConfiguredHeaders = _getClientConfiguredHeaders(reqConfig.headers);
  let csrfHeaders = {};
  if (!_csrfSafeMethod(reqConfig.method)) {
    csrfHeaders = _getCsrfHeader(reqConfig.csrfCheck);
  }
  headers = Object.assign({}, headers, clientConfiguredHeaders, csrfHeaders, authorizationHeader);

  if (reqConfig.multiPart) {
    // content type will be automatically set in this case
    delete headers['content-type'];
  }

  return headers;
};

const _getClientConfiguredHeaders = (additionalHeaders) => {
  let header;
  let clientHeaders = {};
  if (additionalHeaders && additionalHeaders instanceof Object) {
    /* eslint-disable guard-for-in */
    for (header in additionalHeaders) {
      clientHeaders[header] = additionalHeaders[header].toString();
    }
    /* eslint-enable guard-for-in */
  }
  return clientHeaders;
};


const _csrfSafeMethod = (method) => {
  // these HTTP methods do not require CSRF protection
  return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
};

export const prepareEndpoint = (endpoint, data) => {
  let endpointCpy = JSON.parse(JSON.stringify(endpoint));

  Object.keys(data).forEach((key) => {
    endpointCpy.url = endpointCpy.url.replace('<%='+ key + '%>', encodeURI(data[key]));
  });

  return endpointCpy;
};

export const handleBlobDataReceivedAndStartDownload = (blob, filename) => {
  if (window.navigator.userAgent.indexOf('Trident/') > -1) {
    window.navigator.msSaveBlob(blob, filename);
  } else {
    // create a blob url representing the data
    let url = window.URL.createObjectURL(blob);
    // attach blob url to anchor element with download attribute
    let anchor = document.createElement('a');
    anchor.setAttribute('href', url);
    anchor.setAttribute('download', filename);

    //* anchor.click() doesn't work on ff, edge
    anchor.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true, view: window}));

    setTimeout(() => {
      window.URL.revokeObjectURL(url);
    }, 100);
  }
};
