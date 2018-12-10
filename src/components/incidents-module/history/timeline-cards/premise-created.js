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
class PremiseCreatedCard extends TimelineCardBase {
  static get template() {
    return html`
       ${this.styles}

        <div class$="[[getCardClass(item)]]">
          [[getUserName(item.by_user)]] added an premise impact.
          <span title="View entire impact at this version">
            <a href="/incidents/history/[[item.incident_id]]/view-premise/[[item.id]]">
              View original impact data
            </a>
          </span>
        </div>
      `;
  }

  static get is() {
    return 'premise-created-card';
  }
}

window.customElements.define(PremiseCreatedCard.is, PremiseCreatedCard);