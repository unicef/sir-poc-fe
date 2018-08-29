/**
@license
*/
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { updatePath } from '../../common/navigation-helper.js';
import '@polymer/app-route/app-route.js';
import { store } from '../../../redux/store.js';
import '../../styles/shared-styles.js';
import './impact-list.js';

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
          <impact-list></impact-list>
        </div>
      </iron-pages>
    `;
  }

  static get properties() {
    return {
      routeData: Object,
      incidentId: {
        type: Number,
        computed: '_setIncidentId(state.app.locationInfo.incidentId)',
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

  _sectionChanged(section) {
    if (!section) {
      updatePath(`incidents/impact/${this.incidentId}/list`);
    }
  }

  _stateChanged(state) {
    this.state = state;
  }
}

window.customElements.define(ImpactController.is, ImpactController);
