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
import { lazyLoadReportingPages } from '../../actions/app.js';
import { store } from '../../redux/store.js';

import '@polymer/paper-button/paper-button.js';
import '@polymer/app-route/app-route.js';
import '../common/etools-tabs.js';
import '../styles/shared-styles.js';

class ReportingController extends connect(store)(BaseController) {
  static get template() {
    return html`
      <style include="shared-styles">
        :host {
        }
        
      </style>

      <app-route
        route="{{route}}"
        pattern="/reporting/list/"
        tail="{{subRoute}}"
        data="{{routeData}}">
      </app-route>
    
      <iron-pages selected="[[page]]" attr-for-selected="name" role="main" selected-attribute="visible">
        <reporting-list name="list" route="{{route}}"></reporting-list>
      </iron-pages>
    `;
  }

  static get properties() {
    return {
      page: String,
      route: Object,
      routeData: Object,
      isOffline: Boolean,
      visible: {
        type: Boolean,
        observer: 'visibilityChanged'
      }
    };
  }

  _stateChanged(state) {
    if (state && state.app) {
      this.isOffline = state.app.offline;
    }
  }

  visibilityChanged(visible) {
    if (!visible) {
      this.page = '';
    }
  }

  pageChanged(page) {
    if (page === '') {
      return;
    }
    if (page === 'history' && this.isOffline) {
      updatePath('/');
    }
    store.dispatch(lazyLoadReportingPages(page));
  }

  _unsyncedAndCreatedOffline(id) {
    return id && isNaN(id);
  }


}

window.customElements.define('reporting-controller', ReportingController);
