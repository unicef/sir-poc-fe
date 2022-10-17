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

import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-menu-button/paper-menu-button.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/iron-media-query/iron-media-query.js';

import '@unicef-polymer/etools-data-table/etools-data-table.js';
import { store } from '../../redux/store.js';
import {
  fetchReportingUser
} from '../../actions/reporting.js';
import { getCountriesForRegion } from '../common/utils.js';

import '../styles/shared-styles.js';
import '../styles/form-fields-styles.js';
import '../styles/grid-layout-styles.js';
import '../styles/filters-styles.js';


class ReportingList extends connect(store)(ListBaseClass) {
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

  
        .capitalize {
          text-transform: capitalize;
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
          <etools-dropdown class="filter select"
            enable-none-option
            label="Please Select Region"
            option-label="name"
            option-value="id"
            options="[[staticData.regions]]"
            selected="{{selectedRegionId}}"
          >
          </etools-dropdown>

          <etools-dropdown class="filter select"
            enable-none-option
            label="Please Select Country"
            option-label="name"
            option-value="id"
            options="[[getCountriesForRegion(selectedRegionId, staticData.countries)]]"
            selected="{{selectedId}}"
            disabled$="[[!selectedRegionId]]"
          >
        </etools-dropdown>
          </div>
        </iron-collapse>

        <div class="filters-button" on-tap="_toggleFilters" hidden$="[[!showToggleFiltersBtn]]">
          <iron-icon id=toggleIcon icon="icons:expand-more"></iron-icon>
          FILTERS
        </div>
      </div>


      <template id="rows" is="dom-repeat" items="[[selectedId]]">
      <div class="card list">
        <div class="row-h">
          <span class="col-9">
            <h3> Reporting Users </h3>
          </span>
        </div>


        <div>
        <etools-data-table-header no-collapse id="listHeader"
                                  no-title
                                  low-resolution-layout="[[lowResolutionLayout]]">
          <etools-data-table-column class="col-12">
           Name
          </etools-data-table-column>
        </etools-data-table-header>

        
        <template id="rows" is="dom-repeat" items="[[reportingUsers]]">
          <etools-data-table-row no-collapse id="listHeader"  
                                  no-title 
                                  low-resolution-layout="[[lowResolutionLayout]]" class="p-relative">
            <div slot="row-data" class="p-relative flex-c">
              <span class="col-data col-12" data-col-header-label="Name">
              [[item.display_name]]
              </span>
            </div>
          </etools-data-table-row>
       </template>
      </div>
      </template>
    `;
  }
  static get properties() {
    return {
      staticData: Object,
      reportingUsers: Array,
      selectedId: {
        type: Number,
        value: null,
        observer: 'selectedCountry'
      },
      selectedRegionId: {
        type: Number,
        value: null
      },
      getCountriesForRegion: {
        type: Function,
        value: () => getCountriesForRegion
      }
    };
  }
   selectedCountry() {
    if (this.selectedId !== null) {
    store.dispatch(fetchReportingUser(this.selectedId));
    }
    return false;
   }

  _stateChanged(state) {
    this.set('reportingUsers', state.reporting.list);
    if (state && state.app) {
      this.isOffline = state.app.offline;
    }
    this.staticData = state.staticData;
  }
}


window.customElements.define('reporting-list', ReportingList);
