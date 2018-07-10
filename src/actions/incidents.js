import { makeRequest, prepareEndpoint } from '../components/common/request-helper.js';
import { Endpoints } from '../config/endpoints.js';
import { scrollToTop } from '../components/common/content-container-helper.js';
import { updatePath } from '../components/common/navigation-helper.js';

export const ADD_INCIDENT_SUCCESS = 'ADD_INCIDENT_SUCCESS';
export const ADD_INCIDENT_FAIL = 'ADD_INCIDENT_FAIL';
export const RECEIVE_INCIDENTS = 'RECEIVE_INCIDENTS';

export const addIncident = (newIncident) => (dispatch, getState) => {
  if (getState().app.offline === false) {
    // try and send the data straight to the server maybe?
  }
  makeRequest(Endpoints.newIncident, newIncident).then((result) => {
    dispatch(addIncidentSuccess(JSON.parse(result)));
    updatePath('/incidents/list/');
  }).catch((error) => {
    dispatch(addIncidentFail(error.response));
    scrollToTop();
  });
}

export const editIncident = (incident) => (dispatch, getState) => {
  if (getState().app.offline === false) {
    // try and send the data straight to the server maybe?
  }
  let endpoint = prepareEndpoint(Endpoints.editIncident, {id: incident.id});

  // return;

  makeRequest(endpoint, incident).then((result) => {
    dispatch(fetchIncidents());
    updatePath('/incidents/list/');
  }).catch((error) => {
    dispatch(addIncidentFail(error.response));
    scrollToTop();
  });
}

const addIncidentSuccess = (newIncident) => {
  return {
    type: ADD_INCIDENT_SUCCESS,
    newIncident
  };
}

const addIncidentFail = (serverError) => {
  return {
    type: ADD_INCIDENT_FAIL,
    serverError
  };
}


export const fetchIncidents = () => (dispatch, getState) => {
  makeRequest(Endpoints.incidentsList).then((result) => {
    dispatch(receiveIncidents(JSON.parse(result)));
  });
}

const receiveIncidents = (incidents) => {
  return {
    type: RECEIVE_INCIDENTS,
    incidents
  };
}
