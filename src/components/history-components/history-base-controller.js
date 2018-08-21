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

import HistoryHelpers from './history-helpers.js';

export class HistoryBaseController extends HistoryHelpers(connect(store)(PolymerElement)) {

  static get properties() {
    return {
      incidentId: {
        type: Number,
        computed: '_setId(state.app.locationInfo.incidentId)',
        observer: '_incidentIdChanged'
      },
      eventId: {
        type: Number,
        computed: '_setId(state.app.locationInfo.incidentId)',
        observer: '_eventIdChanged'
      },
      visible: {
        type: Boolean,
        value: false,
        observer: '_visibilityChanged'
      },
      subRouteData: Object,
      workingItem: Object,
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

  _visibilityChanged(visible) {
    if (visible) {
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

  _setId(id) {
    return id;
  }

  _stateChanged(state) {
    this.set('state', state);
  }

  _eventIdChanged(newId) {
    if (!this.state.app.offline && newId && !isNaN(newId)) {
      this._fetchEventHistory();
    }
  }

  _incidentIdChanged(newId) {
    if (!this.state.app.offline && newId && !isNaN(newId)) {
      this._fetchIncidentHistory();
    }
  }

  _fetchEventHistory() {
    let endpoint = prepareEndpoint(Endpoints.getIncidentHistory, {id: this.incidentId});
    makeRequest(endpoint).then((response) => {
      this.history = response;
    });
  }

  _fetchIncidentHistory() {
    let endpoint = prepareEndpoint(Endpoints.getIncidentHistory, {id: this.incidentId});
    makeRequest(endpoint).then((response) => {
      this.history = response;
    });
  }

}
