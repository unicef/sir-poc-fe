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
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-icons/av-icons.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import './common/my-icons.js';
import './styles/app-theme.js';

// basic stuff above, PWA stuff below

import { connect } from 'pwa-helpers/connect-mixin.js';
import { installOfflineWatcher } from 'pwa-helpers/network.js';
// This element is connected to the Redux store.
import './snack-bar/snack-bar.js';
import './snack-bar/ios-shortcut-dialog.js';
import { store } from '../redux/store.js';

import { updatePath } from '../components/common/navigation-helper.js';
// These are the actions needed by this element.
import {
  updateOffline,
  lazyLoadModules,
  updateLocationInfo
} from '../actions/app.js';

import {SirMsalAuth} from './auth/jwt/msal-authentication.js';

// Gesture events like tap and track generated from touch will not be
// preventable, allowing for better scrolling performance.
setPassiveTouchGestures(true);

// Set Polymer's root path to the same value we passed to our service worker
// in `index.html`.
setRootPath(MyAppGlobals.rootPath);

class MyApp extends connect(store)(PolymerElement) {
  static get template() {
    // language=HTML
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

        app-header app-toolbar {
          @apply --layout-justified;
        }

        app-header paper-icon-button {
          --paper-icon-button-ink-color: white;
        }

        #menu-header {
          @apply --layout-horizontal;
          @apply --layout-center;
          height: 63px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.12);
          background-color: var(--menu-header-bg, #d6d8d9);
        }

