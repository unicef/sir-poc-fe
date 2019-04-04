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
class ProgrammeChangedCard extends TimelineCardBase {
  static get template() {
    return html`
       ${this.styles}
       <div class$="[[getCardClass(item)]]" hidden$="[[!hasChangedFields(item.change)]]">
        [[item.by_user]] changed programme impact fields:
        <p> [[getChangedFileds(item.change)]] </p>
        You can
        <a href="/incidents/history/[[item.incident_id]]/diff-programme/[[item.id]]">
          view the changes
        </a>
        or
        <a href="/incidents/history/[[item.incident_id]]/view-programme/[[item.id]]">
          view the entire impact at this revision
        </a>
      </div>
      `;
  }

  static get is() {
    return 'programme-changed-card';
  }
}

window.customElements.define(ProgrammeChangedCard.is, ProgrammeChangedCard);
