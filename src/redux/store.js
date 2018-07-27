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
import { persistStore, persistCombineReducers } from 'redux-persist';

import { storeReady } from '../actions/app.js';
import app from '../reducers/app.js';
import errors from '../reducers/errors.js';
import events from '../reducers/events.js';
import incidents from '../reducers/incidents.js';
import staticData from '../reducers/static-data.js';

import { getStorage } from './storage/storage-loader.js';

// Sets up a Chrome extension for time travel debugging.
// See https://github.com/zalmoxisus/redux-devtools-extension for more information.
const compose = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || origCompose;

const persistConfig = {
  key: 'sir-app',
  storage: getStorage(),
  blacklist: ['errors']
};

const persistedReducer = persistCombineReducers(persistConfig, {
  app,
  errors,
  events,
  incidents,
  staticData
});

// lazy reducers are not being used with redux-persist
export const store = createStore(
  persistedReducer,
  compose(lazyReducerEnhancer(combineReducers), applyMiddleware(thunk))
);
// storeReady() gets called after the old state is loaded from storage 
// any data pushed to redux before this callback fires will be overwritten by the old state
export const persistor = persistStore(store, null, () => store.dispatch(storeReady()));
