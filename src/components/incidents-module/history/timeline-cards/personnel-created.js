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
class PersonnelCreatedCard extends TimelineCardBase {
  static get template() {
    return html`
       ${this.styles}

        <div class$="[[getCardClass(item)]]">
          [[item.by_user_display]] added a personnel impact.
          <span title="View entire impact at this version">
            <a href="/incidents/history/[[item.incident_id]]/view-personnel/[[item.id]]">
              View original impact data
            </a>
          </span>
        </div>
      `;
  }

  static get is() {
    return 'personnel-created-card';
  }
}

window.customElements.define(PersonnelCreatedCard.is, PersonnelCreatedCard);
