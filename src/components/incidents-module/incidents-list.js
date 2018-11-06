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
import { getNameFromId, hasPermission } from '../common/utils.js';
import { Endpoints } from '../../config/endpoints.js';

import '../common/etools-dropdown/etools-dropdown-multi-lite.js';
import '../common/etools-dropdown/etools-dropdown-lite.js';

import '../styles/shared-styles.js';
import '../styles/form-fields-styles.js';
import '../styles/grid-layout-styles.js';
import '../styles/filters-styles.js';

class IncidentsList extends connect(store)(DateMixin(PaginationMixin(ListCommonMixin(PolymerElement)))) {
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
                        placeholder="Search by City or Description"
                        value="{{filters.q}}">
              <iron-icon icon="search" slot="prefix"></iron-icon>
            </paper-input>

            <etools-dropdown-multi-lite class="filter sync-filter"
                                        label="Sync Status"
                                        options="[[itemSyncStatusOptions]]"
                                        selected-values="{{filters.syncStatus}}"
                                        hide-search>
            </etools-dropdown-multi-lite>

            <datepicker-lite class="filter"
                            value="{{filters.startDate}}"
                            max-date="[[toDate(filters.endDate)]]"
                            label="From"></datepicker-lite>

            <datepicker-lite class="filter"
                            value="{{filters.endDate}}"
                            min-date="[[toDate(filters.startDate)]]"
                            label="To"></datepicker-lite>

            <etools-dropdown-lite class="filter select"
                                  label="Country"
                                  enable-none-option
                                  options="[[staticData.countries]]"
                                  selected="{{filters.country}}">
            </etools-dropdown-lite>

            <etools-dropdown-lite class="filter select"
                                  label="Incident Category"
                                  enable-none-option
                                  options="[[staticData.incidentCategories]]"
                                  selected="{{filters.incidentCategory}}"
                                  selected-item="{{selectedIncidentCategory}}">
            </etools-dropdown-lite>

            <etools-dropdown-lite class="filter select"
                                  label="Incident Subcategory"
                                  enable-none-option
                                  disabled="[[!selectedIncidentCategory]]"
                                  options="[[selectedIncidentCategory.subcategories]]"
                                  selected="{{filters.incidentSubcategory}}">
            </etools-dropdown-lite>

            <etools-dropdown-lite class="filter select"
                                  label="Events"
                                  enable-none-option
                                  options="[[events]]"
                                  selected="{{filters.event}}">
            </etools-dropdown-lite>

            <etools-dropdown-lite class="filter select"
                                  label="Target"
                                  enable-none-option
                                  options="[[staticData.targets]]"
                                  selected="{{filters.target}}">
            </etools-dropdown-lite>

            <etools-dropdown-lite class="filter select"
                                  label="Threat Category"
                                  enable-none-option
                                  options="[[staticData.threatCategories]]"
                                  selected="{{filters.threatCategory}}">
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
            Case number
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
                <span class="truncate">
                  <a href="/incidents/view/[[item.id]]">[[item.case_number]]</a>
                </span>
              </span>
              <span class="col-data col-4" data-col-header-label="Case number">
                <span class="truncate">
                  [[item.description]]
                </span>
              </span>
              <span class="col-data col-1" title="[[item.city]]" data-col-header-label="City">
                  <span>[[incident.city]]</span>
              </span>
              <span class="col-data col-1" title="[[getNameFromId(item.incident_category, 'incidentCategories')]]"
                    data-col-header-label="Incident Category">
                <span>[[getNameFromId(item.incident_category, 'incidentCategories')]]</span>
              </span>
              <span class="col-data col-2" title="[[getIncidentSubcategory(item.incident_subcategory)]]"
                    data-col-header-label="Incident Subcategory">
                <span>[[getIncidentSubcategory(item.incident_subcategory)]]</span>
              </span>
              <span class="col-data col-2" data-col-header-label="Status">
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
                  <a href="/incidents/view/[[item.id]]">
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
        type: Array,
        computed: '_filterData(incidents, filters.q, pagination.pageSize, pagination.pageNumber, ' +
            'filters.syncStatus.length, filters.startDate, filters.endDate, filters.country, ' +
            'filters.incidentCategory, _queryParamsInitComplete, filters.event, filters.target, ' +
            'filters.incidentSubcategory, filters.threatCategory)'
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
          incidentCategory: null,
          incidentSubcategory: null,
          country: null,
          startDate: null,
          endDate: null,
          syncStatus: [],
          q: null,
          event: null,
          target: null,
          threatCategory: null
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

