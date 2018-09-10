/**
@license
*/
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { store } from '../../../../redux/store.js';
import '../../../styles/shared-styles.js';
import '../../../styles/grid-layout-styles.js';
import '../../../styles/required-fields-styles.js';

/**
 * @polymer
 * @customElement
 */
export class PremiseForm extends connect(store)(PolymerElement) {
  static get is() {
    return 'premise-form';
  }
  static get template() {
    return html`
      <style include="shared-styles grid-layout-styles required-fields-styles">
        :host {
          @apply --layout-vertical;
        }
      </style>

      <div class="card">
        <h3> Premise form </h3>
      </div>
    `;
  }

  static get properties() {
    return {
      state: Object
    };
  }

  _stateChanged(state) {
    this.state = state;
  }
}

window.customElements.define(PremiseForm.is, PremiseForm);
