import { DiffViewBase } from '../../history-components/diff-view.js';
import { html } from '@polymer/polymer/polymer-element.js';
import './history-navigation-links.js';
/**
 * @polymer
 * @customElement
 */
class EventDiffView extends DiffViewBase {
  static get is() {
    return 'event-diff-view';
  }

  static get navButtons() {
    return html`
      <event-history-navigation-links page="diff" working-item="[[workingItem]]">
      </event-history-navigation-links>`;
  }
}

window.customElements.define(EventDiffView.is, EventDiffView);
