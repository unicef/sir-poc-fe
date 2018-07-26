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
import '@polymer/paper-input/paper-input.js';
import '@polymer/iron-icons/editor-icons.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { store } from '../../redux/store.js';
import PaginationMixin from '../common/pagination-mixin.js'

import 'etools-data-table/etools-data-table.js';
import '../styles/shared-styles.js';
import '../styles/grid-layout-styles.js';

class EventsList extends connect(store)(PaginationMixin(PolymerElement)) {
  static get template() {
    // language=HTML
    return html`
      <style include="shared-styles data-table-styles grid-layout-styles">
        :host {
          display: block;
          padding: 10px;
        }

        etools-data-table-row[unsynced] {
          --list-bg-color: pink;
        }

        .col-data > span {
          max-width: 100%;
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
          <etools-data-table-column class="col-3">
            Description
          </etools-data-table-column>
          <etools-data-table-column class="col-3">
            Start date
          </etools-data-table-column>
          <etools-data-table-column class="col-3">
            Location
          </etools-data-table-column>
          <etools-data-table-column class="col-2">
            Status
          </etools-data-table-column>
          <etools-data-table-column class="col-1">
            Actions
          </etools-data-table-column>
        </etools-data-table-header>

        <template id="rows" is="dom-repeat" items="[[filteredEvents]]">
          <etools-data-table-row unsynced$="[[item.unsynced]]">
            <div slot="row-data">
                <span class="col-data col-3">
                  <span class="truncate">
                    <a href="/events/view/[[item.id]]"> [[item.description]] </a>
                  </span>
                </span>
                <span class="col-data col-3" title="[[item.start_date]]">
                    [[item.start_date]]
                </span>
                <span class="col-data col-3" title="[[item.location]]">
                  <span class="truncate">[[item.location]]</span>
                </span>
                <span class="col-data col-2">
                  <span class="truncate">[[getStatus(item)]]</span>
                </span>
                <span class="col-data col-1">
                  <a href="/events/view/[[item.id]]"> <iron-icon icon="assignment"></iron-icon> </a>
                  <a href="/events/edit/[[item.id]]" hidden$="[[notEditable(item, offline)]]"> <iron-icon icon="editor:mode-edit"></iron-icon> </a>
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

        <etools-data-table-footer id="footer" page-size="{{pagination.pageSize}}"
                                  page-number="{{pagination.pageNumber}}"
                                  total-results="[[pagination.totalResults]]"
                                  visible-range="{{visibleRange}}">
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
      offline: Boolean,
      filteredEvents: {
        type: Array,
        computed: '_filterData(events, q, pagination.pageSize, pagination.pageNumber)'
      }
    };
  }

  _stateChanged(state) {
    if (!state) {
      return;
    }
    this.events = state.events.list;
    this.offline = state.app.offline;
  }

  _filterData(events, q) {
    let filteredEvents = events ? JSON.parse(JSON.stringify(events)) : [];
    if (events instanceof Array && events.length > 0 && typeof q === 'string' && q !== '') {
      filteredEvents = filteredEvents.filter(e => this._applyQFilter(e, q));
    }
    return this.applyPagination(filteredEvents);
  }

  _applyQFilter(e, q) {
    return String(e.description).toLowerCase().search(q) > -1 || String(e.location).toLowerCase().search(q) > -1;
  }

  notEditable(event, offline) {
    return offline && !event.unsynced;
  }

  getStatus(event) {
    return event.unsynced? 'Not Synced': 'Synced';
  }
}

window.customElements.define('events-list', EventsList);
