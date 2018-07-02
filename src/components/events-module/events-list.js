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
import { connect } from 'pwa-helpers/connect-mixin.js';
import { store } from '../store.js';

import 'etools-data-table/etools-data-table.js';
import '../styles/shared-styles.js';

class EventsList extends connect(store)(PolymerElement) {
  static get template() {
    // language=HTML
    return html`
      <style include="shared-styles data-table-styles">
        :host {
          display: block;
          padding: 10px;
        }

        a {
          text-decoration: none;
        }

        .col-4 {
          flex: 0 0 33.333333%;
          max-width: 33.333333%;
        }

        .col-6 {
          flex: 0 0 50%;
          max-width: 50%;
        }

      </style>

      <div class="card filters">
        <paper-input class="search-input"
                     no-label-float placeholder="Search by Description or Location"
                     value="{{q}}">
          <iron-icon icon="search" slot="prefix"></iron-icon>
        </paper-input>
      </div>

      <div class="card list">
        <etools-data-table-header id="listHeader" label="Events">
          <etools-data-table-column class="col-4">
            Description
          </etools-data-table-column>
          <etools-data-table-column class="col-4">
            Start date
          </etools-data-table-column>
          <etools-data-table-column class="col-4">
            Location
          </etools-data-table-column>
        </etools-data-table-header>

        <template id="rows" is="dom-repeat" items="[[filteredEvents]]">
          <etools-data-table-row>
            <div slot="row-data">
                <span class="col-data col-4">
                  <a href="/events/view/[[item.id]]"> [[item.description]] </a>
                </span>
                <span class="col-data col-4" title="[[item.start_date]]">
                    [[item.start_date]]
                </span>
                <span class="col-data col-4" title="[[item.location]]">
                    [[item.location]]
                </span>
            </div>
            <div slot="row-data-details">
              <div class="col-6">
                <strong>Description: </strong>
                <span>[[item.description]]</span>
              </div>
              <div class="col-6">
                <strong>Note: </strong>
                <span>[[item.note]]</span>
              </div>

            </div>
          </etools-data-table-row>
        </template>

        <etools-data-table-footer id="footer" page-size="[[pageSize]]" page-number="[[pageNumber]]"
                                  total-results="[[events.length]]" visible-range="{{visibleRange}}">
        </etools-data-table-footer>
      </div>
    `;
  }

  static get properties() {
    return {
      events: {
        type: Object,
        value: []
      },
      q: String,
      filteredEvents: {
        type: Array,
        computed: '_filterData(events, q)'
      }
    };
  }

  _stateChanged(state) {
    if (!state) {
      return;
    }
    this.events = state.events.events;
  }

  _filterData(events, q) {
    let filteredEvents = events ? JSON.parse(JSON.stringify(events)) : [];
    if (events instanceof Array && events.length > 0 && typeof q === 'string' && q !== '') {
      filteredEvents = filteredEvents.filter(e => this._applyQFilter(e, q));
    }
    return filteredEvents;
  }

  _applyQFilter(e, q) {
    return String(e.description).toLowerCase().search(q) > -1 || String(e.location).toLowerCase().search(q) > -1;
  }
}

window.customElements.define('events-list', EventsList);
