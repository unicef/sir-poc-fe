import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { DynamicDialogMixin } from 'etools-dialog/dynamic-dialog-mixin.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { store } from '../../../redux/store.js';

export class ButtonsBaseClass extends connect(store)(DynamicDialogMixin(PolymerElement)) {

  disconnectedCallback() {
    super.disconnectedCallback();
    this.cleanDialogs();
  }

  static get properties() {
    return {
      incident: {
        type: Object,
        observer: 'incidentChanged'
      },
      offline: Boolean
    };
  }

  connectedCallback() {
    this.store = store;
    super.connectedCallback();
  }

  _stateChanged(state) {
    if (!state) {
      return;
    }

    this.offline = state.app.offline;
  }

  incidentChanged() {
    // overwrite when needed
  }

  createConfirmationDialog(content, callback, okText, cancelText) {
    const submitWarningDialogContent = document.createElement('span');
    submitWarningDialogContent.innerHTML = content;

    const config = {
      size: 'sm',
      okBtnText: okText || 'Ok',
      cancelBtnText: cancelText || 'Cancel',
      closeCallback: callback,
      content: submitWarningDialogContent
    };

    this.warningDialog = this.createDynamicDialog(config);

    this.warningDialog.updateStyles({'--etools-dialog-confirm-btn-bg': 'var(--button-primary-bg-color)'});
  }

  cleanDialogs() {
    if (this.warningDialog) {
      this.removeDialog(this.warningDialog);
    }
  }
}
