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
class IncidentCreatedCard extends TimelineCardBase {
  static get template() {
    return html`
       ${this.styles}

        <div class$="[[getCardClass(item)]]">
          [[item.by_user]] added this incident.
          <span title="View entire incident at this version">
            <a href="/incidents/history/[[item.data.id]]/view-incident/[[item.id]]">
              View original data
            </a>
          </span>
        </div>
      `;
  }

  static get is() {
    return 'incident-created-card';
  }
}

window.customElements.define(IncidentCreatedCard.is, IncidentCreatedCard);
