import { DiffViewBase } from '../../../history-components/diff-view.js';
import { html } from '@polymer/polymer/polymer-element.js';
import '../incident-history-navigation-links.js'
/**
 * @polymer
 * @customElement
 */
class PremiseDiffView extends DiffViewBase {
  static get is() {
    return 'premise-diff-view';
  }

  static get navButtons() {
    return html`
      <incident-history-navigation-links page="diff"
                                         view-url="view-property"
                                         working-item="[[workingItem]]">
      </incident-history-navigation-links>`;
  }

  static get properties() {
    return {
      ...super.properties,
      viewUrl: String
    }
  }
}

window.customElements.define(PremiseDiffView.is, PremiseDiffView);
