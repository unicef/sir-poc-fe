import { PLAIN_ERROR, SERVER_ERROR, CLEAR_ERRORS } from '../actions/errors.js';

const noErrors = {
  serverError: null,
  plainErrors: null
};

const errors = (state = {serverError: ''}, action) => {
  switch (action.type) {
    case CLEAR_ERRORS:
      return noErrors;
    case SERVER_ERROR:
    case 'ADD_EVENT_FAIL':
      return {
        ...state,
        serverError: action.serverError
      };
    case PLAIN_ERROR:
      return {
        ...state,
        plainErrors: action.plainErrors
      };
    default:
      return state;
  }
};

export default errors;
