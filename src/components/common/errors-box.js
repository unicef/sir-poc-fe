'use strict';

import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/paper-styles/element-styles/paper-material-styles.js';
import '@polymer/paper-icon-button/paper-icon-button.js';

import { connect } from 'pwa-helpers/connect-mixin.js';
import { store } from '../../redux/store.js';
import { clearErrors } from '../../actions/errors';

/**
 * @customElement
 * @polymer
 */
class ErrorsBox extends connect(store)(PolymerElement) {
  static get template() {
    // language=HTML
    return html`
      <style include="paper-material-styles">
        :host {
          width: 100%;
          display: block;
          padding: 16px;
          margin-bottom: 24px;
          border-radius: 5px;
          color: var(--primary-error-color);
          background-color: var(--secondary-error-color);
          box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
                      0 1px 5px 0 rgba(0, 0, 0, 0.12),
                      0 3px 1px -2px rgba(0, 0, 0, 0.2);
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
          background-color: var(--primary-error-color);
          color: var(--light-primary-text-color);
        }
        .cancel-li-display {
          display: block;
        }
      </style>

      <div class="errors-box-header">
        [[errorsBoxTitle]]
      </div>

      <ul>
        <template is="dom-repeat" items=[[preparedErrors]]>
          <li class$="[[getItemClass(item)]]">[[item]]</li>
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
        observer: '_preparedErrorsChanged'
      },
      serverErrors: {
        type: Object,
        notify: true
      }
    };
  }
  _prepareErrors(serverErrors, errors) {
    let errs = [];
    if (serverErrors && typeof serverErrors === 'string') {
      errs = [serverErrors];
    }
    if (errors && typeof errors === 'string') {
      errs = [...errs, ...errors];
    }
    if (errors instanceof Array && errors.length > 0) {
      errs = [...errors];
    }
    if (serverErrors && serverErrors.constructor === Object && Object.keys(serverErrors).length > 0) {
      let serverErrs = this._getServerErrorsArray(serverErrors);
      errs = [...errs, ...serverErrs];
    }
    return errs;
  }

  _getServerErrorsArray(serverErrors) {
    let errsArr = [];

    for (let field in serverErrors) {
      if (serverErrors[field] instanceof Array && serverErrors[field].length > 0) {
        let fieldErrors = serverErrors[field].map(e => field + ' - ' + e);
        errsArr = [...errsArr, ...fieldErrors];
        continue;
      }

      if (typeof serverErrors[field] === 'object') {
        errsArr.push(field + ':');
        let nestedErr = [];
        for (let subfield in serverErrors[field]) {
          nestedErr.push(' ' + subfield + ' - ' + serverErrors[field][subfield]);
        }
        errsArr = [...errsArr, ...nestedErr];
      }
    }
    return errsArr;
  }

  getItemClass(item) {
    return item.startsWith(' ') ? 'cancel-li-display' : '';
  }

  _dismissErrors() {
    this.setProperties({
      errors: [],
      serverErrors: {}
    });
    store.dispatch(clearErrors());
  }

  _preparedErrorsChanged(errors) {
    if (errors && errors instanceof Array && errors.length > 0) {
      this.classList.remove('hidden');
    } else {
      this.classList.add('hidden');
    }
  }

  _stateChanged(state) {
    if (!state) {
      return;
    }
    this.serverErrors = state.errors.serverError;
    this.errors = state.errors.plainErrors;
  }

}

window.customElements.define('errors-box', ErrorsBox);
