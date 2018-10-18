import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { store } from '../../../../redux/store.js';

import '../../../styles/shared-styles.js';
import '../../../styles/grid-layout-styles.js';
import '../../../styles/form-fields-styles.js';


export class ReviewFields extends connect(store)(PolymerElement) {

  static get template() {
    return html`
      <style include="shared-styles grid-layout-styles form-fields-styles">
      </style>

      <div class="row-h flex-c">
        <div class="col col-3">
          <paper-input id="created_by"
                        label="Created by"
                        placeholder="&#8212;"
                        type="text"
                        value="[[_getUsername(data.created_by_user_id)]]"
                        readonly></paper-input>
        </div>
        <div class="col col-3">
          <datepicker-lite id="created_on"
                            label="Created on"
                            value="[[data.created_on]]"
                            readonly></datepicker-lite>
        </div>
        <div class="col col-3">
          <paper-input id="last_edited_by"
                        label="Last edited by"
                        placeholder="&#8212;"
                        type="text"
                        readonly
                        value="[[_getUsername(data.last_modify_user_id)]]"></paper-input>
        </div>
        <div class="col col-3">
          <datepicker-lite id="last_edited_on"
                            label="Last edited on"
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
      state: Object,
    };
  }

  _stateChanged(state) {
    this.staticData = state.staticData;
  }

  _getUsername(userId) {
    if (userId === null || userId === undefined) {
      return 'N/A';
    }

    let user = this.staticData.users.find(u => Number(u.id) === Number(userId));
    if (user) {
      return user.name;
    }
    return 'N/A';
  }
}

window.customElements.define(ReviewFields.is, ReviewFields);
