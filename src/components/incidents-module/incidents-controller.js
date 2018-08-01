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

import { updatePath } from '../common/navigation-helper.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import '@polymer/paper-tabs/paper-tabs.js';
import { fetchIncidents, fetchIncidentComments } from '../../actions/incidents.js';
import { lazyLoadIncidentPages } from '../../actions/app.js';
import { store } from '../../redux/store.js';

import '@polymer/paper-button/paper-button.js';
import '@polymer/app-route/app-route.js';
import '../common/etools-tabs.js';
import '../styles/shared-styles.js';

class IncidentsController extends connect(store)(PolymerElement) {
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
        pattern="/incidents/:section/:id"
        data="{{routeData}}"
        tail="{{subroute}}">
      </app-route>

      <template is="dom-if" if="[[_showTabs(page)]]">
        <div class="tabs-container">
          <etools-tabs tabs="[[viewPageTabs]]" selected="{{routeData.section}}">
          </etools-tabs>
        </div>
      </template>

      <iron-pages selected="[[page]]" attr-for-selected="name" role="main">
        <incidents-list name="list"></incidents-list>
        <template is="dom-if" if="[[pageIs(page, 'new')]]" restamp>
          <add-incident name="new"></add-incident>
        </template>
        <edit-incident name="edit"></edit-incident>

        <view-incident name="view"></view-incident>
        <incident-comments name="comments"></incident-comments>

      </iron-pages>
    `;
  }

  static get properties() {
    return {
      page: String,
      route: Object,
      subroute: Object,
      routeData: Object,
      viewPageTabs: {
        type: Array,
        value: [
          {
            name: 'view',
            tabLabel: 'VIEW'
          },
          {
            name: 'comments',
            tabLabel: 'COMMENTS'
          }
        ]
      }
    };
  }

  static get observers() {
    return [
      'routeChanged(routeData.section)',
      'pageChanged(page)'
    ];
  }

  connectedCallback() {
    super.connectedCallback();
    store.dispatch(fetchIncidents());
    store.dispatch(fetchIncidentComments());
  }

  _stateChanged(state) {
  }

  routeChanged(section) {
    this.set('page', section ? section : 'list');
  }

  pageIs(actualPage, expectedPage) {
    return actualPage === expectedPage;
  }

  pageChanged(page) {
    store.dispatch(lazyLoadIncidentPages(page));
  }
  _showTabs(page) {
    return page === 'view' || page === 'comments';
  }

}

window.customElements.define('incidents-controller', IncidentsController);
