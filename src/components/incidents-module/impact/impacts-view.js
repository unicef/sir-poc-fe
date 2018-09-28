/**
@license
*/
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { updatePath } from '../../common/navigation-helper.js';
import { selectIncident } from '../../../reducers/incidents.js';
import '@polymer/app-route/app-route.js';
import { store } from '../../../redux/store.js';
import { clearErrors } from '../../../actions/errors.js';
import '../../styles/shared-styles.js';

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
    return html`
      <style include="shared-styles">
        hr {
          border-width: 1px;
          border-style: inset;
          margin-bottom: 0;
        }
        h3 {
          margin-bottom: 0;
        }
        paper-button {
          text-transform: none;
          padding: 0 8px;
        }
        .right {
          text-align: right;
        }
      </style>

      <div class="card" hidden$="[[!showErrorBox(state.errors.serverError, state.errors.plainErrors)]]">
        <errors-box></errors-box>
      </div>

      <div class="card">
        <h3>Personnel</h3>
        <hr>
        <div class="right">
          <paper-button raised
              class="smaller"
              on-click="_addUnPersonnel">
            <iron-icon icon="add"></iron-icon>
            Add UN Personnel
          </paper-button>
        </div>
        <un-personnel-list></un-personnel-list>

        <div class="right">
          <paper-button raised
              class="smaller"
              on-click="_addNonUn">
            <iron-icon icon="add"></iron-icon>
            Add NON UN Personnel
          </paper-button>
        </div>
        <non-un-personnel-list></non-un-personnel-list>
      </div>

      <div class="card">
        <h3>Evacuations</h3>
        <hr>
        <div class="right">
          <paper-button raised
              class="smaller"
              on-click="_addEvacuation">
            <iron-icon icon="add"></iron-icon>
            Add Evacuation
          </paper-button>
        </div>
        <evacuations-list></evacuations-list>
      </div>

      <div class="card">
        <h3>UN Property(assets)</h3>
        <hr>
        <div class="right">
          <paper-button raised
              class="smaller"
              on-click="_addProperty">
            <iron-icon icon="add"></iron-icon>
            Add UN Property
          </paper-button>
        </div>
        <properties-list></properties-list>
      </div>

      <div class="card">
        <h3>UN Premises(facilities)</h3>
        <hr>
        <div class="right">
          <paper-button raised
              class="smaller"
              on-click="_addPremise">
            <iron-icon icon="add"></iron-icon>
            Add Premise
          </paper-button>
        </div>
        <premises-list></premises-list>
      </div>

      <div class="card">
        <h3>UN Programme</h3>
        <hr>
        <div class="right">
          <paper-button raised
              class="smaller"
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
    updatePath(`incidents/impact/${this.incidentId}/un-personel/new/`);
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
    if (visible === false) {
      store.dispatch(clearErrors());
    }
  }

  showErrorBox(err1, err2) {
    if (!err1 && !err2) {
      return false;
    }
    if (!Object.keys(errs) && err2.length) {
      return false;
    }
    return true;
  }
}

window.customElements.define(ImpactsView.is, ImpactsView);
