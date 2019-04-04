import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { store } from '../../redux/store.js';

import '../styles/shared-styles.js';
import '../styles/grid-layout-styles.js';
import '../styles/form-fields-styles.js';

export class ReviewFields extends connect(store)(PolymerElement) {

  static get template() {
    return html`
      <style include="shared-styles grid-layout-styles form-fields-styles">
      </style>

      <div class="row-h flex-c" hidden$="[[offline]]">
        <div class="col col-3">
          <paper-input id="created_by"
                        label="Created By"
                        placeholder="&#8212;"
                        type="text"
                        value="[[data.created_by_user_name]]"
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
                        value="[[data.last_modify_user_name]]"></paper-input>
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
      state: Object,
      offline: Boolean
    };
  }

  _stateChanged(state) {
    if (!state) {
      return;
    }

    this.offline = state.app.offline;
  }

}

window.customElements.define(ReviewFields.is, ReviewFields);
