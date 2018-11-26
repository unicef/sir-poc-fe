import { makeRequest, prepareEndpoint,
  handleBlobDataReceivedAndStartDownload } from '../components/common/request-helper.js';
import { Endpoints } from '../config/endpoints.js';
import { objDiff, isNumber } from '../components/common/utils.js';
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

import { showSnackbar } from '../actions/app.js';

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

export const clearIncidentDraft = () => {
  return {
    type: ACTIONS.CLEAR_INCIDENT_DRAFT
  };
};

export const deleteIncidentFromRedux = (incidentId) => {
  return {
    type: ACTIONS.DELETE_INCIDENT,
    incidentId
  };
};

export const fetchAllIncidentData = () => (dispatch) => {
  dispatch(fetchIncidents());
  dispatch(fetchIncidentEvacuations());
  dispatch(fetchIncidentProperties());
  dispatch(fetchIncidentProgrammes());
  dispatch(fetchIncidentPersonnel());
  dispatch(fetchIncidentPremises());
  dispatch(fetchIncidentComments());
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
  newIncident = getSanitizedIncident(newIncident);

  if (getState().app.offline === true) {
    return addIncidentOffline(newIncident, dispatch);
  } else {
    return addIncidentOnline(newIncident, dispatch);
  }
};

const addCommentOnline = comment => (dispatch) => {
  return makeRequest(Endpoints.addIncidentComment, comment).then((result) => {
    dispatch(addCommentSuccess(result));
    return true;
  }).catch((error) => {
    dispatch(serverError(error.response));
    return false;
  });
};

export const addComment = comment => (dispatch) => {
  return dispatch(addCommentOnline(comment));
};

