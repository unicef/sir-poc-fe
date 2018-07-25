import { makeRequest, prepareEndpoint } from '../components/common/request-helper.js';
import { Endpoints } from '../config/endpoints.js';
import { objDiff } from '../components/common/utils.js';
import { updatePath } from '../components/common/navigation-helper.js';
import { scrollToTop } from '../components/common/content-container-helper.js';
import { generateRandomHash } from './action-helpers.js';
import { updateEventIdsInIncidents } from './incidents.js';
export const EDIT_EVENT_SUCCESS = 'EDIT_EVENT_SUCCESS';
export const ADD_EVENT_SUCCESS = 'ADD_EVENT_SUCCESS';
export const ADD_EVENT_FAIL = 'ADD_EVENT_FAIL';
export const RECEIVE_EVENTS = 'RECEIVE_EVENTS';
export const RECEIVE_EVENT = 'RECEIVE_EVENT';


// ----- BASIC ACTION CREATORS -----------
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

const receiveEvent = (event) => {
  return {
    type: RECEIVE_EVENT,
    event
  };
}
// ------------------------------

const addEventOnline = (newEvent, dispatch) => {
  makeRequest(Endpoints.newEvent, newEvent).then((result) => {
    updatePath('/events/list/');
    dispatch(addEventSuccess(JSON.parse(result)));
  }).catch((error) => {
    dispatch(addEventFail(error.response));
    scrollToTop();
  });
}

const addEventOffline = (newEvent, dispatch) => {
  newEvent.id = generateRandomHash();
  newEvent.unsynced = true;

  updatePath('/events/list/');
  dispatch(addEventSuccess(newEvent));
}

const editEventOnline = (event, dispatch, state) => {
  let origEvent = state.events.list.find(ev => ev.id === event.id);
  let modifiedFields = objDiff(origEvent, event);
  let endpoint = prepareEndpoint(Endpoints.editEvent, {id: event.id});

  makeRequest(endpoint, modifiedFields).then((result) => {
    let response = JSON.parse(result);
    updatePath('/events/list/');
    dispatch(editEventSuccess(response, response.id));
  }).catch((error) => {
    dispatch(addEventFail(error.response));
    scrollToTop();
  });
}

const editEventOffline = (event, dispatch) => {
  event.unsynced = true;
  updatePath('/events/list/');
  dispatch(editEventSuccess(event, event.id));
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
    editEventOnline(event, dispatch, getState());
  }
}

export const syncEvent = (event) => (dispatch, getState) => {
  makeRequest(Endpoints.newEvent, event).then((result) => {
    let response = JSON.parse(result);
    updatePath('/events/list/');
    dispatch(editEventSuccess(response, event.id));
    dispatch(updateEventIdsInIncidents(event.id, response.id))
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


