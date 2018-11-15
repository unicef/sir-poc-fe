import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { updatePath } from '../../../common/navigation-helper';
import { getCountriesForRegion } from '../../../common/utils.js';

export class ImpactFormBase extends PolymerElement {
  static get properties() {
    return {
      visible: {
        type: Boolean,
        observer: '_visibilityChanged'
      },
      incidentId: {
        type: Number
      },
      data: {
        type: Object,
        value: {
          person: {}
          // incident id (TODO: API should use incident_id for all impacts)
          // incident: null
        }
      },
      getCountriesForRegion: {
        type: Function,
        value: () => getCountriesForRegion
      },
      selectedImpactType: {
        type: Object,
        value: {}
      }
    };
  }

  _visibilityChanged(visible) {
    if (visible) {
      this.resetValidations();
    }
  }

  _shouldShowNextOfKinCheckbox(impactName) {
    return impactName === 'Death';
  }

  _goToIncidentImpacts() {
    updatePath(`/incidents/impact/${this.incidentId}/list/`);
  }

  _hideInfoTooltip(arg) {
    if (!arg) {
      return true;
    }
    return !typeof arg === 'string' && arg !== '';
  }

}
