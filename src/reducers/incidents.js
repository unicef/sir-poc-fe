import {
  ADD_INCIDENT_COMMENT_SUCCESS,
  RECEIVE_INCIDENT_COMMENTS,
  EDIT_INCIDENT_SUCCESS,
  ADD_INCIDENT_SUCCESS,
  RECEIVE_INCIDENTS,
  RECEIVE_INCIDENT,
  UPDATE_EVENT_IDS
} from '../actions/incidents.js';
import {
  EDIT_EVACUATION_SUCCESS,
  ADD_EVACUATION_SUCCESS,
  RECEIVE_EVACUATIONS,
  EDIT_PROPERTY_SUCCESS,
  ADD_PROPERTY_SUCCESS,
  RECEIVE_PROPERTIES,
  EDIT_PREMISE_SUCCESS,
  ADD_PREMISE_SUCCESS,
  RECEIVE_PREMISES,
} from '../actions/incident-impacts.js';

import { createSelector } from 'reselect';

let defaultState = {
  list: [],
  premises:[],
  comments: [],
  evacuations:[],
  properties: []
};

const incidents = (state = defaultState, action) => {
  switch (action.type) {
    case RECEIVE_INCIDENTS:
      return {
        ...state,
        list: getRefreshedData(state.list, action.incidents)
      };
    case RECEIVE_INCIDENT_COMMENTS:
      return {
        ...state,
        comments: action.comments
      };
    case RECEIVE_INCIDENT:
      return {
        ...state,
        list: getListWithEditedItem(state.list, action)
      };
    case ADD_INCIDENT_SUCCESS:
      return {
        ...state,
        list: [...state.list, action.newIncident]
      };
    case ADD_INCIDENT_COMMENT_SUCCESS:
      return {
        ...state,
        comments: [...state.comments, action.comment]
      };
    case EDIT_INCIDENT_SUCCESS:
      return {
        ...state,
        list: getListWithEditedItem(state.list, action)
      };
    case UPDATE_EVENT_IDS:
      return {
        ...state,
        list: updateEventIds(state.list, action.oldId, action.newId)
      };
   ///////////////////////////////
    case EDIT_EVACUATION_SUCCESS:
      return {
        ...state,
        evacuations: getListWithEditedItem(state.evacuations, action, 'evacuation')
      };
    case ADD_EVACUATION_SUCCESS:
      return {
        ...state,
        evacuations: [...state.evacuations, action.evacuation]
      };
    case RECEIVE_EVACUATIONS:
      return {
        ...state,
        evacuations: getRefreshedData(state.evacuations, action.evacuations)
      };
   ///////////////////////////////
    case EDIT_PROPERTY_SUCCESS:
      return {
        ...state,
        properties: getListWithEditedItem(state.properties, action, 'property')
      };
    case ADD_PROPERTY_SUCCESS:
      return {
        ...state,
        properties: [...state.properties, action.property]
      };
    case RECEIVE_PROPERTIES:
      return {
        ...state,
        properties: getRefreshedData(state.properties, action.properties)
      };
   ///////////////////////////////
    case EDIT_PREMISE_SUCCESS:
      return {
        ...state,
        premises: getListWithEditedItem(state.premises, action, 'premise')
      };
    case ADD_PREMISE_SUCCESS:
      return {
        ...state,
        premises: [...state.premises, action.premise]
      };
    case RECEIVE_PREMISES:
      return {
        ...state,
        premises: getRefreshedData(state.premises, action.premises)
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
