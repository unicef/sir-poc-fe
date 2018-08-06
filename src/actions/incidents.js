import { makeRequest, prepareEndpoint } from '../components/common/request-helper.js';
import { Endpoints } from '../config/endpoints.js';
import { objDiff } from '../components/common/utils.js';
import { scrollToTop } from '../components/common/content-container-helper.js';
import { updatePath } from '../components/common/navigation-helper.js';
import { generateRandomHash } from './action-helpers.js';
import { serverError } from './errors.js'

export const EDIT_INCIDENT_SUCCESS = 'EDIT_INCIDENT_SUCCESS';
export const ADD_INCIDENT_SUCCESS = 'ADD_INCIDENT_SUCCESS';
export const ADD_INCIDENT_FAIL = 'ADD_INCIDENT_FAIL';
export const RECEIVE_INCIDENTS = 'RECEIVE_INCIDENTS';
export const RECEIVE_INCIDENT = 'RECEIVE_INCIDENT';
export const UPDATE_EVENT_IDS = 'UPDATE_EVENT_IDS';
export const RECEIVE_INCIDENT_COMMENTS = 'RECEIVE_INCIDENT_COMMENTS';
export const ADD_INCIDENT_COMMENT_SUCCESS = 'ADD_INCIDENT_COMMENT_SUCCESS';

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

const addCommentSuccess = (comment) => {
  return {
    type: ADD_INCIDENT_COMMENT_SUCCESS,
    comment
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

const receiveIncidentComments = (comments) => {
  return {
    type: RECEIVE_INCIDENT_COMMENTS,
    comments
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
  return makeRequest(Endpoints.newIncident, newIncident).then((result) => {
    dispatch(addIncidentSuccess(JSON.parse(result)));
    updatePath('/incidents/list/');
    return true;
  }).catch((error) => {
    dispatch(addIncidentFail(error.response));
    scrollToTop();
    return false;
  });
}

const addCommentOnline = (comment, dispatch) => {
  return makeRequest(Endpoints.addIncidentComment, comment).then((result) => {
    dispatch(addCommentSuccess(JSON.parse(result)));
    return true;
  }).catch((error) => {
    dispatch(serverError(error.response));
    return false;
  });
}

const addIncidentOffline = (newIncident, dispatch) => {
  newIncident.id = generateRandomHash();
  newIncident.unsynced = true;
  updatePath('/incidents/list/');
  dispatch(addIncidentSuccess(newIncident));
  return true;
}

const editIncidentOnline = (incident, dispatch, state) => {
  let origIncident = state.incidents.list.find(elem => elem.id === incident.id);
  let modifiedFields = objDiff(origIncident, incident);
  let endpoint = prepareEndpoint(Endpoints.editIncident, {id: incident.id});

  makeRequest(endpoint, modifiedFields).then((result) => {
    updatePath('/incidents/list/');
    dispatch(fetchIncidents());
  }).catch((error) => {
    dispatch(addIncidentFail(error.response));
    scrollToTop();
  });
}

const editIncidentOffline = (incident, dispatch) => {
  incident.unsynced = true;
  updatePath('/incidents/list/');
  dispatch(editIncidentSuccess(incident, incident.id));
}

export const addIncident = (newIncident) => (dispatch, getState) => {
  if (getState().app.offline === true) {
    return addIncidentOffline(newIncident, dispatch);
  } else {
    return addIncidentOnline(newIncident, dispatch);
  }
}

export const addComment = (comment) => (dispatch, getState) => {
  return addCommentOnline(comment, dispatch);
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
    updatePath('/incidents/list/');
    let response = JSON.parse(result);
    dispatch(editIncidentSuccess(response, newIncident.id));
  }).catch((error) => {
    dispatch(addIncidentFail(error.response));
    scrollToTop();
  });
}

export const fetchIncidents = () => (dispatch, getState) => {
  if (getState().app.offline !== true) {
    makeRequest(Endpoints.incidentsList).then((result) => {
      dispatch(receiveIncidents(JSON.parse(result)));
    });
  }
}

export const fetchIncidentComments = () => (dispatch, getState) => {
  if (getState().app.offline !== true) {
    makeRequest(Endpoints.incidentsCommentsList).then((result) => {
      dispatch(receiveIncidentComments(JSON.parse(result)));
    });
  }
}

export const updateEventIdsInIncidents = (oldId, newId) => (dispatch) => {
  dispatch(updateEventIds(newId, oldId));
}

export const fetchIncident = (id) => (dispatch, getState) => {
  if (getState().app.offline === true) {
    return;
  }
  if (isNaN(id)) {
    updatePath('/incidents/list/');
    return;
  }
  let endpoint = prepareEndpoint(Endpoints.getIncident,  {id: id});
  makeRequest(endpoint).then((response) => {
    dispatch(receiveIncident(JSON.parse(response)));
  });
};
