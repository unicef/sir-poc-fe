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

import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-icons/editor-icons.js';
import '@polymer/iron-icons/notification-icons.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-menu-button/paper-menu-button.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/iron-media-query/iron-media-query.js';
import '@polymer/iron-collapse/iron-collapse.js';

import 'etools-data-table/etools-data-table.js';
import 'etools-info-tooltip/etools-info-tooltip.js';
import 'etools-date-time/datepicker-lite.js';

import { store } from '../../redux/store.js';
import PaginationMixin from '../common/pagination-mixin.js';
import DateMixin from '../common/date-mixin.js';
import { syncIncidentOnList, exportIncidents } from '../../actions/incidents.js';
import ListCommonMixin from '../common/list-common-mixin.js';
import { updateAppState } from '../common/navigation-helper';
import { getNameFromId } from '../common/utils.js';
import { PermissionsBase } from '../common/permissions-base-class';

import { Endpoints } from '../../config/endpoints.js';

import '../common/etools-dropdown/etools-dropdown-multi-lite.js';
import '../common/etools-dropdown/etools-dropdown-lite.js';

import '../styles/shared-styles.js';
import '../styles/form-fields-styles.js';
import '../styles/grid-layout-styles.js';
import '../styles/filters-styles.js';

export class IncidentsList extends connect(store)(DateMixin(PaginationMixin(ListCommonMixin(PermissionsBase)))) {
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

