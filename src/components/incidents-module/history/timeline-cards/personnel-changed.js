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
class PersonnelChangedCard extends TimelineCardBase {
  static get template() {
    return html`
       ${this.styles}
       <div class$="[[getCardClass(item)]]" hidden$="[[!hasChangedFields(item.change)]]">
        [[getUserName(item.by_user)]] changed personnel impact fields:
        <p> [[getChangedFileds(item.change)]] </p>
        You can
        <a href="/incidents/history/[[item.incident_id]]/diff-personnel/[[item.id]]">
          view the changes
        </a>
        or
        <a href="/incidents/history/[[item.incident_id]]/view-personnel/[[item.id]]">
          view the entire impact at this revision
        </a>
      </div>
      `;
  }

  static get is() {
    return 'personnel-changed-card';
  }
}

window.customElements.define(PersonnelChangedCard.is, PersonnelChangedCard);
