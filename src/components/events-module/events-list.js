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
import '@polymer/iron-icons/notification-icons.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import 'etools-data-table/etools-data-table.js';
import 'etools-info-tooltip/etools-info-tooltip.js';

import { store } from '../../redux/store.js';
import PaginationMixin from '../common/pagination-mixin.js';
import { updatePath } from '../common/navigation-helper.js';

import { syncEvent } from '../../actions/events.js';
import { plainErrors } from '../../actions/errors.js';

import '../common/etools-dropdown/etools-dropdown-multi-lite.js';
import '../common/datepicker-lite.js';
import '../styles/shared-styles.js';
import '../styles/form-fields-styles.js';
import '../styles/grid-layout-styles.js';
import '../styles/filters-styles.js';

class EventsList extends connect(store)(PaginationMixin(PolymerElement)) {
  static get template() {
    // language=HTML
    return html`
      <style include="shared-styles form-fields-styles filters-styles data-table-styles grid-layout-styles">
        :host {
          display: block;
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

        .sync-btn {
          color: var(--primary-color);
          cursor: pointer;
        }

      </style>

      <div class="card filters">
        <div class="row-h row-flex">
          <paper-input class="filter search-input"
                       placeholder="Search by Description or Location"
                       value="{{filters.q}}">
            <iron-icon icon="search" slot="prefix"></iron-icon>
          </paper-input>

          <etools-dropdown-multi-lite class="filter sync-filter"
                                      label="Sync status"
                                      options="[[itemSyncStatusOptions]]"
                                      selected-values="{{filters.syncStatus}}"
                                      hide-search>
          </etools-dropdown-multi-lite>

          <div class="col col-3">
            <datepicker-lite id="fromDate"
                             value="{{filters.startDate}}"
                             label="From">
            </datepicker-lite>
          </div>

          <div class="col col-3">
            <datepicker-lite id="endDate"
                             value="{{filters.endDate}}"
                             label="To">
            </datepicker-lite>
          </div>

        </div>
      </div>

      <div class="card list">
        <etools-data-table-header id="listHeader" label="Events">
          <etools-data-table-column class="col-2">
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
                <span class="col-data col-2" data-col-header-label="Description">
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
                      <span slot="message">This event has not been sumitted to the server. Click the sync button when online to submit it. </span>
                    </etools-info-tooltip>
                  </template>
                </span>
              <span class="col-data col-2" data-col-header-label="Actions">
                  <a href="/events/view/[[item.id]]">
                    <iron-icon icon="assignment" title="View Event"></iron-icon>
                  </a>
                  <a href="/events/edit/[[item.id]]" title="Edit Event" hidden$="[[notEditable(item, offline)]]">
                    <iron-icon icon="editor:mode-edit"></iron-icon>
                  </a>
                  <template is="dom-if" if="[[_showSyncButton(item.unsynced, offline)]]">
                    <div> <!-- this div prevents resizing of the icon on low resolutions -->
                      <iron-icon icon="notification:sync" title="Sync Event" class="sync-btn" on-click="_syncItem"></iron-icon>
                    </div>
                  </template>
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
      offline: Boolean,
      filteredEvents: {
        type: Array,
        computed: '_filterData(events, filters.q, pagination.pageSize, pagination.pageNumber, ' +
        'filters.syncStatus.length, filters.startDate, filters.endDate)'
      },
      itemSyncStatusOptions: {
        type: Array,
        value: [
          {id: 'synced', name: 'Synced'},
          {id: 'unsynced', name: 'Not Synced'}
        ]
      },
      filters: {
        type: Object,
        value: {
          q: null,
          startDate: null,
          endDate: null,
          syncStatus: []
        }
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

  _filterData(events, q, pageSize, pageNumber, syncStatusLen, startDate, endDate) {

    if (!(events instanceof Array && events.length > 0)) {
      return [];
    }

    let filteredEvents = JSON.parse(JSON.stringify(events));

    filteredEvents = filteredEvents.filter(e => this._applyQFilter(e, q));
    filteredEvents = filteredEvents.filter(e => this._applyStatusFilter(e, this.filters.syncStatus));
    filteredEvents = filteredEvents.filter(e => this._applyDateFilter(e, startDate, endDate));

    return this.applyPagination(filteredEvents);
  }

  _applyQFilter(e, q) {
    if (!q || q === '') {
      return true;
    }
    return String(e.description).toLowerCase().search(q) > -1 || String(e.location).toLowerCase().search(q) > -1;
  }

  _applyStatusFilter(e, selectedSyncStatuses) {
    if (selectedSyncStatuses.length === 0 || selectedSyncStatuses.length === this.itemSyncStatusOptions.length) {
      return true;
    }
    const eStatus = e.unsynced ? 'unsynced' : 'synced';
    return selectedSyncStatuses.some(s => s === eStatus);
  }

  _applyDateFilter(e, startDate, endDate) {
    return (moment(e.start_date).isBetween(startDate, endDate, null, '[]')) ||
        (moment(e.end_date).isBetween(startDate, endDate, null, '[]'));

  }

  _showSyncButton(unsynced, offline) {
    return unsynced && !offline;
  }

  async _syncItem(event) {
    if (!event || !event.model || !event.model.__data || !event.model.__data.item) {
      return;
    }
    let element = event.model.__data.item;
    let successfull = await store.dispatch(syncEvent(element));

    if (successfull === false) {
      updatePath('/events/edit/' + element.id + '/')
      store.dispatch(plainErrors(['There was an error syncing your event. Please review the data and try again']));
    }
  }

  notEditable(event, offline) {
    return offline && !event.unsynced;
  }
}

window.customElements.define('events-list', EventsList);
