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

export const UPDATE_PAGE = 'UPDATE_PAGE';
export const UPDATE_OFFLINE = 'UPDATE_OFFLINE';
export const UPDATE_DRAWER_STATE = 'UPDATE_DRAWER_STATE';
export const OPEN_SNACKBAR = 'OPEN_SNACKBAR';
export const CLOSE_SNACKBAR = 'CLOSE_SNACKBAR';
export const UPDATE_MODULE = 'UPDATE_MODULE';
export const UPDATE_SELECTED_ITEM_ID = 'UPDATE_SELECTED_ITEM_ID';

//TODO: break this up into smaller files
//TODO: add a sync data action when app is back online

let snackbarTimer;

export const showSnackbar = () => (dispatch) => {
  dispatch({
    type: OPEN_SNACKBAR
  });
  clearTimeout(snackbarTimer);
  snackbarTimer = setTimeout(() =>
    dispatch({ type: CLOSE_SNACKBAR }), 3000);
};

export const updateOffline = (offline) => (dispatch, getState) => {
  if (!getState()) { return; }
  // Show the snackbar, unless this is the first load of the page.
  if (getState().app.offline !== undefined) {
    dispatch(showSnackbar());
  }
  dispatch({
    type: UPDATE_OFFLINE,
    offline
  });
};

export const lazyLoadEventPages = (page) => (dispatch, getState) => {
  switch(page) {
    case 'list':
      import('../components/events-module/events-list.js');
      break;
    case 'new':
      import('../components/events-module/add-event.js');
      break;
    case 'view':
      import('../components/events-module/view-event.js');
      break;
    default:
      updatePath('/404/');
      break;
  }

  dispatch(updatePage(page));
}

export const lazyLoadIncidentPages = (page) => (dispatch, getState) => {
  switch(page) {
    case 'list':
      import('../components/incidents-module/incidents-list.js');
      break;
    case 'new':
      import('../components/incidents-module/add-incident.js');
      break;
    case 'view':
      import('../components/incidents-module/view-incident.js');
      break;
    default:
      updatePath('/404/');
      break;
  }

  dispatch(updatePage(page));
}

export const lazyLoadModules = (selectedModule) => (dispatch, getState) => {
  // Import the page component on demand.
  //
  // Note: `polymer build` doesn't like string concatenation in the import
  // statement, so break it up.
  //TODO - check if already imported?
  switch (selectedModule) {
    case 'events':
      import('../components/events-module/events-controller.js');
      break;
    case 'incidents':
      import('../components/incidents-module/incidents-controller.js');
      break;
    case 'view404':
      import('../components/non-found-module/404.js');
      break;
  }

  dispatch(updateModule(selectedModule));
}

export const updateModule = (selectedModule) => {
  return {
    type: UPDATE_MODULE,
    selectedModule
  };
}

export const updatePage = (page) => {
  return {
    type: UPDATE_PAGE,
    page
  };
}

export const updateSelectedItemId = (selectedItemId) => {
  return {
    type: UPDATE_SELECTED_ITEM_ID,
    selectedItemId
  }
}
