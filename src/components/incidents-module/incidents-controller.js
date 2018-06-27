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
import { makeRequest } from '../common/request-helper.js';
import { loadIncidents } from '../../actions/incidents.js';
import { store } from '../store.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/app-route/app-route.js';
import '../styles/shared-styles.js';

class IncidentsController extends connect(store)(PolymerElement) {
  static get template() {
    return html`
      <style include="shared-styles">
        :host {
        }
      </style>

      <app-route
        route="{{route}}"
        pattern="/:section/:id"
        data="{{routeData}}"
        tail="{{subroute}}">
      </app-route>

      <iron-pages selected="[[page]]" attr-for-selected="name" role="main">
        <incidents-list name="list"></incidents-list>
        <add-incident name="new"></add-incident>
        <view-incident name="view" incident-id="[[routeData.id]]"></view-incident>
      </iron-pages>
    `;
  }

  static get properties() {
    return {
      page: String,
      route: Object,
      subroute: Object,
      routeData: Object,
      incidentsListEndpointName: {
        type: String,
        value: 'incidentsList'
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
    makeRequest(this.incidentsListEndpointName).then((result) => {
      store.dispatch(loadIncidents(JSON.parse(result)));
    });
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
    switch(page) {
      case 'list':
        import('./incidents-list.js');
        break;
      case 'new':
        import('./add-incident.js');
        break;
      case 'view':
        import('./view-incident.js');
        break;
      default:
        updatePath('/404/');
        break;
    }
  }

}

window.customElements.define('incidents-controller', IncidentsController);
