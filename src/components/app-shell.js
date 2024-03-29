/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import { html } from '@polymer/polymer/polymer-element.js';
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
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-menu-button/paper-menu-button.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import './common/my-icons.js';
import './styles/app-theme.js';
import './styles/shared-styles.js';
// import './common/support-btn.js';
// import './common/documentation-btn.js';

import { connect } from 'pwa-helpers/connect-mixin.js';
import { installOfflineWatcher } from 'pwa-helpers/network.js';

import './snack-bar/snack-bar.js';
import './snack-bar/ios-shortcut-dialog.js';
import { store } from '../redux/store.js';
import { resetKeyExpiry } from '../redux/storage/utils.js';
import { CHECK_IDLE_STATE_INTERVAL } from '../config/general.js';
import { PermissionsBase } from './common/permissions-base-class.js';
import { updatePath } from '../components/common/navigation-helper.js';

import { clearIncidentDraft } from '../actions/incidents.js';
import {
  showBrowserWarning,
  updateOffline,
  lazyLoadModules,
  updateLocationInfo
} from '../actions/app.js';

import { SirMsalAuth } from './auth/jwt/msal-authentication.js';

class AppShell extends connect(store)(PermissionsBase) {
  static get template() {
    // language=HTML
    return html`
      <style include="shared-styles">
        :host {
          display: block;
        }

        app-drawer-layout:not([narrow]) [drawer-toggle] {
          display: none;
        }

        app-header {
          color: #fff;
          background-color: var(--primary-color);
        }

        app-header app-toolbar {
          @apply --layout-justified;
        }

        app-header paper-icon-button {
          --paper-icon-button-ink-color: white;
          padding: 4px;
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
          padding: 0 30px;
          text-decoration: none;
          color: var(--primary-text-color);
          line-height: 40px;
        }
        .drawer-list a iron-icon {
          margin-right: 8px;
          color: var(--secondary-text-color);
        }
        .drawer-list a.menu-heading[selected] {
          color: var(--primary-color);
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
          color: var(--primary-color);
        }
        #logo {
          width: 70%;
          padding: 0 16px;
          position: fixed;
          bottom: 128px;
        }
        .menu-icon {
          padding: 4px;
          border-right: solid;
        }
        .title-group {
          flex-direction: row;
          display: flex;
          align-items: center;
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
              selected$="[[pathsMatch(page, 'incidents')]]"
              href="[[rootPath]]incidents/list/">Incidents</a>

            <a selected$="[[pathsMatch(route.path, '/incidents/list/')]]"
              href="[[rootPath]]incidents/list/">
                <iron-icon icon="list"></iron-icon>
                <span> Incidents List </span>
                <small hidden$="[[!getNewCaseCount(incidents)]]">
                  &nbsp;([[getNewCaseCount(incidents)]] new)
                </small>
            </a>

            <a selected$="[[pathsMatch(route.path, '/incidents/new/')]]"
              href="[[rootPath]]incidents/new/"
              hidden$="[[!canAddIncidents(profile)]]">
                  <iron-icon icon="av:playlist-add"></iron-icon>
                  <span>New Incident</span>
            </a>

            <a class="menu-heading"
              selected$="[[pathsMatch(page, 'events')]]"
              href="[[rootPath]]events/list/">Events</a>

            <a selected$="[[pathsMatch(route.path, '/events/list/')]]"
              href="[[rootPath]]events/list/">
                <iron-icon icon="list"></iron-icon>
                <span>Events List</span>
                <small hidden$="[[!getNewCaseCount(events)]]">
                  &nbsp;([[getNewCaseCount(events)]] new)
                </small>
            </a>

            <a selected$="[[pathsMatch(route.path, '/events/new/')]]"
              href="[[rootPath]]events/new/"
              hidden$="[[!canAddEvents(profile)]]">
                <iron-icon icon="av:playlist-add"></iron-icon>
                <span>New Event</span>
            </a>

            <a class="menu-heading"
              selected$="[[pathsMatch(route.path, '/reporting/list/')]]"
              hidden$="[[!canViewStaff(profile)]]"
              href="[[rootPath]]reporting/list/">Reporting Users</a>

            <a selected$="[[pathsMatch(route.path, '/reporting/list/')]]"
            hidden$="[[!canViewStaff(profile)]]"
              href="[[rootPath]]reporting/list/">
                <iron-icon icon="list"></iron-icon>
                <span> Reporting List </span>
            </a>

           

        
            <a class="menu-heading" href="[[rootPath]]admin/" target="_blank" hidden$="[[!canViewAdmin(profile)]]">
                <iron-icon icon="supervisor-account"></iron-icon>
                <span>Admin</span>
            </a>
          </div>
          <img id="logo" align="end" src="../../images/unicef_logo.png"></img>

        </app-drawer>

        <!-- Main content -->
        <app-header-layout has-scrolling-region="">

          <app-header id="header" slot="header" effects="waterfall">
            <app-toolbar>
              <div class="title-group">
                <paper-icon-button icon="my-icons:menu" drawer-toggle=""></paper-icon-button>
                <div class="capitalize">[[_getPageTitle(page)]][[warningMessage]]</div>
              </div>
              <div>

              <paper-menu-button class="export" horizontal-align="right" vertical-offset="8">
              <iron-icon icon="view-headline" class="action-btn" slot="dropdown-trigger"></iron-icon>
              <paper-listbox slot="dropdown-content">
                <paper-item >
                    <a  
                        href="https://unicef.service-now.com/cc?id=sc_cat_item&sys_id=dbf207abdb56d740085184735b9619d5"
                        target="_blank"
                    > 
                    Assign / Revoke Access
                    </a>
                </paper-item>
                <paper-item >
                    <a  
                        href="https://unicef.service-now.com/cc?id=sc_cat_item&sys_id=30a0503bdb437c504eaa2dcb0b961989"
                        target="_blank"
                    > 
                    Data correction or modification
                    </a>
                </paper-item>
                <paper-item >
                    <a  
                        href="https://unicef.service-now.com/cc?id=sc_cat_item&sys_id=c8e43760db622450f65a2aea4b9619ad&sysparm_category=b473317ddb0b30504eaa2dcb0b9619de"
                        target="_blank"
                    > 
                    Report a technical problem
                    </a>
                </paper-item>
                <paper-item >
                    <a  
                        href=" https://unicef.sharepoint.com/teams/EMOPS-OSC/General%20Library/Forms/AllItems.aspx?id=%2fteams%2fEMOPS%2DOSC%2fGeneral%20Library%2fSIR%2fUNICEF%20SIR%20Manual%20%28v%2E2%29%2Epdf&parent=%2fteams%2fEMOPS%2DOSC%2fGeneral%20Library%2fSIR"
                        target="_blank"
                    > 
                    Documentation
                    </a>
                </paper-item>
              </paper-listbox>
            </paper-menu-button>
                 
                
                <!-- <support-btn class="menu-icon"></support-btn> -->
                <paper-icon-button id="logout" icon="exit-to-app" title="Logout" on-tap="_logout"></paper-icon-button>
              </div>
            </app-toolbar>
          </app-header>

          <iron-pages selected="[[page]]" attr-for-selected="name" role="main" selected-attribute="visible">
            <events-controller name="events" route="{{route}}"></events-controller>
            <incidents-controller name="incidents" route="{{route}}"></incidents-controller>
            <reporting-controller name="reporting" route="{{route}}"></reporting-controller>
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
        value: ['events', 'incidents', 'reporting']
      },
      snackbarOpened: Boolean,
      snackbarText: String,
      route: Object,
      routeData: Object,
      queryParams: Object,
      offline: Boolean,
      warningMessage: {
        type: String,
        value: ''
      }
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
    this.showPrefferedBrowserMessage();
    this.checkForIdleState();
    this.setHeaderColor();
  }

  checkForIdleState() {
    let lastActivityTimestamp = Date.now();
    let lastTimeWeRest = Date.now();

    document.addEventListener('mouseup', () => lastActivityTimestamp = Date.now());
    document.addEventListener('keyup', () => lastActivityTimestamp = Date.now());

    this.idleCheckInterval = this.idleCheckInterval || setInterval(() => {
      if (lastActivityTimestamp !== lastTimeWeRest) {
        resetKeyExpiry();
        lastTimeWeRest = lastActivityTimestamp;
      }
    }, CHECK_IDLE_STATE_INTERVAL);
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

    this._routePageChangedCallback(page);
  }

  _routePageChangedCallback(page) {
    if (!page) {
      updatePath('incidents/list/');
    } else if (this._isValidPage(page)) {
      this.page = page;
    } else {
      this.page = 'view404';
    }

    if (!this.$.drawer.persistent) {
      this.$.drawer.close();
    }
  }

  _stateChanged(state) {
    if (!state) {
      return;
    }

    this.set('offline', state.app.offline);
    this.set('profile', state.staticData.profile);
    this.set('events', state.events.list);
    this.set('incidents', state.incidents.list);
    this.set('reporting', state.reporting.list);
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
    store.dispatch(clearIncidentDraft());
    SirMsalAuth.logout();
  }

  _getPageTitle(page) {
    return !page ? '' : `SIR - ${page}`;
  }

  canAddIncidents(profile) {
    if (!profile) {
      return false;
    }
    return this.hasPermission('add_incident');
  }

  canAddEvents(profile) {
    if (!profile) {
      return false;
    }
    return this.hasPermission('add_event');
  }

  canViewAdmin(profile) {
    if (!profile) {
      return false;
    }
    return this.hasPermission('view_admin');
  }

  canViewStaff(profile) {
    if (!profile) {
      return false;
    }
     return this.hasPermission('view_admin');
  }

  getNewCaseCount(allCases) {
    if (!this.profile || !this.profile.last_login) {
      return '';
    }

    let lastLogin = this.profile.last_login;
    let filteredCases = allCases.filter((incident) => {
      return moment(incident.created_on).isAfter(moment(lastLogin));
    });

    return filteredCases.length;
  }

  showPrefferedBrowserMessage() {
    if (!window.chrome) {
      store.dispatch(showBrowserWarning(
        'SIR will only work properly with the Chrome browser. Please download Chrome and try again.'
      ));
    }
  }

  setHeaderColor() {
    if (window.location.host != 'sir.unicef.org') {
      this.$.header.style.background = 'red';
      this.warningMessage = ' - SIR TESTING ENVIRONMENT';
    }
  }
}

window.customElements.define('app-shell', AppShell);
