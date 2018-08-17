export const PLAIN_ERROR = 'PLAIN_ERROR';
export const SERVER_ERROR = 'SERVER_ERROR';
export const CLEAR_ERRORS = 'CLEAR_ERRORS';

export const serverError = (serverError) => {
  return {
    type: SERVER_ERROR,
    serverError
  };
};

export const plainErrors = (plainErrors) => {
  return {
    type: PLAIN_ERROR,
    plainErrors
  };
};

export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS
  };
};
