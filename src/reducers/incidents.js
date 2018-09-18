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
  RECEIVE_EVACUATIONS
} from '../actions/incident-impacts.js';

import { createSelector } from 'reselect';

const incidents = (state = {list: [], comments: []}, action) => {
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
    case RECEIVE_EVACUATIONS:
      return {
        ...state,
        evacuations: getRefreshedData(state.evacuations, action.evacuations)
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
    case ADD_EVACUATION_SUCCESS:
      return {
        ...state,
        evacuations: [...state.evacuations, action.evacuation]
      };
    case EDIT_INCIDENT_SUCCESS:
      return {
        ...state,
        list: getListWithEditedItem(state.list, action)
      };
    case EDIT_EVACUATION_SUCCESS:
      return {
        ...state,
        evacuations: getListWithEditedItem(state.evacuations, action, 'evacuation')
      };
    case UPDATE_EVENT_IDS:
      return {
        ...state,
        list: updateEventIds(state.list, action.oldId, action.newId)
      };
    default:
      return state;
  }
};

export default incidents;

const getListWithEditedItem = (list, action, key) => {
  key = key || 'incident';
  return list.map((element) => {
    if (action.id !== element.id) {
      return element;
    }
    return action[key];
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
