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
  applyMiddleware,
  combineReducers
} from 'redux';
import thunk from 'redux-thunk';
import { lazyReducerEnhancer } from 'pwa-helpers/lazy-reducer-enhancer.js';

import app from '../reducers/app.js';
import events from '../reducers/events.js';
import incidents from '../reducers/incidents.js';
import staticData from '../reducers/static-data.js';
import errors from '../reducers/errors.js';

import { persistStore, persistCombineReducers } from 'redux-persist';

// import storage from 'redux-persist/es/storage';
import { storage } from './indexeddb-storage.js';
// Sets up a Chrome extension for time travel debugging.
// See https://github.com/zalmoxisus/redux-devtools-extension for more information.
const compose = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || origCompose;

// Initializes the Redux store with a lazyReducerEnhancer (so that you can
// lazily add reducers after the store has been created) and redux-thunk (so
// that you can dispatch async actions). See the "Redux and state management"
// section of the wiki for more details:
// https://github.com/Polymer/pwa-starter-kit/wiki/4.-Redux-and-state-management

const persistConfig = {
  key: 'sir-app',
  storage,
};


const persistedReducer = persistCombineReducers(persistConfig, {
  app,
  events,
  incidents,
  staticData,
  errors
});

// lazy reducers are not being used with redux-persist
export const store = createStore(
  persistedReducer,
  compose(lazyReducerEnhancer(combineReducers), applyMiddleware(thunk))
);

export const persistor = persistStore(store);
