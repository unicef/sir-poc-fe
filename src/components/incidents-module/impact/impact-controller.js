/**
@license
*/
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { updatePath } from '../../common/navigation-helper.js';
import '@polymer/app-route/app-route.js';
import { store } from '../../../redux/store.js';
import '../../styles/shared-styles.js';
import './impacts-view.js';

import './forms/premise.js';
import './forms/property.js';
import './forms/programme.js';
import './forms/evacuation.js';
import './forms/un-personnel.js';
import './forms/non-un-personnel.js';

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
          <un-personnel-form></un-personnel-form>
        </div>
        <div name="non-un">
          <non-un-personnel-form></non-un-personnel-form>
        </div>
        <div name="evacuation">
          <evacuation-form></evacuation-form>
        </div>
        <div name="property">
          <property-form></property-form>
        </div>
        <div name="premise">
          <premise-form></premise-form>
        </div>
        <div name="programme">
          <programme-form></programme-form>
        </div>
        <div name="list">
          <impacts-view></impacts-view>
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
