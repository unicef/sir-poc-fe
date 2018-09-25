import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import 'etools-data-table/etools-data-table.js';
import 'etools-info-tooltip/etools-info-tooltip.js';

import '@polymer/iron-icons/editor-icons.js';
import '@polymer/iron-icons/notification-icons.js';

import { store } from '../../redux/store.js';
import { syncEventOnList } from '../../actions/events.js';
import { syncIncidentOnList } from '../../actions/incidents.js';
import { getNameFromId } from '../common/utils.js';
import DateMixin from '../common/date-mixin.js';
import '../styles/shared-styles.js';
import '../styles/grid-layout-styles.js';

export class DashboardList extends connect(store)(DateMixin(PolymerElement)) {
  static get template() {
    return html`
      <style include="shared-styles grid-layout-styles data-table-styles">
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

      <etools-data-table-header id="listHeader" no-title>
        <etools-data-table-column class="col-1">
          Case Number
        </etools-data-table-column>
        <etools-data-table-column class="col-3">
          Description
        </etools-data-table-column>
        <etools-data-table-column class="col-1">
          Case Type
        </etools-data-table-column>
        <etools-data-table-column class="col-1">
          Country
        </etools-data-table-column>
        <etools-data-table-column class="col-1">
          Status
        </etools-data-table-column>
        <etools-data-table-column class="col-2">
          Date created
        </etools-data-table-column>
        <etools-data-table-column class="col-1">
          Category
        </etools-data-table-column>
        <etools-data-table-column class="col-1">
          Subcategory
        </etools-data-table-column>
        <etools-data-table-column class="col-1">
          Actions
        </etools-data-table-column>
      </etools-data-table-header>

      <template id="rows" is="dom-repeat" items="[[cases]]">
        <etools-data-table-row unsynced$="[[item.unsynced]]">
          <div slot="row-data">
            <span class="col-data col-1" data-col-header-label="Case Number">
              <a href="/[[item.case_type]]s/view/[[item.id]]"> [[item.id]] </a>
            </span>
            <span class="col-data col-3" data-col-header-label="Description">
              [[briefDescription(item.description)]]
            </span>
            <span class="col-data col-1" data-col-header-label="Case type">
              [[_capitalizeString(item.case_type)]]
            </span>
            <span class="col-data col-1" data-col-header-label="Country">
              <template is="dom-if" if="[[!!item.location]]">
                [[item.location]]
              </template>
              <template is="dom-if" if="[[!!item.country]]">
                [[getNameFromId(item.country, 'countries')]]
              </template>
            </span>
            <span class="col-data col-1" data-col-header-label="Status">
              <template is="dom-if" if="[[!!item.status]]">
                [[_capitalizeString(item.status)]]
              </template>
              <template is="dom-if" if="[[!item.status]]">
                N/A
              </template>
            </span>
            <span class="col-data col-2" data-col-header-label="Date created">
              <template is="dom-if" if="[[!!item.creation_date]]">
                [[prettyDate(item.creation_date)]]
              </template>
              <template is="dom-if" if="[[!item.creation_date]]">
                N/A
              </template>
            </span>
            <span class="col-data col-1" data-col-header-label="Category">
              <template is="dom-if" if="[[!!item.incident_category]]">
                [[getNameFromId(item.incident_category, 'incidentCategories')]]
              </template>
              <template is="dom-if" if="[[!item.incident_category]]">
                N/A
              </template>
            </span>
            <span class="col-data col-1" data-col-header-label="Subcategory">
              <template is="dom-if" if="[[!!item.incident_subcategory]]">
                [[getIncidentSubcategory(item.incident_subcategory)]]
              </template>
              <template is="dom-if" if="[[!item.incident_subcategory]]">
                N/A
              </template>
            </span>
            <span class="col-data col-1" data-col-header-label="Actions">
              <template is="dom-if" if="[[checkStatus(item.status)]]">
                <a href="/[[item.case_type]]s/view/[[item.id]]">
                  <iron-icon icon="assignment" title="View [[item.case_type]]"></iron-icon>
                </a>
              </template>
              <template is="dom-if" if="[[!checkStatus(item.status)]]">
                <a href="/[[item.case_type]]s/edit/[[item.id]]"
                    title="Edit [[item.case_type]]"
                    hidden$="[[_notEditable(item, offline)]]">
                  <iron-icon icon="editor:mode-edit"></iron-icon>
                </a>
              </template>
              <template is="dom-if" if="[[_showSyncButton(item.unsynced, offline)]]">
                <etools-info-tooltip class="info" icon="notification:sync" open-on-click
                            title="Sync [[item.case_type]]"
                            class="sync-btn"
                            on-click="_syncItem">
                  <span slot="message">This [[item.case_type]] has not been sumitted to the server.
                                       Click to submit when an internet connection is availale.</span>
                </etools-info-tooltip>
              </template>
            </span>
          </div>
          <div slot="row-data-details">
            <template is="dom-if" if="[[_caseIs(item.case_type, 'event')]]">
              <div class="row-h flex-c">
                <div class="col col-12">
                  <strong> Location: </strong>
                  [[item.location]]
                </div>
              </div>
            </template>
            <template is="dom-if" if="[[_caseIs(item.case_type, 'incident')]]">
              <div class="row-h flex-c">
                <div class="col col-3">
                  <strong> Category: </strong>
                  [[getNameFromId(item.incident_category, 'incidentCategories')]]
                </div>
                <div class="col col-3">
                  <strong> Region: </strong>
                  [[getNameFromId(item.region, 'regions')]]
                </div>
                <div class="col col-3">
                  <strong> Country: </strong>
                  [[getNameFromId(item.country, 'countries')]]
                </div>
                <div class="col col-3">
                  <strong> Person: </strong>
                  [[item.primary_person.first_name]] [[item.primary_person.last_name]]
                </div>
              </div>
            </template>
          </div>
        </etools-data-table-row>
      </template>
    `;
  }

