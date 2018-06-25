import {
  ADD_NEW_INCIDENT
} from '../actions/incidents.js';

const incidents = (state = {incidents: []}, action) => {
  switch (action.type) {
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
