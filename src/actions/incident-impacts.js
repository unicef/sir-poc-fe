import { makeRequest, prepareEndpoint } from '../components/common/request-helper.js';
import { Endpoints } from '../config/endpoints.js';
import { objDiff } from '../components/common/utils.js';
import { generateRandomHash } from './action-helpers.js';
import { updatePath } from '../components/common/navigation-helper.js';
import { serverError, plainErrors } from './errors.js';

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

export const syncIncidentImpacts = (newId, oldId) => async (dispatch, getState) =>  {
  let state = getState();
  let operations = [
    ...await dispatch(syncEvacuations(newId, oldId)),
    ...await dispatch(syncProperties(newId, oldId)),
  ];

  Promise.all(operations).then((results) => {
    let allSuccessful = true;

    results.forEach((res) => {
      allSuccessful = allSuccessful && res.success;
    });

    if (!allSuccessful) {
      dispatch(plainErrors(['Some impacts could not be synced. Please review them individually and try again.']));
      updatePath(`/incidents/impact/${newId}/list/`);
    }
  });
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

export const syncEvacuation = (evacuation) => (dispatch, getState) => {
  return _syncEvacuation(evacuation, dispatch).then((result) => {
    if (!result.success) {
      dispatch(serverError(result.error));
    }
    return result.success;
  });
}

const _syncEvacuation = (evacuation, dispatch) => {
  return makeRequest(Endpoints.addIncidentEvacuation, evacuation).then((result) => {
    dispatch(editEvacuationSuccess(result, evacuation.id));
    return {success: true};
  }).catch((error) => {
    // we still need to update the incident_id in redux
    dispatch(editEvacuationSuccess(evacuation, evacuation.id));
    return {success: false, error: error.response};
  });
}

const syncEvacuations = (newId, oldId) => (dispatch, getState) => {
  let evacuations = getState().incidents.evacuations.filter(ev => ev.incident_id == oldId);
  let operations = [];

  for(let index = 0; index < evacuations.length; index++) {
    let evacuation = JSON.parse(JSON.stringify(evacuations[index]));
    evacuation.incident_id = newId;
    operations.push(_syncEvacuation(evacuation, dispatch));
  };

  return operations;
}

////////////////////////////////// Impacts on properties ///////////////////////////////////////////////////////////////


export const EDIT_PROPERTY_SUCCESS = 'EDIT_PROPERTY_SUCCESS';
export const ADD_PROPERTY_SUCCESS = 'ADD_PROPERTY_SUCCESS';
export const RECEIVE_PROPERTIES = 'RECEIVE_PROPERTIES';


const receiveIncidentProperties = (properties) => {
  return {
    type: RECEIVE_PROPERTIES,
    properties
  };
};

const addPropertySuccess = (property) => {
  return {
    type: ADD_PROPERTY_SUCCESS,
    property
  };
};

const editPropertySuccess = (property, id) => {
  return {
    type: EDIT_PROPERTY_SUCCESS,
    property,
    id
  };
};


const addPropertyOnline = (property, dispatch) => {
  return makeRequest(Endpoints.addIncidentProperty, property).then((result) => {
    dispatch(addPropertySuccess(result));
    return true;
  }).catch((error) => {
    dispatch(serverError(error.response));
    return false;
  });
};

const addPropertyOffline = (newProperty, dispatch) => {
  newProperty.id = generateRandomHash();
  newProperty.unsynced = true;
  dispatch(addPropertySuccess(newProperty));
  return true;
};

export const addProperty = newProperty => (dispatch, getState) => {
  if (getState().app.offline || isNaN(newProperty.incident_id)) {
    return addPropertyOffline(newProperty, dispatch);
  } else {
    return addPropertyOnline(newProperty, dispatch);
  }
};

const editPropertyOnline = (property, dispatch, state) => {
  let origProperty = state.incidents.properties.find(elem => elem.id === property.id);
  let modifiedFields = objDiff(origProperty, property);
  let endpoint = prepareEndpoint(Endpoints.editIncidentProperty, {id: property.id});

  return makeRequest(endpoint, modifiedFields).then((result) => {
    dispatch(fetchIncidentProperties());
    return true;
  }).catch((error) => {
    dispatch(serverError(error.response));
    return false;
  });
};

const editPropertyOffline = (property, dispatch) => {
  property.unsynced = true;
  dispatch(editPropertySuccess(property, property.id));
  return true;
};

export const editProperty = property => (dispatch, getState) => {
  if (getState().app.offline === true || property.unsynced) {
    return editPropertyOffline(property, dispatch);
  } else {
    return editPropertyOnline(property, dispatch, getState());
  }
};

export const fetchIncidentProperties = () => (dispatch, getState) => {
  if (getState().app.offline !== true) {
    makeRequest(Endpoints.incidentPropertiesList).then((result) => {
      dispatch(receiveIncidentProperties(result));
    });
  }
};

export const syncProperty = (property) => (dispatch, getState) => {
  return _syncProperty(property, dispatch).then((result) => {
    if (!result.success) {
      dispatch(serverError(result.error));
    }
    return result.success;
  });
}

const _syncProperty = (property, dispatch) => {
  return makeRequest(Endpoints.addIncidentProperty, property).then((result) => {
    dispatch(editPropertySuccess(result, property.id));
    return {success: true};
  }).catch((error) => {
    // we still need to update the incident_id in redux
    dispatch(editPropertySuccess(property, property.id));
    return {success: false, error: error.response};
  });
}

const syncProperties = (newId, oldId) => (dispatch, getState) =>  {
  let properties = getState().incidents.properties.filter(ev => ev.incident_id == oldId);
  let operations = [];

  properties.forEach(property => {
    property.incident_id = newId;
    operations.push(_syncProperty(property, dispatch));
  });

  return operations;
}
