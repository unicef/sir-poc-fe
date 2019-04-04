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
class ProgrammeCreatedCard extends TimelineCardBase {
  static get template() {
    return html`
       ${this.styles}

        <div class$="[[getCardClass(item)]]">
          [[item.by_user]] added an programme impact.
          <span title="View entire impact at this version">
            <a href="/incidents/history/[[item.incident_id]]/view-programme/[[item.id]]">
              View original impact data
            </a>
          </span>
        </div>
      `;
  }

  static get is() {
    return 'programme-created-card';
  }
}

window.customElements.define(ProgrammeCreatedCard.is, ProgrammeCreatedCard);