        .capitalize {
          text-transform: capitalize;
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
                        placeholder="Search by City or Description"
                        value="{{filters.values.q}}">
              <iron-icon icon="search" slot="prefix"></iron-icon>
            </paper-input>

            <etools-dropdown-multi-lite class="filter sync-filter"
                                        label="Sync Status"
                                        options="[[itemSyncStatusOptions]]"
                                        selected-values="{{filters.values.syncStatus}}"
                                        hide-search>
            </etools-dropdown-multi-lite>

            <datepicker-lite class="filter"
                            value="{{filters.values.startDate}}"
                            max-date="[[toDate(filters.values.endDate)]]"
                            label="From"></datepicker-lite>

            <datepicker-lite class="filter"
                            value="{{filters.values.endDate}}"
                            min-date="[[toDate(filters.values.startDate)]]"
                            label="To"></datepicker-lite>

            <etools-dropdown-lite class="filter select"
                                  label="Country"
                                  enable-none-option
                                  options="[[staticData.countries]]"
                                  selected="{{filters.values.country}}">
            </etools-dropdown-lite>

            <etools-dropdown-lite class="filter select"
                                  label="Incident Category"
                                  enable-none-option
                                  options="[[staticData.incidentCategories]]"
                                  selected="{{filters.values.incidentCategory}}"
                                  selected-item="{{selectedIncidentCategory}}">
            </etools-dropdown-lite>

            <etools-dropdown-lite class="filter select"
                                  label="Incident Subcategory"
                                  enable-none-option
                                  disabled="[[!selectedIncidentCategory]]"
                                  options="[[selectedIncidentCategory.subcategories]]"
                                  selected="{{filters.values.incidentSubcategory}}">
            </etools-dropdown-lite>

            <etools-dropdown-lite class="filter select"
                                  label="Events"
                                  enable-none-option
                                  options="[[events]]"
                                  selected="{{filters.values.event}}">
            </etools-dropdown-lite>

            <etools-dropdown-lite class="filter select"
                                  label="Target"
                                  enable-none-option
                                  options="[[staticData.targets]]"
                                  selected="{{filters.values.target}}">
            </etools-dropdown-lite>

            <etools-dropdown-lite class="filter select"
                                  label="Threat Category"
                                  enable-none-option
                                  options="[[staticData.threatCategories]]"
                                  selected="{{filters.values.threatCategory}}">
            </etools-dropdown-lite>

            <paper-menu-button class="export" horizontal-align="right" vertical-offset="8">
              <paper-button raised class="white" slot="dropdown-trigger">
                <iron-icon icon="file-download"></iron-icon>
                Export
              </paper-button>
              <paper-listbox slot="dropdown-content" attr-for-selected="doc-type" selected="{{exportDocType}}">
                <paper-item doc-type="pdf">PDF</paper-item>
                <paper-item doc-type="csv">CSV</paper-item>
                <paper-item doc-type="xls">XLS</paper-item>
                <paper-item doc-type="xlsx">XLSX</paper-item>
              </paper-listbox>
            </paper-menu-button>
          </div>
        </iron-collapse>

        <div class="filters-button" on-tap="_toggleFilters" hidden$="[[!showToggleFiltersBtn]]">
          <iron-icon id=toggleIcon icon="icons:expand-more"></iron-icon>
          FILTERS
        </div>
      </div>

      <div class="card list">
        <etools-data-table-header id="listHeader"
                                  label="Incidents"
                                  low-resolution-layout="[[lowResolutionLayout]]">
          <etools-data-table-column class="col-1">
            Case Number
          </etools-data-table-column>
          <etools-data-table-column class="col-4">
            Description
          </etools-data-table-column>
          <etools-data-table-column class="col-1">
            City
          </etools-data-table-column>
          <etools-data-table-column class="col-1">
            Category
          </etools-data-table-column>
          <etools-data-table-column class="col-2">
            Subcategory
          </etools-data-table-column>
          <etools-data-table-column class="col-2">
            Status
          </etools-data-table-column>
          <etools-data-table-column class="col-1">
            Actions
          </etools-data-table-column>
        </etools-data-table-header>

        <template id="rows" is="dom-repeat" items="[[filteredIncidents]]">
          <etools-data-table-row unsynced$="[[item.unsynced]]"
                                 low-resolution-layout="[[lowResolutionLayout]]" class="p-relative">
            <div slot="row-data" class="p-relative">
              <span class="col-data col-1" data-col-header-label="Case number">
                <span class="truncate" hidden$="[[!hasPermission('view_incident')]]">
                  <a href="/incidents/view/[[item.id]]">[[item.case_number]]</a>
                </span>
                <span class="truncate" hidden$="[[hasPermission('view_incident')]]">
                  [[item.case_number]]
                </span>
              </span>
              <span class="col-data col-4" data-col-header-label="Case number">
                <span class="truncate">
                  [[item.description]]
                </span>
              </span>
              <span class="col-data col-1" title="[[item.city]]" data-col-header-label="City">
                <span>[[item.city]]</span>
              </span>
              <span class="col-data col-1" title="[[getNameFromId(item.incident_category, 'incidentCategories')]]"
                    data-col-header-label="Incident Category">
                <span>[[getNameFromId(item.incident_category, 'incidentCategories')]]</span>
              </span>
              <span class="col-data col-2" title="[[getIncidentSubcategory(item.incident_subcategory)]]"
                    data-col-header-label="Incident Subcategory">
                <span>[[getIncidentSubcategory(item.incident_subcategory)]]</span>
              </span>
              <span class="col-data col-2 capitalize" data-col-header-label="Status">
                <template is="dom-if" if="[[!item.unsynced]]">
                  [[item.status]]
                </template>
                <template is="dom-if" if="[[item.unsynced]]">
                  <etools-info-tooltip class="info" open-on-click>
                    <span slot="field">Not Synced</span>
                    <span slot="message">This incident has not been submitted to the server.
                                         Click the sync button when online to submit it.</span>
                  </etools-info-tooltip>
                </template>
              </span>
              <span class="col-data col-1" data-col-header-label="Actions">
                <template is="dom-if" if="[[!canEdit(item.status, item.unsynced, offline)]]">
                  <a href="/incidents/view/[[item.id]]" hidden$="[[!hasPermission('view_incident')]]">
                    <iron-icon icon="assignment" title="View Incident"></iron-icon>
                  </a>
                </template>
                <template is="dom-if" if="[[canEdit(item.status, item.unsynced, offline)]]">
                  <a href="/incidents/edit/[[item.id]]" title="Edit Incident">
                    <iron-icon icon="editor:mode-edit"></iron-icon>
                  </a>
                </template>
                <template is="dom-if" if="[[_showSyncButton(item.unsynced, offline)]]">
                    <iron-icon icon="notification:sync" title="Sync Incident" class="sync-btn" on-click="_syncItem">
                    </iron-icon>
                </template>
              </span>
            </div>
            <div slot="row-data-details">
              <div class="row-details-content flex-c">
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
      incidents: {
        type: Object,
        value: []
      },
      events: {
        type: Array,
        value: []
      },
      threatCategories: Array,
      offline: Boolean,
      filteredIncidents: {
        type: Array
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
          values: {
            incidentSubcategory: null,
            incidentCategory: null,
            threatCategory: null,
            syncStatus: [],
            startDate: null,
            endDate: null,
            country: null,
            target: null,
            event: null,
            q: null
          },
          handlers: {
            incidentSubcategory: IncidentsList.incidentSubcategoryFilter,
            incidentCategory: IncidentsList.incidentCategoryFilter,
            threatCategory: IncidentsList.threatCategoryFilter,
            syncStatus: IncidentsList.syncStatusFilter,
            startDate: IncidentsList.startDateFilter,
            endDate: IncidentsList.endDateFilter,
            country: IncidentsList.countryFilter,
            target: IncidentsList.targetFilter,
            event: IncidentsList.eventFilter,
            q: IncidentsList.searchFilter
          }
        }
      },
      _lastQueryString: {
        type: String,
        value: '',
        observer: 'queryStringChanged'
      },
      visible: {
        type: Boolean,
        observer: '_visibilityChanged'
      },
      exportDocType: {
        type: String,
        observer: '_export'
      },
      selectedIncidentCategory: {
        type: Object,
        value: {}
      },
      lowResolutionLayout: Boolean
    };
  }

  static get observers() {
    return [
      'filterData(incidents)',
      'filterData(pagination.*)',
      'filterData(filters.values.*)'
    ];
  }

  connectedCallback() {
    super.connectedCallback();
    this.getNameFromId = getNameFromId;
    this.store = store;
  }

  queryStringChanged(qs) {
    if (!this.visible || !qs) {
      return false;
    }

    updateAppState('/incidents/list', qs, false);
  }

  _updateUrlQuery() {
    if (!this.visible) {
      return false;
    }

    this.set('_lastQueryString', this._buildUrlQueryString(this.filters.values));
  }

  _visibilityChanged(visible) {
    if (visible && this._lastQueryString !== '') {
      updateAppState('/incidents/list', this._lastQueryString, false);
    }
  }

  updateFilters(queryParams) {
    if (queryParams && this.visible) {
      this.set('filters.values', this.deserializeFilters(queryParams));
    }
  }

  _stateChanged(state) {
    if (!state) {
      return;
    }

    this.offline = state.app.offline;
    this.staticData = state.staticData;
    this.incidents = state.incidents.list;
    this.threatCategories = state.staticData.threatCategories;

    if (typeof state.app.locationInfo.queryParams !== 'undefined') {
      this.updateFilters(state.app.locationInfo.queryParams);
    }

    this.events = state.events.list.map((elem) => {
      elem.name = elem.description;
      return elem;
    });
  }

  filterData() {
    let filteredIncidents = JSON.parse(JSON.stringify(this.incidents));
    let allFilters = Object.keys(this.filters.handlers);

    allFilters.forEach((key) => {
      let value = this.filters.values[key];
      let handler = this.filters.handlers[key];
      filteredIncidents = handler(filteredIncidents, value);
    });

    filteredIncidents.sort((left, right) => {
      return moment.utc(right.last_modify_date).diff(moment.utc(left.last_modify_date));
    });

    this._updateUrlQuery();
    this.filteredIncidents = this.applyPagination(filteredIncidents);
  }

  static threatCategoryFilter(incidents, selectedThreatCategory) {
    return incidents.filter((incident) => {
      return selectedThreatCategory ? Number(incident.threat_category) === Number(selectedThreatCategory) : true;
    });
  }

  static searchFilter(incidents, q) {
    return incidents.filter((incident) => {
      if (!q || q === '') {
        return true;
      }
      q = q.toLowerCase();
      return String(incident.city).search(q) > -1 ||
          String(incident.description).toLowerCase().search(q) > -1;
    });
  }

  static incidentCategoryFilter(incidents, selectedIncidentCategory) {
    return incidents.filter((incident) => {
      return selectedIncidentCategory ? Number(incident.incident_category) === Number(selectedIncidentCategory) : true;
    });
  }

  static incidentSubcategoryFilter(incidents, selectedSubCategory) {
    return incidents.filter((incident) => {
      return selectedSubCategory ? Number(incident.incident_subcategory) === Number(selectedSubCategory) : true;
    });
  }

  static countryFilter(incidents, selectedCountry) {
    return incidents.filter((incident) => {
      return selectedCountry ? incident.country === Number(selectedCountry) : true;
    });
  }

  static startDateFilter(incidents, startDate) {
    return incidents.filter((incident) => {
      return !startDate || new Date(incident.incident_date) > new Date(startDate);
    });
  }

  static endDateFilter(incidents, endDate) {
    return incidents.filter((incident) => {
      return !endDate || new Date(incident.incident_date) < new Date(endDate);
    });
  }

  static syncStatusFilter(incidents, selectedSyncStatuses) {
    return incidents.filter((incident) => {
      if (selectedSyncStatuses.length === 0) {
        return true;
      }
      const eStatus = incident.unsynced ? 'unsynced' : 'synced';
      return selectedSyncStatuses.some(s => s === eStatus);
    });
  }

  static eventFilter(incidents, selectedEvent) {
    return incidents.filter((incident) => {
      return selectedEvent ? incident.event === selectedEvent : true;
    });
  }

  static targetFilter(incidents, selectedTarget) {
    return incidents.filter((incident) => {
      return selectedTarget ? Number(incident.target) === Number(selectedTarget) : true;
    });
  }

  _showSyncButton(unsynced, offline) {
    return !offline && unsynced && this.hasPermission('add_incident');
  }

  _syncItem(incident) {
    if (!incident || !incident.model || !incident.model.__data || !incident.model.__data.item) {
      return;
    }

    let element = incident.model.__data.item;
    store.dispatch(syncIncidentOnList(element));
  }

  canEdit(status, unsynced, offline) {
    return (status === 'created' && this.hasPermission('change_incident') && !offline) ||
           (unsynced && this.hasPermission('add_incident'));
  }

  getIncidentSubcategory(id) {
    if (id) {
      let allSubCategories = [].concat(...this.staticData.incidentCategories.map(thing => thing.subcategories));
      let selectedDatum = allSubCategories.find(item => item.id === id);
      return selectedDatum.name;
    }
  }

  _getExportQueryString(docType) {
    return this._buildUrlQueryString({
      incident_category: this.filters.values.incidentCategory,
      incident_subcategory: this.filters.values.incidentSubcategory,
      incident_date__gt: this.filters.values.startDate,
      incident_date__lt: this.filters.values.endDate,
      country: this.filters.values.country,
      q: this.filters.values.q,
      event: this.filters.values.event,
      format: docType,
      target: this.filters.values.target,
      threat_category: this.filters.values.threatCategory
    });
  }

  _export(docType) {
    if (!docType || docType === '') {
      return;
    }
    const csvQStr = this._getExportQueryString(docType);
    const csvDownloadUrl = Endpoints['incidentsList'].url + '?' + csvQStr;
    this.set('exportDocType', '');

    store.dispatch(exportIncidents(csvDownloadUrl, docType));
  }

}

window.customElements.define('incidents-list', IncidentsList);
