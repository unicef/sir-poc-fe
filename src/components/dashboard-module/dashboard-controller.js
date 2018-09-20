import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { store } from '../../redux/store.js';
import DateMixin from '../common/date-mixin.js';
import '../styles/shared-styles.js';
import '../styles/grid-layout-styles.js';
import '../common/datepicker-lite.js';
import './dashboard-list.js';

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
          font-size: 36px;
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
          <div class="col col-5 center-text">
            <div class="large-text"> [[filteredEvents.length]] </div>
            Events between [[prettyDate(selectedStartDate)]] and [[prettyDate(selectedEndDate)]]
          </div>
          <div class="col col-2"></div>
          <div class="col col-5 center-text">
            <div class="large-text"> [[filteredIncidents.length]] </div>
            Incidents between [[prettyDate(selectedStartDate)]] and [[prettyDate(selectedEndDate)]]
          </div>
        </div>

        <div class="row-h">
          <div class="col col-12 center-text">
            <p> Show stastistics between </p>
          </div>
        </div>

        <div class="row-h">

          <div class="col col-5">
            <datepicker-lite value="{{selectedStartDate}}">
            </datepicker-lite>
          </div>

          <div class="col col-2 center-text">
            <p> and </p>
          </div>

          <div class="col col-5">
            <datepicker-lite value="{{selectedEndDate}}">
            </datepicker-lite>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="row-h">
          <div class="col col-12">
            <dashboard-list></dashboard-list>
          </div>
        </div>
      </div>
    `;
  }

  static get is() {
    return 'dashboard-controller';
  }

  static get properties() {
    return {
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

    this.events = state.events.list;
    this.incidents = state.incidents.list;
    this.staticData = state.staticData;
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

}

window.customElements.define(DashboardController.is, DashboardController);
