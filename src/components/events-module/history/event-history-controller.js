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

import HistoryHelpers from '../../history-components/history-helpers.js';
import '../../history-components/revisions-list.js';
import '../../history-components/diff-view.js';
import './event-revision-view.js';

export class EventHistory extends HistoryHelpers(connect(store)(PolymerElement)) {
  static get template() {
    return html`
      <style include="shared-styles">
        :host {
          @apply --layout-vertical;
        }
      </style>

      <app-route
        route="{{route}}"
        pattern="/events/history/:eventId/:section"
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
                   module="events"
                   history="[[history]]">
        </revisions-list>
        <diff-view name="diff"
                   module="events"
                   working-item="[[workingItem]]">
        </diff-view>
        <event-revision-view name="view"
                        working-item="[[workingItem]]">
        </event-revision-view>
      </iron-pages>
    `;
  }

  static get is() {
    return 'event-history-controller';
  }

  static get properties() {
    return {
      eventId: {
        type: Number,
        computed: '_setEventId(state.app.locationInfo.eventId)',
        observer: '_idChanged'
      },
      visible: {
        type: Boolean,
        observer: '_visibilityChanged'
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

  _setEventId(id) {
    return id;
  }

  _stateChanged(state) {
    this.set('state', state);
  }

  _idChanged(newId) {
    if (!this.state.app.offline && newId && !isNaN(newId)) {
      this._fetchHistory();
    }
  }

  _fetchHistory() {
    let endpoint = prepareEndpoint(Endpoints.getEventHistory, {id: this.eventId});
    makeRequest(endpoint).then((response) => {
      this.history = response;
    });
  }

}

window.customElements.define(EventHistory.is, EventHistory);
