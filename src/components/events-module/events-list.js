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
import ListCommonMixin from '../common/list-common-mixin.js';

import '../common/etools-dropdown/etools-dropdown-multi-lite.js';
import '../common/datepicker-lite.js';
import '../styles/shared-styles.js';
import '../styles/grid-layout-styles.js';
import '../styles/filters-styles.js';

/**
 *
 * @polymer
 * @customElement
 * @appliesMixin PaginationMixin
 * @appliesMixin ListCommonMixin
 *
 */
class EventsList extends connect(store)(PaginationMixin(ListCommonMixin(PolymerElement))) {
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

        <template id="rows" is="dom-repeat" items="[[filteredEvents]]" as="event">
          <etools-data-table-row unsynced$="[[event.unsynced]]">
            <div slot="row-data">
                <span class="col-data col-3" data-col-header-label="Description">
                  <span class="truncate">
                    <a href="/events/view/[[event.id]]"> [[event.description]] </a>
                  </span>
                </span>
              <span class="col-data col-3" title="[[event.start_date]]" data-col-header-label="Start date">
                    [[event.start_date]]
                </span>
              <span class="col-data col-3" title="[[event.location]]" data-col-header-label="Location">
                  <span class="truncate">[[event.location]]</span>
                </span>
              <span class="col-data col-2" data-col-header-label="Status">
                  <template is="dom-if" if="[[!event.unsynced]]">
                    Synced
                  </template>
                  <template is="dom-if" if="[[event.unsynced]]">
                    <etools-info-tooltip class="info" open-on-click>
                      <span slot="field">Not Synced</span>
                      <span slot="message">This event has not been sumitted to the server. Go to its edit page
                        and save it when an internet connection is availale.</span>
                    </etools-info-tooltip>
                  </template>
                </span>
              <span class="col-data col-1" data-col-header-label="Actions">
                  <a href="/events/view/[[event.id]]">
                    <iron-icon icon="assignment"></iron-icon>
                  </a>
                  <a href="/events/edit/[[event.id]]" hidden$="[[notEditable(event, offline)]]">
                    <iron-icon icon="editor:mode-edit"></iron-icon>
                  </a>
                </span>
            </div>
            <div slot="row-data-details">
              <div class="col-6">
                <strong>Description: </strong>
                <span>[[event.description]]</span>
              </div>
              <div class="col-6">
                <strong>Note: </strong>
                <span>[[event.note]]</span>
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
        'filters.syncStatus.length, filters.startDate, filters.endDate, _queryParamsInitComplete)'
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
      },
      _queryParams: {
        type: Object,
        observer: '_queryParamsChanged'
      },
      _queryParamsInitComplete: Boolean,
      _lastQueryString: {
        type: String,
        value: ''
      },
      _isActiveModule: {
        type: Boolean,
        value: false,
        observer: '_isActiveModuleChanged'
      },
      _moduleNavigatedFrom: {
        type: String,
        value: ''
      }
    };
  }

  _stateChanged(state) {
    if (!state) {
      return;
    }

    this.set('_moduleNavigatedFrom', state.app.locationInfo.selectedModule);

    if (typeof state.app.locationInfo.selectedModule !== 'undefined') {
      console.log("state app location ", state.app.locationInfo.selectedModule);
      this.set('_isActiveModule', state.app.locationInfo.selectedModule === 'events');
    }
    if (typeof state.app.locationInfo.queryParams !== 'undefined') {
      this._queryParams = state.app.locationInfo.queryParams;
    }

    this.events = state.events.list;
    this.offline = state.app.offline;

    if (typeof state.app.locationInfo.queryParams !== 'undefined') {
      this._queryParams = state.app.locationInfo.queryParams;
    }

  }

  _queryParamsChanged(params) {
    
    if (params && this._moduleNavigatedFrom === 'events') {

      if (params.q && params.q !== this.filters.q) {
        this.set('filters.q', params.q);
      }

      if (params.start){
        this.set('filters.startDate', params.start);
      }
      if (params.end){
        this.set('filters.endDate', params.end);
      }
      if (params.synced) {

        if (params.synced.indexOf('|') > -1) {
          this.set('filters.syncStatus', params.synced.split('|'));
        } else {
          this.set('filters.syncStatus', [params.synced]);
        }
      }

      this.set('_queryParamsInitComplete', true);
    }
  }

  connectedCallback() {
    super.connectedCallback();
    console.log('query params: ', this._queryParams);
  }

  _updateUrlQs() {

    this.set('_lastQueryString', this._buildQueryString());
    this.updateAppState('/events/list', this._lastQueryString, false);
  }

  _isActiveModuleChanged(newVal, oldVal) {
    console.log(newVal, oldVal);
    if (this._queryParamsInitComplete) {
      if (newVal && newVal !== oldVal && this._lastQueryString !== '') {
        this.updateAppState('/events/list', this._lastQueryString, false);
      }
    }
  }

  _filterData(events, q, pageSize, pageNumber, syncStatusLen, startDate, endDate, queryParamsInit) {

    if (!queryParamsInit || !(events instanceof Array && events.length > 0)) {
      return [];
    }

    this._updateUrlQs();

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

  notEditable(event, offline) {
    return offline && !event.unsynced;
  }

  // Outputs the query string for the list
  _buildQueryString() {
    return this._buildUrlQueryString({
      q: this.filters.q,
      synced: this.filters.syncStatus,
      start: this.filters.startDate,
      end: this.filters.endDate
    });
  }

}

window.customElements.define('events-list', EventsList);
