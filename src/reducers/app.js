/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
import { createSelector } from 'reselect';

import {
  UPDATE_OFFLINE,
  OPEN_SNACKBAR,
  CLOSE_SNACKBAR,
  UPDATE_DRAWER_STATE,
  UPDATE_LOCATION_INFO,
} from '../actions/app.js';

const app = (state = {narrowDrawer: false, offline: false, locationInfo: {selectedModule: '', page: '', selectedItemId: ''}}, action) => {
  switch (action.type) {
    case UPDATE_OFFLINE:
      return {
        ...state,
        offline: action.offline
      };
    case UPDATE_DRAWER_STATE:
      return {
        ...state,
        narrowDrawer: action.opened
      }
    case OPEN_SNACKBAR:
      return {
        ...state,
        snackbarOpened: true
      };
    case CLOSE_SNACKBAR:
      return {
        ...state,
        snackbarOpened: false
      };
    case UPDATE_LOCATION_INFO:
      return {
        ...state,
        locationInfo: action.locationInfo
      };
    default:
      return state;
  }
}

export default app;

const locationInfoSelector = state => state.app.locationInfo;
export const onNewEvent = createSelector(
  locationInfoSelector,
  (locInfo) => (locInfo.page === 'new' && locInfo.selectedModule === 'events')
);

export const onEditEvent = createSelector(
  locationInfoSelector,
  (locInfo) => (locInfo.page === 'edit' && locInfo.selectedModule === 'events'
    && locInfo.selectedItemId)
);

export const onNewIncident = createSelector(
  locationInfoSelector,
  (locInfo) => (locInfo.page === 'new' && locInfo.selectedModule === 'incidents')
);

