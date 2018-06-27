import '@polymer/iron-ajax/iron-request.js';

function EtoolsRequestError(error, statusCode, statusText, response) {
  this.error = error;
  this.status = statusCode;
  this.statusText = statusText;
  this.response = _prepareResponse(response);
}

function _prepareResponse(response) {
  try {
    return JSON.parse(response);
  } catch (e) {
    return response;
  }
}

class EtoolsAjaxReqLite {

  constructor() {
    if (!EtoolsAjaxReqLite._instance) {
      EtoolsAjaxReqLite._instance = this;
    }
    return EtoolsAjaxReqLite._instance;
  }

  /**
   * fire new request
   * returns Promise
   */
  request(reqConfig) {
    // prepare request config options
    let reqConfigOptions = this._prepareConfigOptions(reqConfig);
    // make request
    return this._doRequest(reqConfigOptions);
  }

  /**
   * Fire new request
   */
  _doRequest(reqConfigOptions) {
    let request = /** @type {!IronRequestElement} */ (document.createElement('iron-request'));
    request.send(reqConfigOptions);
    return request.completes.then(function (request) {
      let responseData = request.response;
      if (reqConfigOptions.handleAs === 'json' && typeof responseData === 'string') {
        responseData = _prepareResponse(responseData);
      }
      return responseData;
    }).catch(function (request, error) {
      if (!request.aborted && request.xhr.status === 0) {
        // not an error, this is an asynchronous request that is not completed yet
        return;
      }
      // request failed
      // check request aborted, no error handling in this case
      if (!request.aborted) {
        throw new EtoolsRequestError(error, request.xhr.status, request.xhr.statusText, request.xhr.response);
      } else {
        throw new EtoolsRequestError(error, 0, 'Request aborted', null);
      }
    }.bind(this, request));
  }

  _prepareConfigOptions(reqConfig) {
    return {
      url: this._getRequestUrl(reqConfig),
      method: reqConfig.method || 'GET',
      headers: this._getRequestHeaders(reqConfig),
      body: this._getRequestBody(reqConfig),
      async: !reqConfig.sync,
      handleAs: this._getHandleAs(reqConfig),
      jsonPrefix: reqConfig.jsonPrefix || '',
      withCredentials: !!reqConfig.withCredentials,
      timeout: reqConfig.timeout || 0
    };
  }

  _getHandleAs(reqConfig) {
    let handleAs = reqConfig.handleAs || 'json';
    if (reqConfig.downloadCsv) {
      handleAs = 'blob';
    }
    return handleAs;
  }

  _getRequestUrl(reqConfig) {
    let url = '';
    if (reqConfig.url) {
      url = reqConfig.url;
      url += this._buildQueryString(url, reqConfig.params);
    }
    return url;
  }

  _buildQueryString(url, params) {
    let queryStr = '';
    if (!params || (Object.keys(params).length === 0 && params.constructor === Object)) {
      return '';
    }
    if (url.indexOf('?') < 0) {
      queryStr = '?';
    } else {
      queryStr = '&';
    }
    /* eslint-disable guard-for-in */
    for (let key in params) {
      queryStr += key + '=' + params[key] + '&';
    }
    /* eslint-enable guard-for-in */

    // remove trailing &
    queryStr = queryStr.substring(0, queryStr.length - 1);
    return queryStr;
  }

  _getRequestBody(reqConfig) {
    return reqConfig.body || {};
  }

  _getRequestHeaders(reqConfig) {
    let headers = {};

    headers['content-type'] = this._determineContentType(reqConfig.body);

    if (reqConfig.downloadCsv) {
      headers['accept'] = 'text/csv';
      headers['content-type'] = 'text';
    }

    let clientConfiguredHeaders = this._getClientConfiguredHeaders(reqConfig.headers);
    let csrfHeaders = {};
    if (!this._csrfSafeMethod(reqConfig.method)) {
      csrfHeaders = this._getCsrfHeader(reqConfig.csrfCheck);
    }
    headers = Object.assign({}, headers, clientConfiguredHeaders, csrfHeaders);

    if (reqConfig.multiPart) {
      // content type will be automatically set in this case
      delete headers['content-type'];
    }

    return headers;
  }

  _getClientConfiguredHeaders(additionalHeaders) {
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
  }

  _getCsrfHeader(csrfCheck) {
    let csrfHeaders = {};
    if (csrfCheck !== 'disabled') {
      let csrfToken = this._getCSRFCookie();

      if (csrfToken) {
        csrfHeaders['x-csrftoken'] = csrfToken;
      }
    }
    return csrfHeaders;
  }

  _csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
  }

  _getCSRFCookie() {
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
  }

  /**
   * Content-Type set here can be overridden later
   * by headers sent from the client
   */
  _determineContentType(body) {
    let contentType = 'application/json';

    if (typeof body === 'string') {
      contentType = 'application/x-www-form-urlencoded';
    }

    return contentType;
  }

}

export const EtoolsAjaxLite = Object.freeze(new EtoolsAjaxReqLite());
