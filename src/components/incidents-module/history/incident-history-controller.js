/**
@license
*/
import { html } from '@polymer/polymer/polymer-element.js';
import { PermissionsBase } from '../../common/permissions-base-class';
import '@polymer/iron-pages/iron-pages.js';
import '@polymer/app-route/app-route.js';

import { connect } from 'pwa-helpers/connect-mixin.js';
import { store } from '../../../redux/store.js';

import { makeRequest, prepareEndpoint } from '../../common/request-helper.js';
import { selectIncidentComments } from '../../../reducers/incidents.js';
import { fetchImpactsHistory } from '../../../actions/incident-impacts.js';
import { Endpoints } from '../../../config/endpoints.js';
import '../../styles/shared-styles.js';

import HistoryHelpers from '../../history-components/history-helpers.js';
import '../../history-components/diff-view.js';
import './incident-revision-view.js';
import './incident-timeline.js';

export class IncidentHistory extends HistoryHelpers(connect(store)(PermissionsBase)) {
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
        <incident-timeline name="list"
                           comments="[[comments]]"
                           history="[[history]]">
        </incident-timeline>
        <diff-view name="diff"
                   module="incidents"
                   working-item="[[workingItem]]">
        </diff-view>
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
      visible: {
        type: Boolean,
        value: false,
        observer: '_visibilityChanged'
      },
      workingItem: Object,
      subRouteData: Object,
      routeData: Object,
      comments: Object,
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

  _visibilityChanged(newValue, oldValue) {
    let pageWasJustReloaded = typeof oldValue === 'undefined';
    if (newValue && !pageWasJustReloaded) {
      this.set('routeData.section', 'list');
    }
  }

  _routeChanged(section, revId) {
    if (!section) {
      this.set('routeData.section', 'list');
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
    this._fetchComments();
  }

  _idChanged(newId) {
    if (!this.state.app.offline && newId && !isNaN(newId)) {
      this._fetchHistory();
      this._fetchComments();
    }
  }

  _fetchComments() {
    this.comments = JSON.parse(JSON.stringify(selectIncidentComments(this.state))) || [];
  }

  async _fetchHistory() {
    let endpoint = prepareEndpoint(Endpoints.getIncidentHistory, {id: this.incidentId});
    let incidentHistory = await makeRequest(endpoint);
    let impactHistory  = await this.fetchImpactHistory();
    this.history = [...incidentHistory, ...impactHistory];
  }

  getImpactIds() {
    let premise = this.state.incidents.premises.filter(elem => '' + elem.incident_id === this.incidentId).map(elem => elem.id);
    let property = this.state.incidents.properties.filter(elem => '' + elem.incident_id === this.incidentId).map(elem => elem.id);
    let personnel = this.state.incidents.personnel.filter(elem => '' + elem.incident === this.incidentId).map(elem => elem.id);
    let programme = this.state.incidents.programmes.filter(elem => '' + elem.incident_id === this.incidentId).map(elem => elem.id);
    let evacuation = this.state.incidents.evacuations.filter(elem => '' + elem.incident_id === this.incidentId).map(elem => elem.id);

    return {premise, property, personnel, programme, evacuation};
  }

  fetchImpactHistory() {
    return store.dispatch(fetchImpactsHistory(this.getImpactIds()));
  }
}

window.customElements.define(IncidentHistory.is, IncidentHistory);
