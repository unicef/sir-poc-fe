/**
@license
*/
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
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
      route: {
        type: Object,
        notify: true
      }
    };
  }

  _addUnPersonnel() {
    this.set('routeData.section', 'un-personel');
  }
  _addNonUn() {
    this.set('routeData.section', 'non-un');
  }
  _addEvacuation() {
    this.set('routeData.section', 'evacuation');
  }
  _addProperty() {
    this.set('routeData.section', 'property');
  }
  _addPrimese() {
    this.set('routeData.section', 'premise');
  }
  _addProgramme() {
    this.set('routeData.section', 'programme');
  }

  _stateChanged(state) {
    // console.log(state.staticData.impacts.programme);
    // console.log(state.staticData.impacts.property);
    // console.log(state.staticData.impacts.person);
  }
}

window.customElements.define(ImpactController.is, ImpactController);
