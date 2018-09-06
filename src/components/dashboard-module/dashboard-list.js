import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import 'etools-data-table/etools-data-table.js';
import 'etools-info-tooltip/etools-info-tooltip.js';

import '@polymer/iron-icons/editor-icons.js';
import '@polymer/iron-icons/notification-icons.js';

import { store } from '../../redux/store.js';
import { syncEventOnList } from '../../actions/events.js';
import { syncIncidentOnList } from '../../actions/incidents.js';
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
        <etools-data-table-column class="col-2">
          Case number
        </etools-data-table-column>
        <etools-data-table-column class="col-2">
          Case type
        </etools-data-table-column>
        <etools-data-table-column class="col-2">
          Status
        </etools-data-table-column>
        <etools-data-table-column class="col-2">
          Date created
        </etools-data-table-column>
        <etools-data-table-column class="col-2">
          Date edited
        </etools-data-table-column>
        <etools-data-table-column class="col-2">
          Actions
        </etools-data-table-column>
      </etools-data-table-header>

      <template id="rows" is="dom-repeat" items="[[cases]]">
        <etools-data-table-row unsynced$="[[item.unsynced]]">
          <div slot="row-data">
            <span class="col-data col-2" data-col-header-label="Case number">
              <a href="/[[item.case_type]]s/view/[[item.id]]"> N/A </a>
            </span>
            <span class="col-data col-2" data-col-header-label="Case type">
              [[item.case_type]]
            </span>
            <span class="col-data col-2" data-col-header-label="Status">
              <template is="dom-if" if="[[!item.unsynced]]">
                Synced
              </template>
              <template is="dom-if" if="[[item.unsynced]]">
                <etools-info-tooltip class="info" open-on-click>
                  <span slot="field">Not Synced</span>
                  <span slot="message">This [[item.case_type]] has not been sumitted to the server. Go to its edit page
                    and save it when an internet connection is availale.</span>
                </etools-info-tooltip>
              </template>
            </span>
            <span class="col-data col-2" data-col-header-label="Date created">
              [[prettyDate(item.submitted_date)]]
            </span>
            <span class="col-data col-2" data-col-header-label="Date edited">
              [[prettyDate(item.last_modify_date)]]
            </span>
            <span class="col-data col-2" data-col-header-label="Actions">
              <a href="/[[item.case_type]]s/view/[[item.id]]">
                <iron-icon icon="assignment" title="View [[item.case_type]]"></iron-icon>
              </a>
              <a href="/[[item.case_type]]s/edit/[[item.id]]" title="Edit [[item.case_type]]" hidden$="[[_notEditable(item, offline)]]">
                <iron-icon icon="editor:mode-edit"></iron-icon>
              </a>
              <template is="dom-if" if="[[_showSyncButton(item.unsynced, offline)]]">
                <div> <!-- this div prevents resizing of the icon on low resolutions -->
                  <iron-icon icon="notification:sync" title="Sync [[item.case_type]]" class="sync-btn" on-click="_syncItem"></iron-icon>
                </div>
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
    };
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
      return moment.utc(left.last_modify_date).diff(moment.utc(right.last_modify_date));
    });
  }

  getNameFromId(id, staticDataKey) {
    let result = this.staticData[staticDataKey].find(v => v.id === Number(id));
    return result.name || '';
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
