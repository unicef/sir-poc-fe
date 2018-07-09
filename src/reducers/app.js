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
  UPDATE_PAGE,
  UPDATE_OFFLINE,
  OPEN_SNACKBAR,
  CLOSE_SNACKBAR,
  UPDATE_DRAWER_STATE,
  UPDATE_MODULE,
  UPDATE_SELECTED_ITEM_ID
} from '../actions/app.js';


const app = (state = {narrowDrawer: false, selectedModule: '', page: '', selectedItemId:''}, action) => {
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
    case UPDATE_PAGE:
      return {
        ...state,
        page: action.page
      };
    case UPDATE_MODULE:
      return {
        ...state,
        selectedModule: action.selectedModule
      };
    case UPDATE_SELECTED_ITEM_ID:
      return {
        ...state,
        selectedItemId: action.selectedItemId
      };
    default:
      return state;
  }
}

export default app;

const appSelector = state => state.app;
export const onNewEvent = createSelector(
  appSelector,
  (app) => (app.page === 'new' && app.selectedModule === 'events')
);

export const onNewIncident = createSelector(
  appSelector,
  (app) => (app.page === 'new' && app.selectedModule === 'incidents')
);

