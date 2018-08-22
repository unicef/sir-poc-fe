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
import '../common/navigation-helper.js';

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
      },
      _queryParams: Object
    };
  }

  _stateChanged(state) {
    if (!state) {
      return;
    }

    this.events = state.events.list;
    this.offline = state.app.offline;

    // console.log(state.app.locationInfo.queryParams);

    if (typeof state.app.locationInfo.queryParams !== 'undefined') {
      this._queryParams = state.app.locationInfo.queryParams;
    }

    if (this._queryParams){
      if (this._queryParams.q){
        this.filters.q = this._queryParams.q;
      }
      if (this._queryParams.synced){
        if (this._queryParams.synced.indexOf('|') > -1){
          // console.log("2");
          // console.log(this._queryParams.synced);
          this.filters.syncStatus = this._queryParams.synced.split('|');
          console.log(this.filters.syncStatus);
        } else {
          // console.log("1");
          // console.log(this._queryParams.synced);
          this.filters.syncStatus = [this._queryParams.synced];
          console.log(this.filters.syncStatus);
        }

        // console.log('sync param',this._queryParams.synced.split('|'));

      }
      if (this._queryParams.start){
        this.filters.startDate = this._queryParams.start;
      }
      if (this._queryParams.end){
        this.filters.endDate = this._queryParams.end;
      }
    } 

    // console.log(this._queryParams);
  }

  connectedCallback() {
    super.connectedCallback();
    // console.log('query params: ', this._queryParams);
  }

  _updateUrlQs() {
    const qs = this._buildQueryString();
    this.updateAppState('/events/list', qs, true);
    // this.updatePath('/events/list'+qs);
  }

  _filterData(events, q, pageSize, pageNumber, syncStatusLen, startDate, endDate) {

    console.log('filter data...');

    this._updateUrlQs();

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

  // Updates URL state with new query string, and launches query
  _updateUrlAndDislayedData(currentPageUrlPath, qs, filterData) {
    if (qs !== null) {
      // update URL
      this.updateAppState(currentPageUrlPath, qs, true);
      filterData();
    } else {
      if (location.search === '') {
        // only update URL query string, without location change event being fired(no page refresh)
        // used to keep prev list filters values when navigating from details to list page
        this.updateAppState(currentPageUrlPath, qs, false);
      }
        filterData();
    }
  }

  /**
   * Update app state
   */
  updateAppState(routePath, qs, dispatchLocationChange) {
    // Using replace state to change the URL here ensures the browser's
    // back button doesn't take you through every query
    let currentState = window.history.state;

    // console.log(currentState);

    window.history.replaceState(currentState, null,
        routePath + (qs.length ? '?' + qs : ''));

    if (dispatchLocationChange) {
      // This event lets app-location and app-route know
      // the URL has changed
      window.dispatchEvent(new CustomEvent('location-changed'));
    }
  }

}

window.customElements.define('events-list', EventsList);
