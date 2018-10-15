import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { clearErrors } from '../../../../actions/errors.js';
import { store } from '../../../../redux/store.js';

export class ImpactFormBase extends PolymerElement {
  static get properties() {
    return {
      visible: {
        type: Boolean,
        observer: '_visibilityChanged'
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
}
