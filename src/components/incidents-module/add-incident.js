/**
@license
*/

import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import '@polymer/paper-input/paper-input.js';

import { updatePath } from '../common/navigation-helper.js';
import { addIncident } from '../../actions/incidents.js';
import { store } from '../store.js';

import '../common/errors-box.js';

// These are the shared styles needed by this element.
import '../styles/shared-styles.js';

/**
 * @polymer
 * @customElement
 */
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

          <errors-box server-errors="{{serverReceivedErrors}}"></errors-box>

          <h3> Primary Person data </h3>

          <paper-input label="First name" type="text" value="{{incident.primary_person.first_name}}"></paper-input>
          <paper-input label="Last name" type="text" value="{{incident.primary_person.last_name}}"></paper-input>
          <paper-input label="Date of birth" type="date" value="{{incident.primary_person.date_of_birth}}"></paper-input>
          <etools-dropdown-lite label="Gender" options="[[genders]]" selected="{{incident.primary_person.gender}}"></etools-dropdown-lite>
          <paper-input label="Nationality" type="text" value="{{incident.primary_person.nationality}}"></paper-input>
          <paper-input label="UN Employer" type="text" value="{{incident.primary_person.un_employer}}"></paper-input>
          <paper-input label="Job Title" type="text" value="{{incident.primary_person.job_title}}"></paper-input>
          <paper-input label="Type of Contract" type="text" value="{{incident.primary_person.type_of_contract}}"></paper-input>
          <paper-input type="text" label="Contact info" value="{{incident.primary_person.contact}}"></paper-input>
          <paper-input label="Index number" type="number" value="{{incident.primary_person.index}}"></paper-input>


          <h3> Incident details </h3>
          <etools-dropdown-lite label="Event" options="[[events]]" selected="{{incident.event}}"></etools-dropdown-lite>
          <etools-dropdown-lite label="Incident Type" options="[[staticData.incidentTypes]]" selected="{{incident.incident_type}}"></etools-dropdown-lite>
          <etools-dropdown-lite label="Country" options="[[staticData.countries]]" selected="{{incident.country}}"></etools-dropdown-lite>

          <paper-input label="Region" type="text" value="{{incident.region}}"></paper-input>
          <paper-input label="City" type="text" value="{{incident.city}}"></paper-input>
          <paper-input label="Street" type="text" value="{{incident.street}}"></paper-input>

          <paper-input label="Incident date" type="date" value="{{incident.incident_date}}"></paper-input>
          <paper-input label="Incident time" type="time" value="{{incident.incident_time}}"></paper-input>

          <paper-input type="text" label="Injuries" value="{{incident.injuries}}"></paper-input>
          <paper-input type="text" label="Incident Description" value="{{incident.description}}"></paper-input>

          <etools-dropdown-lite label="On Duty" options="[[onDuty]]" selected="{{incident.on_duty}}"></etools-dropdown-lite>
          <etools-dropdown-multi-lite label="Weapons used" options="[[staticData.weapons]]" selected-values="{{incident.weapons_used}}">
          </etools-dropdown-multi-lite>
          <etools-dropdown-lite label="Reported to police" options="[[reported]]" selected="{{incident.reported}}"></etools-dropdown-lite>

          <paper-input label="Reported to" type="text" value="{{incident.reported_to}}"></paper-input>
          <paper-input label="Responsible party" type="text" value="{{incident.responsible}}"></paper-input>

          <paper-input type="text" label="Incident Note" value="{{incident.note}}"></paper-input>

          <etools-dropdown-lite label="Criticality" options="[[staticData.criticalities]]" selected="{{incident.criticality}}"></etools-dropdown-lite>
          <etools-dropdown-lite label="Vehicle Type" options="[[staticData.vehicleTypes]]" selected="{{incident.vehicle_type}}"></etools-dropdown-lite>
          <etools-dropdown-lite label="Crash Type" options="[[staticData.crashTypes]]" selected="{{incident.crash_type}}"></etools-dropdown-lite>

          <br>
          <etools-dropdown-lite label="Impact" options="[[staticData.impacts]]" selected="{{incident.impact}}"></etools-dropdown-lite>
          <etools-dropdown-lite label="Contributing factor" options="[[staticData.factors]]" selected="{{incident.contributing_factor}}"></etools-dropdown-lite>

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
    store.dispatch(addIncident(this.incident));
  }
}

window.customElements.define('add-incident', AddIncident);
