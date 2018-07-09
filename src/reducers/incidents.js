import {
  ADD_INCIDENT_SUCCESS,
  RECEIVE_INCIDENTS
} from '../actions/incidents.js';

const incidents = (state = {list: []}, action) => {
  switch (action.type) {
    case RECEIVE_INCIDENTS:
      return {
        ...state,
        list: action.incidents
      };
    case ADD_INCIDENT_SUCCESS:
      return {
        ...state,
        list: [...state.list, action.newIncident]
      };
    default:
      return state;
  }
}

export default incidents;
