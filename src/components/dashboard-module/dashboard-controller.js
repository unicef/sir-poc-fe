import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import 'etools-data-table/etools-data-table.js';
import 'etools-info-tooltip/etools-info-tooltip.js';

import '../common/etools-dropdown/etools-dropdown-lite.js';
import { store } from '../../redux/store.js';
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
      </style>

      <div class="card">
        <div class="row-h">
          <div class="col col-4">
            <etools-dropdown-lite label="Active user"
                                  trigger-value-change-event
                                  on-etools-selected-item-changed="_userSelected"
                                  options="[[users]]">
            </etools-dropdown-lite>
          </div>
        </div>
      </div>
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
              <div class="col col-6">
                <etools-data-table-header id="listHeader" label="Your Events" no-collapse>
                  <etools-data-table-column class="col-6">
                    Description
                  </etools-data-table-column>
                  <etools-data-table-column class="col-1">
                  </etools-data-table-column>
                  <etools-data-table-column class="col-5">
                    Start date
                  </etools-data-table-column>
                </etools-data-table-header>

                <template id="rows" is="dom-repeat" items="[[userEvents]]">

                  <etools-data-table-row unsynced$="[[item.unsynced]]" no-collapse>
                    <div slot="row-data">
                      <span class="col-data col-6" data-col-header-label="Description">
                        <a href="/events/view/[[item.id]]"> [[item.description]] </a>
                      </span>
                      <span class="col-data col-1">
                        <template is="dom-if" if="[[item.unsynced]]">
                          <etools-info-tooltip class="info" open-on-click>
                            <span slot="message">This event has not been sumitted to the server. Go to its edit page
                              and save it when an internet connection is availale.</span>
                          </etools-info-tooltip>
                        </template>
                      </span>
                      <span class="col-data col-5" data-col-header-label="Start date">
                        [[prettyDate(item.start_date)]]
                      </span>
                    </div>
                  </etools-data-table-row>

                </template>
              </div>
              <div class="col col-6">
                <etools-data-table-header id="listHeader" label="Your Incidents" no-collapse>
                  <etools-data-table-column class="col-6">
                    Description
                  </etools-data-table-column>
                  <etools-data-table-column class="col-1">
                  </etools-data-table-column>
                  <etools-data-table-column class="col-5">
                    Start date
                  </etools-data-table-column>
                </etools-data-table-header>

                <template id="rows" is="dom-repeat" items="[[userIncidents]]">

                  <etools-data-table-row unsynced$="[[item.unsynced]]" no-collapse>
                    <div slot="row-data">
                      <span class="col-data col-6" data-col-header-label="Description">
                        <a href="/incidents/view/[[item.id]]"> [[item.description]] </a>
                      </span>
                      <span class="col-data col-1">
                        <template is="dom-if" if="[[item.unsynced]]">
                          <etools-info-tooltip class="info" open-on-click>
                            <span slot="message">This incident has not been sumitted to the server. Go to its edit page
                              and save it when an internet connection is availale.</span>
                          </etools-info-tooltip>
                        </template>
                      </span>
                      <span class="col-data col-5" data-col-header-label="Start date">
                         [[prettyDate(item.incident_date)]]
                      </span>
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
      userEvents: Array,
      userIncidents: Array,
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
      },
    };
  }

  _stateChanged(state) {
    if (!state) {
      return;
    }

    this.events = state.events.list;
    this.incidents = state.incidents.list;
    this.users = state.staticData.users.map((elem) => {
      elem.name = elem.first_name + ' ' + elem.last_name;
      return elem;
    });

    this.updateUserListsData();
  }

  getEventsForPeriod(events, selectedStartDate, selectedEndDate) {
    let filteredEvents = events.filter((event) => {
      let evStart = moment(event.start_date);
      let evEnd = moment(event.end_date);

      let cond1 = evStart.isBetween(selectedStartDate, selectedEndDate);
      let cond2 = evEnd.isBetween(selectedStartDate, selectedEndDate);

      return cond1 || cond2;
    });

    return filteredEvents;
  }

  getIncidentsForPeriod(incidents, selectedStartDate, selectedEndDate) {
    let filteredIncidents = incidents.filter((incident) => {
      return moment(incident.incident_date).isBetween(selectedStartDate, selectedEndDate);
    });

    return filteredIncidents;
  }

  _userSelected(event) {
    if (!event.detail.selectedItem) {
      return;
    }
    this.activeUser = event.detail.selectedItem;
    this.updateUserListsData();
  }

  updateUserListsData() {
    this.userEvents = this.events.filter((e) => {
      return !this.activeUser.id || e.submitted_by === this.activeUser.id;
    });
    this.userIncidents = this.incidents.filter((e) => {
      return !this.activeUser.id || e.submitted_by === this.activeUser.id;
    });
  }
}

window.customElements.define(DashboardController.is, DashboardController);
