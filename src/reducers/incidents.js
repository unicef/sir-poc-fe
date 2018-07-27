import {
  EDIT_INCIDENT_SUCCESS,
  ADD_INCIDENT_SUCCESS,
  RECEIVE_INCIDENTS,
  RECEIVE_INCIDENT,
  UPDATE_EVENT_IDS
} from '../actions/incidents.js';

import { createSelector } from 'reselect';

const incidents = (state = {list: []}, action) => {
  switch (action.type) {
    case RECEIVE_INCIDENTS:
      return {
        ...state,
        list: getRefreshedIncidents(state.list, action.incidents)
      };
    case RECEIVE_INCIDENT:
      return {
        ...state,
        list: getEditedList(state.list, action)
      };
    case ADD_INCIDENT_SUCCESS:
      return {
        ...state,
        list: [...state.list, action.newIncident]
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
}

export default incidents;

const getEditedList = (list, action) => {
  return list.map((incident) => {
    if (action.id !== incident.id) {
      return incident;
    }
    return action.incident;
  });
}

const getRefreshedIncidents = (oldIncidents, newIncidents) => {
  let unsynced = oldIncidents.filter(elem => elem.unsynced);
  return [...newIncidents, ...unsynced];
}

const updateEventIds = (list, oldId, newId) => {
  return list.map((incident) => {
    if (incident.event === oldId) {
      incident.event = newId;
    }

    return incident;
  });
}

// ---------- SELECTORS -------
const incidentsSelector = state => state.incidents.list;
const selectedIncidentId = state => state.app.locationInfo.incidentId;
export const selectIncident = createSelector(
  incidentsSelector,
  selectedIncidentId,
  (incidents, incidentId) => {
    if (!incidentId) {
      return {};
    }
    return incidents.find(i => String(i.id) === String(incidentId));
  }
)
