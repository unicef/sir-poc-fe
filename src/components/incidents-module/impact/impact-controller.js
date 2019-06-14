/**
@license
*/
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import '@polymer/app-route/app-route.js';

import { store } from '../../../redux/store.js';
import { updatePath } from '../../common/navigation-helper.js';

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
      <app-route
        route="{{route}}"
        pattern="/:section"
        data="{{routeData}}"
        tail="{{subroute}}">
      </app-route>
      <app-route
        route="{{subroute}}"
        pattern="/:id"
        data="{{subrouteData}}">
      </app-route>
      <iron-pages selected="[[routeData.section]]" attr-for-selected="name" selected-attribute="visible" role="main">
        <un-personnel-form name="un-personnel" impact-id="[[subrouteData.id]]"></un-personnel-form>
        <non-un-personnel-form name="non-un" impact-id="[[subrouteData.id]]"></non-un-personnel-form>
        <evacuation-form name="evacuation" impact-id="[[subrouteData.id]]"></evacuation-form>
        <property-form name="property" impact-id="[[subrouteData.id]]"></property-form>
        <premise-form name="premise" impact-id="[[subrouteData.id]]"></premise-form>
        <programme-form name="programme" impact-id="[[subrouteData.id]]"></programme-form>
        <impacts-view name="list" impact-id="[[subrouteData.id]]"></impacts-view>
      </iron-pages>
    `;
  }

  static get properties() {
    return {
      subroute: Object,
      routeData: Object,
      subrouteData: Object,
      incidentId: {
        type: Number,
        computed: '_setIncidentId(state.app.locationInfo.incidentId)'
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
