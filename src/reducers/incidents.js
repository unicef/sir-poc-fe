import {
  ADD_INCIDENT_COMMENT_SUCCESS,
  RECEIVE_INCIDENT_COMMENTS,
  ADD_EVACUATION_SUCCESS,
  EDIT_INCIDENT_SUCCESS,
  ADD_INCIDENT_SUCCESS,
  RECEIVE_EVACUATIONS,
  RECEIVE_INCIDENTS,
  RECEIVE_INCIDENT,
  UPDATE_EVENT_IDS
} from '../actions/incidents.js';

import { createSelector } from 'reselect';

const incidents = (state = {list: [], comments: []}, action) => {
  switch (action.type) {
    case RECEIVE_INCIDENTS:
      return {
        ...state,
        list: getRefreshedIncidents(state.list, action.incidents)
      };
    case RECEIVE_INCIDENT_COMMENTS:
      return {
        ...state,
        comments: action.comments
      };
    case RECEIVE_INCIDENT:
      return {
        ...state,
        list: getEditedList(state.list, action)
      };
    case RECEIVE_EVACUATIONS:
      return {
        ...state,
        evacuations: getRefreshedIncidents(state.evacuations, action.evacuations)
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
        list: getEditedList(state.list, action)
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

const getEditedList = (list, action) => {
  return list.map((incident) => {
    if (action.id !== incident.id) {
      return incident;
    }
    return action.incident;
  });
};

const getRefreshedIncidents = (oldIncidents, newIncidents) => {
  oldIncidents = oldIncidents instanceof Array ? oldIncidents : [];
  newIncidents = newIncidents instanceof Array ? newIncidents : [];
  let unsynced = oldIncidents.filter(elem => elem.unsynced && isNaN(elem.id));
  return [...newIncidents, ...unsynced];
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
