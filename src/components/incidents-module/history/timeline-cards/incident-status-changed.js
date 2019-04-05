/**
@license
*/
import { html } from '@polymer/polymer/polymer-element.js';
import { TimelineCardBase } from './card-base-class.js';

/**
 * @polymer
 * @customElement
 *
 */
class IncidentStatusChangedCard extends TimelineCardBase {
  static get template() {
    return html`
       ${this.styles}
        <div class$="[[getCardClass(item)]]">
          [[item.by_user_display]] [[item.change.status.after]] this <br>
        </div>
      `;
  }

  static get is() {
    return 'incident-status-changed-card';
  }
}

window.customElements.define(IncidentStatusChangedCard.is, IncidentStatusChangedCard);
