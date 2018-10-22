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
import '@polymer/iron-icons/notification-icons.js';
import '@polymer/iron-media-query/iron-media-query.js';
import '@polymer/iron-collapse/iron-collapse.js';
import {connect} from 'pwa-helpers/connect-mixin.js';

import 'etools-data-table/etools-data-table.js';
import 'etools-info-tooltip/etools-info-tooltip.js';

import {store} from '../../redux/store.js';
import PaginationMixin from '../common/pagination-mixin.js';
import DateMixin from '../common/date-mixin.js';

import {syncEventOnList} from '../../actions/events.js';
import ListCommonMixin from '../common/list-common-mixin.js';
import {updateAppState} from '../common/navigation-helper';

import '../common/etools-dropdown/etools-dropdown-multi-lite.js';
import 'etools-date-time/datepicker-lite.js';
import '../styles/shared-styles.js';
import '../styles/form-fields-styles.js';
import '../styles/grid-layout-styles.js';
import '../styles/filters-styles.js';


/**
 *
 * @polymer
 * @customElement
 * @appliesMixin PaginationMixin
 * @appliesMixin DateMixin
 * @appliesMixin ListCommonMixin
 *
 */
class EventsList extends connect(store)(DateMixin(PaginationMixin(ListCommonMixin(PolymerElement)))) {
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
          margin-right: 8px;
        }

        .sync-btn {
          color: var(--primary-color);
          cursor: pointer;
        }

        etools-data-table-row[low-resolution-layout] etools-info-tooltip {
          display: inherit;
        }

      </style>

      <iron-media-query query="(max-width: 767px)" query-matches="{{lowResolutionLayout}}"></iron-media-query>
      <iron-media-query query="(max-width: 1024px)" query-matches="{{showToggleFiltersBtn}}"></iron-media-query>

      <div class="card">
        <iron-collapse id="collapse" opened>
          <div class="filters">
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

            <div class="col filter">
              <datepicker-lite id="fromDate"
                              value="{{filters.startDate}}"
                              max-date="[[toDate(filters.endDate)]]"
                              label="From">
              </datepicker-lite>
            </div>

            <div class="col filter">
              <datepicker-lite id="endDate"
                              value="{{filters.endDate}}"
                              min-date="[[toDate(filters.startDate)]]"
                              label="To">
              </datepicker-lite>
            </div>
          </div>
        </iron-collapse>

        <div class="filters-button" on-tap="_toggleFilters" hidden$="[[!showToggleFiltersBtn]]">
          <iron-icon id=toggleIcon icon="icons:expand-more"></iron-icon>
          FILTERS
        </div>
      </div>

      <div class="card list">
        <etools-data-table-header id="listHeader" label="Events" low-resolution-layout="[[lowResolutionLayout]]">
          <etools-data-table-column class="col-1">
            Case number
          </etools-data-table-column>
          <etools-data-table-column class="col-4">
            Description
          </etools-data-table-column>
          <etools-data-table-column class="col-2">
            Start date
          </etools-data-table-column>
          <etools-data-table-column class="col-2">
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
          <etools-data-table-row unsynced$="[[item.unsynced]]" low-resolution-layout="[[lowResolutionLayout]]">
            <div slot="row-data" class="p-relative">
              <span class="col-data col-1" data-col-header-label="Case Number">
                <span class="truncate">
                  <a href="/events/view/[[item.id]]">[[item.case_number]]</a>
                </span>
              </span>
              <span class="col-data col-4" data-col-header-label="Description">
                <span class="truncate">
                  [[item.description]]
                </span>
              </span>
              <span class="col-data col-2" title="[[item.start_date]]" data-col-header-label="Start date">
                [[item.start_date]]
              </span>
              <span class="col-data col-2" title="[[item.location]]" data-col-header-label="Location">
                <span class="truncate">[[item.location]]</span>
              </span>
              <span class="col-data col-2" data-col-header-label="Status">
                <template is="dom-if" if="[[!item.unsynced]]">
                  Synced
                </template>
                <template is="dom-if" if="[[item.unsynced]]">
                  <etools-info-tooltip class="info" open-on-click>
                    <span slot="field">Not Synced</span>
                    <span slot="message">This event has not been submitted to the server. Click the sync button when
                                          online to submit it. </span>
                  </etools-info-tooltip>
                </template>
              </span>
              <span class="col-data col-1" data-col-header-label="Actions">
                <template is="dom-if" if="[[isApproved(item.status)]]">
                  <a href="/events/view/[[item.id]]">
                    <iron-icon icon="assignment" title="View Event"></iron-icon>
                  </a>
                </template>
                <template is="dom-if" if="[[!isApproved(item.status)]]">
                  <a href="/events/edit/[[item.id]]" title="Edit Event" hidden$="[[notEditable(item, offline)]]">
                    <iron-icon icon="editor:mode-edit"></iron-icon>
                  </a>
                </template>
                <template is="dom-if" if="[[_showSyncButton(item.unsynced, offline)]]">
                  <iron-icon icon="notification:sync" title="Sync Event" class="sync-btn"
                             on-click="_syncItem">
                  </iron-icon>
                </template>
              </span>
            </div>

            <div slot="row-data-details">
              <div class="row-details-content flex-c">
                <div class="row-h flex-c">
                  <div class="col col-6">
                    <strong class="rdc-title inline">Date Created: </strong>
                    <span>[[prettyDate(item.submitted_date)]]</span>
                  </div>
                  <div class="col col-6">
                    <strong class="rdc-title inline">Date Revised: </strong>
                    <span>[[prettyDate(item.last_modify_date)]]</span>
                  </div>
                </div>
                <div class="row-h flex-c">
                  <div class="col col-6">
                    <strong class="rdc-title inline">Long Description: </strong>
                    <span>[[item.description]]</span>
                  </div>
                  <div class="col col-6">
                    <strong class="rdc-title inline">Note: </strong>
                    <span>[[item.note]]</span>
                  </div>
                </div>
              </div>
            </div>
          </etools-data-table-row>
        </template>

        <etools-data-table-footer id="footer" page-size="{{pagination.pageSize}}"
                                  page-number="{{pagination.pageNumber}}"
                                  total-results="[[pagination.totalResults]]"
                                  visible-range="{{visibleRange}}"
                                  low-resolution-layout="[[lowResolutionLayout]]">
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
      visible: {
        type: Boolean,
        value: false,
        observer: '_visibilityChanged'
      },
      lowResolutionLayout: Boolean
    };
  }

  _stateChanged(state) {
    if (!state) {
      return;
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
    if (params && this.visible) {
      if (params.q && params.q !== this.filters.q) {
        this.set('filters.q', params.q);
      }
      if (params.start) {
        this.set('filters.startDate', params.start);
      }
      if (params.end) {
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

  _updateUrlQuery() {
    if (!this.visible) {
      return false;
    }
    this.set('_lastQueryString', this._buildQueryString());
    updateAppState('/events/list', this._lastQueryString, false);
  }

  _visibilityChanged(visible) {
    if (this._queryParamsInitComplete) {
      if (visible && this._lastQueryString !== '') {
        updateAppState('/events/list', this._lastQueryString, false);
      }
    }
  }

  _filterData(events, q, pageSize, pageNumber, syncStatusLen, startDate, endDate, queryParamsInit) {
    if (!queryParamsInit || !(events instanceof Array && events.length > 0)) {
      return [];
    }

    this._updateUrlQuery();

    let filteredEvents = JSON.parse(JSON.stringify(events));

    filteredEvents = filteredEvents.filter(e => this._applyQFilter(e, q));
    filteredEvents = filteredEvents.filter(e => this._applyStatusFilter(e, this.filters.syncStatus));
    filteredEvents = filteredEvents.filter(e => this._applyDateFilter(e, startDate, endDate));

    filteredEvents.sort((left, right) => {
      return moment.utc(right.last_modify_date).diff(moment.utc(left.last_modify_date));
    });

    return this.applyPagination(filteredEvents);
  }

  _applyQFilter(e, q) {
    if (!q || q === '') {
      return true;
    }
    q = q.toLowerCase();
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

  isApproved(status) {
    return status === 'approved';
  }

  _showSyncButton(unsynced, offline) {
    return unsynced && !offline;
  }

  _syncItem(event) {
    if (!event || !event.model || !event.model.__data || !event.model.__data.item) {
      return;
    }
    let element = event.model.__data.item;
    store.dispatch(syncEventOnList(element));
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
