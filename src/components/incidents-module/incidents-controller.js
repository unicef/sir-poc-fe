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
import {EtoolsAjaxLite} from '../common/etools-ajax-lite';
import { loadIncidents } from '../../actions/incidents.js';
import { store } from '../store.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/app-route/app-route.js';
import '../styles/shared-styles.js';
import {ENDPOINTS_URL} from "../../config/endpoints";
import {addEvent} from "../../actions/events";

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
      routeData: Object
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
    EtoolsAjaxLite.request({
      url: ENDPOINTS_URL.INCIDENTS,
      method: 'GET'
    }).then((result) => {
      store.dispatch(loadIncidents(result));
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
        import('./incidents-list.js');
        break;
    }
  }

}

window.customElements.define('incidents-controller', IncidentsController);
