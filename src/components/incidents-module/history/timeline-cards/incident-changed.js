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
class IncidentChangedCard extends TimelineCardBase {
  static get template() {
    return html`
       ${this.styles}
       <div class$="[[getCardClass(item)]]" hidden$="[[!hasChangedFields(item.change)]]">
        [[getUserName(item.by_user)]] changed fields:
        <p> [[getChangedFileds(item.change)]] </p>
        You can
        <a href="/incidents/history/[[item.data.id]]/diff-incident/[[item.id]]">
          view the changes
        </a>
        or
        <a href="/incidents/history/[[item.data.id]]/view-incident/[[item.id]]">
          view the entire incident at this revision
        </a>
      </div>
      `;
  }

  static get is() {
    return 'incident-changed-card';
  }
}

window.customElements.define(IncidentChangedCard.is, IncidentChangedCard);
