/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-input/paper-input.js';
import {connect} from 'pwa-helpers/connect-mixin.js';
import {store} from '../store.js';

import 'etools-data-table/etools-data-table.js';
import '../styles/shared-styles.js';

class IncidentsList extends connect(store)(PolymerElement) {
  static get template() {
    // language=HTML
    return html`
      <style include="shared-styles data-table-styles">
        :host {
          display: block;
          padding: 10px;
        }

        a {
          text-decoration: none;
        }

        .col-4 {
          flex: 0 0 33.333333%;
          max-width: 33.333333%;
        }

        .col-6 {
          flex: 0 0 50%;
          max-width: 50%;
        }

      </style>

      <div class="card filters">
        <paper-input class="search-input" 
                     no-label-float placeholder="Search by Person Involved, City or Description" 
                     value="{{q}}">
          <iron-icon icon="search" slot="prefix"></iron-icon>
        </paper-input>
      </div>

      <div class="card list">
        <etools-data-table-header id="listHeader"
                                  label="Incidents">
          <etools-data-table-column class="col-4">
            Person involved
          </etools-data-table-column>
          <etools-data-table-column class="col-4">
            City
          </etools-data-table-column>
          <etools-data-table-column class="col-4">
            Incident Type
          </etools-data-table-column>
        </etools-data-table-header>

        <template id="rows" is="dom-repeat" items="[[filteredIncidents]]">
          <etools-data-table-row>
            <div slot="row-data" style="display:flex; flex-direction: row;">
                <span class="col-4 ">
                  <a href="/incidents/view/[[item.id]]">
                    [[item.primary_person.first_name]] [[item.primary_person.last_name]]
                  </a>
                </span>
              <span class="col-4">
                  <span class="truncate">[[item.city]]</span>
                </span>
              <span class="col-4">
                  <span class="truncate">[[_getIncidentName(item.incident_type)]]</span>
                </span>
            </div>
            <div slot="row-data-details">
              <div class="col-6">
                <strong>Description:</strong>
                <span>[[item.description]]</span>
              </div>
              <div class="col-6">
                <strong>Note: </strong>
                <span>[[item.note]]</span>
              </div>

            </div>
          </etools-data-table-row>
        </template>

        <etools-data-table-footer id="footer" page-size="[[pageSize]]" page-number="[[pageNumber]]"
                                  total-results="[[incidents.length]]" visible-range="{{visibleRange}}">
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
      incidentTypes: Array,
      q: String,
      filteredIncidents: {
        type: Array,
        computed: '_filterData(incidents, q)'
      }
    };
  }

  _stateChanged(state) {
    this.incidents = state.incidents.incidents;
    this.incidentTypes = state.staticData.incidentTypes;
  }

  _getIncidentName(incidentType) {
    let incident = this.incidentTypes.find(e => e.id === incidentType) || {};
    return incident.name || 'Not Specified';
  }

  _filterData(incidents, q) {
    let filteredIncidents = incidents ? JSON.parse(JSON.stringify(incidents)) : [];
    if (incidents instanceof Array && incidents.length > 0 && typeof q === 'string' && q !== '') {
      filteredIncidents = filteredIncidents.filter(e => this._applyQFilter(e, q));
    }
    return filteredIncidents;
  }

  _applyQFilter(e, q) {
    let person = (e.primary_person.first_name + ' ' + e.primary_person.last_name).trim();
    return person.toLowerCase().search(q) > -1 ||
        String(e.city).toLowerCase().search(q) > -1 ||
        String(e.description).toLowerCase().search(q) > -1;
  }

}

window.customElements.define('incidents-list', IncidentsList);
