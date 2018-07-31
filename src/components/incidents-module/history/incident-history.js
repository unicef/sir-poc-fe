/**
@license
*/
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '../../styles/shared-styles.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { store } from '../../../redux/store.js';

import './incident-diff.js';
import './revisions-list.js';

import { makeRequest, prepareEndpoint } from '../../common/request-helper.js';
import { Endpoints } from '../../../config/endpoints.js';

export class IncidentHistory extends connect(store)(PolymerElement) {
  static get template() {
    return html`
      <style include="shared-styles">
        :host {
          @apply --layout-vertical;
        }
      </style>

      <revisions-list hidden$="[[!diffElemHidden]]"
                      history="[[history]]"
                      working-item="{{workingItem}}"></revisions-list>
      <incident-diff id="diffElem"
                     hidden="{{diffElemHidden}}"
                     working-item="{{workingItem}}"></incident-diff>
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
      diffElemHidden: Boolean
    };
  }

  connectedCallback() {
    this.store = store;
    super.connectedCallback();
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
