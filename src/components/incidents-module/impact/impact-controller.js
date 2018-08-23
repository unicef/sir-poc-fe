/**
@license
*/
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { updatePath } from '../../common/navigation-helper.js';
import '@polymer/app-route/app-route.js';
import { store } from '../../../redux/store.js';
import '../../styles/shared-styles.js';

/**
 * @polymer
 * @customElement
 */
export class ImpactController extends connect(store)(PolymerElement) {
  static get is() {
    return 'impact-controller';
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

      <app-route
        route="{{route}}"
        pattern="/:section"
        data="{{routeData}}">
      </app-route>
      <iron-pages selected="[[routeData.section]]" attr-for-selected="name" role="main">
        <div name="un-personel">
          <h3> Add un personel </h3>
        </div>
        <div name="non-un">
          <h3> Non Un </h3>
        </div>
        <div name="evacuation">
          <h3> Evacuation </h3>
        </div>
        <div name="property">
          <h3> Property </h3>
        </div>
        <div name="premise">
          <h3> Premise </h3>
        </div>
        <div name="programme">
          <h3> Programme </h3>
        </div>
        <div name="list">
          <h3> List </h3>
        </div>
      </iron-pages>

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
        <hr>
        <div class="right">
          <paper-button raised
              class="smaller"
              on-click="_addNonUn">
            <iron-icon icon="add"></iron-icon>
            Add NON UN Personnel
          </paper-button>
        </div>
        <hr>
        <div class="right">
          <paper-button raised
              class="smaller"
              on-click="_addEvacuation">
            <iron-icon icon="add"></iron-icon>
            Add Evacuation
          </paper-button>
        </div>

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

        <h3>UN Premises(facilities)</h3>
        <hr>
        <div class="right">
          <paper-button raised
              class="smaller"
              on-click="_addPrimese">
            <iron-icon icon="add"></iron-icon>
            Add Premise
          </paper-button>
        </div>

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
      </div>
    `;
  }

  static get properties() {
    return {
      routeData: Object,
      state: Object,
      incidentId: {
        type: Number,
        computed: '_setIncidentId(state.app.locationInfo.incidentId)',
        observer: '_idChanged'
      },
      route: {
        type: Object,
        notify: true
      }
    };
  }

  static get observers() {
    return [
      '_sectionChanged(routeData.section)'
    ];
  }

  _setIncidentId(id) {
    return id;
  }

  _stateChanged(state) {
    this.set('state', state);
  }

  _idChanged(newId) {

  }

  _sectionChanged(section) {
    if (!section) {
      updatePath(`incidents/impact/${this.incidentId}/list`);
    }
  }

  _addUnPersonnel() {
    updatePath(`incidents/impact/${this.incidentId}/un-personel`);
  }

  _addEvacuation() {
    updatePath(`incidents/impact/${this.incidentId}/evacuation`);
  }

  _addProgramme() {
    updatePath(`incidents/impact/${this.incidentId}/programme`);
  }

  _addProperty() {
    updatePath(`incidents/impact/${this.incidentId}/property`);
  }

  _addPrimese() {
    updatePath(`incidents/impact/${this.incidentId}/premise`);
  }

  _addNonUn() {
    updatePath(`incidents/impact/${this.incidentId}/non-un`);
  }

  _stateChanged(state) {
    this.state = state;
    // console.log(state.staticData.impacts.programme);
    // console.log(state.staticData.impacts.property);
    // console.log(state.staticData.impacts.person);
  }
}

window.customElements.define(ImpactController.is, ImpactController);
