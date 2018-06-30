import { makeRequest } from '../components/common/request-helper.js';
import { Endpoints } from '../config/endpoints.js';
import {updatePath} from '../components/common/navigation-helper.js';
import { serverError } from './errors';
import { scrollToTop } from '../components/common/content-container-helper.js';

export const ADD_EVENT_SUCCESS = 'ADD_EVENT_SUCCESS';
export const ADD_EVENT_FAIL = 'ADD_EVENT_FAIL';
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
  };
}

export const addEvent = (newEvent) => (dispatch, getState) => {
  if (getState().app.offline === false) {
    // try and send the data straight to the server maybe?
  }
  makeRequest(Endpoints.newEvent, newEvent).then((result) => {
    dispatch(addEventSuccess(JSON.parse(result)));
    updatePath('/events/list/');
  }).catch((error) => {
    dispatch(addEventFail(error.response));
    scrollToTop();
  });
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

