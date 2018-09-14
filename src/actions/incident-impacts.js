import { makeRequest, prepareEndpoint } from '../components/common/request-helper.js';
import { Endpoints } from '../config/endpoints.js';
import { objDiff } from '../components/common/utils.js';
import { generateRandomHash } from './action-helpers.js';
import { serverError } from './errors.js';

export const EDIT_EVACUATION_SUCCESS = 'EDIT_EVACUATION_SUCCESS';
export const ADD_EVACUATION_SUCCESS = 'ADD_EVACUATION_SUCCESS';
export const RECEIVE_EVACUATIONS = 'RECEIVE_EVACUATIONS';


const receiveIncidentEvacuations = (evacuations) => {
  return {
    type: RECEIVE_EVACUATIONS,
    evacuations
  };
};

const addEvacuationSuccess = (evacuation) => {
  return {
    type: ADD_EVACUATION_SUCCESS,
    evacuation
  };
};

const editEvacuationSuccess = (evacuation, id) => {
  return {
    type: EDIT_EVACUATION_SUCCESS,
    evacuation,
    id
  };
};

export const syncIncidentImpacts = (newId, oldId) => (dispatch, getState) =>  {
  dispatch(syncEvacuations(newId, oldId));
}

const addEvacuationOnline = (evacuation, dispatch) => {
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

export const addEvacuation = newEvacuation => (dispatch, getState) => {
  if (getState().app.offline || isNaN(newEvacuation.incident_id)) {
    return addEvacuationOffline(newEvacuation, dispatch);
  } else {
    return addEvacuationOnline(newEvacuation, dispatch);
  }
};

const editEvacuationOnline = (evacuation, dispatch, state) => {
  let origEvacuation = state.incidents.evacuations.find(elem => elem.id === evacuation.id);
  let modifiedFields = objDiff(origEvacuation, evacuation);
  let endpoint = prepareEndpoint(Endpoints.editIncidentEvacuation, {id: evacuation.id});

  return makeRequest(endpoint, modifiedFields).then((result) => {
    dispatch(fetchIncidentEvacuations());
    return true;
  }).catch((error) => {
    dispatch(serverError(error.response));
    return false;
  });
};

const editEvacuationOffline = (evacuation, dispatch) => {
  evacuation.unsynced = true;
  dispatch(editEvacuationSuccess(evacuation, evacuation.id));
  return true;
};

export const editEvacuation = evacuation => (dispatch, getState) => {
  if (getState().app.offline === true || evacuation.unsynced) {
    return editEvacuationOffline(evacuation, dispatch);
  } else {
    return editEvacuationOnline(evacuation, dispatch, getState());
  }
};

export const fetchIncidentEvacuations = () => (dispatch, getState) => {
  if (getState().app.offline !== true) {
    makeRequest(Endpoints.incidentEvacuationsList).then((result) => {
      dispatch(receiveIncidentEvacuations(result));
    });
  }
};
const syncEvacuation = (evacuation) => {
  return makeRequest(Endpoints.addIncidentEvacuation, evacuation).then((result) => {
    // dispatch(addEvacuationSuccess(result));
    return true;
  }).catch((error) => {
    // dispatch(serverError(error.response));
    return false;
  });
}
const syncEvacuations = (newId, oldId) => (dispatch, getState) =>  {
  let evacuations = getState().incidents.evacuations.filter(ev => ev.incident_id == oldId);
  let operations = [];
  evacuations.forEach(evacuation => {
    evacuation.incident_id = newId;
    operations.push(syncEvacuation(evacuation));
  });

  Promise.all(operations).then((results) => {
    console.log('sync results', results);
  });
}
