export const SERVER_ERROR = 'SERVER_ERROR';
export const CLEAR_ERRORS = 'CLEAR_ERRORS';

export const serverError = (serverError) => {
  return {
    type: SERVER_ERROR,
    serverError
  };
}

export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS
  }
}