const editIncidentOnline = (incident, dispatch, state) => {
  let origIncident = state.incidents.list.find(elem => elem.id === incident.id);
  let modifiedFields = objDiff(origIncident, incident);
  let endpoint = prepareEndpoint(Endpoints.editIncident, {id: incident.id});

  if (modifiedFields && Object.keys(modifiedFields).length === 0) {
    // no changes
    dispatch(showSnackbar('There are no changes to save'));
    return;
  }

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
  incident = getSanitizedIncident(incident);

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

export const syncIncidentOnList = newIncident => (dispatch) => {
  newIncident = getSanitizedIncident(newIncident);

  return makeRequest(Endpoints.newIncident, newIncident).then((result) => {
    dispatch(editIncidentSuccess(result, newIncident.id));
    dispatch(syncIncidentImpacts(result.id, newIncident.id));
    return true;
  }).catch((error) => {
    updatePath('/incidents/edit/' + newIncident.id + '/');
    setTimeout(() => dispatch(syncIncidentFail()));
    return false;
  });
};

export const syncIncident = newIncident => (dispatch) => {
  newIncident = getSanitizedIncident(newIncident);

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

export const submitIncident = incident => (dispatch) => {
  let endpoint = prepareEndpoint(Endpoints.submitIncident, {id: incident.id});

  return makeRequest(endpoint).then((result) => {
    dispatch(editIncidentSuccess(result, result.id));
    return true;
  }).catch((error) => {
    dispatch(serverError(error.response));
    return false;
  });
};

export const rejectIncident = data => (dispatch) => {
  let endpoint = prepareEndpoint(Endpoints.rejectIncident, {id: data.incident});
  return makeRequest(endpoint, data).then((result) => {
    dispatch(editIncidentSuccess(result, result.id));
    dispatch(fetchIncidentComments());
    return true;
  }).catch((error) => {
    dispatch(serverError(error.response));
    return false;
  });
};

export const approveIncident = incident => (dispatch) => {
  let endpoint = prepareEndpoint(Endpoints.approveIncident, {id: incident.id});

  return makeRequest(endpoint).then((result) => {
    dispatch(editIncidentSuccess(result, result.id));
    return true;
  }).catch((error) => {
    dispatch(serverError(error.response));
    return false;
  });
};

export const reviewIncidentEOD = incident => (dispatch) => {
  let endpoint = prepareEndpoint(Endpoints.reviewIncidentEOD, {id: incident.id});
  return makeRequest(endpoint).then((result) => {
    dispatch(editIncidentSuccess(incident, incident.id));
    return true;
  }).catch((error) => {
    dispatch(serverError(error.response));
    return false;
  });
};

export const reviewIncidentDHR = incident => (dispatch) => {
  let endpoint = prepareEndpoint(Endpoints.reviewIncidentDHR, {id: incident.id});
  return makeRequest(endpoint).then((result) => {
    dispatch(editIncidentSuccess(incident, incident.id));
    return true;
  }).catch((error) => {
    dispatch(serverError(error.response));
    return false;
  });
};

export const reviewIncidentDFAM = incident => (dispatch) => {
  let endpoint = prepareEndpoint(Endpoints.reviewIncidentDFAM, {id: incident.id});
  return makeRequest(endpoint).then((result) => {
    dispatch(editIncidentSuccess(incident, incident.id));
    return true;
  }).catch((error) => {
    dispatch(serverError(error.response));
    return false;
  });
};

export const reviewIncidentLegal = incident => (dispatch) => {
  let endpoint = prepareEndpoint(Endpoints.reviewIncidentLegal, {id: incident.id});
  return makeRequest(endpoint).then((result) => {
    dispatch(editIncidentSuccess(incident, incident.id));
    return true;
  }).catch((error) => {
    dispatch(serverError(error.response));
    return false;
  });
};

export const reviewIncidentStaffWellbeing = incident => (dispatch) => {
  let endpoint = prepareEndpoint(Endpoints.reviewIncidentStaffWellbeing, {id: incident.id});
  return makeRequest(endpoint).then((result) => {
    dispatch(editIncidentSuccess(incident, incident.id));
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
  let state = getState();
  if (state.app.offline === true || !state.staticData.profile.permissions) {
    return;
  }
  if(state.staticData.profile.permissions['view_comment']) {
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

export const updateAddedAttachmentIds = (incidentId, attachments) => (dispatch) => {
  let operations = [];

  if (!attachments || !attachments.length) {
    return;
  }

  attachments.forEach((attachment) => {
    let endpoint = prepareEndpoint(Endpoints.editIncidentAttachments, {id: attachment.id});
    operations.push(makeRequest(endpoint, {incident: incidentId}));
  });

  Promise.all(operations).catch((err) => {
    dispatch(serverError(err.status === 500 ? 'There was an error updating Related Documents section' : err));
  });
}

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

export const deleteIncident = incidentId => (dispatch) => {
  if (isNaN(incidentId)) {
    return dispatch(deleteIncidentLocally(incidentId));
  } else {
    return dispatch(deleteIncidentFromServer(incidentId));
  }
}

export const deleteIncidentFromServer = incidentId => (dispatch) => {
  return makeRequest(prepareEndpoint(Endpoints.deleteIncident, {id: incidentId})).then(() => {
    return dispatch(deleteIncidentLocally(incidentId));
  }).catch((err) => {
    dispatch(serverError(err));
    return false;
  });

};

export const deleteIncidentLocally = incidentId => (dispatch) => {
  dispatch(deleteIncidentFromRedux(incidentId));
  return true;
};

export const exportIncidents = (exportUrl, docType) => (dispatch) => {
  const incidentsExportReqOptions = Object.assign({}, Endpoints['incidentsList'],
      {
        url: exportUrl,
        handleAs: 'blob'
      }
  );
  makeRequest(incidentsExportReqOptions).then((blob) => {
    handleBlobDataReceivedAndStartDownload(blob, 'incidents.' + docType);
  }).catch((error) => {
    // eslint-disable-next-line
    console.error(error);
    // TODO: redirects and messages should be moved to the view
    dispatch(showSnackbar('An error occurred on incidents export!'));
  });
};

const getSanitizedIncident = (rawIncident) => {
  let sanitizedIncident = JSON.parse(JSON.stringify(rawIncident));

  sanitizedIncident.latitude = isNumber(sanitizedIncident.latitude)? sanitizedIncident.latitude : null;
  sanitizedIncident.longitude = isNumber(sanitizedIncident.longitude)? sanitizedIncident.longitude : null;

  return sanitizedIncident;
};
