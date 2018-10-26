/**
@license
*/
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { updatePath } from '../../common/navigation-helper.js';
import { selectIncident } from '../../../reducers/incidents.js';
import '@polymer/app-route/app-route.js';
import 'etools-info-tooltip/etools-info-tooltip.js';
import { store } from '../../../redux/store.js';
import '../../styles/shared-styles.js';
import '../../styles/grid-layout-styles.js';

import '../../common/errors-box.js';
import './lists/non-un-personnel.js';
import './lists/un-personnel.js';
import './lists/evacuations.js';
import './lists/properties.js';
import './lists/programmes.js';
import './lists/premises.js';

/**
 * @polymer
 * @customElement
 */
export class ImpactsView extends connect(store)(PolymerElement) {
  static get is() {
    return 'impacts-view';
  }
  static get template() {
    // language=HTML
    return html`
      <style include="shared-styles grid-layout-styles">
        h3 {
          margin: 0 24px 0 0;;
        }
        .info h3 {
          margin: 0 8px 0 0;
        }

        .info {
          margin-right: 24px;
        }

        .right {
          text-align: right;
        }

        .error-card {
          padding: 0;
          box-shadow: none;
        }

        errors-box {
          width: auto;
        }

      </style>

      <div class="card error-card">
        <errors-box></errors-box>
      </div>

      <div class="card">
        <div class="layout-horizontal space-between p-relative">
          <etools-info-tooltip class="info" theme="light">
            <h3 slot="field">UN Personnel</h3>
            <span slot="message">
              Individuals covered by Chapter III of the UNSMS Security Policy Manual, Applicability of United
              Nations Security Management System, dated 08 April 2011 (Security Policy Manual, Chapter III)
            </span>
          </etools-info-tooltip>
          <paper-button raised
              class="no-t-transform smaller"
              on-click="_addUnPersonnel">
            <iron-icon icon="add"></iron-icon>
            Add UN Personnel
          </paper-button>
        </div>
        <un-personnel-list></un-personnel-list>
      </div>

      <div class="card">
        <div class="layout-horizontal space-between p-relative">
          <etools-info-tooltip class="info" theme="light">
            <h3 slot="field">Non-UN Personnel</h3>
            <span slot="message">
              Any person not defined as above as UN Personnel that is impacted by an incident in which a
              UN Personnel is the perpetrator. For instance, a non-UN person could be involved in a traffic
              accident with a UN staff member, or could be a visitor to a UN building when an incident occurs.
            </span>
          </etools-info-tooltip>
          <paper-button raised class="no-t-transform smaller" on-click="_addNonUn">
            <iron-icon icon="add"></iron-icon>
            Add non-UN Personnel
          </paper-button>
        </div>
        <non-un-personnel-list></non-un-personnel-list>
      </div>

      <div class="card">
        <div class="layout-horizontal space-between">
          <h3>Evacuations</h3>
          <paper-button raised class="no-t-transform smaller" on-click="_addEvacuation">
            <iron-icon icon="add"></iron-icon>
            Add Evacuation
          </paper-button>
        </div>
        <evacuations-list></evacuations-list>
      </div>

      <div class="card">
        <div class="layout-horizontal space-between p-relative">
          <etools-info-tooltip class="info" theme="light">
            <h3 slot="field">UN Property (Assets)</h3>
            <span slot="message">
              UN Assets include equipment, vehicles and vessels.
            </span>
          </etools-info-tooltip>
          <paper-button raised class="no-t-transform smaller" on-click="_addProperty">
            <iron-icon icon="add"></iron-icon>
            Add UN Property
          </paper-button>
        </div>
        <properties-list></properties-list>
      </div>

      <div class="card">
        <div class="layout-horizontal space-between p-relative">
          <etools-info-tooltip class="info" theme="light">
            <h3 slot="field">UN Premises (Facilities)</h3>
            <span slot="message">
              Premises: any location occupied for living or working by UN Personnel, as identified
              by the Premises Policy.<br> Facilities: unoccupied property and/or other
              infrastructure used for UN services, such as water and food points, and communication
              repeater stations.
            </span>
          </etools-info-tooltip>
          <paper-button raised class="no-t-transform smaller" on-click="_addPremise">
            <iron-icon icon="add"></iron-icon>
            Add Premise
          </paper-button>
        </div>
        <premises-list></premises-list>
      </div>

      <div class="card">
        <div class="layout-horizontal space-between">
          <h3>UN Programme</h3>
          <paper-button raised
              class="no-t-transform smaller"
              on-click="_addProgramme">
            <iron-icon icon="add"></iron-icon>
            Add Programme
          </paper-button>
        </div>
        <programmes-list></programmes-list>
      </div>
    `;
  }

  static get properties() {
    return {
      state: Object,
      incident: Object,
      visible: Boolean,
      incidentId: {
        type: Number,
        computed: '_setIncidentId(state.app.locationInfo.incidentId)',
        observer: '_idChanged'
      }
    };
  }

  _setIncidentId(id) {
    return id;
  }

  _idChanged(newId) {
    // TODO: add checks so we don't fetch this info except when this section is active
    this.incident = JSON.parse(JSON.stringify(selectIncident(this.state)));
  }

  _addUnPersonnel() {
    updatePath(`incidents/impact/${this.incidentId}/un-personnel/new/`);
  }

  _addEvacuation() {
    updatePath(`incidents/impact/${this.incidentId}/evacuation/new/`);
  }

  _addProgramme() {
    updatePath(`incidents/impact/${this.incidentId}/programme/new/`);
  }

  _addProperty() {
    updatePath(`incidents/impact/${this.incidentId}/property/new/`);
  }

  _addPremise() {
    updatePath(`incidents/impact/${this.incidentId}/premise/new/`);
  }

  _addNonUn() {
    updatePath(`incidents/impact/${this.incidentId}/non-un/new/`);
  }

  _stateChanged(state) {
    this.state = state;
  }

  _visibilityChanged(visible) {
  }
}

window.customElements.define(ImpactsView.is, ImpactsView);
