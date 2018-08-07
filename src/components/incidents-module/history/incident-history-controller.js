/**
@license
*/
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-pages/iron-pages.js';
import '@polymer/app-route/app-route.js';

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
        pattern="/incidents/history/:incidentId/:section"
        data="{{routeData}}"
        tail="{{subRoute}}">
      </app-route>
      <app-route
        route="{{subRoute}}"
        pattern="/:revisionId"
        data="{{subRouteData}}">
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
      subRouteData: Object,
      routeData: Object,
      history: Object,
      route: Object,
      state: Object
    };
  }


  static get observers() {
    return [
      '_routeChanged(routeData.section)',
      '_revisionIdChanged(subRouteData.revisionId, history)'
    ];
  }

  reset() {
    this.navigateToList();
  }

  navigateToList() {
    this.set('routeData.section', 'list');
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
