import { makeRequest, prepareEndpoint } from '../components/common/request-helper.js';
import { Endpoints } from '../config/endpoints.js';
import { scrollToTop } from '../components/common/content-container-helper.js';
import { updatePath } from '../components/common/navigation-helper.js';
import { generateRandomHash } from './action-helpers.js';

export const ADD_INCIDENT_SUCCESS = 'ADD_INCIDENT_SUCCESS';
export const ADD_INCIDENT_FAIL = 'ADD_INCIDENT_FAIL';
export const RECEIVE_INCIDENTS = 'RECEIVE_INCIDENTS';

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

const receiveIncidents = (incidents) => {
  return {
    type: RECEIVE_INCIDENTS,
    incidents
  };
}

const addIncidentOffline = (newIncident, dispatch) => {
  newIncident.id = generateRandomHash();
  newIncident.unsynced = true;

  dispatch(addIncidentSuccess(newIncident));
  updatePath('/incidents/list/');
}

const addIncidentOnline = (newIncident, dispatch) => {
  makeRequest(Endpoints.newIncident, newIncident).then((result) => {
    dispatch(addIncidentSuccess(JSON.parse(result)));
    updatePath('/incidents/list/');
  }).catch((error) => {
    dispatch(addIncidentFail(error.response));
    scrollToTop();
  });
}

export const fetchIncidents = () => (dispatch, getState) => {
  makeRequest(Endpoints.incidentsList).then((result) => {
    dispatch(receiveIncidents(JSON.parse(result)));
  });
}

export const addIncident = (newIncident) => (dispatch, getState) => {
  if (getState().app.offline === true) {
    addIncidentOffline(newIncident, dispatch);
  } else {
    addIncidentOnline(newIncident, dispatch);
  }
}

export const editIncident = (incident) => (dispatch, getState) => {
  if (getState().app.offline === true) {
    console.log('Can\'t edit offline yet');
    return;
  }

  let endpoint = prepareEndpoint(Endpoints.editIncident, {id: incident.id});

  makeRequest(endpoint, incident).then((result) => {
    dispatch(fetchIncidents());
    updatePath('/incidents/list/');
  }).catch((error) => {
    dispatch(addIncidentFail(error.response));
    scrollToTop();
  });
}
