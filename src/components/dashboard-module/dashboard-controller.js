import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import 'etools-date-time/datepicker-lite.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import ListCommonMixin from '../common/list-common-mixin.js';
import { store } from '../../redux/store.js';
import DateMixin from '../common/date-mixin.js';
import '@polymer/iron-collapse/iron-collapse.js';
import '@polymer/iron-icons/iron-icons.js';

import '@polymer/paper-button/paper-button.js';
import '../styles/shared-styles.js';
import '../styles/filters-styles.js';
import '../styles/grid-layout-styles.js';
import './dashboard-list.js';
// import { log } from 'util';

export class DashboardController extends connect(store)(DateMixin(ListCommonMixin(PolymerElement))) {
  static get template() {
    // language=HTML
    return html`
      <style include="shared-styles grid-layout-styles data-table-styles filters-styles">
        :host {
          @apply --layout-vertical;
        }

        .label {
          padding-top: 28px;
        }

        .center-text {
          justify-content: center;
        }

        .statistics-between {
          @apply --layout-horizontal;
          align-items: flex-end;
          font-size: 20px;
        }

        .date-input {
          margin: 0 24px;
        }

        @media screen and (max-width: 480px) {
          .statistics-between {
            @apply --layout-vertical;
            @apply --layout-center;
          }

          #statistics-between-and {
            position: relative;
            top: 12px;
          }
        }

      </style>

      <iron-media-query query="(max-width: 1024px)" query-matches="{{showToggleFiltersBtn}}"></iron-media-query>
      
      <div class="card">
        <iron-collapse id="collapse" opened>
          <div class="row-h">
            <div class="col col-12 statistics-between center-text">
              Displaying incidents between 
              <datepicker-lite class="date-input" value="{{selectedStartDate}}" 
                              max-date="[[toDate(selectedEndDate)]]"></datepicker-lite>
              <span id="statistics-between-and">and</span>
              <datepicker-lite class="date-input" value="{{selectedEndDate}}" 
                              min-date="[[toDate(selectedStartDate)]]"></datepicker-lite>
            </div>
          </div>
        </iron-collapse>

        <div class="filters-button" on-tap="_toggleFilters" hidden$="[[!showToggleFiltersBtn]]">
          <iron-icon id=toggleIcon icon="icons:expand-more"></iron-icon>
          DATE RANGE
        </div>
      </div>

      <div class="card">
        <div class="row-h">
          <div class="col col-12">
            <dashboard-list filtered-incidents=[[filteredIncidents]]></dashboard-list>
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

    this.incidents = state.incidents.list;
    this.staticData = state.staticData;
  }

  getIncidentsForPeriod(incidents, selectedStartDate, selectedEndDate) {
    let filteredIncidents = incidents.filter(
      incident => moment(incident.incident_date).isBetween(selectedStartDate, selectedEndDate, null, '[]')
    );

    return filteredIncidents;
  }

  checkSelection(date) {
    if (date) {
      return this.prettyDate(date);
    } else {
      return '---';
    }
  }
}

window.customElements.define(DashboardController.is, DashboardController);
