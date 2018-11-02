/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { updatePath } from '../components/common/navigation-helper.js';
import { loadAllStaticData } from './static-data.js';
import { fetchIncident, fetchAllIncidentData } from './incidents.js';
import { fetchEvent, fetchAndStoreEvents } from './events.js';
import * as ACTIONS from './constants.js';
// TODO: break this up into smaller files
// TODO: add a sync data action when app is back online

let snackbarTimer;

export const requestPageLoadData = () => (dispatch) => {
  console.log('i have been called');

  dispatch(loadAllStaticData());
  dispatch(fetchAndStoreEvents());
  dispatch(fetchAllIncidentData());
};

export const storeReady = () => (dispatch, getState) => {
  let state = getState();
  const isOffline = state && state.app && state.app.offline;
  if (isOffline) {
    return;
  }

  dispatch(requestPageLoadData());
};

export const showSnackbar = text => (dispatch) => {
  dispatch({
    type: ACTIONS.OPEN_SNACKBAR,
    text
  });
  clearTimeout(snackbarTimer);
  snackbarTimer = setTimeout(() =>
    dispatch({ type: ACTIONS.CLOSE_SNACKBAR }), 3000);
};

export const updateOffline = offline => (dispatch, getState) => {
  if (!getState()) {
    return;
  }

  let message = offline ? 'You are now offline' : 'You are now online';
  dispatch(showSnackbar(message));

  dispatch({
    type: ACTIONS.UPDATE_OFFLINE,
    offline
  });
};

export const lazyLoadEventPages = page => (dispatch, getState) => {
  switch (page) {
    case 'list':
      import('../components/events-module/events-list.js');
      break;
    case 'new':
      import('../components/events-module/add-event.js');
      break;
    case 'view':
      import('../components/events-module/view-event.js');
      break;
    case 'edit':
      import('../components/events-module/edit-event.js');
      break;
    case 'history':
      import('../components/events-module/history/event-history-controller.js');
      break;
    default:
      updatePath('/404/');
      break;
  }
};

export const lazyLoadIncidentPages = page => (dispatch, getState) => {
  switch (page) {
    case 'list':
      import('../components/incidents-module/incidents-list.js');
      break;
    case 'new':
      import('../components/incidents-module/add-incident.js');
      break;
    case 'view':
      import('../components/incidents-module/view-incident.js');
      break;
    case 'edit':
      import('../components/incidents-module/edit-incident.js');
      break;
    case 'history':
      import('../components/incidents-module/history/incident-history-controller.js');
      break;
    case 'review':
      import('../components/incidents-module/incident-review.js');
      break;
    case 'impact':
      import('../components/incidents-module/impact/impact-controller.js');
      break;
    default:
      updatePath('/404/');
      break;
  }
};

export const lazyLoadModules = selectedModule => (dispatch, getState) => {
  // Import the page component on demand.
  //
  // Note: `polymer build` doesn't like string concatenation in the import
  // statement, so break it up.
  switch (selectedModule) {
    case 'events':
      import('../components/events-module/events-controller.js');
      break;
    case 'incidents':
      import('../components/incidents-module/incidents-controller.js');
      break;
    case 'dashboard':
      import('../components/dashboard-module/dashboard-controller.js');
      break;
    case 'view404':
      import('../components/non-found-module/404.js');
      break;
  }
};

export const updateLocationInfo = (path, queryParams) => (dispatch, getState) => {

  let [selectedModule, page, eventId, incidentId] = extractInfoFromPath(path);

  if (!getState().app.offline) {
    if (eventId && !isNaN(eventId) && getState().app.locationInfo.eventId !== eventId) {
      // refresh event
      dispatch(fetchEvent(eventId));
    }

    if (incidentId && !isNaN(incidentId) && getState().app.locationInfo.incidentId !== incidentId) {
      // refresh incident
      dispatch(fetchIncident(incidentId));
    }
  }

  dispatch({
    type: ACTIONS.UPDATE_LOCATION_INFO,
    locationInfo: {
      selectedModule,
      page,
      queryParams,
      eventId,
      incidentId
    }
  });
};

const extractInfoFromPath = (path) => {
  const splitPath = (path || '').slice(1).split('/');
  let selectedModule = splitPath[0];
  let page = splitPath[1] || '';
  let eventId = '';
  let incidentId = '';
  if (selectedModule === 'events') {
    eventId = splitPath[2] || '';
  } else {
    incidentId = splitPath[2] || '';
  }
  return [selectedModule, page, eventId, incidentId];
};
