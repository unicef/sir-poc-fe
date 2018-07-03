/**
@license
*/
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import '../common/etools-dropdown/etools-dropdown-multi-lite.js';
import '../common/etools-dropdown/etools-dropdown-lite.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-checkbox/paper-checkbox.js';
import '@polymer/paper-button/paper-button.js';
import '../common/errors-box.js';
import { store } from '../store.js';
import '../styles/shared-styles.js';
import '../styles/grid-layout-styles.js';

export class IncidentsBaseView extends connect(store)(PolymerElement) {
  static get template() {
    return html`
      <style include="shared-styles grid-layout-styles">
        :host {
          @apply --layout-vertical;
          width: 100%;
          padding: 10px;
        }
        etools-dropdown-lite, etools-dropdown-multi-lite {
          width: 100%;
        }
        paper-checkbox {
          --paper-checkbox-unchecked-color: var(--secondary-text-color);
          --paper-checkbox-label-color: var(--secondary-text-color);

          /* TODO: figure out a better way of doing vertical alignment */
          padding-top: 29px;
          padding-bottom: 12px;
        }
        paper-button {
          margin: 8px 24px;
          padding: 8px;
        }
      </style>

      <div class="card">
        <div class="row-h">
          <h2> [[title]] </h2>
        </div>

        <div class="row-h">
          <errors-box></errors-box>
        </div>

        <div class="row-h">
          <h3> Primary Person data </h3>
        </div>

        <div class="row-h flex-c">
          <div class="col col-6">
            <paper-input readonly="[[readonly]]" label="First name" type="text" value="{{incident.primary_person.first_name}}"></paper-input>
            <paper-input readonly="[[readonly]]" label="Last name" type="text" value="{{incident.primary_person.last_name}}"></paper-input>
            <!-- <paper-input readonly="[[readonly]]" label="Index number" type="number" value="{{incident.primary_person.index}}"></paper-input> -->
            <paper-input readonly="[[readonly]]" label="Date of birth" type="date" value="{{incident.primary_person.date_of_birth}}"></paper-input>
            <paper-input readonly="[[readonly]]" label="Nationality" type="text" value="{{incident.primary_person.nationality}}"></paper-input>
            <etools-dropdown-lite readonly="[[readonly]]" label="Gender" options="[[genders]]" selected="{{incident.primary_person.gender}}"></etools-dropdown-lite>
          </div>

          <div class="col col-6">
            <paper-input readonly="[[readonly]]" label="UN Employer" type="text" value="{{incident.primary_person.un_employer}}"></paper-input>
            <paper-input readonly="[[readonly]]" label="Job Title" type="text" value="{{incident.primary_person.job_title}}"></paper-input>
            <paper-input readonly="[[readonly]]" label="Type of Contract" type="text" value="{{incident.primary_person.type_of_contract}}"></paper-input>
            <paper-input type="text" readonly="[[readonly]]" label="Contact info" value="{{incident.primary_person.contact}}"></paper-input>
            <paper-checkbox checked="{{incident.on_duty}}" disabled="[[readonly]]">On Duty</paper-checkbox>
          </div>
        </div>

        <div class="row-h">
          <h3> Incident details </h3>
        </div>

        <div class="row-h flex-c">
          <div class="col col-6">
            <etools-dropdown-lite readonly="[[readonly]]" label="Event" options="[[events]]" selected="{{incident.event}}"></etools-dropdown-lite>
            <etools-dropdown-lite readonly="[[readonly]]" label="Incident Type" options="[[staticData.incidentTypes]]" selected="{{incident.incident_type}}"></etools-dropdown-lite>
            <etools-dropdown-lite readonly="[[readonly]]" label="Country" options="[[staticData.countries]]" selected="{{incident.country}}"></etools-dropdown-lite>
          </div>

          <div class="col col-6">
            <paper-input readonly="[[readonly]]" label="Region" type="text" value="{{incident.region}}"></paper-input>
            <paper-input readonly="[[readonly]]" label="City" type="text" value="{{incident.city}}"></paper-input>
            <paper-input readonly="[[readonly]]" label="Street" type="text" value="{{incident.street}}"></paper-input>
          </div>
        </div>

        <div class="row-h flex-c">
          <div class="col col-6">
            <paper-input readonly="[[readonly]]" label="Incident date" type="date" value="{{incident.incident_date}}"></paper-input>
          </div>
          <div class="col col-6">
            <paper-input readonly="[[readonly]]" label="Incident time" type="time" value="{{incident.incident_time}}"></paper-input>
          </div>
        </div>

        <div class="row-h flex-c">
          <div class="col col-12">
            <paper-input type="text" readonly="[[readonly]]" label="Injuries" value="{{incident.injuries}}"></paper-input>
            <paper-input type="text" readonly="[[readonly]]" label="Incident Description" value="{{incident.description}}"></paper-input>
          </div>
        </div>

        <div class="row-h flex-c">
          <div class="col col-6">
            <etools-dropdown-multi-lite readonly="[[readonly]]" label="Weapons used" options="[[staticData.weapons]]" selected-values="{{incident.weapons_used}}"></etools-dropdown-multi-lite>
            <paper-input readonly="[[readonly]]" label="Reported to" type="text" value="{{incident.reported_to}}"></paper-input>
          </div>
          <div class="col col-6">
            <paper-checkbox checked="{{incident.reported}}" disabled="[[readonly]]">Reported to police</paper-checkbox>
            <paper-input readonly="[[readonly]]" label="Responsible party" type="text" value="{{incident.responsible}}"></paper-input>
          </div>
        </div>

        <div class="row-h flex-c">
          <div class="col col-12">
            <paper-input type="text" readonly="[[readonly]]" label="Incident Note" value="{{incident.note}}"></paper-input>
          </div>
        </div>

        <div class="row-h flex-c">
          <div class="col col-6">
            <etools-dropdown-lite readonly="[[readonly]]" label="Criticality" options="[[staticData.criticalities]]" selected="{{incident.criticality}}"></etools-dropdown-lite>
            <etools-dropdown-lite readonly="[[readonly]]" label="Vehicle Type" options="[[staticData.vehicleTypes]]" selected="{{incident.vehicle_type}}"></etools-dropdown-lite>
            <etools-dropdown-lite readonly="[[readonly]]" label="Crash Type" options="[[staticData.crashTypes]]" selected="{{incident.crash_type}}"></etools-dropdown-lite>
          </div>
          <div class="col col-6">
            <etools-dropdown-lite readonly="[[readonly]]" label="Impact" options="[[staticData.impacts]]" selected="{{incident.impact}}"></etools-dropdown-lite>
            <etools-dropdown-lite readonly="[[readonly]]" label="Contributing factor" options="[[staticData.factors]]" selected="{{incident.contributing_factor}}"></etools-dropdown-lite>
          </div>
        </div>

        <template is="dom-if" if="[[!readonly]]">
          <paper-button raised on-click="save"> Save </paper-button>
        </template>
      </div>
    `;
  }
  connectedCallback() {
    super.connectedCallback();
    this.store = store;
  }

  static get properties() {
    return {
      incident: {
        type: Object,
        value: {
          // TODO: Move this to a proper model
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
      readonly: {
        type: Boolean,
        value: false
      },
      title: String,
      staticData: Object,
      state: Object,
      store: Object
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

  save() {
  }
}
