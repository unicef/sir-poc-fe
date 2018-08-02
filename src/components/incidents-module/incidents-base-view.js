/**
@license
*/
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import '../common/etools-dropdown/etools-dropdown-multi-lite.js';
import '../common/etools-dropdown/etools-dropdown-lite.js';
import '../common/datepicker-lite.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-checkbox/paper-checkbox.js';
import '../common/errors-box.js';
import { store } from '../../redux/store.js';
import { IncidentModel } from './models/incident-model.js';
import { selectIncident } from '../../reducers/incidents.js';
import { isOnNewIncident } from '../../reducers/app.js';
import { fetchIncident } from '../../actions/incidents.js';
import '../styles/shared-styles.js';
import '../styles/grid-layout-styles.js';

export class IncidentsBaseView extends connect(store)(PolymerElement) {
  static get template() {
    return html`
      <style include="shared-styles grid-layout-styles">
        :host {
          @apply --layout-vertical;
        }
        .details {
          margin-top: 28px;
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
            <etools-dropdown-lite readonly="[[readonly]]"
                                  label="Primary person"
                                  trigger-value-change-event
                                  on-etools-selected-item-changed="_userSelected"
                                  options="[[staticData.users]]"
                                  selected="{{incident.primary_person.id}}">
            </etools-dropdown-lite>
          </div>

          <div class="col col-6">
            <etools-dropdown-lite readonly="[[readonly]]"
                                  label="Agency"
                                  options="[[staticData.agencies]]"
                                  selected="{{incident.primary_person.agency}}">
            </etools-dropdown-lite>
          </div>
        </div>

        <div class="row-h flex-c">
          <div class="col col-6">
            <paper-checkbox checked="{{incident.on_duty}}" disabled="[[readonly]]">On Duty</paper-checkbox>
          </div>
        </div>

        <div class="row-h">
          <h3> Incident details </h3>
        </div>

        <div class="row-h flex-c">
          <div class="col col-6">
            <etools-dropdown-lite readonly="[[readonly]]"
                                  label="Event"
                                  options="[[events]]"
                                  selected="{{incident.event}}"
                                  selected-item="{{selectedEvent}}">
            </etools-dropdown-lite>
          </div>
          <div class="col col-6">
            <div class="details"> [[selectedEvent.note]] </div>
          </div>
        </div>
        <div class="row-h flex-c">
          <div class="col col-6">
            <etools-dropdown-lite readonly="[[readonly]]"
                                  label="Incident Type"
                                  options="[[staticData.incidentCategories]]"
                                  selected="{{incident.incident_category}}"
                                  selected-item="{{selectedIncidentCategory}}">
            </etools-dropdown-lite>
          </div>
          <div class="col col-6">
            <div class="details">
              [[selectedIncidentCategory.description]]
            </div>
            <div class="details" hidden$="[[!selectedIncidentCategory.comment]]">
              [[selectedIncidentCategory.comment]]
            </div>
          </div>
        </div>

        <div class="row-h flex-c">
          <div class="col col-6">
            <etools-dropdown-lite readonly="[[readonly]]"
                                  label="Threat category"
                                  options="[[staticData.threatCategories]]"
                                  selected="{{incident.threat_category}}"
                                  selected-item="{{selectedThreatCategory}}">
            </etools-dropdown-lite>
          </div>
          <div class="col col-6">
            <div class="details"> [[selectedThreatCategory.description]] </div>
          </div>
        </div>
        <div class="row-h flex-c">
          <div class="col col-6">
            <etools-dropdown-lite readonly="[[readonly]]"
                                  label="Target"
                                  options="[[staticData.targets]]"
                                  selected="{{incident.target}}"
                                  selected-item="{{selectedTarget}}">
            </etools-dropdown-lite>
          </div>
          <div class="col col-6">
            <div class="details"> [[selectedTarget.description]] </div>
          </div>
        </div>

        <div class="row-h flex-c">
          <div class="col col-6">
            <datepicker-lite value="{{incident.incident_date}}" readonly="[[readonly]]" label="Incident date"></datepicker-lite>
          </div>
          <div class="col col-6">
            <paper-input readonly="[[readonly]]"
                         label="Incident time"
                         type="time"
                         value="{{incident.incident_time}}">
            </paper-input>
          </div>
        </div>

        <div class="row-h flex-c">
          <div class="col col-6">
            <etools-dropdown-lite readonly="[[readonly]]"
                                  label="Country"
                                  options="[[staticData.countries]]"
                                  selected="{{incident.country}}">
            </etools-dropdown-lite>
            <etools-dropdown-lite readonly="[[readonly]]"
                                  label="Region"
                                  options="[[staticData.regions]]"
                                  selected="{{incident.region}}">
            </etools-dropdown-lite>
          </div>

          <div class="col col-6">
            <paper-input readonly="[[readonly]]" label="City" type="text" value="{{incident.city}}"></paper-input>
            <paper-input readonly="[[readonly]]" label="Street" type="text" value="{{incident.street}}"></paper-input>
          </div>
        </div>

        <div class="row-h flex-c">
          <div class="col col-12">
            <paper-input type="text" readonly="[[readonly]]" label="Injuries" value="{{incident.injuries}}"></paper-input>
            <paper-input type="text" readonly="[[readonly]]" label="Incident Description" value="{{incident.description}}"></paper-input>
            <paper-input type="text" readonly="[[readonly]]" label="Incident Note" value="{{incident.note}}"></paper-input>
          </div>
        </div>


        <div class="row-h flex-c">
          <div class="col col-6">
            <etools-dropdown-lite readonly="[[readonly]]"
                                  label="Criticality"
                                  options="[[staticData.criticalities]]"
                                  selected="{{incident.criticality}}"
                                  selected-item="{{selectedCriticality}}">
            </etools-dropdown-lite>
          </div>
          <div class="col col-6">
            <div class="details"> [[selectedCriticality.description]] </div>
          </div>
        </div>

        <div class="row-h flex-c">
          <div class="col col-12" hidden$="[[!incident.incident_category]]">
            <etools-dropdown-multi-lite hidden$="[[isAccident(incident.incident_category, staticData)]]"
                                        readonly="[[readonly]]"
                                        label="Weapons used"
                                        options="[[staticData.weapons]]"
                                        selected-values="{{incident.weapons_used}}">
            </etools-dropdown-multi-lite>
          </div>
        </div>

        <div class="row-h flex-c">
          <div class="col col-6">
            <etools-dropdown-lite hidden$="[[!isAccident(incident.incident_category, staticData)]]"
                                  readonly="[[readonly]]"
                                  label="Vehicle Type"
                                  options="[[staticData.vehicleTypes]]"
                                  selected="{{incident.vehicle_type}}">
            </etools-dropdown-lite>
          </div>
          <div class="col col-6">
            <etools-dropdown-lite hidden$="[[!isAccident(incident.incident_category, staticData)]]"
                                  readonly="[[readonly]]"
                                  label="Contributing factor"
                                  options="[[staticData.factors]]"
                                  selected="{{incident.contributing_factor}}">
            </etools-dropdown-lite>
          </div>
        </div>

        <div class="row-h flex-c">
          <div class="col col-6">
            <etools-dropdown-lite hidden$="[[!isAccident(incident.incident_category, staticData)]]"
                                  readonly="[[readonly]]"
                                  label="Crash Type"
                                  options="[[staticData.crashTypes]]"
                                  selected="{{incident.crash_type}}">
            </etools-dropdown-lite>
          </div>
          <div class="col col-6">
            <paper-checkbox hidden$="[[!isAccident(incident.incident_category)]]"
                            checked="{{incident.near_miss}}"
                            disabled="[[readonly]]">
              Near miss
            </paper-checkbox>
          </div>
        </div>

        <div class="row-h flex-c">
          <div class="col col-6">
            <paper-checkbox checked="{{incident.reported}}" disabled="[[readonly]]">Reported to police</paper-checkbox>
          </div>
        </div>

        <div class="row-h flex-c">
          <div class="col col-6">
            <paper-input hidden$="[[isNotReported(incident.reported)]]" readonly="[[readonly]]" label="Reported to" type="text" value="{{incident.reported_to}}"></paper-input>
          </div>
          <div class="col col-6">
            <paper-input hidden$="[[isNotReported(incident.reported)]]" readonly="[[readonly]]" label="Responsible party" type="text" value="{{incident.responsible}}"></paper-input>
          </div>
        </div>

        <template is="dom-if" if="[[!readonly]]">
          <div class="row-h flex-c">
            <div class="col col-12">
              <span class="warning" hidden$="[[!state.app.offline]]">
                Because there is no internet conenction the incident will be saved offine for now,
                and you must sync it manually by saving it again when online
              </span>
            </div>
          </div>
          <div class="row-h flex-c">
            <div class="col col-12">
              <p hidden$="[[!eventNotOk(incident.event, state.app.offline)]]"> Can't save, selected event must be synced first </p>
              <paper-button raised
                            on-click="save"
                            disabled$="[[eventNotOk(incident.event, state.app.offline)]]">
                Save
              </paper-button>
            </div>
          </div>
        </template>
      </div>
    `;
  }

