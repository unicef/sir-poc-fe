import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-icons/editor-icons.js';
import '@polymer/iron-icons/notification-icons.js';
import '@polymer/iron-media-query/iron-media-query.js';

import { connect } from 'pwa-helpers/connect-mixin.js';
import 'etools-data-table/etools-data-table.js';
import 'etools-info-tooltip/etools-info-tooltip.js';

import { store } from '../../redux/store.js';
import { syncEventOnList } from '../../actions/events.js';
import { syncIncidentOnList } from '../../actions/incidents.js';
import { getNameFromId } from '../common/utils.js';
import DateMixin from '../common/date-mixin.js';
import '../styles/shared-styles.js';
import '../styles/grid-layout-styles.js';
import moment from 'moment';

export class DashboardList extends connect(store)(DateMixin(PolymerElement)) {
  static get template() {
    // language=HTML
    return html`
      <style include="shared-styles grid-layout-styles data-table-styles">
        
        .col-data iron-icon {
          margin-right: 8px;
        }

        .sync-btn {
          color: var(--primary-color);
          cursor: pointer;
        }

        .capitalize {
          text-transform: capitalize;
        }

        .case-det-desc,
        .case-det-loc {
          display: block;
        }

        etools-data-table-row[created-last-week]:not([unsynced]) {
          --list-bg-color: #fff3cd;
        }

        etools-data-table-row[low-resolution-layout] etools-info-tooltip {
          display: inherit;
        }

        @media only screen and (max-width: 900px) {
          etools-data-table-row[medium-resolution-layout] *[slot="row-data-details"] .case-det-desc,
          etools-data-table-row[medium-resolution-layout] *[slot="row-data-details"] .case-det-loc {
            padding-top: 8px;
            padding-bottom: 8px;
          }
        }
      </style>

      <iron-media-query query="(max-width: 767px)" query-matches="{{lowResolutionLayout}}"></iron-media-query>
      <iron-media-query query="(min-width: 768px) and (max-width: 1024px)"
                        query-matches="{{mediumResolutionLayout}}"></iron-media-query>

      <etools-data-table-header id="listHeader" label="Cases"
                                low-resolution-layout="[[lowResolutionLayout]]"
                                medium-resolution-layout="[[mediumResolutionLayout]]">
        <etools-data-table-column class="col-1">
          Case Number
        </etools-data-table-column>
        <etools-data-table-column class="col-1">
          Case Type
        </etools-data-table-column>
        <etools-data-table-column class="col-2">
          Country
        </etools-data-table-column>
        <etools-data-table-column class="col-1">
          Status
        </etools-data-table-column>
        <etools-data-table-column class="col-2">
          Date created
        </etools-data-table-column>
        <etools-data-table-column class="col-2">
          Category
        </etools-data-table-column>
        <etools-data-table-column class="col-2">
          Subcategory
        </etools-data-table-column>
        <etools-data-table-column class="col-1">
          Actions
        </etools-data-table-column>
      </etools-data-table-header>

      <template id="rows" is="dom-repeat" items="[[cases]]">
        <etools-data-table-row unsynced$="[[item.unsynced]]"
                               low-resolution-layout="[[lowResolutionLayout]]"
                               medium-resolution-layout="[[mediumResolutionLayout]]"
                               created-last-week$="[[wasCreatedLastWeek(item)]]">
          <div slot="row-data" class="p-relative">
            <span class="col-data col-1" data-col-header-label="Case Number">
              <a href="/[[item.case_type]]s/view/[[item.id]]"> [[item.id]] </a>
            </span>
            <span class="col-data col-1 capitalize" data-col-header-label="Case type">
              [[item.case_type]]
            </span>
            <span class="col-data col-2" data-col-header-label="Country">
              <template is="dom-if" if="[[item.location]]">
                [[item.location]]
              </template>
              <template is="dom-if" if="[[item.country]]">
                [[getNameFromId(item.country, 'countries')]]
              </template>
            </span>
            <span class="col-data col-1 capitalize" data-col-header-label="Status">
              <template is="dom-if" if="[[item.status]]">
                [[item.status]]
              </template>
              <template is="dom-if" if="[[!item.status]]">
                N/A
              </template>
              <template is="dom-if" if="[[_showSyncButton(item.unsynced, offline)]]">
                <etools-info-tooltip class="info" open-on-click>
                  <span slot="message">
                    This [[item.case_type]] has not been submitted to the server.
                    Click the sync button when online to submit it.
                  </span>
                </etools-info-tooltip>
              </template>
            </span>
            <span class="col-data col-2" data-col-header-label="Date created">
              <template is="dom-if" if="[[item.creation_date]]">
                [[prettyDate(item.creation_date)]]
              </template>
              <template is="dom-if" if="[[!item.creation_date]]">
                N/A
              </template>
            </span>
            <span class="col-data col-2" data-col-header-label="Category">
              <template is="dom-if" if="[[item.incident_category]]">
                [[getNameFromId(item.incident_category, 'incidentCategories')]]
              </template>
              <template is="dom-if" if="[[!item.incident_category]]">
                N/A
              </template>
            </span>
            <span class="col-data col-2" data-col-header-label="Subcategory">
              <template is="dom-if" if="[[item.incident_subcategory]]">
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
                <iron-icon icon="notification:sync" title="Sync Event" class="sync-btn"
                            on-click="_syncItem">
                </iron-icon>
              </template>
            </span>
          </div>
          <div slot="row-data-details">
            <div class="row-details-content flex-c">
              <div class="row-h flex-c case-det case-det-desc">
                <strong class="rdc-title inline">Description: </strong>[[item.description]]
              </div>
              <template is="dom-if" if="[[_caseIs(item.case_type, 'event')]]">
                <div class="row-h flex-c case-det case-det-loc">
                  <strong class="rdc-title inline">Location: </strong>[[item.location]]
                </div>
              </template>
              <template is="dom-if" if="[[_caseIs(item.case_type, 'incident')]]">
                <div class="row-h flex-c case-det">
                  <div class="col col-3">
                    <strong class="rdc-title inline">Category: </strong>
                    [[getNameFromId(item.incident_category, 'incidentCategories')]]
                  </div>
                  <div class="col col-3">
                    <strong class="rdc-title inline">Region: </strong>
                    [[getNameFromId(item.region, 'regions')]]
                  </div>
                  <div class="col col-3">
                    <strong class="rdc-title inline">Country: </strong>
                    [[getNameFromId(item.country, 'countries')]]
                  </div>
                  <div class="col col-3">
                    <strong class="rdc-title inline">Person: </strong>
                    [[item.primary_person.first_name]] [[item.primary_person.last_name]]
                  </div>
                </div>
              </template>
            </div>
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
      cases: Array,
      lowResolutionLayout: Boolean,
      mediumResolutionLayout: Boolean
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

  wasCreatedLastWeek(item) {
    const date = new Date();
    const lastWeek = date.getDate() - 7;

    const createdDate = item.case_type === 'event' ? item.start_date : item.creation_date;
    return moment(createdDate).isAfter(moment().add(-7, 'days'));
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
