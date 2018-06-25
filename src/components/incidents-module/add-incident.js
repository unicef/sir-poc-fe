/**
@license
*/

import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import '../common/simple-dropdown.js';

import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-input/paper-textarea.js';



import 'web-animations-js/web-animations-next-lite.min.js';

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
          <simple-dropdown label="Event" items="[[events]]" selected="{{incident.event}}"></simple-dropdown>
          <simple-dropdown label="Incident Type" items="[[staticData.incidentTypes]]" selected="{{incident.incident_type}}"></simple-dropdown>
          <simple-dropdown label="Country" items="[[staticData.countries]]" selected="{{incident.country}}"></simple-dropdown>

          <paper-input label="Region" type="text" value="[[incident.region]]"></paper-input>
          <paper-input label="City" type="text" value="[[incident.city]]"></paper-input>
          <paper-input label="Street" type="text" value="[[incident.street]]"></paper-input>

          <paper-input label="Incident date" type="date" value="{{incident.incident_date}}"></paper-input>
          <paper-input label="Incident time" type="time" value="{{incident.incident_time}}"></paper-input>

          <paper-textarea label="Injuries" value="{{incident.injuries}}"></paper-textarea>
          <paper-textarea label="Incident Description" value="{{incident.description}}"></paper-textarea>

          <simple-dropdown label="On Duty" items="[[onDuty]]" selected="{{incident.on_duty}}"></simple-dropdown>
          <simple-dropdown label="Weapons used" items="[[staticData.weapons]]" selected="{{incident.weapons_used}}"></simple-dropdown>
          <simple-dropdown label="Reported to police" items="[[reported]]" selected="{{incident.reported}}"></simple-dropdown>

          <paper-input label="Reported to" type="text" value="[[incident.reported_to]]"></paper-input>
          <paper-input label="Responsible party" type="text" value="[[incident.responsible]]"></paper-input>

          <paper-textarea label="Incident Note" value="{{incident.note}}"></paper-textarea>

          <simple-dropdown label="Criticality" items="[[staticData.criticalities]]" selected="{{incident.criticality}}"></simple-dropdown>
          <simple-dropdown label="Vehicle Type" items="[[staticData.vehicleTypes]]" selected="{{incident.vehicle_type}}"></simple-dropdown>
          <simple-dropdown label="Crash Type" items="[[staticData.crashTypes]]" selected="{{incident.crash_type}}"></simple-dropdown>

          <br>
          <simple-dropdown label="Impact" items="[[staticData.impacts]]" selected="{{incident.impact}}"></simple-dropdown>
          <simple-dropdown label="Contributing factor" items="[[staticData.factors]]" selected="{{incident.contributing_factor}}"></simple-dropdown>

          <br><br>
          <paper-button on-click="save"> Save </paper-button>
      </div>
    `;
    `
          <paper-input label="Location" type="text" value="{{incident.location}}"></paper-input>
          <paper-textarea label="Note" value="{{incident.note}}"></paper-textarea>
    `;
  }
/*

 */
  static get properties() {
    return {
      incident: {
        type: Object,
        value: {
          // TODO: Fix this.
          last_modify_user: 1,
          primary_person: 1,
          submitted_by: 1,
          status: 'submitted'
        }
      },
      staticData: Object,
      onDuty: {
        type: Array,
        value: [
          {id: 'on', name: 'On Duty'},
          {id: 'off', name: 'Off Duty'},
        ]
      },
      reported: {
        type: Array,
        value: [
          {id: 'on', name: 'Reported'},
          {id: 'off', name: 'Not Reported'},
        ]
      },
      events: {
        type: Array,
        value: []
      }
    };
  }

  _stateChanged(state) {
    this.staticData = state.staticData;

    this.events = state.events.events.map(elem => {
      elem.name = elem.description;
      return elem;
    });
  }

  save() {
    // should this.incident not be passed by reference?
    store.dispatch(addIncident(this.incident));
    this.set('incident', {});
  }
}

window.customElements.define('add-incident', AddIncident);
