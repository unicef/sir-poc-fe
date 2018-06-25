import {
  ADD_NEW_INCIDENT,
  LOAD_INCIDENTS
} from '../actions/incidents.js';

const incidents = (state = {incidents: []}, action) => {
  switch (action.type) {
    case LOAD_INCIDENTS:
      return {
        ...state,
        incidents: action.incidents
      };
    case ADD_NEW_INCIDENT:
      return {
        ...state,
        incidents: [...state.incidents, action.newIncident]
      };
    default:
      return state;
  }
}

export default incidents;
