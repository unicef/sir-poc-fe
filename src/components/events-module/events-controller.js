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
import '@polymer/paper-button/paper-button.js';
import '@polymer/app-route/app-route.js';
import '../styles/shared-styles.js';

class EventsController extends PolymerElement {
  static get template() {
    return html`
      <style include="shared-styles">
        :host {
        }
      </style>

      <div class="card">
        <paper-button on-click="naviateToList" hidden="[[pageIs(page, 'list')]]">to list</paper-button>
        <paper-button on-click="naviateToNew" hidden="[[pageIs(page, 'new')]]">to new</paper-button>
      </div>

      <app-route
        route="{{route}}"
        pattern="/:section"
        data="{{routeData}}"
        tail="{{subroute}}">
      </app-route>

      <iron-pages selected="[[page]]" attr-for-selected="name" role="main">
        <events-list name="list"></events-list>
        <add-event name="new"></add-event>
        <!-- <view-event name="view" route="{{subroute}}"></view-event> -->
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

  routeChanged(section) {
    console.log('section', section);
    this.set('page', section ? section : 'list');
  }

  pageIs(actualPage, expectedPage) {
    return actualPage === expectedPage;
  }
  naviateToList() {
    this.set('routeData.section', 'list');
  }
  naviateToNew() {
    this.set('routeData.section', 'new');
  }

  pageChanged(page) {
    switch(page) {
      case 'list':
        import('./events-list.js');
        break;
      case 'new':
        import('./add-event.js');
        break;
      // case 'view':
      //   import('view-event.js');
      //   break;
      default:
        import('./events-list.js');
        break;
    }
  }

}

window.customElements.define('events-controller', EventsController);
