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
import { connect } from 'pwa-helpers/connect-mixin.js';

import '@polymer/iron-icons/av-icons.js';
import '@polymer/iron-icons/editor-icons.js';
import '@polymer/iron-icons/notification-icons.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-menu-button/paper-menu-button.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/iron-media-query/iron-media-query.js';
import '@polymer/iron-collapse/iron-collapse.js';
import '@polymer/paper-checkbox/paper-checkbox.js';

import '@unicef-polymer/etools-data-table/etools-data-table.js';
import '@unicef-polymer/etools-info-tooltip/etools-info-tooltip.js';
import '@unicef-polymer/etools-date-time/datepicker-lite.js';
import '@unicef-polymer/etools-dropdown/etools-dropdown-multi.js';
import '@unicef-polymer/etools-dropdown/etools-dropdown.js';

import { store } from '../../redux/store.js';
import {
  syncIncidentOnList, exportIncidents, exportSingleIncident,
  saveMultipleIncidentsAsDraft
} from '../../actions/incidents.js';
import { getNameFromId } from '../common/utils.js';

import '../styles/shared-styles.js';
import '../styles/form-fields-styles.js';
import '../styles/grid-layout-styles.js';
import '../styles/filters-styles.js';

class IncidentsList extends connect(store)(ListBaseClass) {
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

        .action-btn {
          color: var(--primary-color);
          cursor: pointer;
        }

        etools-data-table-row[low-resolution-layout] etools-info-tooltip {
          display: inherit;
        }

        .notification-tooltip {
          color: var(--notification-icon-color);
        }

        iron-icon.smaller {
          --iron-icon-width: 20px;
          --iron-icon-height: 20px;
        }

