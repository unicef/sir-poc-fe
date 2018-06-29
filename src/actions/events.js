import { makeRequest } from '../components/common/request-helper.js';
import { Endpoints } from '../config/endpoints.js';

export const ADD_NEW_EVENT = 'ADD_NEW_EVENT';
export const RECEIVE_EVENTS = 'RECEIVE_EVENTS';


export const fetchAndStoreEvents = () => (dispatch, getState) => {
  makeRequest(Endpoints.eventsList).then(result => {
    dispatch(receiveEvents(JSON.parse(result)));
  });
};

const receiveEvents = (events) => {
  return {
    type: RECEIVE_EVENTS,
    events
  }
}

export const addEvent = (newEvent) => (dispatch, getState) => {
  if (getState().app.offline === false) {
    // try and send the data straight to the server maybe?
  }

  dispatch({
    type: ADD_NEW_EVENT,
    newEvent
  });
};

