import { makeRequest, prepareEndpoint } from '../components/common/request-helper.js';
import { Endpoints } from '../config/endpoints.js';
import { updatePath } from '../components/common/navigation-helper.js';
import { scrollToTop } from '../components/common/content-container-helper.js';
import { generateRandomHash } from './action-helpers.js';
import { updateEventIdsInIncidents } from './incidents.js';
export const EDIT_EVENT_SUCCESS = 'EDIT_EVENT_SUCCESS';
export const ADD_EVENT_SUCCESS = 'ADD_EVENT_SUCCESS';
export const ADD_EVENT_FAIL = 'ADD_EVENT_FAIL';
export const RECEIVE_EVENTS = 'RECEIVE_EVENTS';
export const RECEIVE_EVENT = 'RECEIVE_EVENT';

const editEventSuccess = (event, id) => {
  return {
    type: EDIT_EVENT_SUCCESS,
    event,
    id
  };
}

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

const editEventOnline = (event, dispatch) => {
  let endpoint = prepareEndpoint(Endpoints.editEvent, {id: event.id});

  makeRequest(endpoint, event).then((result) => {
    let response = JSON.parse(result);
    dispatch(editEventSuccess(response, response.id));
    updatePath('/events/list/');
  }).catch((error) => {
    dispatch(addEventFail(error.response));
    scrollToTop();
  });
}

const editEventOffline = (event, dispatch) => {
  event.unsynced = true;
  dispatch(editEventSuccess(event, event.id));
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
    editEventOffline(event, dispatch);
  } else {
    editEventOnline(event, dispatch);
  }
}

export const syncEvent = (event) => (dispatch, getState) => {
  makeRequest(Endpoints.newEvent, event).then((result) => {
    let response = JSON.parse(result);
    dispatch(editEventSuccess(response, event.id));
    dispatch(updateEventIdsInIncidents(event.id, response.id))
    updatePath('/events/list/');
  }).catch((error) => {
    dispatch(addEventFail(error.response));
    scrollToTop();
  });
}

export const fetchAndStoreEvents = () => (dispatch, getState) => {
  makeRequest(Endpoints.eventsList).then(result => {
    dispatch(receiveEvents(JSON.parse(result)));
  });
};

export const fetchEvent = (id) => (dispatch, getState) => {
  let endpoint = prepareEndpoint(Endpoints.getEvent,  {id: id});
  makeRequest(endpoint).then((response) => {
    dispatch(receiveEvent(JSON.parse(response)));
  });
};

const receiveEvent = (event) => {
  return {
    type: RECEIVE_EVENT,
    event
  };
}