        @media (max-width: 768px) {
          .hidden-on-mobile {
            display: none;
          }
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

            <etools-dropdown-multi class="filter sync-filter"
                                   label="Sync Status"
                                   option-label="name"
                                   option-value="id"
                                   options="[[itemSyncStatusOptions]]"
                                   selected-values="{{filters.values.syncStatus}}"
                                   hide-search>
            </etools-dropdown-multi>

            <datepicker-lite class="filter"
                            value="{{filters.values.startDate}}"
                            max-date="[[toDate(filters.values.endDate)]]"
                            label="From"></datepicker-lite>

            <datepicker-lite class="filter"
                            value="{{filters.values.endDate}}"
                            min-date="[[toDate(filters.values.startDate)]]"
                            label="To"></datepicker-lite>

            <etools-dropdown class="filter select"
                              label="Country"
                              enable-none-option
                              option-label="name"
                              option-value="id"
                              options="[[staticData.countries]]"
                              selected="{{filters.values.country}}">
            </etools-dropdown>

            <etools-dropdown class="filter select"
                              label="Incident Category"
                              enable-none-option
                              option-label="name"
                              option-value="id"
                              options="[[staticData.incidentCategories]]"
                              selected="{{filters.values.incidentCategory}}"
                              selected-item="{{selectedIncidentCategory}}">
            </etools-dropdown>

            <etools-dropdown class="filter select"
                              label="Incident Subcategory"
                              enable-none-option
                              option-label="name"
                              option-value="id"
                              disabled="[[!selectedIncidentCategory]]"
                              options="[[selectedIncidentCategory.subcategories]]"
                              selected="{{filters.values.incidentSubcategory}}">
            </etools-dropdown>

            <etools-dropdown class="filter select"
                              label="Target"
                              enable-none-option
                              option-label="name"
                              option-value="id"
                              options="[[staticData.targets]]"
                              selected="{{filters.values.target}}">
            </etools-dropdown>

            <etools-dropdown class="filter select"
                              label="Threat Category"
                              enable-none-option
                              option-label="name"
                              option-value="id"
                              options="[[staticData.threatCategories]]"
                              selected="{{filters.values.threatCategory}}">
            </etools-dropdown>

            <paper-menu-button class="export"
                               horizontal-align="right"
                               vertical-offset="8">
              <paper-button raised class="white" slot="dropdown-trigger">
                <iron-icon icon="file-download"></iron-icon>
                Export
              </paper-button>
              <paper-listbox slot="dropdown-content" on-iron-select="exportList">
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
        <div class="row-h flex-c">
          <span class="col-9">
            <h3> Incidents </h3>
          </span>
          <span class="col-3">
            <etools-dropdown id="incidentSorting"
                              label="Sorting"
                              option-label="name"
                              option-value="id"
                              options="[[sortingOptions]]"
                              selected-item="{{selectedSorting}}">
            </etools-dropdown>
          </span>
        </div>

        <etools-data-table-header id="listHeader"
                                  no-title
                                  low-resolution-layout="[[lowResolutionLayout]]">
          <etools-data-table-column class="col-1">
           Select
          </etools-data-table-column>
          <etools-data-table-column class="col-2">
            Case Number
          </etools-data-table-column>
          <etools-data-table-column class="col-2">
            Description
          </etools-data-table-column>
          <etools-data-table-column class="col-1">
            City
          </etools-data-table-column>
          <etools-data-table-column class="col-1">
            Country
          </etools-data-table-column>
          <etools-data-table-column class="col-1">
            Category
          </etools-data-table-column>
          <etools-data-table-column class="col-2">
            Subcategory
          </etools-data-table-column>
          <etools-data-table-column class="col-1">
            Status
          </etools-data-table-column>
          <etools-data-table-column class="col-1">
            Actions
          </etools-data-table-column>
        </etools-data-table-header>

        <template id="rows" is="dom-repeat" items="[[filteredItems]]">
          <etools-data-table-row unsynced$="[[item.unsynced]]"
                                 low-resolution-layout="[[lowResolutionLayout]]" class="p-relative">
            <div slot="row-data" class="p-relative">
            <template is="dom-if" if="[[!canEdit(item.status, item.unsynced, offline)]]">
           <span class="col-data col-1" data-col-header-label="Case number">
                <span><paper-checkbox on-change="_handleCheckbox" incident-id$="[[item.id]]"> </paper-checkbox></span>
           </span>
           </template>
           <template is="dom-if" if="[[canEdit(item.status, item.unsynced, offline)]]">
                <span class="col-data col-1" data-col-header-label="Case number"></span>
           </template>
              <span class="col-data col-2" data-col-header-label="Case number">
                <span class="truncate" hidden$="[[!hasPermission('view_incident')]]">
                  <a href="/incidents/view/[[item.id]]">[[item.case_number]]</a>
                </span>
                <span class="truncate" hidden$="[[hasPermission('view_incident')]]">
                  [[item.case_number]]
                </span>

                <etools-info-tooltip class="notification-tooltip"
                                     hidden$="[[!showNewIncidentTooltip(item)]]"
                                     custom-icon
                                     open-on-click>
                  <span slot="custom-icon"><iron-icon icon="av:fiber-new"></iron-icon></span>
                  <span slot="message"> This incident has been added since your last login </span>
                </etools-info-tooltip>

                <etools-info-tooltip class="notification-tooltip"
                                     hidden$="[[!showNewCommentsTooltip(item)]]"
                                     custom-icon
                                     open-on-click>
                  <span slot="custom-icon"><iron-icon class="smaller" icon="editor:insert-comment"></iron-icon></span>
                  <span slot="message"> New comments have been added since your last login </span>
                </etools-info-tooltip>

                <etools-info-tooltip class="notification-tooltip"
                                     hidden$="[[!showNewChangesTooltip(item)]]"
                                     custom-icon
                                     open-on-click>
                  <span slot="custom-icon"><iron-icon class="smaller" icon="build"></iron-icon></span>
                  <span slot="message"> This incident has been changed since your last login </span>
                </etools-info-tooltip>

              </span>
              <span class="col-data col-2" data-col-header-label="Case number">
                <span class="truncate">
                  [[item.description]]
                </span>
              </span>
              <span class="col-data col-1"
                    title="[[item.city]]"
                    data-col-header-label="City">
                <span>[[item.city]]</span>
              </span>
              <span class="col-data col-1"
                    title="[[getCountryName(item.country)]]"
                    data-col-header-label="Country">
                <span>[[getCountryName(item.country)]]</span>
              </span>
              <span class="col-data col-1" title="[[item.incident_category_name]]"
                    data-col-header-label="Incident Category">
                <span>[[item.incident_category_name]]</span>
              </span>
              <span class="col-data col-2" title="[[item.incident_subcategory_name]]"
                    data-col-header-label="Incident Subcategory">
                <span>[[item.incident_subcategory_name]]</span>
              </span>
              <span class="col-data col-1 capitalize" data-col-header-label="Status">
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
                  <span> <!-- This container is mostly useless, but without it the icon doesn't render -->
                    <iron-icon icon="notification:sync" title="Sync Incident" class="action-btn" on-click="_syncItem">
                    </iron-icon>
                  </span>
                </template>
                <div class="export-btn hidden-on-mobile">
                  <paper-menu-button class="export" horizontal-align="right" vertical-offset="8">
                    <iron-icon icon="file-download" class="action-btn" slot="dropdown-trigger"></iron-icon>
                    <paper-listbox slot="dropdown-content" on-iron-select="exportItem">
                      <paper-item doc-type="pdf" incident-id$="[[item.id]]">PDF</paper-item>
                      <paper-item doc-type="docx" incident-id$="[[item.id]]">DOCX</paper-item>
                    </paper-listbox>
                  </paper-menu-button>
                </div>
              </span>
            </div>
            <div slot="row-data-details">
              <div class="row-details-content flex-c">
                <div class="row-h flex-c">
                  <div class="col col-6">
                    <strong class="rdc-title inline"> Created by: </strong>
                    <span>[[item.created_by_user.email]]</span>
                  </div>
                  <div class="col col-6">
                    <strong class="rdc-title inline"> Created on: </strong>
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
        <paper-button  on-click="_changeToDraft"
        disabled$="[[disabled]]"
                  >
                  CHANGE TO DRAFT</paper-button>
       
      </div>
    `;
  }

  static get properties() {
    return {
      threatCategories: Array,
      staticData: Object,
      offline: Boolean,
      store: Object,
      state: Object,
      itemSyncStatusOptions: {
        type: Array,
        value: [
          {id: 'synced', name: 'Synced'},
          {id: 'unsynced', name: 'Not Synced'}
        ]
      },
      selectedIncidentCategory: {
        type: Object,
        value: {}
      },
      incidentIds: {
        type: Array,
        value: []
      },
      disabled: {
        type: Boolean,
        value: true
      }
    };
  }

  _stateChanged(state) {
    if (!state) {
      return;
    }
    this.state = state;
    this.offline = state.app.offline;
    this.staticData = state.staticData;
    this.threatCategories = state.staticData.threatCategories;
    this.listItems = state.incidents.list.map((elem) => {
      elem.incident_category_name = getNameFromId(elem.incident_category, 'incidentCategories');
      elem.incident_subcategory_name = this.getIncidentSubcategory(elem.incident_subcategory);
      return elem;
    });
  }

  initFilters() {
    this.filters = {
      values: {
        incidentSubcategory: null,
        incidentCategory: null,
        threatCategory: null,
        syncStatus: [],
        startDate: null,
        endDate: null,
        country: null,
        target: null,
        q: null
      },
      handlers: {
        incidentSubcategory: this.incidentSubcategoryFilter,
        incidentCategory: this.incidentCategoryFilter,
        threatCategory: this.threatCategoryFilter,
        syncStatus: this.syncStatusFilter,
        startDate: this.startDateFilter,
        endDate: this.endDateFilter,
        country: this.countryFilter,
        target: this.targetFilter,
        q: this.searchFilter
      }
    };
  }

  initSorting() {
    this.sortingOptions = [
      {
        name: 'Date Created',
        id: 'date_created_desc',
        default: true,
        method: ((left, right) => this.chronologicalSort(right.created_on, left.created_on))
      },
      {
        name: 'Reverse Date Created',
        id: 'date_created_asc',
        default: false,
        method: ((left, right) => this.chronologicalSort(left.created_on, right.created_on))
      },
      {
        name: 'Date Modified',
        id: 'date_modified_desc',
        default: false,
        method: ((left, right) => this.chronologicalSort(right.last_modify_date, left.last_modify_date))
      },
      {
        name: 'Reverse Date Modified',
        id: 'date_modified_asc',
        default: false,
        method: ((left, right) => this.chronologicalSort(left.last_modify_date, right.last_modify_date))
      },
      {
        name: 'Description A-Z',
        id: 'description_asc',
        default: false,
        method: ((left, right) => this.alphabeticalSort(left.description, right.description))
      },
      {
        name: 'Description Z-A',
        id: 'description_desc',
        default: false,
        method: ((left, right) => this.alphabeticalSort(right.description, left.description))
      },
      {
        name: 'City A-Z',
        id: 'city_asc',
        default: false,
        method: ((left, right) => this.alphabeticalSort(left.city, right.city))
      },
      {
        name: 'City Z-A',
        id: 'city_desc',
        default: false,
        method: ((left, right) => this.alphabeticalSort(right.city, left.city))
      },
      {
        name: 'Status A-Z',
        id: 'status_asc',
        default: false,
        method: ((left, right) => this.alphabeticalSort(left.status, right.status))
      },
      {
        name: 'Status Z-A',
        id: 'status_desc',
        default: false,
        method: ((left, right) => this.alphabeticalSort(right.status, left.status))
      },
      {
        name: 'Case Number',
        id: 'case_number_asc',
        default: false,
        method: ((left, right) => this.alphabeticalSort(left.case_number, right.case_number))
      },
      {
        name: 'Reverse Case Number',
        id: 'case_number_desc',
        default: false,
        method: ((left, right) => this.alphabeticalSort(right.case_number, left.case_number))
      }
    ];
  }

  incidentSubcategoryFilter(incident, selectedSubCategory) {
    return selectedSubCategory ? Number(incident.incident_subcategory) === Number(selectedSubCategory) : true;
  }

  incidentCategoryFilter(incident, selectedIncidentCategory) {
    return selectedIncidentCategory ? Number(incident.incident_category) === Number(selectedIncidentCategory) : true;
  }

  threatCategoryFilter(incident, selectedThreatCategory) {
    return selectedThreatCategory ? Number(incident.threat_category) === Number(selectedThreatCategory) : true;
  }

  syncStatusFilter(incident, selectedSyncStatuses = []) {
    if (selectedSyncStatuses.length === 0) {
      return true;
    }
    const eStatus = incident.unsynced ? 'unsynced' : 'synced';
    return selectedSyncStatuses.some(s => s === eStatus);
  }

  startDateFilter(incident, startDate) {
    return !startDate || new Date(incident.incident_date) > new Date(startDate);
  }

  endDateFilter(incident, endDate) {
    return !endDate || new Date(incident.incident_date) < new Date(endDate);
  }

  countryFilter(incident, selectedCountry) {
    return selectedCountry ? incident.country === Number(selectedCountry) : true;
  }

  targetFilter(incident, selectedTarget) {
    return selectedTarget ? Number(incident.target) === Number(selectedTarget) : true;
  }

  searchFilter(incident, q) {
    if (!q || q === '') {
      return true;
    }
    q = q.toLowerCase();
    return String(incident.city).toLowerCase().search(q) > -1 ||
          String(incident.status).toLowerCase().search(q) > -1 ||
          String(incident.description).toLowerCase().search(q) > -1 ||
          String(incident.case_number).toLowerCase().search(q) > -1 ||
          String(incident.incident_category_name).toLowerCase().search(q) > -1 ||
          String(incident.incident_subcategory_name).toLowerCase().search(q) > -1;
  }

  canEdit(status, unsynced, offline) {
    return (['created', 'rejected'].indexOf(status) > -1 && this.hasPermission('change_incident') && !offline) ||
           (unsynced && this.hasPermission('add_incident'));
  }

  _showSyncButton(unsynced, offline) {
    return !offline && unsynced && this.hasPermission('add_incident');
  }

  _handleCheckbox(e) {
    let incidentId = e.target.getAttribute('incident-id');
    if (e.target.checked === true) {
      this.push('incidentIds', JSON.parse(incidentId));
    }
    else {
      var index = this.incidentIds.indexOf(incidentId);
      this.splice('incidentIds', index, 1);
    }
    if (this.incidentIds.length === 0) {
      this.set('disabled', true);
    }
    else {
      this.set('disabled', false);
    }
  }
  _changeToDraft() {
    store.dispatch(saveMultipleIncidentsAsDraft(this.incidentIds.toString()));
    this.set('incidentIds', []);
    this.set('disabled', true);
   }


  _syncItem(incident) {
    if (!incident || !incident.model || !incident.model.__data || !incident.model.__data.item) {
      return;
    }

    let element = incident.model.__data.item;
    store.dispatch(syncIncidentOnList(element));
  }

  getIncidentSubcategory(id) {
    if (id) {
      let allSubCategories = [].concat(...this.staticData.incidentCategories.map(thing => thing.subcategories));
      let selectedDatum = allSubCategories.find(item => item.id === id);
      return selectedDatum.name;
    }
  }

  _getExportQueryString(docType) {
    return this.serializeFilters({
      incident_category: this.filters.values.incidentCategory,
      incident_subcategory: this.filters.values.incidentSubcategory,
      incident_date__gt: this.filters.values.startDate,
      incident_date__lt: this.filters.values.endDate,
      country: this.filters.values.country,
      q: this.filters.values.q,
      format: docType,
      target: this.filters.values.target,
      threat_category: this.filters.values.threatCategory
    });
  }

  getCountryName(id) {
    return getNameFromId(id, 'countries');
  }

  exportItem(e) {
    if (!e || !e.target || !e.detail || !e.detail.item) {
      return;
    }
    // reset selected item
    e.target.selected = null;

    let docType = e.detail.item.getAttribute('doc-type');
    let incidentId = e.detail.item.getAttribute('incident-id');

    store.dispatch(exportSingleIncident(incidentId, docType));
  }

  exportList(e) {
    if (!e || !e.target || !e.detail || !e.detail.item) {
      return;
    }
    // reset selected item
    e.target.selected = null;

    let docType = e.detail.item.getAttribute('doc-type');
    const csvQStr = this._getExportQueryString(docType);

    store.dispatch(exportIncidents(csvQStr, docType));
  }

  showNewIncidentTooltip(incident) {
    if (!incident.id || !this.state || !this.state.app || this.state.app.offilne) {
      return false;
    }

    let lastLogin = this.state.staticData.profile.last_login;
    return moment(incident.created_on).isAfter(moment(lastLogin));
  }

  showNewChangesTooltip(incident) {
    if (!incident.id || !this.state || !this.state.app || this.state.app.offilne) {
      return false;
    }

    let lastLogin = this.state.staticData.profile.last_login;
    let modifiedAfterLastLogin = moment(incident.last_modify_date).isAfter(moment(lastLogin));
    return modifiedAfterLastLogin && !this.showNewIncidentTooltip(incident);
  }

  showNewCommentsTooltip(incident) {
    if (!incident.id || !this.state || !this.state.app || this.state.app.offilne) {
      return false;
    }

    let lastLogin = this.state.staticData.profile.last_login;
    let allComments = this.state.incidents.comments;
    let newCommentsForIncident = allComments.filter((c) => {
      return Number(c.incident) === Number(incident.id) &&
            moment(c.created_on).isAfter(moment(lastLogin));
    });

    return newCommentsForIncident.length > 0;
  }
}

window.customElements.define('incidents-list', IncidentsList);
