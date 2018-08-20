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
import '@polymer/paper-input/paper-input.js';
import '@polymer/iron-icons/editor-icons.js';
import '@polymer/iron-icons/notification-icons.js';
import 'etools-data-table/etools-data-table.js';
import 'etools-info-tooltip/etools-info-tooltip.js';

import { store } from '../../redux/store.js';
import PaginationMixin from '../common/pagination-mixin.js';
import DateMixin from '../common/date-mixin.js';
import { updatePath } from '../common/navigation-helper.js';
import { syncIncident } from '../../actions/incidents.js';
import { plainErrors } from '../../actions/errors.js';

import '../common/etools-dropdown/etools-dropdown-multi-lite.js';
import '../common/etools-dropdown/etools-dropdown-lite.js';
import '../common/datepicker-lite.js';
import '../styles/shared-styles.js';
import '../styles/form-fields-styles.js';
import '../styles/grid-layout-styles.js';
import '../styles/filters-styles.js';

class IncidentsList extends connect(store)(DateMixin(PaginationMixin(PolymerElement))) {
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

        .sync-btn {
          color: var(--primary-color);
          cursor: pointer;
        }

        .row-details {
          display: block;
        }

      </style>

      <div class="card filters">
        <div class="row-h flex-c">
          <paper-input class="filter search-input"
                       placeholder="Search by Person Involved, City or Description"
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
                             label="From"></datepicker-lite>
          </div>

          <div class="col col-3">
            <datepicker-lite id="endDate"
                             value="{{filters.endDate}}"
                             label="To"></datepicker-lite>
          </div>

        </div>
        <div class="row-h flex-c">
          <div class="col col-3">
            <etools-dropdown-lite id="country"
                                  label="Country"
                                  enable-none-option
                                  options="[[staticData.countries]]"
                                  selected="{{filters.country}}">
            </etools-dropdown-lite>
          </div>

          <div class="col col-3">
            <etools-dropdown-lite id="incidentType"
                                  label="Incident Type"
                                  enable-none-option
                                  options="[[staticData.incidentCategories]]"
                                  selected="{{filters.incidentCategory}}">
            </etools-dropdown-lite>
          </div>

        </div>
      </div>

      <div class="card list">
        <etools-data-table-header id="listHeader"
                                  label="Incidents">
          <etools-data-table-column class="col-3">
            Person involved
          </etools-data-table-column>
          <etools-data-table-column class="col-2">
            City
          </etools-data-table-column>
          <etools-data-table-column class="col-3">
            Incident Type
          </etools-data-table-column>
          <etools-data-table-column class="col-2">
            Status
          </etools-data-table-column>
          <etools-data-table-column class="col-2">
            Actions
          </etools-data-table-column>
        </etools-data-table-header>

        <template id="rows" is="dom-repeat" items="[[filteredIncidents]]">
          <etools-data-table-row unsynced$="[[item.unsynced]]">
            <div slot="row-data">
              <span class="col-data col-3" data-col-header-label="Person involved">
                <span class="truncate">
                  <a href="/incidents/view/[[item.id]]">
                    [[item.primary_person.first_name]] [[item.primary_person.last_name]]
                  </a>
                </span>
              </span>
              <span class="col-data col-2" title="[[item.city]]" data-col-header-label="City">
                  <span>[[item.city]]</span>
              </span>
              <span class="col-data col-3" type="[[_getIncidentName(item.incident_category)]]"
                    data-col-header-label="Incident Type">
              <span>[[_getIncidentName(item.incident_category)]]</span>
              </span>
              <span class="col-data col-2" data-col-header-label="Status">
                <template is="dom-if" if="[[!item.unsynced]]">
                  [[item.status]]
                </template>
                <template is="dom-if" if="[[item.unsynced]]">
                  <etools-info-tooltip class="info" open-on-click>
                    <span slot="field">Not Synced</span>
                    <span slot="message">This incident has not been sumitted to the server. Click the sync button when online to submit it.</span>
                  </etools-info-tooltip>
                </template>
              </span>
              <span class="col-data col-2" data-col-header-label="Actions">
                <a href="/incidents/view/[[item.id]]">
                  <iron-icon icon="assignment" title="View Incident"></iron-icon>
                </a>
                <a href="/incidents/edit/[[item.id]]" title="Edit Incident" hidden$="[[notEditable(item, offline)]]">
                  <iron-icon icon="editor:mode-edit"></iron-icon>
                </a>
                <template is="dom-if" if="[[_showSyncButton(item.unsynced, offline)]]">
                  <div> <!-- this div prevents resizing of the icon on low resolutions -->
                    <iron-icon icon="notification:sync" title="Sync Incident" class="sync-btn" on-click="_syncItem"></iron-icon>
                  </div>
                </template>
              </span>
            </div>
            <div slot="row-data-details" class="row-details">
              <div class="row-h flex-c">
                <div class="col-6">
                  <strong>Date created: </strong>
                  <span>[[prettyDate(item.submitted_date)]]</span>
                </div>
                <div class="col-6">
                  <strong>Date revised: </strong>
                  <span>[[prettyDate(item.last_modify_date)]]</span>
                </div>
              </div>

