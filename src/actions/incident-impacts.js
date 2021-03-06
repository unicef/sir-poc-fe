import { makeRequest, prepareEndpoint } from '../components/common/request-helper.js';
import { Endpoints } from '../config/endpoints.js';
import { objDiff } from '../components/common/utils.js';
import { generateRandomHash } from './action-helpers.js';
import { updatePath } from '../components/common/navigation-helper.js';
import { serverError, plainErrors } from './errors.js';
import * as ACTIONS from './constants.js';

const receiveIncidentEvacuations = (evacuations) => {
  return {
    type: ACTIONS.RECEIVE_EVACUATIONS,
    evacuations
  };
};

const addEvacuationSuccess = (evacuation) => {
  return {
    type: ACTIONS.ADD_EVACUATION_SUCCESS,
    evacuation
  };
};

const editEvacuationSuccess = (evacuation, id) => {
  return {
    type: ACTIONS.EDIT_EVACUATION_SUCCESS,
    evacuation,
    id
  };
};

export const syncIncidentImpacts = (newId, oldId) => async (dispatch, getState) => {
  let operations = [
    ...await dispatch(syncPersonnelList(newId, oldId)),
    ...await dispatch(syncEvacuations(newId, oldId)),
    ...await dispatch(syncProperties(newId, oldId)),
    ...await dispatch(syncProgrammes(newId, oldId)),
    ...await dispatch(syncPremises(newId, oldId))
  ];

  Promise.all(operations).then((results) => {
    let allSuccessful = true;

    results.forEach((res) => {
      allSuccessful = allSuccessful && res.success;
    });

    if (!allSuccessful) {
      updatePath(`/incidents/impact/${newId}/list/`);
      setTimeout(() =>
       dispatch(plainErrors(['Some impacts could not be synced. Please review them individually and try again.']))
      );
    }
  });
};

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

export const syncEvacuation = evacuation => (dispatch, getState) => {
  return _syncEvacuation(evacuation, dispatch).then((result) => {
    if (!result.success) {
      dispatch(serverError(result.error));
    }
    return result.success;
  });
};

const _syncEvacuation = (evacuation, dispatch) => {
  return makeRequest(Endpoints.addIncidentEvacuation, evacuation).then((result) => {
    dispatch(editEvacuationSuccess(result, evacuation.id));
    return {success: true};
  }).catch((error) => {
    // we still need to update the incident_id in redux
    dispatch(editEvacuationSuccess(evacuation, evacuation.id));
    return {success: false, error: error.response};
  });
};

const syncEvacuations = (newId, oldId) => (dispatch, getState) => {
  let evacuations = getState().incidents.evacuations.filter(ev => ev.incident_id == oldId);
  let operations = [];

  for (let index = 0; index < evacuations.length; index++) {
    let evacuation = JSON.parse(JSON.stringify(evacuations[index]));
    evacuation.incident_id = newId;
    operations.push(_syncEvacuation(evacuation, dispatch));
  }

  return operations;
};

/* Impacts on properties */

const receiveIncidentProperties = (properties) => {
  return {
    type: ACTIONS.RECEIVE_PROPERTIES,
    properties
  };
};

const addPropertySuccess = (property) => {
  return {
    type: ACTIONS.ADD_PROPERTY_SUCCESS,
    property
  };
};