        #menu-header #app-logo {
          @apply --layout-horizontal;
          @apply --layout-center;
          @apply --layout-center-justified;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border: 2px solid var(--primary-color);
          background-color: #fff;
          color: var(--primary-color);
          font-size: 20px;
        }

        #menu-header #app-name {
          @apply --layout-vertical;
          margin-left: 8px;
          font-size: 14px;
        }

        #menu-header #app-name span:last-child {
          color: var(--secondary-text-color);
          font-size: 13px;
        }

        .capitalize {
          text-transform: capitalize;
        }

        .drawer-list a {
          @apply --layout-horizontal;
          @apply --layout-center;
          font-weight: normal;
          padding: 0 32px;
          text-decoration: none;
          color: var(--primary-text-color);
          line-height: 40px;
        }
        .drawer-list a iron-icon {
          margin-right: 8px;
          color: var(--secondary-text-color);
        }
        .drawer-list a.menu-heading[selected] {
          color: var(--app-primary-color);
        }
        .drawer-list a.menu-heading {
          padding: 0 24px;
          font-size: 18px;
          margin-top: 16px;
        }
        .drawer-list a[selected] {
          font-weight: bold;
        }
        .drawer-list a[selected]:not(.menu-heading) {
          background-color: var(--menu-selected-bg-color);
          color: var(--app-primary-color);
        }

        :host([page="login"]) app-drawer .drawer-list {
          position: relative;
        }

        :host([page="login"]) app-drawer .drawer-list:after {
          position: absolute;
          content: "";
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          background-color: rgba(255, 255, 255, .7);
        }

        :host([page="login"]) #logout {
          display: none;
        }

        :host([page="login"]) app-drawer a {
          -webkit-filter: blur(2px);
          -moz-filter: blur(2px);
          -o-filter: blur(2px);
          -ms-filter: blur(2px);
          filter: blur(2px);
        }
      </style>

      <app-location route="{{route}}" url-space-regex="^[[rootPath]]">
      </app-location>

      <app-route route="{{route}}" pattern="[[rootPath]]:page" data="{{routeData}}" query-params="{{queryParams}}">
      </app-route>

      <!-- menu will switch to mobile hamburger menu under 1280px -->
      <app-drawer-layout fullbleed="" narrow="{{narrow}}" responsive-width="1280px">
        <!-- Drawer content -->
        <app-drawer id="drawer" slot="drawer" swipe-open="[[narrow]]">
          <app-toolbar id="menu-header">
            <span id="app-logo">SIR</span>
            <span id="app-name">
              <span>Safety and Security</span>
              <span>Incident Recording System</span>
            </span>
          </app-toolbar>

          <div class="drawer-list">
            <a class="menu-heading"
              selected$="[[pathsMatch(page, 'dashboard')]]"
              href="[[rootPath]]dashboard">Dashboard</a>

            <a class="menu-heading"
              selected$="[[pathsMatch(page, 'events')]]"
              href="[[rootPath]]events/list/">Events</a>

            <a selected$="[[pathsMatch(route.path, '/events/list/')]]"
              href="[[rootPath]]events/list/">
                <iron-icon icon="list"></iron-icon>
                <span>Events List</span>
              </a>

            <a selected$="[[pathsMatch(route.path, '/events/new/')]]"
              href="[[rootPath]]events/new/">
              <iron-icon icon="av:playlist-add"></iron-icon>
              <span>New Event</span>
            </a>

            <a class="menu-heading"
              selected$="[[pathsMatch(page, 'incidents')]]"
              href="[[rootPath]]incidents/list/">Incidents</a>

            <a selected$="[[pathsMatch(route.path, '/incidents/list/')]]"
              href="[[rootPath]]incidents/list/">
              <iron-icon icon="list"></iron-icon>
              <span>Incidents List</span>
            </a>

            <a selected$="[[pathsMatch(route.path, '/incidents/new/')]]"
              href="[[rootPath]]incidents/new/">
              <iron-icon icon="av:playlist-add"></iron-icon>
              <span>New Incident</span>
            </a>

            <a class="menu-heading" href="[[rootPath]]admin/" target="_blank">
              <iron-icon icon="supervisor-account"></iron-icon>
              <span>Admin</span>
            </a>
          </div>

        </app-drawer>

        <!-- Main content -->
        <app-header-layout has-scrolling-region="">

          <app-header slot="header" condenses="" reveals="" effects="waterfall">
            <app-toolbar>
              <paper-icon-button icon="my-icons:menu" drawer-toggle=""></paper-icon-button>
              <div class="capitalize">[[_getPageTitle(page)]]</div>
              <paper-icon-button id="logout" icon="exit-to-app" title="Logout" on-tap="_logout"></paper-icon-button>
            </app-toolbar>
          </app-header>

          <iron-pages selected="[[page]]" attr-for-selected="name" role="main">
            <sir-login name="login"></sir-login>
            <events-controller name="events" route="{{route}}"></events-controller>
            <incidents-controller name="incidents" route="{{route}}"></incidents-controller>
            <dashboard-controller name="dashboard"></dashboard-controller>
            <my-view404 name="view404"></my-view404>
          </iron-pages>

        </app-header-layout>
        <snack-bar active$="[[snackbarOpened]]">
          <span>[[snackbarText]]</span>
        </snack-bar>
        <ios-shortcut-dialog></ios-shortcut-dialog>
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
      validPages: {
        type: Array,
        value: ['login', 'dashboard', 'events', 'incidents']
      },
      snackbarOpened: Boolean,
      snackbarText: String,
      route: Object,
      routeData: Object,
      queryParams: Object,
      offline: Boolean
    };
  }

  static get observers() {
    return [
      '_locationChanged(route.path, queryParams)',
      '_routePageChanged(routeData.page)'
    ];
  }

  connectedCallback() {
    super.connectedCallback();
    installOfflineWatcher(offline => store.dispatch(updateOffline(offline)));
  }

  _locationChanged(path, queryParams) {
    store.dispatch(updateLocationInfo(path, queryParams));
    store.dispatch({type: 'CLEAR_ERRORS'});
  }

  pathsMatch(path1, path2) {
    return path1 === path2;
  }

  _routePageChanged(page) {
    if (this.page === page) {
      return;
    }
    if (SirMsalAuth.tokenIsValid()) {
      if (page === 'login') {
        // no need to go to login page, go to landing page instead
        updatePath('dashboard');
      }
      // if msal login token is valid proceed to requested page immediately
      this._routePageChangedCallback(page);
    } else {
      // if no valid token found, request token.
      // if no valid token is received then go to login page
      SirMsalAuth.acquireTokenSilent()
          .then(() => {
            this._routePageChangedCallback(page);
          })
          .catch(() => {
            updatePath('login');
            this.page = 'login';
          });
    }
  }

  _routePageChangedCallback(page) {
    // Show the corresponding page according to the route.
    // If no page was found in the route data, page will be an empty string.
    // Show the dashboard in that case. And if the page doesn't exist, show 'view404'.
    if (!page || page === 'login') {
      updatePath('dashboard');
    } else if (this._isValidPage(page)) {
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
    this.set('snackbarText', state.app.snackbarText);
    this.set('snackbarOpened', state.app.snackbarOpened);
  }

  _pageChanged(page) {
    store.dispatch(lazyLoadModules(page));
  }

  _isValidPage(page) {
    return this.validPages.indexOf(page) !== -1;
  }

  _logout() {
    SirMsalAuth.logout();
  }

  _getPageTitle(page) {
    return !page ? '' : `SIR - ${page}`;
  }

}

window.customElements.define('app-shell', MyApp);
