import { makeRequest, prepareEndpoint } from '../components/common/request-helper.js';
import { Endpoints } from '../config/endpoints.js';
import { objDiff } from '../components/common/utils.js';
import { scrollToTop } from '../components/common/content-container-helper.js';
import { updatePath } from '../components/common/navigation-helper.js';
import { generateRandomHash } from './action-helpers.js';

export const EDIT_INCIDENT_SUCCESS = 'EDIT_INCIDENT_SUCCESS';
export const ADD_INCIDENT_SUCCESS = 'ADD_INCIDENT_SUCCESS';
export const ADD_INCIDENT_FAIL = 'ADD_INCIDENT_FAIL';
export const RECEIVE_INCIDENTS = 'RECEIVE_INCIDENTS';
export const RECEIVE_INCIDENT = 'RECEIVE_INCIDENT';
export const UPDATE_EVENT_IDS = 'UPDATE_EVENT_IDS';

const editIncidentSuccess = (incident, id) => {
  return {
    type: EDIT_INCIDENT_SUCCESS,
    incident,
    id
  };
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

const receiveIncidents = (incidents) => {
  return {
    type: RECEIVE_INCIDENTS,
    incidents
  };
}

const receiveIncident = (incident) => {
  return {
    type: RECEIVE_INCIDENT,
    incident
  };
}

const updateEventIds = (newId, oldId) => {
  return {
    type: UPDATE_EVENT_IDS,
    oldId, newId
  };
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

const addIncidentOffline = (newIncident, dispatch) => {
  newIncident.id = generateRandomHash();
  newIncident.unsynced = true;

  dispatch(addIncidentSuccess(newIncident));
  updatePath('/incidents/list/');
}

const editIncidentOnline = (incident, dispatch, state) => {
  let origIncident = state.incidents.list.find(elem => elem.id === incident.id);
  let modifiedFields = objDiff(origIncident, incident);
  let endpoint = prepareEndpoint(Endpoints.editIncident, {id: incident.id});

  makeRequest(endpoint, modifiedFields).then((result) => {
    dispatch(fetchIncidents());
    updatePath('/incidents/list/');
  }).catch((error) => {
    dispatch(addIncidentFail(error.response));
    scrollToTop();
  });
}

const editIncidentOffline = (incident, dispatch) => {
  incident.unsynced = true;
  dispatch(editIncidentSuccess(incident, incident.id));
  updatePath('/incidents/list/');
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
    editIncidentOffline(incident, dispatch);
  } else {
    editIncidentOnline(incident, dispatch, getState());
  }
}

export const syncIncident = (newIncident) => (dispatch, getState) => {
  makeRequest(Endpoints.newIncident, newIncident).then((result) => {
    let response = JSON.parse(result);
    dispatch(editIncidentSuccess(response, newIncident.id));
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

export const updateEventIdsInIncidents = (oldId, newId) => (dispatch) => {
  dispatch(updateEventIds(newId, oldId));
}

export const fetchIncident = (id) => (dispatch, getState) => {
  let endpoint = prepareEndpoint(Endpoints.getIncident,  {id: id});
  makeRequest(endpoint).then((response) => {
    dispatch(receiveIncident(JSON.parse(response)));
  });
};
