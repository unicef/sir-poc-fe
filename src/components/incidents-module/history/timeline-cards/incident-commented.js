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
class IncidentCommentedCard extends TimelineCardBase {
  static get template() {
    return html`
      ${this.styles}
      <div class$="[[getCardClass(item)]]">
        [[item.created_by_user.email]] commented on this:
        <p> [[item.comment]] </p>
      </div>
    `;
  }

  static get is() {
    return 'incident-commented-card';
  }
}

window.customElements.define(IncidentCommentedCard.is, IncidentCommentedCard);
