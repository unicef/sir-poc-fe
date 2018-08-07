/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/iron-icons/editor-icons.js';
import {connect} from 'pwa-helpers/connect-mixin.js';
import 'etools-data-table/etools-data-table.js';
import 'etools-info-tooltip/etools-info-tooltip.js';

import {store} from '../../redux/store.js';
import PaginationMixin from '../common/pagination-mixin.js';

import '../common/etools-dropdown/etools-dropdown-multi-lite.js';
import '../styles/shared-styles.js';
import '../styles/grid-layout-styles.js';
import '../styles/filters-styles.js';

class EventsList extends connect(store)(PaginationMixin(PolymerElement)) {
  static get template() {
    // language=HTML
    return html`
      <style include="shared-styles filters-styles data-table-styles grid-layout-styles">
        :host {
          display: block;
        }

        etools-data-table-row[unsynced] {
          --list-bg-color: var(--unsynced-item-bg-color);
        }

        .col-data > span {
          max-width: 100%;
        }

        .col-data iron-icon {
          margin-right: 16px;
        }

        @media screen and (max-width: 767px) {
          /* mobile specific css, under tablet min 768px */
        }

      </style>

      <div class="card filters">
        <div class="row-h row-flex">
          <paper-input class="filter search-input"
                       placeholder="Search by Description or Location"
                       value="{{q}}">
            <iron-icon icon="search" slot="prefix"></iron-icon>
          </paper-input>

          <etools-dropdown-multi-lite class="filter sync-filter"
                                      label="Sync status"
                                      options="[[itemSyncStatusOptions]]"
                                      selected-values="{{selectedSyncStatuses}}"
                                      hide-search>
          </etools-dropdown-multi-lite>
        </div>
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
                <span class="col-data col-3" data-col-header-label="Description">
                  <span class="truncate">
                    <a href="/events/view/[[item.id]]"> [[item.description]] </a>
                  </span>
                </span>
              <span class="col-data col-3" title="[[item.start_date]]" data-col-header-label="Start date">
                    [[item.start_date]]
                </span>
              <span class="col-data col-3" title="[[item.location]]" data-col-header-label="Location">
                  <span class="truncate">[[item.location]]</span>
                </span>
              <span class="col-data col-2" data-col-header-label="Status">
                  <template is="dom-if" if="[[!item.unsynced]]">
                    Synced
                  </template>
                  <template is="dom-if" if="[[item.unsynced]]">
                    <etools-info-tooltip class="info" open-on-click>
                      <span slot="field">Not Synced</span>
                      <span slot="message">This event has not been sumitted to the server. Go to its edit page
                        and save it when an internet connection is availale.</span>
                    </etools-info-tooltip>
                  </template>
                </span>
              <span class="col-data col-1" data-col-header-label="Actions">
                  <a href="/events/view/[[item.id]]">
                    <iron-icon icon="assignment"></iron-icon>
                  </a>
                  <a href="/events/edit/[[item.id]]" hidden$="[[notEditable(item, offline)]]">
                    <iron-icon icon="editor:mode-edit"></iron-icon>
                  </a>
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
        computed: '_filterData(events, q, pagination.pageSize, pagination.pageNumber, selectedSyncStatuses.length)'
      },
      itemSyncStatusOptions: {
        type: Array,
        value: [
          {id: 'synced', name: 'Synced'},
          {id: 'unsynced', name: 'Not Synced'}
        ]
      },
      selectedSyncStatuses: {
        type: Array
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
    if (events instanceof Array && events.length > 0 && typeof q === 'string') {
      filteredEvents = filteredEvents.filter(e => this._applyQFilter(e, q) &&
          this._applyStatusFilter(e, this.selectedSyncStatuses));
    }
    return this.applyPagination(filteredEvents);
  }

  _applyQFilter(e, q) {
    return String(e.description).toLowerCase().search(q) > -1 || String(e.location).toLowerCase().search(q) > -1;
  }

  _applyStatusFilter(e, selectedSyncStatuses) {
    if (selectedSyncStatuses.length === 0 || selectedSyncStatuses.length === this.itemSyncStatusOptions.length) {
      return true;
    }
    const eStatus = e.unsynced ? 'unsynced' : 'synced';
    return selectedSyncStatuses.some(s => s === eStatus);
  }

  notEditable(event, offline) {
    return offline && !event.unsynced;
  }
}

window.customElements.define('events-list', EventsList);