  static get properties() {
    return {
      incident: {
        type: Object,
        value: () => JSON.parse(JSON.stringify(IncidentModel))
      },
      incidentId: {
        type: Number,
        computed: '_setIncidentId(state.app.locationInfo.incidentId)',
        observer: '_idChanged'
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
      events: {
        type: Array,
        value: []
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

  connectedCallback() {
    this.store = store;
    super.connectedCallback();
  }

  _setIncidentId(id) {
    return id;
  }

  _idChanged(newId) {
    if (!this.isOnExpectedPage(this.state)) {
      return;
    }

    if (!newId) {
      this.incident = JSON.parse(JSON.stringify(IncidentModel));
      return;
    }

    this.incident = JSON.parse(JSON.stringify(selectIncident(this.state)));


    if (!this.isOfflineOrUnsynced()) {
      this.store.dispatch(fetchIncident(this.incidentId));
    }
  }

  isOfflineOrUnsynced() {
    return this.state.app.offline || (this.incident && this.incident.unsynced);
  }

  _userSelected(event) {
    if (!event.detail.selectedItem) {
      return;
    }
    this.incident.primary_person.id = event.detail.selectedItem.id;
    this.incident.primary_person.first_name = event.detail.selectedItem.first_name;
    this.incident.primary_person.last_name = event.detail.selectedItem.last_name;
  }

  _stateChanged(state) {
    this.state = state;

    if (!this.isOnExpectedPage(this.state)) {
      return;
    }

    this.staticData = state.staticData;

    this.events = state.events.list.map(elem => {
      elem.name = elem.description;
      return elem;
    });

    // TODO: this is TEMPORARY! user data should be more properly displayed
    this.staticData.users = state.staticData.users.map(elem => {
      elem.name = elem.first_name + ' ' + elem.last_name;
      return elem;
    });
  }

  isNotReported(reported) {
    return reported === false;
  }

  isAccident(incidentCategoryId) {
    if (!this.staticData) {
      return false;
    }

    let incident = this.staticData.incidentCategories.find(elem => {
      return elem.id === incidentCategoryId;
    });

    return incident && incident.name.startsWith('Accident');
  }

  isVisible() {
    return this.classList.contains('iron-selected');
  }

  eventNotOk(eventId, offline) {
    if (!eventId || !this.events) {
      return false;
    }
    let selectedEvent = this.events.find(event => event.id === eventId);
    return !!selectedEvent.unsynced && !offline;
  }
}
