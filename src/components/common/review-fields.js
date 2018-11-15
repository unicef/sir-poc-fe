import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { getNameFromId } from '../common/utils.js';

import '../styles/shared-styles.js';
import '../styles/grid-layout-styles.js';
import '../styles/form-fields-styles.js';

export class ReviewFields extends PolymerElement {

  static get template() {
    return html`
      <style include="shared-styles grid-layout-styles form-fields-styles">
      </style>

      <div class="row-h flex-c">
        <div class="col col-3">
          <paper-input id="created_by"
                        label="Created By"
                        placeholder="&#8212;"
                        type="text"
                        value="[[getUserName(data.created_by_user_id)]]"
                        readonly></paper-input>
        </div>
        <div class="col col-3">
          <datepicker-lite id="created_on"
                            label="Created On"
                            value="[[data.created_on]]"
                            readonly></datepicker-lite>
        </div>
        <div class="col col-3">
          <paper-input id="last_edited_by"
                        label="Last Edited By"
                        placeholder="&#8212;"
                        type="text"
                        readonly
                        value="[[getUserName(data.last_modify_user_id)]]"></paper-input>
        </div>
        <div class="col col-3">
          <datepicker-lite id="last_edited_on"
                            label="Last Edited On"
                            value="[[data.last_modify_date]]"
                            readonly></datepicker-lite>
        </div>
      </div>
    `;
  }

  static get is() {
    return 'review-fields';
  }

  static get properties() {
    return {
      data: Object,
      state: Object
    };
  }

  getUserName(userId) {
    return getNameFromId(userId, 'users');
  }
}

window.customElements.define(ReviewFields.is, ReviewFields);
