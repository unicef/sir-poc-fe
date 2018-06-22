/**
@license
*/

import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { connect } from 'pwa-helpers/connect-mixin.js';

import { paperTextarea } from '@polymer/paper-input/paper-textarea.js';
import { paperInput } from '@polymer/paper-input/paper-input.js';

import { addIncident } from '../../actions/incidents.js';
import { store } from '../store.js';

// These are the shared styles needed by this element.
import '../styles/shared-styles.js';

class AddIncident extends connect(store)(PolymerElement) {
 static get template() {
    return html`
      <style include="shared-styles">
        :host {
          display: block;

          padding: 10px;
        }
      </style>
      <div class="card">
          <h2>Add new incident</h2>

          <paper-input label="Start date" type="date" value="{{incident.startDate}}"></paper-input>
          <paper-input label="End date" type="date" value="{{incident.endDate}}"></paper-input>

          <paper-input label="Description" type="text" value="{{incident.description}}"></paper-input>
          <paper-textarea label="Note" value="{{incident.note}}"></paper-textarea>
          <paper-input label="Location" type="text" value="{{incident.location}}"></paper-input>

          <paper-button on-click="save"> Save </paper-button>
      </div>
    `;
  }

  static get properties() {
    return {
      incident: {
        type: Object,
        value: {}
      }
    };
  }

  _stateChanged(state) {
    // console.log('new state', state);
  }

  save() {
    // should this.incident not be passed by reference?
    store.dispatch(addIncident(this.incident));
    this.set('incident', {});
  }
}

window.customElements.define('add-incident', AddIncident);
