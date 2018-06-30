import { SERVER_ERROR, CLEAR_ERRORS } from '../actions/errors.js'

const noErrors = {
  serverError: null
};

const errors = (state = {serverError: ''}, action) => {
  switch (action.type) {
    case CLEAR_ERRORS:
      return noErrors;
    case SERVER_ERROR:
    case 'ADD_EVENT_FAIL':
    case 'ADD_INCIDENT_FAIL':
      return {
        ...state,
        serverError: action.serverError
      };
    default:
      return state;
  }
}

export default errors;