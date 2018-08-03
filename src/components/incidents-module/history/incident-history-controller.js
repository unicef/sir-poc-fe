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

      <app-route
        route="{{route}}"
        pattern="/incidents/history/:incidentId/:section/:revisionId"
        data="{{routeData}}">
      </app-route>

      <iron-pages selected="[[routeData.section]]" attr-for-selected="name" role="main">
        <revisions-list name="list"
                        history="[[history]]">
        </revisions-list>
        <incident-diff  name="diff"
                        working-item="[[workingItem]]">
        </incident-diff>
        <incident-revision-view name="view"
                        working-item="[[workingItem]]">
        </incident-revision-view>
      </iron-pages>

      <div class="card" hidden$="[[pageIs('list', routeData.section)]]">
        <div class="row-h flex-c">
          <div class="col col-12">
            <paper-button raised on-tap="navigateToList"> back to changes list </paper-button>

            <paper-button hidden$="[[shouldHideViewChangesButton(workingItem.change, routeData.section)]]"
                          on-tap="navigateToDiff"
                          raised> view changes only </paper-button>

            <paper-button hidden$="[[pageIs('view', routeData.section)]]"
                          on-tap="navigateToView"
                          raised> view entire incident </paper-button>
          </div>
        </div>
      </div>
    `;
  }

  static get is() {
    return 'incident-history-controller';
  }

  static get properties() {
    return {
      incidentId: {
        type: Number,
        computed: '_setIncidentId(state.app.locationInfo.incidentId)',
        observer: '_idChanged'
      },
      workingItem: Object,
      routeData: Object,
      history: Object,
      route: Object,
      state: Object,
    };
  }


  static get observers() {
    return [
      '_routeChanged(routeData.section)',
      '_revisionIdChanged(routeData.revisionId, history)'
    ];
  }

  reset() {
    this.navigateToList();
  }

  navigateToList() {
    this.set('routeData.section', 'list');
  }

  navigateToView() {
    this.set('routeData.section', 'view');
  }

  navigateToDiff() {
    this.set('routeData.section', 'diff');
  }

  pageIs(loc) {
    return this.routeData.section === loc;
  }

  shouldHideViewChangesButton(change) {
    if (!change) {
      return true;
    }
    return this.pageIs('diff') || !this.hasChangedFilds(change);
  }

  _routeChanged(section, revId) {
    if (!section) {
      this.navigateToList();
    }
  }

  _revisionIdChanged(revId, history) {
    if (!revId || !history) {
      return;
    }
    let workingItem = history.find(item => item.id === Number(revId));
    this.set('workingItem', workingItem);
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
