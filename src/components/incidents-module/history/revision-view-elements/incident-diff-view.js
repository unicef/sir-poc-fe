import { DiffViewBase } from '../../../history-components/diff-view.js';
import { html } from '@polymer/polymer/polymer-element.js';
import '../incident-history-navigation-links.js';
/**
 * @polymer
 * @customElement
 */
class IncidentDiffView extends DiffViewBase {
  static get is() {
    return 'incident-diff-view';
  }

  static get navButtons() {
    return html`
      <incident-history-navigation-links page="diff"
                                         view-url="[[viewUrl]]"
                                         module="[[module]]"
                                         working-item="[[workingItem]]">
      </incident-history-navigation-links>`;
  }

  static get properties() {
    return {
      ...super.properties,
      viewUrl: String,
      module: String
    };
  }
}

window.customElements.define(IncidentDiffView.is, IncidentDiffView);
