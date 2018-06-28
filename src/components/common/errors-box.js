'use strict';

import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-styles/element-styles/paper-material-styles.js';
import '@polymer/paper-icon-button/paper-icon-button.js';

/**
 * @customElement
 * @polymer
 */
class ErrorsBox extends PolymerElement {
  static get template() {
    // language=HTML
    return html`
      <style include="paper-material-styles">
        :host {
          display: block;
          padding: 16px;
          margin-bottom: 24px;
          border-radius: 5px;
          color: #ea4022;
          background-color: #f8d7da;
          box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
        }

        :host(.hidden) {
          display: none;
        }

        .errors-box-header {
          font-weight: bold;
          font-size: 18px;
        }

        ul {
          padding: 0 0 0 20px;
          margin: 0;
        }

        .errors-box-actions {
          margin-top: 24px;
          @apply --layout-horizontal;
          @apply --layout-start-justified;
        }

        paper-button {
          margin: 0;
          background-color: #ea4022;
          color: #fff;
        }
      </style>
      
      <div class="errors-box-header">
        [[errorsBoxTitle]]
      </div>

      <ul>
        <template is="dom-repeat" items=[[preparedErrors]]>
          <li>[[item]]</li>
        </template>
      </ul>

      <div class="errors-box-actions">
        <paper-button raised on-click="_dismissErrors">
          Ok
        </paper-button>
      </div>
    `;
  }

  static get properties() {
    return {
      errorsBoxTitle: {
        type: String,
        value: 'Errors:'
      },
      errors: {
        type: Array,
        value: [],
        notify: true
      },
      preparedErrors: {
        type: Array,
        computed: '_prepareErrors(serverErrors, errors)',
        observer: 'preparedErrorsChanged'
      },
      serverErrors: {
        type: Object,
        notify: true
      }
    };
  }

  _prepareErrors(serverErrors, errors) {
    let errs = [];
    if (errors instanceof Array && errors.length > 0) {
      errs = [...errors];
    }
    if (serverErrors && serverErrors.constructor === Object && Object.keys(serverErrors).length > 0) {
      let serverErrs = this._prepareServerErrors(serverErrors);
      errs = [...errs, ...serverErrs];
    }
    return errs;
  }

  _prepareServerErrors(serverErrors) {
    let errs = [];
    for (let field in serverErrors) {
      if (serverErrors[field] instanceof Array && serverErrors[field].length > 0) {
        let fieldErrors = serverErrors[field].map(e => field + ' - ' + e);
        errs = [...errs, ...fieldErrors];
      }
    }
    return errs;
  }

  _dismissErrors() {
    this.setProperties({
      errors: [],
      serverErrors: {}
    });
  }

  preparedErrorsChanged(errors) {
    if (errors && errors instanceof Array && errors.length > 0) {
      this.classList.remove('hidden');
    } else {
      this.classList.add('hidden');
    }
  }

}

window.customElements.define('errors-box', ErrorsBox);
