
import '@polymer/iron-ajax/iron-request.js';
import { updatePath, redirectToLogin } from './navigation-helper.js';

// let ironRequestElem;

const createIronRequestElement = function() {
  let ironRequestElem = document.createElement('iron-request');
  // document.querySelector('body').appendChild(ironRequestElem);
  return ironRequestElem;
};

const getRequestElement = function() {
  return createIronRequestElement();
};

const generateRequestConfigOptions = function(endpoint, data) {
  let config =  {
      url: endpoint.url,
      method: endpoint.method,
      async: false,
      handleAs: 'json',
      headers: _getRequestHeaders({}),
      body: data,
      withCredentials: endpoint.auth
  };
  return config;
};


const _prepareResponse = function(response) {
  try {
    return JSON.parse(response);
  } catch (e) {
    return response;
  }
};

const SirRequestError = function(error, statusCode, statusText, response) {
  this.error = error;
  this.status = statusCode;
  this.statusText = statusText;
  this.response = _prepareResponse(response);
};

export const makeRequest = function(endpoint, data = {}) {
  let reqConfig = generateRequestConfigOptions(endpoint, data);
  let requestElem = getRequestElement();

  requestElem.send(reqConfig);
  return requestElem.completes.then(result => {
    return result.response;
  }).catch((error) => {
    console.log('error caught,', requestElem.xhr.status);
    if ([403, 401].indexOf(requestElem.xhr.status) > -1) {
      redirectToLogin();
    }
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

  let clientConfiguredHeaders = _getClientConfiguredHeaders(reqConfig.headers);
  let csrfHeaders = {};
  if (!_csrfSafeMethod(reqConfig.method)) {
    csrfHeaders = _getCsrfHeader(reqConfig.csrfCheck);
  }
  headers = Object.assign({}, headers, clientConfiguredHeaders, csrfHeaders);

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
  for (let key in data) {
    endpointCpy.url = endpointCpy.url.replace('<%='+ key + '%>', data[key]);
  }
  return endpointCpy;
}
