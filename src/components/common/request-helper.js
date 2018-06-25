
import '@polymer/iron-ajax/iron-request.js';
import { Endpoints } from '../../config/endpoints.js';

// import { makeRequest } from '../common/request-helper.js';


let ironRequestElem;

const createIronRequestElement = function() {
  ironRequestElem = document.createElement('iron-request');
  document.querySelector('body').appendChild(ironRequestElem);
  return ironRequestElem;
};

const getRequestElement = function() {
  return ironRequestElem || createIronRequestElement();
};

const getRequestHeaders = function(withAuth) {
  // jwt logic goes here
  return null;
}

const generateRequestConfigOptions = function(endpoint, data) {
  let config =  {
      url: endpoint.url,
      method: endpoint.method,
      async: false,
      handleAs: 'json',
      headers: getRequestHeaders(endpoint.auth),
      body: data,
      withCredentials: true
  };
  return config;
};

export const makeRequest = function(endpointName, data = {}) {
  let endpoint = Endpoints[endpointName];
  let reqConfig = generateRequestConfigOptions(endpoint, data);
  let requestElem = getRequestElement();

  requestElem.send(reqConfig);
  return requestElem.completes.then(result => {
    return result.response;
  }).catch((error) => {
    // TODO: better error handling
    console.log('request failed with error', error);
  });
};
