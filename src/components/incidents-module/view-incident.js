/**
@license
*/

import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import '../common/simple-dropdown.js';

import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-input/paper-textarea.js';

import { addIncident } from '../../actions/incidents.js';
import { store } from '../store.js';

// These are the shared styles needed by this element.
import '../styles/shared-styles.js';

class ViewIncident extends connect(store)(PolymerElement) {
  static get template() {
    return html`
      <style include="shared-styles">
        :host {
          display: block;

          padding: 10px;
        }
      </style>
      <div class="card">
          <h2> View incident</h2>
          <h3> Primary Person data </h3>

          <paper-input readonly label="First name" type="text" value="{{incident.primary_person.first_name}}"></paper-input>
          <paper-input readonly label="Last name" type="text" value="{{incident.primary_person.last_name}}"></paper-input>
          <paper-input readonly label="Date of birth" type="date" value="{{incident.primary_person.date_of_birth}}"></paper-input>
          <simple-dropdown readonly label="Gender" items="[[genders]]" selected="{{incident.primary_person.gender}}"></simple-dropdown>
          <paper-input readonly label="Nationality" type="text" value="{{incident.primary_person.nationality}}"></paper-input>
          <paper-input readonly label="UN Employer" type="text" value="{{incident.primary_person.un_employer}}"></paper-input>
          <paper-input readonly label="Job Title" type="text" value="{{incident.primary_person.job_title}}"></paper-input>
          <paper-input readonly label="Type of Contract" type="text" value="{{incident.primary_person.type_of_contract}}"></paper-input>
          <paper-textarea readonly label="Contact info" value="{{incident.primary_person.contact}}"></paper-textarea>
          <paper-input readonly label="Index number" type="number" value="{{incident.primary_person.index}}"></paper-input>


          <h3> Incident details </h3>
          <simple-dropdown readonly label="Event" items="[[events]]" selected="{{incident.event}}"></simple-dropdown>
          <simple-dropdown readonly label="Incident Type" items="[[staticData.incidentTypes]]" selected="{{incident.incident_type}}"></simple-dropdown>
          <simple-dropdown readonly label="Country" items="[[staticData.countries]]" selected="{{incident.country}}"></simple-dropdown>

          <paper-input readonly label="Region" type="text" value="{{incident.region}}"></paper-input>
          <paper-input readonly label="City" type="text" value="{{incident.city}}"></paper-input>
          <paper-input readonly label="Street" type="text" value="{{incident.street}}"></paper-input>

          <paper-input readonly label="Incident date" type="date" value="{{incident.incident_date}}"></paper-input>
          <paper-input readonly label="Incident time" type="time" value="{{incident.incident_time}}"></paper-input>

          <paper-textarea readonly label="Injuries" value="{{incident.injuries}}"></paper-textarea>
          <paper-textarea readonly label="Incident Description" value="{{incident.description}}"></paper-textarea>

          <simple-dropdown readonly label="On Duty" items="[[onDuty]]" selected="{{incident.on_duty}}"></simple-dropdown>
          <simple-dropdown readonly label="Weapons used" items="[[staticData.weapons]]" selected="{{incident.weapons_used}}"></simple-dropdown>
          <simple-dropdown readonly label="Reported to police" items="[[reported]]" selected="{{incident.reported}}"></simple-dropdown>

          <paper-input readonly label="Reported to" type="text" value="{{incident.reported_to}}"></paper-input>
          <paper-input readonly label="Responsible party" type="text" value="{{incident.responsible}}"></paper-input>

          <paper-textarea readonly label="Incident Note" value="{{incident.note}}"></paper-textarea>

          <simple-dropdown readonly label="Criticality" items="[[staticData.criticalities]]" selected="{{incident.criticality}}"></simple-dropdown>
          <simple-dropdown readonly label="Vehicle Type" items="[[staticData.vehicleTypes]]" selected="{{incident.vehicle_type}}"></simple-dropdown>
          <simple-dropdown readonly label="Crash Type" items="[[staticData.crashTypes]]" selected="{{incident.crash_type}}"></simple-dropdown>

          <br>
          <simple-dropdown readonly label="Impact" items="[[staticData.impacts]]" selected="{{incident.impact}}"></simple-dropdown>
          <simple-dropdown readonly label="Contributing factor" items="[[staticData.factors]]" selected="{{incident.contributing_factor}}"></simple-dropdown>

      </div>
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
          primary_person: {},
          submitted_by: 1,
          status: 'submitted'
        }
      },
      onDuty: {
        type: Array,
        value: [
          {id: true, name: 'On Duty'},
          {id: false, name: 'Off Duty'},
        ]
      },
      reported: {
        type: Array,
        value: [
          {id: true, name: 'Reported'},
          {id: false, name: 'Not Reported'},
        ]
      },
      genders: {
        type: Array,
        value: [
          {id: 'male', name: 'Male'},
          {id: 'female', name: 'Female'},
        ]
      },
      events: {
        type: Array,
        value: []
      },
      incidentId: {
        type: Number,
        observer: '_idChanged'
      },
      staticData: Object,
      state: Object
    };
  }

  _stateChanged(state) {
    this.state = state;
    this.staticData = state.staticData;
    this.events = state.events.events.map(elem => {
      elem.name = elem.description;
      return elem;
    });
  }
  _idChanged(newId) {
    // TODO: fix ==
    this.set('incident', this.state.incidents.incidents.find(elem => elem.id == this.incidentId ));
  }

}

window.customElements.define('view-incident', ViewIncident);