              <div class="row-h flex-c">
                <div class="col-6">
                  <strong>Description: </strong>
                  <span>[[item.description]]</span>
                </div>
                <div class="col-6">
                  <strong>Note: </strong>
                  <span>[[item.note]]</span>
                </div>
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
      incidents: {
        type: Object,
        value: []
      },
      incidentCategories: Array,
      offline: Boolean,
      filteredIncidents: {
        type: Array,
        computed: '_filterData(incidents, filters.q, pagination.pageSize, pagination.pageNumber, filters.syncStatus.length, ' +
        'filters.startDate, filters.endDate, filters.country, filters.incidentCategory)'
      },
      itemSyncStatusOptions: {
        type: Array,
        value: [
          {id: 'synced', name: 'Synced'},
          {id: 'unsynced', name: 'Not Synced'}
        ]
      },
      store: Object,
      state: Object,
      staticData: Object,
      filters: {
        type: Object,
        value: {
          incidentCategory : null,
          country: null,
          startDate: null,
          endDate: null,
          syncStatus: [],
          q: null
        }
      }

    };
  }

  connectedCallback() {
    super.connectedCallback();
    this.store = store;
  }

  _stateChanged(state) {
    if (!state) {
      return;
    }

    this.offline = state.app.offline;
    this.staticData = state.staticData;
    this.incidents = state.incidents.list;
    this.incidentCategories = state.staticData.incidentCategories;
  }

  _getIncidentName(incidentType) {
    let incident = this.incidentCategories.find(e => e.id === incidentType) || {};
    return incident.name || 'Not Specified';
  }

  _filterData(incidents, q, pageSize, pageNumber, syncStatusLen, startDate, endDate, country, incidentCategory) {
    if (!(incidents instanceof Array && incidents.length > 0)) {
      return [];
    }
    let filteredIncidents = JSON.parse(JSON.stringify(incidents));

    filteredIncidents = filteredIncidents.filter(e => this._applyQFilter(e, q));
    filteredIncidents = filteredIncidents.filter(e => this._applyStatusFilter(e, this.filters.syncStatus));
    filteredIncidents = filteredIncidents.filter(e => this._applyDateFilter(e, startDate, endDate));
    filteredIncidents = filteredIncidents.filter(e => this._applyCountryFilter(e, country));
    filteredIncidents = filteredIncidents.filter(e => this._applyIncidentCategoryFilter(e, incidentCategory));

    return this.applyPagination(filteredIncidents);
  }

  _applyQFilter(e, q) {
    if (!q || q === '') {
      return true;
    }
    let person = (e.primary_person.first_name + ' ' + e.primary_person.last_name).trim();
    return person.toLowerCase().search(q) > -1 ||
        String(e.city).toLowerCase().search(q) > -1 ||
        String(e.description).toLowerCase().search(q) > -1;
  }

  _applyStatusFilter(e, selectedSyncStatuses) {
    if (selectedSyncStatuses.length === 0 || selectedSyncStatuses.length === this.itemSyncStatusOptions.length) {
      return true;
    }
    const eStatus = e.unsynced ? 'unsynced' : 'synced';
    return selectedSyncStatuses.some(s => s === eStatus);
  }

  _applyDateFilter(e, startDate, endDate) {

    if (startDate && new Date(e.incident_date) <= new Date(startDate)){
      return false;
    }

    if (endDate && new Date(e.incident_date) >= new Date(endDate)){
      return false;
    }

    return true;
  }

  _applyCountryFilter(e, selectedCountry){

    return selectedCountry ? e.country === selectedCountry: true;
  }

  _applyIncidentCategoryFilter(e, selectedIncidentCategory){

    return selectedIncidentCategory ? e.incident_category === selectedIncidentCategory : true;
  }

  _showSyncButton(unsynced, offline) {
    return unsynced && !offline;
  }

  async _syncItem(event) {
    if (!event || !event.model || !event.model.__data || !event.model.__data.item) {
      return;
    }
    let element = event.model.__data.item;
    let successfull = await store.dispatch(syncIncident(element));
      if (successfull === false) {
      updatePath('/incidents/edit/' + element.id + '/')
      store.dispatch(plainErrors(['There was an error syncing your incident. Please review the data and try again']));
    }
  }

  notEditable(incident, offline) {
    return offline && !incident.unsynced;
  }
}

window.customElements.define('incidents-list', IncidentsList);