  static get is() {
    return 'dashboard-list';
  }

  static get properties() {
    return {
      events: Array,
      incidents: Array,
      offline: Boolean,
      cases: Array
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this.getNameFromId = getNameFromId;
  }

  _stateChanged(state) {
    if (!state) {
      return;
    }

    this.offline = state.app.offline;
    this.staticData = state.staticData;

    this.events = state.events.list.map((event) => {
      event.case_type = 'event';
      return event;
    });

    this.incidents = state.incidents.list.map((incident) => {
      incident.case_type = 'incident';
      return incident;
    });

    this.cases = [...this.events, ...this.incidents].sort((left, right) => {
      return moment.utc(right.last_modify_date).diff(moment.utc(left.last_modify_date));
    });
  }

  briefDescription(description) {
    return description.length > 100 ? description.slice(0, 100) + '...' : description;
  }

  getIncidentSubcategory(id) {
    if (id) {
      let allSubCategories = [].concat(...this.staticData.incidentCategories.map(thing => thing.subcategories));
      let selectedDatum = allSubCategories.find(item => item.id === id);
      return selectedDatum.name;
    }
  }

  checkStatus(status) {
    return status === 'approved';
  }

  _syncItem(item) {
    if (!item || !item.model || !item.model.__data || !item.model.__data.item) {
      return;
    }

    let element = item.model.__data.item;

    if (element.case_type === 'incident') {
      store.dispatch(syncIncidentOnList(element));
    }

    if (element.case_type === 'event') {
      store.dispatch(syncEventOnList(element));
    }
  }

  _capitalizeString(string) {
    if (string) {
      return string.charAt(0).toUpperCase() + string.substr(1);
    }
  }

  _notEditable(item, offline) {
    return offline && !item.unsynced;
  }

  _showSyncButton(unsynced, offline) {
    return unsynced && !offline;
  }

  _caseIs(givenType, expectedType) {
    return givenType === expectedType;
  }
}

window.customElements.define(DashboardList.is, DashboardList);
