export const ADD_NEW_INCIDENT = 'ADD_NEW_INCIDENT';
export const LOAD_INCIDENTS = 'LOAD_INCIDENTS';

export const addIncident = (newIncident) => (dispatch, getState) => {
  if (getState().app.offline === false) {
    // try and send the data straight to the server maybe?
  }

  dispatch({
    type: ADD_NEW_INCIDENT,
    newIncident
  });

};

export const loadIncidents = (incidents) => (dispatch, getState) => {
  dispatch({
    type: LOAD_INCIDENTS,
    incidents
  })
}
