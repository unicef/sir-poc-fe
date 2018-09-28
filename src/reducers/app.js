/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import * as ACTIONS from '../actions/constants.js';

const defaultState = {
  offline: false,
  narrowDrawer: false,
  locationInfo: {
    selectedModule: '',
    incidentId: '',
    eventId: '',
    page: ''
  }
};

const app = (state = defaultState, action) => {
  switch (action.type) {
    case ACTIONS.UPDATE_OFFLINE:
      return {
        ...state,
        offline: action.offline
      };
    case ACTIONS.UPDATE_DRAWER_STATE:
      return {
        ...state,
        narrowDrawer: action.opened
      };
    case ACTIONS.OPEN_SNACKBAR:
      return {
        ...state,
        snackbarOpened: true
      };
    case ACTIONS.CLOSE_SNACKBAR:
      return {
        ...state,
        snackbarOpened: false
      };
    case ACTIONS.UPDATE_LOCATION_INFO:
      return {
        ...state,
        locationInfo: action.locationInfo
      };
    default:
      return state;
  }
};

export default app;
