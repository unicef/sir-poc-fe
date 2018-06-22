/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import 'etools-data-table/etools-data-table.js'
import { makeRequest } from '../common/request-helper.js';
import '../styles/shared-styles.js';

class EventsList extends PolymerElement {
  static get template() {
    return html`
      <style include="shared-styles">
        :host {
          display: block;

          padding: 10px;
        }

        .shortText, .longText {
          font-size: 14px;
        }

        .longText {
          color: gray;
          display: none;
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

      <div class="card">
        <etools-data-table-header id="listHeader"
                                  label="Some results to show">
          <etools-data-table-column class="col-4" field="startDate" sortable="">
            Start Date
          </etools-data-table-column>
          <etools-data-table-column class="col-4" field="endDate" sortable="">
            End Date
          </etools-data-table-column>
          <etools-data-table-column class="col-4" field="location">
            Location
          </etools-data-table-column>
        </etools-data-table-header>

        <template id="rows" is="dom-repeat" items="[[events]]">
          <etools-data-table-row>
            <div slot="row-data" style="display:flex; flex-direction: row;">
                <span class="col-4 ">
                    [[item.startDate]]
                </span>
                <span class="col-4" title="[[item.endDate]]">
                  <span class="truncate"> [[item.location]] </span>
                </span>
            </div>
            <div slot="row-data-details">
              <div class="col-6">
                <span>description</span>
                <span>[[item.description]]</span>
              </div>
              <div class="col-6">
                <span>note</span>
                <span>[[item.note]]</span>
              </div>

            </div>
          </etools-data-table-row>
        </template>

        <etools-data-table-footer id="footer" page-size="[[pageSize]]" page-number="[[pageNumber]]"
                                  total-results="[[totalResults]]" visible-range="{{visibleRange}}">
        </etools-data-table-footer>
      </div>
    `;
  }

  static get properties() {
    return {
      getEventsEndpointName: {
        type: String,
        value: 'eventsList'
      },
      events: {
        type: Object,
        value: []
      }
    };
  }

  connectedCallback() {
    super.connectedCallback();
    makeRequest(this.getEventsEndpointName).then((result) => {
      this.set('events', JSON.parse(result));
    });
  }

}

window.customElements.define('events-list', EventsList);
