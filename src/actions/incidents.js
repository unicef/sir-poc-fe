export const ADD_NEW_INCIDENT = 'ADD_NEW_INCIDENT';

export const addEvent = (newIncident) => (dispatch, getState) => {
  if (getState().app.offline === false) {
    // try and send the data straight to the server maybe?
  }

  dispatch({
    type: ADD_NEW_INCIDENT,
    newIncident
  });

};
