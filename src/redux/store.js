/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import {
  createStore,
  compose as origCompose,
  applyMiddleware
} from 'redux';
import thunk from 'redux-thunk';
import { persistStore, persistCombineReducers } from 'redux-persist';

import { storeReady } from '../actions/app.js';
import app from '../reducers/app.js';
import users from '../reducers/users.js';
import errors from '../reducers/errors.js';
import events from '../reducers/events.js';
import incidents from '../reducers/incidents.js';
import staticData from '../reducers/static-data.js';

import { getStorage } from './storage/storage-loader.js';
import { encryptState } from './storage/utils.js';

// Sets up a Chrome extension for time travel debugging.
// See https://github.com/zalmoxisus/redux-devtools-extension for more information.
const compose = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || origCompose;
let key;

const persistConfig = {
  key: 'sir-app',
  transforms: [encryptState],
  storage: getStorage(),
  blacklist: ['errors', 'app', 'users']
};

const persistedReducer = persistCombineReducers(persistConfig, {
  app,
  users,
  errors,
  events,
  incidents,
  staticData
});

// lazy reducers are not being used with redux-persist
export const store = createStore(
  persistedReducer,
  compose(applyMiddleware(thunk))
);

// storeReady() gets called after the old state is loaded from storage
// any data pushed to redux before this callback fires will be overwritten by the old state

const persistorReady = () => new Promise((resolve, reject) => {
  persistStore(store, null, () => resolve(true));
});

export const initStore = async () => {
  await persistorReady();
  store.dispatch(storeReady());
};
