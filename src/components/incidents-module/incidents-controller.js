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
import { updatePath } from '../common/navigation-helper.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import '@polymer/paper-tabs/paper-tabs.js';
import { lazyLoadIncidentPages } from '../../actions/app.js';
import { store } from '../../redux/store.js';

import '@polymer/paper-button/paper-button.js';
import '@polymer/app-route/app-route.js';
import '../common/etools-tabs.js';
import '../styles/shared-styles.js';

class IncidentsController extends connect(store)(BaseController) {
  static get template() {
    return html`
      <style include="shared-styles">
        :host {
        }
        .tabs-container {
          background-color: white;
          border-left: 1px solid #eeeeee;
          border-bottom: 1px solid #eeeeee;
          --paper-tabs: {
            font-size: 14px;
          }
          position: -webkit-sticky; /* Safari */
          position: sticky;
          top: -1px;
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
        pattern="/incidents/:section/:id"
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
        <incidents-list name="list"></incidents-list>
        <add-incident name="new"></add-incident>
        <edit-incident name="edit"></edit-incident>

        <view-incident name="view"></view-incident>
        <incident-review name="review"></incident-review>
        <impact-controller name="impact" route="{{subRoute}}"></impact-controller>
        <incident-history-controller name="history" route="{{route}}"></incident-history-controller>
      </iron-pages>
    `;
  }

  static get properties() {
    return {
      page: String,
      route: Object,
      routeData: Object,
      isOffline: Boolean,
      viewPageTabs: {
        type: Array,
        computed: 'getTabs(isOffline, showEditTab, incidentId)'
      },
      showEditTab: {
        type: Boolean,
        value: false
      },
      incidentId: {
        type: String
      }
    };
  }

  tabClicked(e) {
    if (this.page === 'history') {
      this.navigateToHistoryList();
    }
    if (this.page === 'impact') {
      this.navigateToImpactDetail();
    }
  }

  navigateToHistoryList() {
    updatePath(`incidents/history/${this.incidentId}/list`);
  }

  navigateToImpactDetail() {
    updatePath(`incidents/impact/${this.incidentId}/list`);
  }

  _stateChanged(state) {
    if (state && state.app) {
      this.incidentId = state.app.locationInfo.incidentId;
      this.isOffline = state.app.offline;
    }
  }

  pageChanged(page) {
    if (page === 'history' && this.isOffline) {
      updatePath('/');
    }
    if (page === 'edit') {
      this.showEditTab = true;
    }
    if (page === 'view') {
      this.showEditTab = false;
    }
    store.dispatch(lazyLoadIncidentPages(page));
  }

  getTabs(offline, showEditTab, incidentId) {
    let hideHistory = this._unsyncedAndCreatedOffline(incidentId);
    let hideReview = this.hideReviewTab();
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
        name: 'impact',
        tabLabel: 'IMPACT'
      },
      {
        name: 'review',
        tabLabel: 'REVIEW',
        hidden: hideReview
      },
      {
        name: 'history',
        tabLabel: 'HISTORY',
        hidden: hideHistory
      }
    ];
  }

  _unsyncedAndCreatedOffline(id) {
    return id && isNaN(id);
  }

  _showTabs(page) {
    return !!this.viewPageTabs.find(pt => pt.name === page);
  }

  hideReviewTab() {
    if (this.showEditTab) {
      return true;
    }
    if (this.isOffline) {
      return true;
    }
    if (this._unsyncedAndCreatedOffline(this.incidentId)) {
      return true;
    }
    return false;
  }

}

window.customElements.define('incidents-controller', IncidentsController);
