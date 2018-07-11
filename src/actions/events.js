import { makeRequest, prepareEndpoint } from '../components/common/request-helper.js';
import { Endpoints } from '../config/endpoints.js';
import { updatePath } from '../components/common/navigation-helper.js';
import { serverError } from './errors';
import { scrollToTop } from '../components/common/content-container-helper.js';
import { generateRandomHash } from './action-helpers.js';
export const ADD_EVENT_SUCCESS = 'ADD_EVENT_SUCCESS';
export const ADD_EVENT_FAIL = 'ADD_EVENT_FAIL';
export const RECEIVE_EVENTS = 'RECEIVE_EVENTS';


export const fetchAndStoreEvents = () => (dispatch, getState) => {
  makeRequest(Endpoints.eventsList).then(result => {
    dispatch(receiveEvents(JSON.parse(result)));
  });
};

const addEventSuccess = (newEvent) => {
  return {
    type: ADD_EVENT_SUCCESS,
    newEvent
  };
}

const addEventFail = (serverError) => {
  return {
    type: ADD_EVENT_FAIL,
    serverError
  };
}

const receiveEvents = (events) => {
  return {
    type: RECEIVE_EVENTS,
    events
  };
}

const addEventOnline = (newEvent, dispatch) => {
  makeRequest(Endpoints.newEvent, newEvent).then((result) => {
    dispatch(addEventSuccess(JSON.parse(result)));
    updatePath('/events/list/');
  }).catch((error) => {
    dispatch(addEventFail(error.response));
    scrollToTop();
  });
}

const addEventOffline = (newEvent, dispatch) => {
  newEvent.id = generateRandomHash();
  newEvent.unsynced = true;
  dispatch(addEventSuccess(newEvent));
  updatePath('/events/list/');
}


export const addEvent = (newEvent) => (dispatch, getState) => {
  if (getState().app.offline === true) {
    addEventOffline(newEvent, dispatch);
  } else {
    addEventOnline(newEvent, dispatch);
  }
}

export const editEvent = (event) => (dispatch, getState) => {
  if (getState().app.offline === true) {
    console.log('Can\'t edit offline yet');
    return;
  }

  let endpoint = prepareEndpoint(Endpoints.editEvent, {id: event.id});

  makeRequest(endpoint, event).then((result) => {
    dispatch(fetchAndStoreEvents());
    updatePath('/events/list/');
  }).catch((error) => {
    dispatch(addEventFail(error.response));
    scrollToTop();
  });
}
