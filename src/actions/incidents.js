import { makeRequest, prepareEndpoint } from '../components/common/request-helper.js';
import { Endpoints } from '../config/endpoints.js';
import { objDiff } from '../components/common/utils.js';
import { scrollToTop } from '../components/common/content-container-helper.js';
import { updatePath } from '../components/common/navigation-helper.js';
import { generateRandomHash } from './action-helpers.js';
import { serverError, PLAIN_ERROR } from './errors.js';
import { syncIncidentImpacts } from './incident-impacts.js';
import * as ACTIONS from './constants.js';
import { fetchIncidentEvacuations,
         fetchIncidentProgrammes,
         fetchIncidentProperties,
         fetchIncidentPersonnel,
         fetchIncidentPremises } from './incident-impacts.js';

const editIncidentSuccess = (incident, id) => {
  return {
    type: ACTIONS.EDIT_INCIDENT_SUCCESS,
    incident,
    id
  };
};

const addIncidentSuccess = (newIncident) => {
  return {
    type: ACTIONS.ADD_INCIDENT_SUCCESS,
    newIncident
  };
};

const addCommentSuccess = (comment) => {
  return {
    type: ACTIONS.ADD_INCIDENT_COMMENT_SUCCESS,
    comment
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
    type: ACTIONS.RECEIVE_INCIDENTS,
    incidents
  };
};

const receiveIncidentComments = (comments) => {
  return {
    type: ACTIONS.RECEIVE_INCIDENT_COMMENTS,
    comments
  };
};

const receiveIncident = (incident) => {
  return {
    type: ACTIONS.RECEIVE_INCIDENT,
    incident,
    id: incident.id
  };
};

const updateEventIds = (newId, oldId) => {
  return {
    type: ACTIONS.UPDATE_EVENT_IDS,
    oldId, newId
  };
};

export const setIncidentDraft = (incident) => {
  return {
    type: ACTIONS.SET_INCIDENT_DRAFT,
    incident
  };
};

export const deleteIncidentFromRedux = (incidentId) => {
  return {
    type: ACTIONS.DELETE_INCIDENT,
    incidentId
  };
};

export const fetchAllIncidentData = () => (dispatch, getState) => {
  dispatch(fetchIncidents());
  dispatch(fetchIncidentComments());
  dispatch(fetchIncidentPremises());
  dispatch(fetchIncidentPersonnel());
  dispatch(fetchIncidentProgrammes());
  dispatch(fetchIncidentProperties());
  dispatch(fetchIncidentEvacuations());
};

const addIncidentOnline = (newIncident, dispatch) => {
  return makeRequest(Endpoints.newIncident, newIncident).then((result) => {
    dispatch(addIncidentSuccess(result));
    return result.id;
  }).catch((error) => {
    dispatch(serverError(error.response));
    scrollToTop();
    return false;
  });
};

const addIncidentOffline = (newIncident, dispatch) => {
  newIncident.id = generateRandomHash();
  newIncident.unsynced = true;
  dispatch(addIncidentSuccess(newIncident));
  return newIncident.id;
};


export const addIncident = newIncident => (dispatch, getState) => {
  if (getState().app.offline === true) {
    return addIncidentOffline(newIncident, dispatch);
  } else {
    return addIncidentOnline(newIncident, dispatch);
  }
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

export const addComment = comment => (dispatch, getState) => {
  return dispatch(addCommentOnline(comment));
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
    dispatch(syncIncidentImpacts(result.id, newIncident.id));
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
    dispatch(syncIncidentImpacts(result.id, newIncident.id));
    return true;
  }).catch((error) => {
    dispatch(serverError(error.response));
    scrollToTop();
    return false;
  });
};

export const submitIncident = incident => (dispatch, state) => {
  let endpoint = prepareEndpoint(Endpoints.submitIncident, {id: incident.id});

  return makeRequest(endpoint).then((result) => {
    dispatch(editIncidentSuccess(result, result.id));
    return true;
  }).catch((error) => {
    dispatch(serverError(error.response));
    return false;
  });
};

export const approveIncident = incidentId => (dispatch, state) => {
  let endpoint = prepareEndpoint(Endpoints.approveIncident, {id: incidentId});

  return makeRequest(endpoint).then((result) => {
    dispatch(editIncidentSuccess(result, result.id));
    return true;
  }).catch((error) => {
    dispatch(serverError(error.response));
    return false;
  });
};

export const rejectIncident = data => (dispatch, getState) => {
  let endpoint = prepareEndpoint(Endpoints.rejectIncident, {id: data.incident});
  return makeRequest(endpoint, data).then((result) => {
    dispatch(addCommentSuccess(result));
    return true;
  }).catch((error) => {
    dispatch(serverError(error.response));
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

export const editAttachmentsNotes = incident => (dispatch, getState) => {
  if (getState().app.offline || incident.unsynced) {
    return Promise.resolve();
  }
  if (!incident.attachments || !incident.attachments.length) {
    return Promise.resolve();
  }
  let origIncident = getState().incidents.list.find(elem => elem.id === Number(incident.id));
  if (!origIncident) {
    return Promise.resolve();
  }

  let attChanges = [];
  let origAtt = origIncident.attachments;
  let currAtt = incident.attachments;

  for (let i = 0; i < origAtt.length; i++) {
    if (origAtt[i].note !== currAtt[i].note) {
      attChanges.push({
        id: currAtt[i].id,
        note: currAtt[i].note
      });
    }
  }

  if (!attChanges.length) {
    return Promise.resolve();
  }

  let operations = [];
  attChanges.forEach((c) => {
    let endpoint = prepareEndpoint(Endpoints.editIncidentAttachments, {id: c.id});
    operations.push(makeRequest(endpoint, {note: c.note}));
  });

  return Promise.all(operations).catch((err) => {
           dispatch(serverError(err.status === 500 ?
           'There was an error updating Related Documents section' : err));
         return Promise.resolve(); // the rest of the Incident changes will be saved despite attachments error
        });
};

export const deleteIncident = incidentId => (dispatch, getState) => {
  makeRequest(prepareEndpoint(Endpoints.deleteIncident, {id: incidentId})).then(() => {
    dispatch(deleteIncidentLocally(incidentId));
  }).catch((err) => {
    dispatch(serverError(err));
  });

};

export const deleteIncidentLocally = incidentId => (dispatch, getState) => {
  dispatch(deleteIncidentFromRedux(incidentId));
  updatePath('/incidents/list/');
};
