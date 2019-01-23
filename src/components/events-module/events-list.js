/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
import { ListBaseClass } from '../common/list-base-class.js';
import { html } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/iron-icons/editor-icons.js';
import '@polymer/iron-icons/notification-icons.js';
import '@polymer/iron-media-query/iron-media-query.js';
import '@polymer/iron-collapse/iron-collapse.js';
import { connect } from 'pwa-helpers/connect-mixin.js';

import 'etools-data-table/etools-data-table.js';
import 'etools-info-tooltip/etools-info-tooltip.js';

import { store } from '../../redux/store.js';

import { syncEventOnList } from '../../actions/events.js';

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
 *
 */
class EventsList extends connect(store)(ListBaseClass) {
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
                        value="{{filters.values.q}}">
              <iron-icon icon="search" slot="prefix"></iron-icon>
            </paper-input>

            <etools-dropdown-multi-lite class="filter sync-filter"
                                        label="Sync status"
                                        options="[[itemSyncStatusOptions]]"
                                        selected-values="{{filters.values.syncStatus}}"
                                        hide-search>
            </etools-dropdown-multi-lite>

            <div class="col filter">
              <datepicker-lite id="fromDate"
                              value="{{filters.values.startDate}}"
                              max-date="[[toDate(filters.values.endDate)]]"
                              label="From">
              </datepicker-lite>
            </div>

            <div class="col filter">
              <datepicker-lite id="endDate"
                              value="{{filters.values.endDate}}"
                              min-date="[[toDate(filters.values.startDate)]]"
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

        <template id="rows" is="dom-repeat" items="[[filteredItems]]">
          <etools-data-table-row unsynced$="[[item.unsynced]]" low-resolution-layout="[[lowResolutionLayout]]">
            <div slot="row-data" class="p-relative">
              <span class="col-data col-1" data-col-header-label="Case Number">
                <span class="truncate" hidden$="[[!hasPermission('view_event')]]">
                  <a href="/events/view/[[item.id]]">[[item.case_number]]</a>
                </span>
                <span class="truncate" hidden$="[[hasPermission('view_event')]]">
                  [[item.case_number]]
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
                  <a href="/events/view/[[item.id]]" hidden$="[[!hasPermission('view_event)]]">
                    <iron-icon icon="assignment" title="View Event"></iron-icon>
                  </a>
                </template>
                <template is="dom-if" if="[[!isApproved(item.status)]]">
                  <a href="/events/edit/[[item.id]]" title="Edit Event" hidden$="[[notEditable(item, offline)]]">
                    <iron-icon icon="editor:mode-edit"></iron-icon>
                  </a>
                </template>
                <template is="dom-if" if="[[_showSyncButton(item.unsynced, offline)]]">
                  <iron-icon icon="notification:sync"
                             title="Sync Event"
                             class="sync-btn"
                             hidden$="[[!hasPermission('add_event')]]"
                             on-click="_syncItem">
                  </iron-icon>
                </template>
              </span>
            </div>

            <div slot="row-data-details">
              <div class="row-details-content flex-c">
                <div class="row-h flex-c">
                  <div class="col col-6">
                    <strong class="rdc-title inline">Created by: </strong>
                    <span>[[getUserName(item.created_by_user_id)]]</span>
                  </div>
                  <div class="col col-6">
                    <strong class="rdc-title inline">Created on: </strong>
                    <span>[[prettyDate(item.created_on, 'D-MMM-YYYY hh:mm A')]]</span>
                  </div>
                </div>
                <div class="row-h flex-c">
                  <div class="col col-12">
                    <strong class="rdc-title inline">Description: </strong>
                    <span>[[item.description]]</span>
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
      lowResolutionLayout: Boolean,
      offline: Boolean,
      itemSyncStatusOptions: {
        type: Array,
        value: [
          {id: 'synced', name: 'Synced'},
          {id: 'unsynced', name: 'Not Synced'}
        ]
      }
    };
  }

  connectedCallback() {
    this.initFilters(); // causes slow filter init if not first
    super.connectedCallback();
  }

  _stateChanged(state) {
    if (!state) {
      return;
    }

    this.offline = state.app.offline;
    this.listItems = state.events.list;
  }

  initFilters() {
    this.filters = {
      values: {
        syncStatus: [],
        startDate: null,
        endDate: null,
        q: null
      },
      handlers: {
        syncStatus: this.syncStatusFilter,
        startDate: this.startDateFilter,
        endDate: this.endDateFilter,
        q: this.searchFilter
      }
    };
  }

  syncStatusFilter(event, selectedSyncStatuses = []) {
    if (selectedSyncStatuses.length === 0) {
      return true;
    }
    const eStatus = event.unsynced ? 'unsynced' : 'synced';
    return selectedSyncStatuses.some(s => s === eStatus);
  }

  startDateFilter(event, startDate) {
    return !startDate || new Date(event.start_date) > new Date(startDate);
  }

  endDateFilter(event, endDate) {
    return !endDate || new Date(event.end_date) < new Date(endDate);
  }

  searchFilter(e, q) {
    if (!q || q === '') {
      return true;
    }
    q = q.toLowerCase();
    return String(e.description).toLowerCase().search(q) > -1 ||
           String(e.case_number).toLowerCase().search(q) > -1 ||
           String(e.location).toLowerCase().search(q) > -1;
  }

  isApproved(status) {
    return status === 'approved';
  }

  _showSyncButton(unsynced, offline) {
    return unsynced && !offline && this.hasPermission('add_event');
  }

  _syncItem(event) {
    if (!event || !event.model || !event.model.__data || !event.model.__data.item) {
      return;
    }
    let element = event.model.__data.item;
    store.dispatch(syncEventOnList(element));
  }

  notEditable(event, offline) {
    return (!this.hasPermission('change_event') || offline) &&
           (!event.unsynced || !this.hasPermission('add_event'));
  }
}

window.customElements.define('events-list', EventsList);
