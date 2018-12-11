/**
@license
*/
import { html } from '@polymer/polymer/polymer-element.js';
import { PermissionsBase } from '../../common/permissions-base-class';
import '@polymer/iron-pages/iron-pages.js';
import '@polymer/app-route/app-route.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-icons/iron-icons.js';

import { connect } from 'pwa-helpers/connect-mixin.js';
import { store } from '../../../redux/store.js';

import { selectIncidentComments } from '../../../reducers/incidents.js';
import { fetchHistoryOfImpacts } from '../../../actions/incident-impacts.js';
import { fetchIncidentHistory } from '../../../actions/incidents.js';
import '../../styles/shared-styles.js';
import '../../styles/button-styles.js';

import HistoryHelpers from '../../history-components/history-helpers.js';

import './revision-view-elements/incident-diff-view.js';
import './revision-view-elements/incident-revision-view.js';

import './revision-view-elements/non-un-personnel-revision-view.js';
import './revision-view-elements/un-personnel-revision-view.js';
import './revision-view-elements/evacuation-revision-view.js';
import './revision-view-elements/programme-revision-view.js';
import './revision-view-elements/property-revision-view.js';
import './revision-view-elements/premise-revision-view.js';

import './incident-timeline.js';

export class IncidentHistory extends HistoryHelpers(connect(store)(PermissionsBase)) {
  static get template() {
    return html`
      <style include="shared-styles button-styles">
        :host {
          @apply --layout-vertical;
        }

        #refreshHistoryBtn {
          float: right;
        }

        #top-container {
          padding-bottom: 32px;
          padding-right: 24px;
          padding-top: 8px;
        }

        @media screen and (max-width: 767px) {
          #top-container {
            padding-right: 16px;
          }
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
          <div slot="topSection" id="top-container">
            <paper-button id="refreshHistoryBtn"
                          raised
                          on-tap="_refreshHistory"
                          class="white no-t-transform">
              <iron-icon icon="autorenew">
              </iron-icon>
              Refresh history
            </paper-button>
          </div>
        </incident-timeline>

        <incident-diff-view view-url="view-incident"
                            name="diff-incident"
                            working-item="[[workingItem]]">
        </incident-diff-view>

        <incident-revision-view name="view-incident"
                                working-item="[[workingItem]]">
        </incident-revision-view>

        <incident-diff-view view-url="view-evacuation"
                            name="diff-evacuation"
                            working-item="[[workingItem]]">
        </incident-diff-view>

        <evacuation-revision-view name="view-evacuation"
                                  working-item="[[workingItem]]">
        </evacuation-revision-view>

        <incident-diff-view view-url="view-property"
                            name="diff-property"
                            working-item="[[workingItem]]">
        </incident-diff-view>

        <property-revision-view name="view-property"
                                working-item="[[workingItem]]">
        </property-revision-view>

        <incident-diff-view view-url="view-premise"
                            name="diff-premise"
                            working-item="[[workingItem]]">
        </incident-diff-view>

        <premise-revision-view name="view-premise"
                               working-item="[[workingItem]]">
        </premise-revision-view>

        <incident-diff-view view-url="view-programme"
                            name="diff-programme"
                            working-item="[[workingItem]]">
        </incident-diff-view>

        <programme-revision-view name="view-programme"
                                 working-item="[[workingItem]]">
        </programme-revision-view>

        <incident-diff-view view-url="view-personnel"
                            name="diff-personnel"
                            working-item="[[workingItem]]">
        </incident-diff-view>

        <div name="view-personnel">
          <template is="dom-if" if="[[personnelIsUn(workingItem)]]">
            <un-personnel-revision-view working-item="[[workingItem]]">
            </un-personnel-revision-view>
          </template>
          <template is="dom-if" if="[[!personnelIsUn(workingItem)]]">
            <non-un-personnel-revision-view working-item="[[workingItem]]">
            </un-personnel-revision-view>
          </template>
        </div>
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
      '_computeWorkingItem(subRouteData.revisionId, history, subRouteData.subsection)'
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

  _getWorkingSectionFromRoute() {
    // turns diff-x and view-x into x
    return this.routeData.section.substr(5);
  }

  _computeWorkingItem(revId, history, routeSection) {
    if (!revId || !history) {
      return;
    }

    let section = this._getWorkingSectionFromRoute();

    let workingItem = history.find((item) => {
      switch (section) {
        case 'incident':
          return !item.impact_type && Number(item.id) === Number(revId);

        case 'evacuation':
          return item.impact_type === 'evacuation' && Number(item.id) === Number(revId);

        case 'property':
          return item.impact_type === 'property' && Number(item.id) === Number(revId);

        case 'premise':
          return item.impact_type === 'premise' && Number(item.id) === Number(revId);

        case 'programme':
          return item.impact_type === 'programme' && Number(item.id) === Number(revId);

        case 'personnel':
          return item.impact_type === 'personnel' && Number(item.id) === Number(revId);

        default:
          return false;
      }
    });

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

  _refreshHistory() {
    let btn = this.$.refreshHistoryBtn;
    if (!btn) {
      return;
    }

    btn.disabled = true;
    setTimeout(() => btn.disabled = false, 10000);
    this._fetchHistory();
  }

  async _fetchHistory() {
    let incidentHistory = await store.dispatch(fetchIncidentHistory(this.incidentId));
    let impactHistory = await this.fetchImpactHistory();
    this.history = [...incidentHistory, ...impactHistory];
  }

  getImpactIds() {
    let premise = this.state.incidents.premises
                  .filter(elem => '' + elem.incident_id === this.incidentId)
                  .map(elem => elem.id);

    let property = this.state.incidents.properties
                  .filter(elem => '' + elem.incident_id === this.incidentId)
                  .map(elem => elem.id);

    let personnel = this.state.incidents.personnel
                  .filter(elem => '' + elem.incident === this.incidentId)
                  .map(elem => elem.id);

    let programme = this.state.incidents.programmes
                  .filter(elem => '' + elem.incident_id === this.incidentId)
                  .map(elem => elem.id);

    let evacuation = this.state.incidents.evacuations
                  .filter(elem => '' + elem.incident_id === this.incidentId)
                  .map(elem => elem.id);

    let incident = this.incidentId;
    return {premise, property, personnel, programme, evacuation, incident};
  }

  fetchImpactHistory() {
    return store.dispatch(fetchHistoryOfImpacts(this.getImpactIds()));
  }

  personnelIsUn(item) {
    if (!item.data || typeof item.data.person !== 'object') {
      return false;
    }

    return !!item.data.person.un_official;
  }
}

window.customElements.define(IncidentHistory.is, IncidentHistory);
