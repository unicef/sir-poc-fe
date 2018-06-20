export const ADD_NEW_EVENT = 'ADD_NEW_EVENT';

export const addEvent = (newEvent) => (dispatch, getState) => {
  if (getState().app.offline === false) {
    // try and send the data straight to the server maybe?
  }

  dispatch({
    type: ADD_NEW_EVENT,
    newEvent
  });

};
