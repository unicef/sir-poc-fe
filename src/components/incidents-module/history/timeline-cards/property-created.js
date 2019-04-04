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
class PropertyCreatedCard extends TimelineCardBase {
  static get template() {
    return html`
       ${this.styles}

        <div class$="[[getCardClass(item)]]">
          [[item.by_user]] added an property impact.
          <span title="View entire impact at this version">
            <a href="/incidents/history/[[item.incident_id]]/view-property/[[item.id]]">
              View original impact data
            </a>
          </span>
        </div>
      `;
  }

  static get is() {
    return 'property-created-card';
  }
}

window.customElements.define(PropertyCreatedCard.is, PropertyCreatedCard);
