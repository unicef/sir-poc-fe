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
import '../common/datepicker-lite.js';

export class DashboardController extends connect(store)(DateMixin(PolymerElement)) {
  static get template() {
    return html`
      <style include="shared-styles grid-layout-styles data-table-styles">
        :host {
          @apply --layout-vertical;
        }
        .label {
          padding-top: 28px;
        }
        .large-text {
          width: 100%;
          font-size: 72px;
        }
        .center-text {
          text-align: center;
        }
        datepicker-lite {
          --paper-input-container-shared-input-style: {
            text-align: center;
            width: calc(100% + 32px);
          }
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

      <div class="card">
        <div class="row-h flex-c">
          <div class="col-12">
            <div class="row-h">
              <div class="col col-6 center-text">
                <div class="large-text"> [[filteredEvents.length]] </div>
                Events between [[prettyDate(selectedStartDate)]] and [[prettyDate(selectedEndDate)]]
              </div>
              <div class="col col-6 center-text">
                <div class="large-text"> [[filteredIncidents.length]] </div>
                Incidents between [[prettyDate(selectedStartDate)]] and [[prettyDate(selectedEndDate)]]
              </div>
            </div>


            <div class="row-h">
              <div class="col col-4"> </div>
              <div class="col col-4">
                <div class="center-text">
                  <p> Show stastistics between </p>
                </div>

                <div class="center-text">
                  <datepicker-lite value="{{selectedStartDate}}">
                  </datepicker-lite>
                </div>

                <div class="center-text">
                  <p> and </p>
                </div>

                <div class="center-text">
                  <datepicker-lite value="{{selectedEndDate}}">
                  </datepicker-lite>
                </div>
              </div>
              <div class="col col-4"> </div>
            </div>

            <div class="row-h">
              <div class="col col-12">
                <etools-data-table-header id="listHeader" label="Your Cases">
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
                      <span class="col-data col-2" class="Date edited">
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
                      <div class="row" hidden$="[[!_caseIs(item.case_type, 'event')]]">
                        <p> I am an event </p>
                      </div>
                      <div class="row" hidden$="[[!_caseIs(item.case_type, 'incident')]]">
                        <p> I am an incident </p>
                      </div>
                    </div>
                  </etools-data-table-row>
                </template>
              </div>
            </div>
          </div>
        </template>
      </div>
    `;
  }

  static get is() {
    return 'dashboard-controller';
  }

  static get properties() {
    return {
      events: Array,
      incidents: Array,
      offline: Boolean,
      activeUser: {
        type: Object,
        value: {}
      },
      selectedEndDate: {
        type: String,
        value: () => {
          return moment().format('YYYY-MM-DD');
        }
      },
      selectedStartDate: {
        type: String,
        value: () => {
          return moment().subtract(1, 'years').format('YYYY-MM-DD');
        }
      },
      filteredEvents: {
        type: Array,
        computed: 'getEventsForPeriod(events, selectedStartDate, selectedEndDate)'
      },
      filteredIncidents: {
        type: Array,
        computed: 'getIncidentsForPeriod(incidents, selectedStartDate, selectedEndDate)'
      }
    };
  }

  _stateChanged(state) {
    if (!state) {
      return;
    }

    this.offline = !!state.app.offline;

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

  getEventsForPeriod(events, selectedStartDate, selectedEndDate) {
    let filteredEvents = events.filter((event) => {
      let evStart = moment(event.start_date);
      let evEnd = moment(event.end_date);

      let cond1 = evStart.isBetween(selectedStartDate, selectedEndDate, null, '[]');
      let cond2 = evEnd.isBetween(selectedStartDate, selectedEndDate, null, '[]');

      return cond1 || cond2;
    });

    return filteredEvents;
  }

  getIncidentsForPeriod(incidents, selectedStartDate, selectedEndDate) {
    let filteredIncidents = incidents.filter((incident) => {
      return moment(incident.incident_date).isBetween(selectedStartDate, selectedEndDate, null, '[]');
    });

    return filteredIncidents;
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

window.customElements.define(DashboardController.is, DashboardController);
