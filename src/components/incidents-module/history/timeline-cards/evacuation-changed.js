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
class EvacuationChangedCard extends TimelineCardBase {
  static get template() {
    return html`
       ${this.styles}
       <div class$="[[getCardClass(item)]]" hidden$="[[!hasChangedFields(item.change)]]">
        [[item.by_user_display]] changed evacuation impact fields:
        <p> [[getChangedFileds(item.change)]] </p>
        You can
        <a href="/incidents/history/[[item.incident_id]]/diff-evacuation/[[item.id]]">
          view the changes
        </a>
        or
        <a href="/incidents/history/[[item.incident_id]]/view-evacuation/[[item.id]]">
          view the entire impact at this revision
        </a>
      </div>
      `;
  }

  static get is() {
    return 'evacuation-changed-card';
  }
}

window.customElements.define(EvacuationChangedCard.is, EvacuationChangedCard);
