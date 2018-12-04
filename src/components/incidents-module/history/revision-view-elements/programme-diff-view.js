import { DiffViewBase } from '../../../history-components/diff-view.js';
import { html } from '@polymer/polymer/polymer-element.js';
import '../incident-history-navigation-links.js'
/**
 * @polymer
 * @customElement
 */
class ProgrammeDiffView extends DiffViewBase {
  static get is() {
    return 'programme-diff-view';
  }

  static get navButtons() {
    return html`
      <incident-history-navigation-links page="diff"
                                         view-url="view-programme"
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

window.customElements.define(ProgrammeDiffView.is, ProgrammeDiffView);
