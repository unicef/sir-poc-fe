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
import { store } from '../../redux/store.js';
import { lazyLoadEventPages } from '../../actions/app.js';
import '../styles/shared-styles.js';

class EventsController extends connect(store)(BaseController) {
  static get template() {
    return html`
      <style include="shared-styles">
        :host {
        }
      </style>

      <app-route
        route="{{route}}"
        pattern="/events/:section/:id"
        data="{{routeData}}">
      </app-route>

      <iron-pages selected="[[page]]" attr-for-selected="name" role="main" selected-attribute="visible">
        <events-list name="list"></events-list>
         <add-event name="new"></add-event>
        <view-event name="view"></view-event>
        <edit-event name="edit"></edit-event>
      </iron-pages>
    `;
  }

  static get properties() {
    return {
      page: String,
      route: Object,
      routeData: Object
    };
  }

  _stateChanged(state) {
  }

  pageChanged(page) {
    store.dispatch(lazyLoadEventPages(page));
  }
}

window.customElements.define('events-controller', EventsController);
