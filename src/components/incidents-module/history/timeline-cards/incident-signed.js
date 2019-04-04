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
class IncidentSignedCard extends TimelineCardBase {
  static get template() {
    return html`
       ${this.styles}
        <div class$="[[getCardClass(item)]]">
          [[item.by_user]] signed this on behalf of [[getTypeOfSignature(item.change)]]<br>
        </div>
      `;
  }

  static get is() {
    return 'incident-signed-card';
  }

  getTypeOfSignature(changesObj) {
    let keys = Object.keys(changesObj);
    switch (true) {
      case keys.indexOf('staff_wellbeing_review_by') > -1:
        return 'Staff Wellbeing';
      case keys.indexOf('legal_review_by') > -1:
        return 'Legal';
      case keys.indexOf('dhr_review_by') > -1:
        return 'DHR';
      case keys.indexOf('dfam_review_by') > -1:
        return 'DFAM';
      case keys.indexOf('eod_review_by') > -1:
        return 'EOD';
    }
    return 'N/A';
  }
}

window.customElements.define(IncidentSignedCard.is, IncidentSignedCard);
