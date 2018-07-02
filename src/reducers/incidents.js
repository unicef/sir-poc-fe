import {
  ADD_INCIDENT_SUCCESS,
  RECEIVE_INCIDENTS
} from '../actions/incidents.js';

const incidents = (state = {incidents: []}, action) => {
  switch (action.type) {
    case RECEIVE_INCIDENTS:
      return {
        ...state,
        incidents: action.incidents
      };
    case ADD_INCIDENT_SUCCESS:
      return {
        ...state,
        incidents: [...state.incidents, action.newIncident]
      };
    default:
      return state;
  }
}

export default incidents;