  connectedCallback() {
    super.connectedCallback();
    this.getNameFromId = getNameFromId;
    this.store = store;
  }

  _updateUrlQuery() {
    if (!this.visible) {
      return false;
    }
    this.set('_lastQueryString', this._buildQueryString());
    updateAppState('/incidents/list', this._lastQueryString, false);
  }

  _visibilityChanged(visible) {
    if (this._queryParamsInitComplete) {
      if (visible && this._lastQueryString !== '') {
        updateAppState('/incidents/list', this._lastQueryString, false);
      }
    }
  }

  _queryParamsChanged(params) {
    if (params && this.visible) {
      if (params.q && params.q !== this.filters.q) {
        this.set('filters.q', params.q);
      }

      if (params.incidentCategory && params.incidentCategory !== this.filters.incidentCategory) {
        this.set('filters.incidentCategory', Number(params.incidentCategory));
      }

      if (params.country && params.country !== this.filters.country) {
        this.set('filters.country', params.country);
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

      if (params.incident_category) {
        this.set('filters.incidentCategory', params.incident_category);
      }

      if (params.incident_subcategory) {
        this.set('filters.incidentSubcategory', params.incident_subcategory);
      }

      if (params.event) {
        this.set('filters.event', params.event);
      }

      if (params.target) {
        this.set('filters.target', params.target);
      }

      if (params.threat_category) {
        this.set('filters.threatCategory', params.threat_category);
      }

      this.set('_queryParamsInitComplete', true);
    }
  }

  _stateChanged(state) {
    if (!state) {
      return;
    }

    if (typeof state.app.locationInfo.queryParams !== 'undefined') {
      this._queryParams = state.app.locationInfo.queryParams;
    }

    this.offline = state.app.offline;
    this.staticData = state.staticData;
    this.incidents = state.incidents.list;
    this.threatCategories = state.staticData.threatCategories;

    this.events = state.events.list.map((elem) => {
      elem.name = elem.description;
      return elem;
    });
  }

  _filterData(incidents, q, pageSize, pageNumber, syncStatusLen, startDate, endDate, country,
              incidentCategory, qParamsInit, event, target, subcategory, threatCategory) {

    if (!qParamsInit || !(incidents instanceof Array && incidents.length > 0)) {
      return [];
    }

    this._updateUrlQuery();

    let filteredIncidents = JSON.parse(JSON.stringify(incidents));

    filteredIncidents = filteredIncidents.filter(incident => this._applyQFilter(incident, q));
    filteredIncidents = filteredIncidents.filter(incident => this._applyStatusFilter(incident,
        this.filters.syncStatus));
    filteredIncidents = filteredIncidents.filter(incident => this._applyDateFilter(incident, startDate, endDate));
    filteredIncidents = filteredIncidents.filter(incident => this._applyCountryFilter(incident, country));
    filteredIncidents = filteredIncidents.filter(incident => this._applyIncidentCategoryFilter(incident,
        incidentCategory));
    filteredIncidents = filteredIncidents.filter(incident => this._applyEventFilter(incident, event));
    filteredIncidents = filteredIncidents.filter(incident => this._applyTargetFilter(incident, target));
    filteredIncidents = filteredIncidents.filter(incident => this._applyIncidentSubcategoryFilter(incident,
        subcategory));
    filteredIncidents = filteredIncidents.filter(incident => this._applyThreatCategoryFilter(incident, threatCategory));

    filteredIncidents.sort((left, right) => {
      return moment.utc(right.last_modify_date).diff(moment.utc(left.last_modify_date));
    });

    return this.applyPagination(filteredIncidents);
  }

  _applyQFilter(incident, q) {
    if (!q || q === '') {
      return true;
    }
    q = q.toLowerCase();
    return String(incident.city).search(q) > -1 ||
        String(incident.description).toLowerCase().search(q) > -1;
  }

  _applyStatusFilter(incident, selectedSyncStatuses) {
    if (selectedSyncStatuses.length === 0 || selectedSyncStatuses.length === this.itemSyncStatusOptions.length) {
      return true;
    }
    const eStatus = incident.unsynced ? 'unsynced' : 'synced';
    return selectedSyncStatuses.some(s => s === eStatus);
  }

  _applyDateFilter(incident, startDate, endDate) {

    if (startDate && new Date(incident.incident_date) <= new Date(startDate)) {
      return false;
    }

    if (endDate && new Date(incident.incident_date) >= new Date(endDate)) {
      return false;
    }

    return true;
  }

  _applyCountryFilter(incident, selectedCountry) {
    return selectedCountry ? incident.country === Number(selectedCountry) : true;
  }

  _applyIncidentCategoryFilter(incident, selectedIncidentCategory) {
    return selectedIncidentCategory ? incident.incident_category === Number(selectedIncidentCategory) : true;
  }

  _applyIncidentSubcategoryFilter(incident, selectedSubCategory) {
    return selectedSubCategory ? incident.incident_subcategory === Number(selectedSubCategory) : true;
  }

  _applyEventFilter(incident, selectedEvent) {
    return selectedEvent ? incident.event === selectedEvent : true;
  }

  _applyTargetFilter(incident, selectedTarget) {
    return selectedTarget ? incident.target === Number(selectedTarget) : true;
  }

  _applyThreatCategoryFilter(incident, selectedThreatCategory) {
    return selectedThreatCategory ? incident.threat_category === Number(selectedThreatCategory) : true;
  }

  _showSyncButton(unsynced, offline) {
    return unsynced && !offline;
  }

  _syncItem(incident) {
    if (!incident || !incident.model || !incident.model.__data || !incident.model.__data.item) {
      return;
    }

    let element = incident.model.__data.item;
    store.dispatch(syncIncidentOnList(element));
  }

  canEdit(status, unsynced, offline) {
    return (status === 'created' && hasPermission('edit_incident') && !offline) ||
           (unsynced && hasPermission('add_incident'));
  }

  getIncidentSubcategory(id) {
    if (id) {
      let allSubCategories = [].concat(...this.staticData.incidentCategories.map(thing => thing.subcategories));
      let selectedDatum = allSubCategories.find(item => item.id === id);
      return selectedDatum.name;
    }
  }

  // Outputs the query string for the list
  _buildQueryString() {
    return this._buildUrlQueryString({
      incident_category: this.filters.incidentCategory,
      incident_subcategory: this.filters.incidentSubcategory,
      country: this.filters.country,
      start: this.filters.startDate,
      end: this.filters.endDate,
      synced: this.filters.syncStatus,
      q: this.filters.q,
      event: this.filters.event,
      target: this.filters.target,
      threat_category: this.filters.threatCategory
    });
  }

  // Outputs the query string for the export
  _buildExportQueryString(docType) {
    return this._buildUrlQueryString({
      incident_category: this.filters.incidentCategory,
      incident_subcategory: this.filters.incidentSubcategory,
      incident_date__gt: this.filters.startDate,
      incident_date__lt: this.filters.endDate,
      country: this.filters.country,
      q: this.filters.q,
      event: this.filters.event,
      format: docType,
      target: this.filters.target,
      threat_category: this.filters.threatCategory
    });
  }

  _export(docType) {
    if (!docType || docType === '') {
      return;
    }
    const csvQStr = this._buildExportQueryString(docType);
    const csvDownloadUrl = Endpoints['incidentsList'].url + '?' + csvQStr;
    this.set('exportDocType', '');

    store.dispatch(exportIncidents(csvDownloadUrl, docType));
  }

}

window.customElements.define('incidents-list', IncidentsList);
