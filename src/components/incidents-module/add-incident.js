/**
@license
*/

import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import '../common/simple-dropdown.js';

import '@polymer/paper-input/paper-input.js';
// import '@polymer/paper-input/paper-textarea.js';

import { updatePath } from '../common/navigation-helper.js';
import { addIncident } from '../../actions/incidents.js';
import { makeRequest } from '../common/request-helper.js';
import { store } from '../store.js';

import '../common/errors-box.js';
import { SirContentScrollMixin } from '../common/content-container-helper.js';

// These are the shared styles needed by this element.
import '../styles/shared-styles.js';

/**
 * @polymer
 * @customElement
 */
class AddIncident extends connect(store)(SirContentScrollMixin(PolymerElement)) {
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
          
          <errors-box server-errors="{{serverReceivedErrors}}"></errors-box>
          
          <h3> Primary Person data </h3>

          <paper-input label="First name" type="text" value="{{incident.primary_person.first_name}}"></paper-input>
          <paper-input label="Last name" type="text" value="{{incident.primary_person.last_name}}"></paper-input>
          <paper-input label="Date of birth" type="date" value="{{incident.primary_person.date_of_birth}}"></paper-input>
          <simple-dropdown label="Gender" items="[[genders]]" selected="{{incident.primary_person.gender}}"></simple-dropdown>
          <paper-input label="Nationality" type="text" value="{{incident.primary_person.nationality}}"></paper-input>
          <paper-input label="UN Employer" type="text" value="{{incident.primary_person.un_employer}}"></paper-input>
          <paper-input label="Job Title" type="text" value="{{incident.primary_person.job_title}}"></paper-input>
          <paper-input label="Type of Contract" type="text" value="{{incident.primary_person.type_of_contract}}"></paper-input>
          <paper-input type="text" label="Contact info" value="{{incident.primary_person.contact}}"></paper-input>
          <paper-input label="Index number" type="number" value="{{incident.primary_person.index}}"></paper-input>


          <h3> Incident details </h3>
          <simple-dropdown label="Event" items="[[events]]" selected="{{incident.event}}"></simple-dropdown>
          <simple-dropdown label="Incident Type" items="[[staticData.incidentTypes]]" selected="{{incident.incident_type}}"></simple-dropdown>
          <simple-dropdown label="Country" items="[[staticData.countries]]" selected="{{incident.country}}"></simple-dropdown>

          <paper-input label="Region" type="text" value="{{incident.region}}"></paper-input>
          <paper-input label="City" type="text" value="{{incident.city}}"></paper-input>
          <paper-input label="Street" type="text" value="{{incident.street}}"></paper-input>

          <paper-input label="Incident date" type="date" value="{{incident.incident_date}}"></paper-input>
          <paper-input label="Incident time" type="time" value="{{incident.incident_time}}"></paper-input>

          <paper-input type="text" label="Injuries" value="{{incident.injuries}}"></paper-input>
          <paper-input type="text" label="Incident Description" value="{{incident.description}}"></paper-input>

          <simple-dropdown label="On Duty" items="[[onDuty]]" selected="{{incident.on_duty}}"></simple-dropdown>
          <simple-dropdown label="Weapons used" items="[[staticData.weapons]]" selected="{{incident.weapons_used}}"></simple-dropdown>
          <simple-dropdown label="Reported to police" items="[[reported]]" selected="{{incident.reported}}"></simple-dropdown>

          <paper-input label="Reported to" type="text" value="{{incident.reported_to}}"></paper-input>
          <paper-input label="Responsible party" type="text" value="{{incident.responsible}}"></paper-input>

          <paper-input type="text" label="Incident Note" value="{{incident.note}}"></paper-input>

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
      addIncidentEndpointName: {
        type: String,
        value: 'newIncident'
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
    makeRequest(this.addIncidentEndpointName, this.incident).then((result) => {
      store.dispatch(addIncident(JSON.parse(result)));
      this.set('incident', {});
      updatePath('/incidents/list/');
    }).catch((error) => {
      this.set('serverReceivedErrors', error.response);
      this.scrollToTop();
    });
  }
}

window.customElements.define('add-incident', AddIncident);
