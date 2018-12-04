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
class PremiseChangedCard extends TimelineCardBase {
  static get template() {
    return html`
       ${this.styles}
       <div class$="[[getCardClass(item)]]" hidden$="[[!hasChangedFields(item.change)]]">
        [[getUserName(item.by_user)]] changed premise impact fields:
        <p> [[getChangedFileds(item.change)]] </p>
        You can
        <a href="/incidents/history/[[item.incident_id]]/diff-premise/[[item.id]]">
          view the changes
        </a>
        or
        <a href="/incidents/history/[[item.incident_id]]/view-premise/[[item.id]]">
          view the entire impact at this revision
        </a>
      </div>
      `;
  }

  static get is() {
    return 'premise-changed-card';
  }
}

window.customElements.define(PremiseChangedCard.is, PremiseChangedCard);
