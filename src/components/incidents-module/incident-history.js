/**
@license
*/
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import 'etools-data-table/etools-data-table.js';
import { store } from '../../redux/store.js';
import '../styles/shared-styles.js';
import '../styles/grid-layout-styles.js';
import './incident-diff.js';

import { makeRequest, prepareEndpoint } from '../common/request-helper.js';
import { Endpoints } from '../../config/endpoints.js';

export class IncidentHistory extends connect(store)(PolymerElement) {
  static get template() {
    return html`
      <style include="shared-styles grid-layout-styles data-table-styles">
        :host {
          @apply --layout-vertical;
        }
      </style>
      <div class="card">
        <h1> HISTORY </h1>
      </div>
      <div class="card list">
        <etools-data-table-header id="listHeader" label="History">
          <etools-data-table-column class="col-6">
            Change made by
          </etools-data-table-column>
          <etools-data-table-column class="col-6">
            Date and time
          </etools-data-table-column>
        </etools-data-table-header>

        <template id="rows" is="dom-repeat" items="[[history]]">
          <etools-data-table-row>
            <div slot="row-data">
              <span class="col-data col-6" data-col-header-label="Change made by">
                <span class="truncate">
                  <button on-click="showDetails"> Details </button>
                  [[item.by_user_display]]
                </span>
              </span>
              <span class="col-data col-6" data-col-header-label="Date and time">
                <span class="truncate">
                  [[item.modified]]
                </span>
              </span>
            </div>
            <div slot="row-data-details">
              <div class="col-6">
                <strong> Action: </strong>
                <span> [[item.action]] </span>
              </div>
              <div class="col-6">
                <strong> Fileds modified: </strong>
                <span> [[getChangedFileds(item.change)]] </span>
              </div>
            </div>
          </etools-data-table-row>
        </template>
      </div>

      <incident-diff id="diffElem"></incident-diff>
    `;
  }

  static get is() {
    return 'incident-history';
  }

  static get properties() {
    return {
      incidentId: {
        type: Number,
        computed: '_setIncidentId(state.app.locationInfo.incidentId)',
        observer: '_idChanged'
      },
      history: Object,
      state: Object,
    };
  }

  connectedCallback() {
    this.store = store;
    super.connectedCallback();
  }

  _setIncidentId(id) {
    return id;
  }

  _stateChanged(state) {
    this.set('state', state);
  }

  _idChanged(newId) {
    if (!this.state.app.offline && newId) {
      this._fetchHistory();
    }
  }

  _fetchHistory() {
    let endpoint = prepareEndpoint(Endpoints.getIncidentHistory, {id: this.incidentId});
    makeRequest(endpoint).then((response) => {
      this.history = JSON.parse(response);
    });
  }

  getChangedFileds(changesArr) {
    return Object.keys(changesArr).filter((change) => change !== 'version').join(', ');
  }

  showDetails(event) {
    let item = event.model.__data.item;
    this.$.diffElem.set('item', item);
  }

}

window.customElements.define(IncidentHistory.is, IncidentHistory);
