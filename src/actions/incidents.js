import { makeRequest, prepareEndpoint } from '../components/common/request-helper.js';
import { Endpoints } from '../config/endpoints.js';
import { objDiff } from '../components/common/utils.js';
import { scrollToTop } from '../components/common/content-container-helper.js';
import { updatePath } from '../components/common/navigation-helper.js';
import { generateRandomHash } from './action-helpers.js';
import { serverError, PLAIN_ERROR } from './errors.js';

export const ADD_INCIDENT_COMMENT_SUCCESS = 'ADD_INCIDENT_COMMENT_SUCCESS';
export const RECEIVE_INCIDENT_COMMENTS = 'RECEIVE_INCIDENT_COMMENTS';
export const ADD_EVACUATION_SUCCESS = 'ADD_EVACUATION_SUCCESS';
export const EDIT_INCIDENT_SUCCESS = 'EDIT_INCIDENT_SUCCESS';
export const ADD_INCIDENT_SUCCESS = 'ADD_INCIDENT_SUCCESS';
export const RECEIVE_EVACUATIONS = 'RECEIVE_EVACUATIONS';
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
};

const addIncidentSuccess = (newIncident) => {
  return {
    type: ADD_INCIDENT_SUCCESS,
    newIncident
  };
};

const addCommentSuccess = (comment) => {
  return {
    type: ADD_INCIDENT_COMMENT_SUCCESS,
    comment
  };
};

const addEvacuationSuccess = (evacuation) => {
  return {
    type: ADD_EVACUATION_SUCCESS,
    evacuation
  };
};

const receiveIncidentEvacuations = (evacuations) => {
  return {
    type: RECEIVE_EVACUATIONS,
    evacuations
  };
};

const syncIncidentFail = () => {
  return {
    type: PLAIN_ERROR,
    plainErrors: ['There was an error syncing your incident. Please review the data and try again']
  };
};

const receiveIncidents = (incidents) => {
  return {
    type: RECEIVE_INCIDENTS,
    incidents
  };
};

const receiveIncidentComments = (comments) => {
  return {
    type: RECEIVE_INCIDENT_COMMENTS,
    comments
  };
};

const receiveIncident = (incident) => {
  return {
    type: RECEIVE_INCIDENT,
    incident
  };
};

const updateEventIds = (newId, oldId) => {
  return {
    type: UPDATE_EVENT_IDS,
    oldId, newId
  };
};

const addIncidentOnline = (newIncident, dispatch) => {
  return makeRequest(Endpoints.newIncident, newIncident).then((result) => {
    dispatch(addIncidentSuccess(result));
    updatePath('/incidents/list/');
    return true;
  }).catch((error) => {
    dispatch(serverError(error.response));
    scrollToTop();
    return false;
  });
};

const addCommentOnline = comment => (dispatch, getState) => {
  return makeRequest(Endpoints.addIncidentComment, comment).then((result) => {
    dispatch(addCommentSuccess(result));
    return true;
  }).catch((error) => {
    dispatch(serverError(error.response));
    return false;
  });
};

const addEvacuationOnline = evacuation => (dispatch, getState) => {
  return makeRequest(Endpoints.addIncidentEvacuation, evacuation).then((result) => {
    dispatch(addEvacuationSuccess(result));
    return true;
  }).catch((error) => {
    dispatch(serverError(error.response));
    return false;
  });
};

const addEvacuationOffline = (newEvacuation, dispatch) => {
  newEvacuation.id = generateRandomHash();
  newEvacuation.unsynced = true;
  dispatch(addEvacuationSuccess(newEvacuation));
  return true;
};

export const fetchIncidentEvacuations = () => (dispatch, getState) => {
  if (getState().app.offline !== true) {
    makeRequest(Endpoints.incidentEvacuationsList).then((result) => {
      dispatch(receiveIncidentEvacuations(result));
    });
  }
};

const addIncidentOffline = (newIncident, dispatch) => {
  newIncident.id = generateRandomHash();
  newIncident.unsynced = true;
  updatePath('/incidents/list/');
  dispatch(addIncidentSuccess(newIncident));
  return true;
};

const editIncidentOnline = (incident, dispatch, state) => {
  let origIncident = state.incidents.list.find(elem => elem.id === incident.id);
  let modifiedFields = objDiff(origIncident, incident);
  let endpoint = prepareEndpoint(Endpoints.editIncident, {id: incident.id});

  makeRequest(endpoint, modifiedFields).then((result) => {
    updatePath('/incidents/list/');
    dispatch(fetchIncidents());
  }).catch((error) => {
    dispatch(serverError(error.response));
    scrollToTop();
  });
};

const editIncidentOffline = (incident, dispatch) => {
  incident.unsynced = true;
  updatePath('/incidents/list/');
  dispatch(editIncidentSuccess(incident, incident.id));
};

export const addEvacuation = newEvacuation => (dispatch, getState) => {
  if (getState().app.offline === true) {
    return addEvacuationOffline(newEvacuation, dispatch);
  } else {
    return addEvacuationOnline(newEvacuation, dispatch);
  }
};

export const addIncident = newIncident => (dispatch, getState) => {
  if (getState().app.offline === true) {
    return addIncidentOffline(newIncident, dispatch);
  } else {
    return addIncidentOnline(newIncident, dispatch);
  }
};

export const addComment = comment => (dispatch, getState) => {
  return addCommentOnline(comment, dispatch);
};

export const editIncident = incident => (dispatch, getState) => {
  if (getState().app.offline === true) {
    editIncidentOffline(incident, dispatch);
  } else {
    if (incident.unsynced) {
      dispatch(syncIncident(incident));
    } else {
      editIncidentOnline(incident, dispatch, getState());
    }
  }
};

export const syncIncidentOnList = newIncident => (dispatch, getState) => {
  return makeRequest(Endpoints.newIncident, newIncident).then((result) => {
    dispatch(editIncidentSuccess(result, newIncident.id));
    return true;
  }).catch((error) => {
    dispatch(syncIncidentFail());
    updatePath('/incidents/edit/' + newIncident.id + '/');
    return false;
  });
};

export const syncIncident = newIncident => (dispatch, getState) => {
  return makeRequest(Endpoints.newIncident, newIncident).then((result) => {
    updatePath('/incidents/list/');
    dispatch(editIncidentSuccess(result, newIncident.id));
    return true;
  }).catch((error) => {
    dispatch(serverError(error.response));
    scrollToTop();
    return false;
  });
};

export const fetchIncidents = () => (dispatch, getState) => {
  if (getState().app.offline !== true) {
    makeRequest(Endpoints.incidentsList).then((result) => {
      dispatch(receiveIncidents(result));
    });
  }
};

export const fetchIncidentComments = () => (dispatch, getState) => {
  if (getState().app.offline !== true) {
    makeRequest(Endpoints.incidentsCommentsList).then((result) => {
      dispatch(receiveIncidentComments(result));
    });
  }
};

export const updateEventIdsInIncidents = (oldId, newId) => (dispatch) => {
  dispatch(updateEventIds(newId, oldId));
};

export const fetchIncident = id => (dispatch, getState) => {
  if (getState().app.offline === true) {
    return;
  }
  if (isNaN(id)) {
    updatePath('/incidents/list/');
    return;
  }
  let endpoint = prepareEndpoint(Endpoints.getIncident, {id});
  makeRequest(endpoint).then((response) => {
    dispatch(receiveIncident(response));
  });
};
