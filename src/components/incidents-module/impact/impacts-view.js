/**
@license
*/
import { html } from '@polymer/polymer/polymer-element.js';
import { PermissionsBase } from '../../common/permissions-base-class';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { updatePath } from '../../common/navigation-helper.js';
import { selectIncident } from '../../../reducers/incidents.js';
import '@polymer/app-route/app-route.js';
import '@unicef-polymer/etools-info-tooltip/etools-info-tooltip.js';
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
export class ImpactsView extends connect(store)(PermissionsBase) {
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
            <h3 slot="field">UNICEF Personnel</h3>
            <span slot="message">
              Individuals covered by Chapter III of the UNSMS Security Policy Manual, Applicability of United
              Nations Security Management System, dated 08 April 2011 (Security Policy Manual, Chapter III)
            </span>
          </etools-info-tooltip>
          <paper-button raised
              class="no-t-transform smaller"
              on-click="_addUnPersonnel"
              hidden$="[[!permissions.add_personincident]]">
            <iron-icon icon="add"></iron-icon>
            Add UNICEF Personnel
          </paper-button>
        </div>
        <un-personnel-list hidden$="[[!permissions.view_personincident]]"></un-personnel-list>
      </div>

      <div class="card">
        <div class="layout-horizontal space-between p-relative">
          <etools-info-tooltip class="info" theme="light">
            <h3 slot="field">Non-UNICEF Personnel</h3>
            <span slot="message">
              Any person not defined as above as UNICEF Personnel that is impacted by an incident in which a
              UNICEF Personnel is the perpetrator. For instance, a non-UNICEF person could be involved in a traffic
              accident with a UNICEF staff member, or could be a visitor to a UNICEF building when an incident occurs.
            </span>
          </etools-info-tooltip>
          <paper-button raised
                        class="no-t-transform smaller"
                        on-click="_addNonUn"
                        hidden$="[[!permissions.add_personincident]]">
            <iron-icon icon="add"></iron-icon>
            Add Non-UNICEF Personnel
          </paper-button>
        </div>
        <non-un-personnel-list hidden$="[[!permissions.view_personincident]]"></non-un-personnel-list>
      </div>

      <div class="card">
        <div class="layout-horizontal space-between">
          <h3>Evacuations and Relocations</h3>
          <paper-button raised
                        class="no-t-transform smaller"
                        on-click="_addEvacuation"
                        hidden$="[[!permissions.add_evacuation]]">
            <iron-icon icon="add"></iron-icon>
            Add Evacuation or Relocation
          </paper-button>
        </div>
        <evacuations-list hidden$="[[!permissions.view_evacuation]]"></evacuations-list>
      </div>

      <div class="card">
        <div class="layout-horizontal space-between p-relative">
          <etools-info-tooltip class="info" theme="light">
            <h3 slot="field">UNICEF Property (Assets)</h3>
            <span slot="message">
              UNICEF Assets include equipment, vehicles and vessels.
            </span>
          </etools-info-tooltip>
          <paper-button raised
                        class="no-t-transform smaller"
                        on-click="_addProperty"
                        hidden$="[[!permissions.add_property]]">
            <iron-icon icon="add"></iron-icon>
            Add UNICEF Property
          </paper-button>
        </div>
        <properties-list hidden$="[[!permissions.view_property]]"></properties-list>
      </div>

      <div class="card">
        <div class="layout-horizontal space-between p-relative">
          <etools-info-tooltip class="info" theme="light">
            <h3 slot="field">UNICEF Premises (Facilities)</h3>
            <span slot="message">
              Premises: any location occupied for living or working by UNICEF Personnel, as identified
              by the Premises Policy.<br> Facilities: unoccupied property and/or other
              infrastructure used for UNICEF services, such as water and food points, and communication
              repeater stations.
            </span>
          </etools-info-tooltip>
          <paper-button raised
                        class="no-t-transform smaller"
                        on-click="_addPremise"
                        hidden$="[[!permissions.add_premise]]">
            <iron-icon icon="add"></iron-icon>
            Add Premise
          </paper-button>
        </div>
        <premises-list hidden$="[[!permissions.view_premise]]"></premises-list>
      </div>

      <div class="card">
        <div class="layout-horizontal space-between">
          <h3>UNICEF Programme</h3>
          <paper-button raised
                        class="no-t-transform smaller"
                        on-click="_addProgramme"
                        hidden$="[[!permissions.add_programme]]">
            <iron-icon icon="add"></iron-icon>
            Add Programme
          </paper-button>
        </div>
        <programmes-list hidden$="[[!permissions.view_programme]]"></programmes-list>
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
      },
      permissions: {
        type: Object,
        notify: true
      }
    };
  }

  static get observers() {
    return ['checkPermissions(state.staticData.profile)'];
  }

  checkPermissions() {
    let permissions = {};
    let types = [
      'add_personincident', 'view_personincident', 'add_evacuation', 'view_evacuation', 'add_property',
      'view_property', 'add_premise', 'view_premise', 'add_programme', 'view_programme'
    ];
    types.forEach(type => permissions[type] = this.hasPermission(type));
    this.set('permissions', permissions);
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
