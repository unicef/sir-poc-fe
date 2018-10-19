import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { clearErrors } from '../../../../actions/errors.js';
import { store } from '../../../../redux/store.js';
import {updatePath} from '../../../common/navigation-helper';

export class ImpactFormBase extends PolymerElement {
  static get properties() {
    return {
      visible: {
        type: Boolean,
        observer: '_visibilityChanged'
      },
      data: {
        type: Object,
        value: {
          person: {},
          incident_id: null
        }
      }
    };
  }

  _visibilityChanged(visible) {
    if (visible === false) {
      store.dispatch(clearErrors());
    } else {
      this.resetValidations();
    }
  }

  _shouldShowNextOfKinCheckbox(impactName) {
    return impactName === 'Death';
  }

  _goToIncidentImpacts() {
    updatePath(`/incidents/impact/${this.data.incident_id}/list/`);
  }

}
