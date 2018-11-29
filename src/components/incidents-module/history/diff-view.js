import { DiffViewBase } from '../../history-components/diff-view.js';
import { html } from '@polymer/polymer/polymer-element.js';
import './history-navigation-links.js'
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
                                         view-url="viewUrl"
                                         working-item="[[workingItem]]">
      </incident-history-navigation-links>`;
  }
}

window.customElements.define(IncidentDiffView.is, IncidentDiffView);
