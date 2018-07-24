/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { setPassiveTouchGestures, setRootPath } from '@polymer/polymer/lib/utils/settings.js';
import '@polymer/app-layout/app-drawer/app-drawer.js';
import '@polymer/app-layout/app-drawer-layout/app-drawer-layout.js';
import '@polymer/app-layout/app-header/app-header.js';
import '@polymer/app-layout/app-header-layout/app-header-layout.js';
import '@polymer/app-layout/app-scroll-effects/app-scroll-effects.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';
import '@polymer/app-route/app-location.js';
import '@polymer/app-route/app-route.js';
import '@polymer/iron-pages/iron-pages.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import './common/my-icons.js';
import './styles/app-theme.js';

// basic stuff above, PWA stuff below

import { connect } from 'pwa-helpers/connect-mixin.js';
import { installMediaQueryWatcher } from 'pwa-helpers/media-query.js';
import { installOfflineWatcher } from 'pwa-helpers/network.js';
import { updateMetadata } from 'pwa-helpers/metadata.js';
// This element is connected to the Redux store.
import './snack-bar/snack-bar.js';
import { store } from './store.js';

import { loadAllStaticData } from './data/static-data-loader.js';
import { updatePath } from '/src/components/common/navigation-helper.js';
// These are the actions needed by this element.
import {
  updateOffline,
  lazyLoadModules,
  updateLocationInfo
} from '../actions/app.js';


// Gesture events like tap and track generated from touch will not be
// preventable, allowing for better scrolling performance.
setPassiveTouchGestures(true);

// Set Polymer's root path to the same value we passed to our service worker
// in `index.html`.
setRootPath(MyAppGlobals.rootPath);

class MyApp extends connect(store)(PolymerElement) {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }

        app-drawer-layout:not([narrow]) [drawer-toggle] {
          display: none;
        }

        app-header {
          color: #fff;
          background-color: var(--app-primary-color);
        }

        app-header paper-icon-button {
          --paper-icon-button-ink-color: white;
        }

        .drawer-list a {
          font-weight: normal;
          display: block;
          padding: 0 32px;
          text-decoration: none;
          color: var(--app-secondary-color);
          line-height: 40px;
        }
        .drawer-list a.menu-heading {
          padding: 0 24px;
        }
        a[selected] {
          color: black;
          font-weight: bold;
        }
      </style>

      <app-location route="{{route}}" url-space-regex="^[[rootPath]]">
      </app-location>

      <app-route route="{{route}}" pattern="[[rootPath]]:page" data="{{routeData}}" tail="{{subroute}}">
      </app-route>

      <app-drawer-layout fullbleed="" narrow="{{narrow}}">
        <!-- Drawer content -->
        <app-drawer id="drawer" slot="drawer" swipe-open="[[narrow]]">
          <app-toolbar>Menu</app-toolbar>

          <div class="drawer-list">
            <a class="menu-heading" selected$="[[pathsMatch(page, 'events')]]" href="[[rootPath]]events/list/">Events</a>
              <a selected$="[[pathsMatch(route.path, '/events/list/')]]" href="[[rootPath]]events/list/">Events List</a>
              <a selected$="[[pathsMatch(route.path, '/events/new/')]]" href="[[rootPath]]events/new/">New Event</a>

            <a class="menu-heading" selected$="[[pathsMatch(page, 'incidents')]]" href="[[rootPath]]incidents/list/">Incidents</a>
              <a selected$="[[pathsMatch(route.path, '/incidents/list/')]]" href="[[rootPath]]incidents/list/">Incidents List</a>
              <a selected$="[[pathsMatch(route.path, '/incidents/new/')]]" href="[[rootPath]]incidents/new/">New Incident</a>
          </div>

        </app-drawer>

        <!-- Main content -->
        <app-header-layout has-scrolling-region="">

          <app-header slot="header" condenses="" reveals="" effects="waterfall">
            <app-toolbar>
              <paper-icon-button icon="my-icons:menu" drawer-toggle=""></paper-icon-button>
              <div main-title="">SIR</div>
            </app-toolbar>
          </app-header>

          <iron-pages selected="[[page]]" attr-for-selected="name" role="main">
            <events-controller name="events" route="[[route]]"></events-controller>
            <incidents-controller name="incidents" route="[[route]]"></incidents-controller>
            <my-view404 name="view404"></my-view404>
          </iron-pages>

        </app-header-layout>
        <snack-bar active$="[[snackbarOpened]]">
          <span hidden$="[[!offline]]">You are now offline</span>
          <span hidden$="[[offline]]">You are now online</span>
        </snack-bar>
      </app-drawer-layout>
    `;
  }

  static get properties() {
    return {
      page: {
        type: String,
        reflectToAttribute: true,
        observer: '_pageChanged'
      },
      snackbarOpened: Boolean,
      route: Object,
      routeData: Object,
      subroute: Object,
      offline: Boolean
    };
  }

  static get observers() {
    return [
      '_locationChanged(route.path)',
      '_routePageChanged(routeData.page)'
    ];
  }

  connectedCallback() {
    super.connectedCallback();
    loadAllStaticData(store);

    installOfflineWatcher((offline) => store.dispatch(updateOffline(offline)));
  }

  _locationChanged(path) {
    store.dispatch(updateLocationInfo(path));
  }

  pathsMatch(path1, path2) {
    return path1 === path2;
  }

  _routePageChanged(page) {
     // Show the corresponding page according to the route.
     //
     // If no page was found in the route data, page will be an empty string.
     // Show 'view1' in that case. And if the page doesn't exist, show 'view404'.
    if (!page) {
      updatePath('events/list/');
    } else if (['events', 'incidents'].indexOf(page) !== -1) {
      this.page = page;
    } else {
      this.page = 'view404';
    }


    // Close a non-persistent drawer when the page & route are changed.
    if (!this.$.drawer.persistent) {
      this.$.drawer.close();
    }
  }

  _stateChanged(state) {
    if (!state) {
      return;
    }
    // this.page = state.app.page;
    this.set('offline', state.app.offline);
    this.set('snackbarOpened', state.app.snackbarOpened);
  }

  _pageChanged(page) {
    store.dispatch({type: 'CLEAR_ERRORS'});
    store.dispatch(lazyLoadModules(page));
  }
}

window.customElements.define('app-shell', MyApp);