const editPropertySuccess = (property, id) => {
  return {
    type: ACTIONS.EDIT_PROPERTY_SUCCESS,
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

export const syncProperty = property => (dispatch, getState) => {
  return _syncProperty(property, dispatch).then((result) => {
    if (!result.success) {
      dispatch(serverError(result.error));
    }
    return result.success;
  });
};

const _syncProperty = (property, dispatch) => {
  return makeRequest(Endpoints.addIncidentProperty, property).then((result) => {
    dispatch(editPropertySuccess(result, property.id));
    return {success: true};
  }).catch((error) => {
    // we still need to update the incident_id in redux
    dispatch(editPropertySuccess(property, property.id));
    return {success: false, error: error.response};
  });
};

const syncProperties = (newId, oldId) => (dispatch, getState) => {
  let properties = getState().incidents.properties.filter(ev => ev.incident_id == oldId);
  let operations = [];

  properties.forEach((property) => {
    property.incident_id = newId;
    operations.push(_syncProperty(property, dispatch));
  });

  return operations;
};

/* Impacts on premises */

const receiveIncidentPremises = (premises) => {
  return {
    type: ACTIONS.RECEIVE_PREMISES,
    premises
  };
};

const addPremiseSuccess = (premise) => {
  return {
    type: ACTIONS.ADD_PREMISE_SUCCESS,
    premise
  };
};

const editPremiseSuccess = (premise, id) => {
  return {
    type: ACTIONS.EDIT_PREMISE_SUCCESS,
    premise,
    id
  };
};

const addPremiseOnline = (premise, dispatch) => {
  return makeRequest(Endpoints.addIncidentPremise, premise).then((result) => {
    dispatch(addPremiseSuccess(result));
    return true;
  }).catch((error) => {
    dispatch(serverError(error.response));
    return false;
  });
};

const addPremiseOffline = (newPremise, dispatch) => {
  newPremise.id = generateRandomHash();
  newPremise.unsynced = true;
  dispatch(addPremiseSuccess(newPremise));
  return true;
};

export const addPremise = newPremise => (dispatch, getState) => {
  if (getState().app.offline || isNaN(newPremise.incident_id)) {
    return addPremiseOffline(newPremise, dispatch);
  } else {
    return addPremiseOnline(newPremise, dispatch);
  }
};

const editPremiseOnline = (premise, dispatch, state) => {
  let origPremise = state.incidents.premises.find(elem => elem.id === premise.id);
  let modifiedFields = objDiff(origPremise, premise);
  let endpoint = prepareEndpoint(Endpoints.editIncidentPremise, {id: premise.id});

  return makeRequest(endpoint, modifiedFields).then((result) => {
    dispatch(fetchIncidentPremises());
    return true;
  }).catch((error) => {
    dispatch(serverError(error.response));
    return false;
  });
};

const editPremiseOffline = (premise, dispatch) => {
  premise.unsynced = true;
  dispatch(editPremiseSuccess(premise, premise.id));
  return true;
};

export const editPremise = premise => (dispatch, getState) => {
  if (getState().app.offline === true || premise.unsynced) {
    return editPremiseOffline(premise, dispatch);
  } else {
    return editPremiseOnline(premise, dispatch, getState());
  }
};

export const fetchIncidentPremises = () => (dispatch, getState) => {
  if (getState().app.offline !== true) {
    makeRequest(Endpoints.incidentPremisesList).then((result) => {
      dispatch(receiveIncidentPremises(result));
    });
  }
};

export const syncPremise = premise => (dispatch, getState) => {
  return _syncPremise(premise, dispatch).then((result) => {
    if (!result.success) {
      dispatch(serverError(result.error));
    }
    return result.success;
  });
};

const _syncPremise = (premise, dispatch) => {
  return makeRequest(Endpoints.addIncidentPremise, premise).then((result) => {
    dispatch(editPremiseSuccess(result, premise.id));
    return {success: true};
  }).catch((error) => {
    // we still need to update the incident_id in redux
    dispatch(editPremiseSuccess(premise, premise.id));
    return {success: false, error: error.response};
  });
};

const syncPremises = (newId, oldId) => (dispatch, getState) => {
  let premises = getState().incidents.premises.filter(ev => ev.incident_id == oldId);
  let operations = [];

  premises.forEach((premise) => {
    premise.incident_id = newId;
    operations.push(_syncPremise(premise, dispatch));
  });

  return operations;
};

/* Impacts on programmes */

const receiveIncidentProgrammes = (programmes) => {
  return {
    type: ACTIONS.RECEIVE_PROGRAMMES,
    programmes
  };
};

const addProgrammeSuccess = (programme) => {
  return {
    type: ACTIONS.ADD_PROGRAMME_SUCCESS,
    programme
  };
};

const editProgrammeSuccess = (programme, id) => {
  return {
    type: ACTIONS.EDIT_PROGRAMME_SUCCESS,
    programme,
    id
  };
};

const addProgrammeOnline = (programme, dispatch) => {
  return makeRequest(Endpoints.addIncidentProgramme, programme).then((result) => {
    dispatch(addProgrammeSuccess(result));
    return true;
  }).catch((error) => {
    dispatch(serverError(error.response));
    return false;
  });
};

const addProgrammeOffline = (newProgramme, dispatch) => {
  newProgramme.id = generateRandomHash();
  newProgramme.unsynced = true;
  dispatch(addProgrammeSuccess(newProgramme));
  return true;
};

export const addProgramme = newProgramme => (dispatch, getState) => {
  if (getState().app.offline || isNaN(newProgramme.incident_id)) {
    return addProgrammeOffline(newProgramme, dispatch);
  } else {
    return addProgrammeOnline(newProgramme, dispatch);
  }
};

const editProgrammeOnline = (programme, dispatch, state) => {
  let origProgramme = state.incidents.programmes.find(elem => elem.id === programme.id);
  let modifiedFields = objDiff(origProgramme, programme);
  let endpoint = prepareEndpoint(Endpoints.editIncidentProgramme, {id: programme.id});

  return makeRequest(endpoint, modifiedFields).then((result) => {
    dispatch(fetchIncidentProgrammes());
    return true;
  }).catch((error) => {
    dispatch(serverError(error.response));
    return false;
  });
};

const editProgrammeOffline = (programme, dispatch) => {
  programme.unsynced = true;
  dispatch(editProgrammeSuccess(programme, programme.id));
  return true;
};

export const editProgramme = programme => (dispatch, getState) => {
  if (getState().app.offline === true || programme.unsynced) {
    return editProgrammeOffline(programme, dispatch);
  } else {
    return editProgrammeOnline(programme, dispatch, getState());
  }
};

export const fetchIncidentProgrammes = () => (dispatch, getState) => {
  if (getState().app.offline !== true) {
    makeRequest(Endpoints.incidentProgrammesList).then((result) => {
      dispatch(receiveIncidentProgrammes(result));
    });
  }
};

export const syncProgramme = programme => (dispatch, getState) => {
  return _syncProgramme(programme, dispatch).then((result) => {
    if (!result.success) {
      dispatch(serverError(result.error));
    }
    return result.success;
  });
};

const _syncProgramme = (programme, dispatch) => {
  return makeRequest(Endpoints.addIncidentProgramme, programme).then((result) => {
    dispatch(editProgrammeSuccess(result, programme.id));
    return {success: true};
  }).catch((error) => {
    // we still need to update the incident_id in redux
    dispatch(editProgrammeSuccess(programme, programme.id));
    return {success: false, error: error.response};
  });
};

const syncProgrammes = (newId, oldId) => (dispatch, getState) => {
  let programmes = getState().incidents.programmes.filter(ev => ev.incident_id == oldId);
  let operations = [];

  programmes.forEach((programme) => {
    programme.incident_id = newId;
    operations.push(_syncProgramme(programme, dispatch));
  });

  return operations;
};

/* Persons impacted */

const receiveIncidentPersonnel = (personnel) => {
  return {
    type: ACTIONS.RECEIVE_PERSONNEL,
    personnel
  };
};

const addPersonnelSuccess = (personnel) => {
  return {
    type: ACTIONS.ADD_PERSONNEL_SUCCESS,
    personnel
  };
};

const editPersonnelSuccess = (personnel, id) => {
  return {
    type: ACTIONS.EDIT_PERSONNEL_SUCCESS,
    personnel,
    id
  };
};

const addPersonnelOnline = (personnel, dispatch) => {
  return makeRequest(Endpoints.addIncidentPersonnel, personnel).then((result) => {
    dispatch(addPersonnelSuccess(result));
    return true;
  }).catch((error) => {
    dispatch(serverError(error.response));
    return false;
  });
};

const addPersonnelOffline = (newPersonnel, dispatch) => {
  newPersonnel.id = generateRandomHash();
  newPersonnel.unsynced = true;
  dispatch(addPersonnelSuccess(newPersonnel));
  return true;
};

export const addPersonnel = newPersonnel => (dispatch, getState) => {
  if (getState().app.offline || isNaN(newPersonnel.incident)) {
    return addPersonnelOffline(newPersonnel, dispatch);
  } else {
    return addPersonnelOnline(newPersonnel, dispatch);
  }
};

const editPersonnelOnline = (personnel, dispatch, state) => {
  let origPersonnel = state.incidents.personnel.find(elem => elem.id === personnel.id);
  let modifiedFields = objDiff(origPersonnel, personnel);
  let endpoint = prepareEndpoint(Endpoints.editIncidentPersonnel, {id: personnel.id});

  return makeRequest(endpoint, modifiedFields).then((result) => {
    dispatch(fetchIncidentPersonnel());
    return true;
  }).catch((error) => {
    dispatch(serverError(error.response));
    return false;
  });
};

const editPersonnelOffline = (personnel, dispatch) => {
  personnel.unsynced = true;
  dispatch(editPersonnelSuccess(personnel, personnel.id));
  return true;
};

export const editPersonnel = personnel => (dispatch, getState) => {
  if (getState().app.offline === true || personnel.unsynced) {
    return editPersonnelOffline(personnel, dispatch);
  } else {
    return editPersonnelOnline(personnel, dispatch, getState());
  }
};

export const fetchIncidentPersonnel = () => (dispatch, getState) => {
  if (getState().app.offline !== true) {
    makeRequest(Endpoints.incidentPersonnelList).then((result) => {
      dispatch(receiveIncidentPersonnel(result));
    });
  }
};

export const syncPersonnel = personnel => (dispatch, getState) => {
  return _syncPersonnel(personnel, dispatch).then((result) => {
    if (!result.success) {
      dispatch(serverError(result.error));
    }
    return result.success;
  });
};

const _syncPersonnel = (personnel, dispatch) => {
  return makeRequest(Endpoints.addIncidentPersonnel, personnel).then((result) => {
    dispatch(editPersonnelSuccess(result, personnel.id));
    return {success: true};
  }).catch((error) => {
    // we still need to update the incident_id in redux
    dispatch(editPersonnelSuccess(personnel, personnel.id));
    return {success: false, error: error.response};
  });
};

const syncPersonnelList = (newId, oldId) => (dispatch, getState) => {
  let personnel = getState().incidents.personnel.filter(ev => ev.incident == oldId);
  let operations = [];

  personnel.forEach((personnel) => {
    personnel.incident = newId;
    operations.push(_syncPersonnel(personnel, dispatch));
  });

  return operations;
};

export const fetchHistoryOfImpacts = ids => async (dispatch, getState) => {
  const state = getState();
  if (state.app.offline === true) {
    return {};
  }

  let historyOfImpacts = [];

  if (state.staticData.profile.permissions['view_personincident']) {
    let ph = await dispatch(fetchImpactHistory(ids.personnel, Endpoints.getIncidentPersonnelHistory, 'personnel'));
    historyOfImpacts = sanitizeImpactedPersonnelHistory(ph);
  }

  if (state.staticData.profile.permissions['view_evacuation']) {
    historyOfImpacts = [
      ...historyOfImpacts,
      ...await dispatch(fetchImpactHistory(ids.evacuation, Endpoints.getIncidentEvacuationHistory, 'evacuation'))
    ];
  }

  if (state.staticData.profile.permissions['view_programme']) {
    historyOfImpacts = [
      ...historyOfImpacts,
      ...await dispatch(fetchImpactHistory(ids.programme, Endpoints.getIncidentProgrammeHistory, 'programme'))
    ];
  }

  if (state.staticData.profile.permissions['view_property']) {
    historyOfImpacts = [
      ...historyOfImpacts,
      ...await dispatch(fetchImpactHistory(ids.property, Endpoints.getIncidentPropertyHistory, 'property'))
    ];
  }

  if (state.staticData.profile.permissions['view_premise']) {
    historyOfImpacts = [
      ...historyOfImpacts,
      ...await dispatch(fetchImpactHistory(ids.premise, Endpoints.getIncidentPremiseHistory, 'premise'))
    ];
  }

  return historyOfImpacts.map((elem) => {
    elem.incident_id = ids.incident;
    return elem;
  });
};

const fetchImpactHistory = (ids, endpoint, impactType) => async (dispatch) => {
  let allHistoryItems = [];

  for (let i = 0; i < ids.length; i++) {
    let impactId = ids[i];
    let result = await makeRequest(prepareEndpoint(endpoint, {id: impactId})).catch((error) => {
      dispatch(serverError(error.response));
      return [];
    });

    result.forEach((value, key) => {
      result[key].action += `_${impactType}_impact`;
      result[key].impact_id = impactId;
      result[key].impact_type = impactType;
    });

    allHistoryItems = allHistoryItems.concat(result);
  }

  return allHistoryItems;
};

const sanitizeImpactedPersonnelHistory = (historyArr) => {
  return historyArr.map((element) => {
    if (!element.change || !element.change.person) {
      return element;
    }
    let newChanges = {};

    for(let key in element.change.person) {sanitizeImpactedPersonnelHistory
      if (['id', 'version', 'last_modify_user', 'created_by_user'].indexOf(key) > -1) {
        continue;
      }

      newChanges['person_' + key] = element.change.person[key];
    }

    delete element.change.person;
    element.change = {...element.change, ...newChanges};

    return element;
  });
};
