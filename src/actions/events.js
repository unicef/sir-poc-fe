import { makeRequest, prepareEndpoint } from '../components/common/request-helper.js';
import { Endpoints } from '../config/endpoints.js';
import { objDiff } from '../components/common/utils.js';
import { updatePath } from '../components/common/navigation-helper.js';
import { scrollToTop } from '../components/common/content-container-helper.js';
import { generateRandomHash } from './action-helpers.js';
import { updateEventIdsInIncidents } from './incidents.js';
import { PLAIN_ERROR } from './errors.js';
import * as ACTIONS from './constants.js';


// ----- BASIC ACTION CREATORS -----------
const editEventSuccess = (event, id) => {
  return {
    type: ACTIONS.EDIT_EVENT_SUCCESS,
    event,
    id
  };
};

const addEventSuccess = (newEvent) => {
  return {
    type: ACTIONS.ADD_EVENT_SUCCESS,
    newEvent
  };
};

const addEventFail = (serverError) => {
  return {
    type: ACTIONS.ADD_EVENT_FAIL,
    serverError
  };
};

const syncEventFail = () => {
  return {
    type: PLAIN_ERROR,
    plainErrors: ['There was an error syncing your event. Please review the data and try again']
  };
};

const receiveEvents = (events) => {
  return {
    type: ACTIONS.RECEIVE_EVENTS,
    events
  };
};

const receiveEvent = (event) => {
  return {
    type: ACTIONS.RECEIVE_EVENT,
    event,
    id: event.id
  };
};

export const setEventDraft = (event) => {
  return {
    type: ACTIONS.SET_EVENT_DRAFT,
    event
  };
};
// ------------------------------

const addEventOnline = (newEvent, dispatch) => {
  return makeRequest(Endpoints.newEvent, newEvent).then((result) => {
    updatePath('/events/list/');
    dispatch(addEventSuccess(result));
    return true;
  }).catch((error) => {
    dispatch(addEventFail(error.response));
    scrollToTop();
    return false;
  });
};

const addEventOffline = (newEvent, dispatch) => {
  newEvent.id = generateRandomHash();
  newEvent.unsynced = true;
  newEvent.status = 'Not Synced';

  updatePath('/events/list/');
  dispatch(addEventSuccess(newEvent));
  return true;
};

const editEventOnline = (event, dispatch, state) => {
  let origEvent = state.events.list.find(ev => ev.id === event.id);
  let modifiedFields = objDiff(origEvent, event);
  let endpoint = prepareEndpoint(Endpoints.editEvent, {id: event.id});

  makeRequest(endpoint, modifiedFields).then((result) => {
    updatePath('/events/list/');
    dispatch(editEventSuccess(result, result.id));
  }).catch((error) => {
    dispatch(addEventFail(error.response));
    scrollToTop();
  });
};

const editEventOffline = (event, dispatch) => {
  event.unsynced = true;
  updatePath('/events/list/');
  dispatch(editEventSuccess(event, event.id));
};

export const addEvent = newEvent => (dispatch, getState) => {
  if (getState().app.offline === true) {
    return addEventOffline(newEvent, dispatch);
  } else {
    return addEventOnline(newEvent, dispatch);
  }
};

export const editEvent = event => (dispatch, getState) => {
  if (getState().app.offline === true) {
    editEventOffline(event, dispatch);
  } else {
    if (event.unsynced) {
      dispatch(syncEvent(event));
    } else {
      editEventOnline(event, dispatch, getState());
    }

  }
};

export const syncEvent = event => (dispatch, getState) => {
  return makeRequest(Endpoints.newEvent, event).then((result) => {
    updatePath('/events/list/');
    dispatch(editEventSuccess(result, event.id));
    dispatch(updateEventIdsInIncidents(event.id, result.id));
    return true;
  }).catch((error) => {
    dispatch(addEventFail(error.response));
    scrollToTop();
    return false;
  });
};

export const syncEventOnList = event => (dispatch, getState) => {
  return makeRequest(Endpoints.newEvent, event).then((result) => {
    dispatch(editEventSuccess(result, event.id));
    dispatch(updateEventIdsInIncidents(event.id, result.id));
    return true;
  }).catch((error) => {
    dispatch(syncEventFail());
    updatePath('/events/edit/' + event.id + '/');
    return false;
  });
};

export const fetchAndStoreEvents = () => (dispatch, getState) => {
  if (getState().app.offline !== true) {
    makeRequest(Endpoints.eventsList).then((result) => {
      dispatch(receiveEvents(result));
    });
  }
};

export const fetchEvent = id => (dispatch, getState) => {
  if (getState().app.offline === true) {
    return;
  }
  if (isNaN(id)) {
    updatePath('/events/list/');
    return;
  }
  let endpoint = prepareEndpoint(Endpoints.getEvent, {id});
  makeRequest(endpoint).then((response) => {
    dispatch(receiveEvent(response));
  });
};
