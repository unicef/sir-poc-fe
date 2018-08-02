/**
@license
*/
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-pages/iron-pages.js';

import { connect } from 'pwa-helpers/connect-mixin.js';
import { store } from '../../../redux/store.js';

import { makeRequest, prepareEndpoint } from '../../common/request-helper.js';
import { Endpoints } from '../../../config/endpoints.js';
import '../../styles/shared-styles.js';

import './incident-diff.js';
import './revisions-list.js';
import './incident-revision-view.js';
import HistoryHelpers from './history-helpers.js';

export class IncidentHistory extends HistoryHelpers(connect(store)(PolymerElement)) {
  static get template() {
    return html`
      <style include="shared-styles">
        :host {
          @apply --layout-vertical;
        }
      </style>

      <iron-pages selected="[[activePage]]" attr-for-selected="name" role="main">
        <revisions-list name="list"
                        history="[[history]]"
                        action="{{activePage}}"
                        working-item="{{workingItem}}">
        </revisions-list>
        <incident-diff  name="diff"
                        working-item="{{workingItem}}">
        </incident-diff>
        <incident-revision-view name="view"
                        working-item="{{workingItem}}">
        </incident-revision-view>
      </iron-pages>

      <div class="card" hidden$="[[activePageIs('list', activePage)]]">
        <div class="row-h flex-c">
          <div class="col col-12">
            <paper-button raised on-tap="navigateToList"> back to changes list </paper-button>

            <paper-button hidden$="[[hideViewChangesButton(activePage, workingItem.change)]]"
                          raised
                          on-tap="navigateToDiff"> view changes only </paper-button>

            <paper-button hidden$="[[activePageIs('view', activePage)]]"
                          raised
                          on-tap="navigateToView"> view entire incident </paper-button>
          </div>
        </div>
      </div>
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
      workingItem: {
        type: Object,
        observer: '_itemChanged'
      },
      history: Object,
      state: Object,
      activePage: {
        type: String,
        value: 'list'
      }
    };
  }

  connectedCallback() {
    this.store = store;
    super.connectedCallback();
  }

  navigateToList() {
    this.activePage = 'list';
  }

  navigateToView() {
    this.activePage = 'view';
  }

  navigateToDiff() {
    this.activePage = 'diff';
  }

  activePageIs(loc) {
    return this.activePage === loc;
  }

  hideViewChangesButton(activePage, change) {
    if (!change) {
      return true;
    }
    return this.activePageIs('diff', activePage) || !this.hasChangedFilds(change);
  }

  _itemChanged(neww, oldd) {
    // console.log('item changed', neww, oldd);
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

}

window.customElements.define(IncidentHistory.is, IncidentHistory);
