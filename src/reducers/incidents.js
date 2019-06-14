import { createSelector } from 'reselect';
import * as ACTIONS from '../actions/constants.js';
import { getIncidentModel } from '../models/incident-model.js';

let defaultState = {
  list: [],
  premises: [],
  comments: [],
  personnel: [],
  programmes: [],
  properties: [],
  evacuations: [],
  draft: getIncidentModel()
};

const incidents = (state = defaultState, action) => {
  switch (action.type) {
    case ACTIONS.SET_INCIDENT_DRAFT:
      return {
        ...state,
        draft: action.incident
      };
    case ACTIONS.CLEAR_INCIDENT_DRAFT:
      return {
        ...state,
        draft: undefined
      };
    case ACTIONS.RECEIVE_INCIDENTS:
      return {
        ...state,
        list: getRefreshedData(state.list, action.incidents)
      };
    case ACTIONS.RECEIVE_INCIDENT_COMMENTS:
      return {
        ...state,
        comments: action.comments
      };
    case ACTIONS.RECEIVE_INCIDENT:
      return {
        ...state,
        list: getListWithEditedItem(state.list, action)
      };
    case ACTIONS.ADD_INCIDENT_SUCCESS:
      return {
        ...state,
        list: [...state.list, action.newIncident]
      };
    case ACTIONS.ADD_INCIDENT_COMMENT_SUCCESS:
      return {
        ...state,
        comments: [...state.comments, action.comment]
      };
    case ACTIONS.EDIT_INCIDENT_SUCCESS:
      return {
        ...state,
        list: getListWithEditedItem(state.list, action)
      };
    case ACTIONS.UPDATE_EVENT_IDS:
      return {
        ...state,
        list: updateEventIds(state.list, action.oldId, action.newId)
      };
    case ACTIONS.DELETE_INCIDENT:
      return {
        ...state,
        list: getListWithoutItem(state.list, action.incidentId)
      };
    case ACTIONS.EDIT_EVACUATION_SUCCESS:
      return {
        ...state,
        evacuations: getListWithEditedItem(state.evacuations, action, 'evacuation')
      };
    case ACTIONS.ADD_EVACUATION_SUCCESS:
      return {
        ...state,
        evacuations: [...state.evacuations, action.evacuation]
      };
    case ACTIONS.RECEIVE_EVACUATIONS:
      return {
        ...state,
        evacuations: getRefreshedData(state.evacuations, action.evacuations)
      };
    case ACTIONS.EDIT_PROPERTY_SUCCESS:
      return {
        ...state,
        properties: getListWithEditedItem(state.properties, action, 'property')
      };
    case ACTIONS.ADD_PROPERTY_SUCCESS:
      return {
        ...state,
        properties: [...state.properties, action.property]
      };
    case ACTIONS.RECEIVE_PROPERTIES:
      return {
        ...state,
        properties: getRefreshedData(state.properties, action.properties)
      };
    case ACTIONS.EDIT_PREMISE_SUCCESS:
      return {
        ...state,
        premises: getListWithEditedItem(state.premises, action, 'premise')
      };
    case ACTIONS.ADD_PREMISE_SUCCESS:
      return {
        ...state,
        premises: [...state.premises, action.premise]
      };
    case ACTIONS.RECEIVE_PREMISES:
      return {
        ...state,
        premises: getRefreshedData(state.premises, action.premises)
      };
    case ACTIONS.EDIT_PROGRAMME_SUCCESS:
      return {
        ...state,
        programmes: getListWithEditedItem(state.programmes, action, 'programme')
      };
    case ACTIONS.ADD_PROGRAMME_SUCCESS:
      return {
        ...state,
        programmes: [...state.programmes, action.programme]
      };
    case ACTIONS.RECEIVE_PROGRAMMES:
      return {
        ...state,
        programmes: getRefreshedData(state.programmes, action.programmes)
      };
    case ACTIONS.EDIT_PERSONNEL_SUCCESS:
      return {
        ...state,
        personnel: getListWithEditedItem(state.personnel, action, 'personnel')
      };
    case ACTIONS.ADD_PERSONNEL_SUCCESS:
      return {
        ...state,
        personnel: [...state.personnel, action.personnel]
      };
    case ACTIONS.RECEIVE_PERSONNEL:
      return {
        ...state,
        personnel: getRefreshedData(state.personnel, action.personnel)
      };
    default:
      return state;
  }
};

export default incidents;

const getListWithEditedItem = (list, action, actionKey) => {
  actionKey = actionKey || 'incident';
  return list.map((element) => {
    if (action.id !== element.id) {
      return element;
    }
    return action[actionKey];
  });
};

const getRefreshedData = (oldElements, newElements) => {
  oldElements = oldElements instanceof Array ? oldElements : [];
  newElements = newElements instanceof Array ? newElements : [];
  let unsynced = oldElements.filter(elem => elem.unsynced && isNaN(elem.id));
  return [...newElements, ...unsynced];
};

const updateEventIds = (list, oldId, newId) => {
  return list.map((incident) => {
    if (incident.event === oldId) {
      incident.event = newId;
    }

    return incident;
  });
};

const getListWithoutItem = (list, deletedIncidentId) => {
  let index = list.findIndex((i) => {
    if (isNaN(deletedIncidentId)) {
      return i.id === deletedIncidentId;
    } else {
      return i.id === Number(deletedIncidentId);
    }
  });
  if (index < 0) {
    return list;
  }
  list.splice(index, 1);
  return [...list];
};

// ---------- SELECTORS -------
const incidentsSelector = state => state.incidents.list;
const selectedIncidentId = state => state.app.locationInfo.incidentId;
export const selectIncident = createSelector(
  incidentsSelector,
  selectedIncidentId,
  (incidents, incidentId) => {
    if (!incidentId) {
      return null;
    }
    return incidents.find(i => String(i.id) === String(incidentId))
     || null;
  }
);
const commentsSelector = state => state.incidents.comments;
export const selectIncidentComments = createSelector(
  commentsSelector,
  selectedIncidentId,
  (comments, incidentId) => {
    return comments.filter(c => String(c.incident) === String(incidentId))
           || null;
  }
);
