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
        type: Number,
        observer: '_incidentIdChanged'
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
      },
      specialConditionImpacts: {
        type: Array,
        value: ['Rape', 'Stalking', 'Sexually assaulted', 'Sexual harassment']
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

  _incidentIdChanged(newId) {
    if (newId) {
      this.data = {};
    }
  }

  isSpecialConditionImpact() {
    if (!this.selectedImpactType) {
      return false;
    }
    return this.specialConditionImpacts.indexOf(this.selectedImpactType.name) > -1;
  }
}
