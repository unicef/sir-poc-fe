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
import { BaseController } from '../common/base-controller.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/app-route/app-route.js';
import '../common/etools-tabs.js';
import { store } from '../../redux/store.js';
import { lazyLoadEventPages } from '../../actions/app.js';
import '../styles/shared-styles.js';

class EventsController extends connect(store)(BaseController) {
  static get template() {
    return html`
      <style include="shared-styles">
        :host {
        }
        .tabs-container {
          background-color: white;
          border-left: 1px solid #eeeeee;
          --paper-tabs: {
            font-size: 14px;
            max-width: 350px;
          }
        }

        paper-tabs {
          --paper-tabs-selection-bar-color: var(--app-primary-color);
        }

        paper-tab[link],
        paper-tab {
          --paper-tab-ink: var(--app-primary-color);
          padding: 0 24px;
        }

        paper-tab.iron-selected {
          color: var(--app-primary-color);
        }
      </style>

      <app-route
        route="{{route}}"
        pattern="/events/:section/:id"
        tail="{{subRoute}}"
        data="{{routeData}}">
      </app-route>
      <app-route
        route="{{subRoute}}"
        pattern="/:subsection"
        data="{{subrouteData}}">
      </app-route>

      <template is="dom-if" if="[[_showTabs(page)]]">
        <div class="tabs-container">
          <etools-tabs tabs="[[viewPageTabs]]"
                       selected="{{routeData.section}}"
                       on-click="tabClicked">
          </etools-tabs>
        </div>
      </template>

      <iron-pages selected="[[page]]" attr-for-selected="name" role="main" selected-attribute="visible">
        <events-list name="list"></events-list>
        <add-event name="new"></add-event>
        <view-event name="view"></view-event>
        <edit-event name="edit"></edit-event>
        <event-history-controller name="history" route="{{route}}"></event-history-controller>
      </iron-pages>
    `;
  }

  static get properties() {
    return {
      page: String,
      route: Object,
      eventId: Number,
      routeData: Object,
      isOffline: Boolean,
      viewPageTabs: {
        type: Array,
        computed: 'getTabs(isOffline, showEditTab, eventId)'
      },
      showEditTab: {
        type: Boolean,
        value: false
      }
    };
  }

  _stateChanged(state) {
    if (state && state.app) {
      this.isOffline = state.app.offline;
      this.eventId = state.app.locationInfo.eventId;
    }
  }

  getTabs(offline, showEditTab, eventId) {
    let hideHistory = this._unsyncedAndCreatedOffline(eventId);
    hideHistory = hideHistory || offline;

    return [
      {
        name: 'view',
        tabLabel: 'VIEW',
        hidden: showEditTab
      },
      {
        name: 'edit',
        tabLabel: 'EDIT',
        hidden: !showEditTab
      },
      {
        name: 'history',
        tabLabel: 'HISTORY',
        hidden: hideHistory
      }
    ];
  }


  tabClicked(e) {
    if (this.page === 'history') {
      this.navigateToHistoryList();
    }
  }

  navigateToHistoryList() {
    // triggers history-controller to change to the list view
    this.set('subrouteData.subsection', null);
  }

  pageChanged(page) {
    if (page === 'edit') {
      this.showEditTab = true;
    }
    if (page === 'view') {
      this.showEditTab = false;
    }
    store.dispatch(lazyLoadEventPages(page));
  }

  _unsyncedAndCreatedOffline(id) {
    return id && isNaN(id);
  }

  _showTabs(page) {
    return !!this.viewPageTabs.find(pt => pt.name === page);
  }
}

window.customElements.define('events-controller', EventsController);
