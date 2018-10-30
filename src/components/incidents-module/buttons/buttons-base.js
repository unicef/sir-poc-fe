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
      }
    };
  }

  connectedCallback() {
    this.store = store;
    super.connectedCallback();
  }

  _stateChanged(state) {
    // TODO: after implementing all the buttons, check if anything from redux is needed.
    if (!state) {
      return;
    }
  }

  incidentChanged() {
    // overwrite when needed
  }

  createConfirmationDialog(content, okText, cancelText, callback) {
    const submitWarningDialogContent = document.createElement('span');
    submitWarningDialogContent.innerHTML = content;

    const config = {
      size: 'sm',
      okBtnText: okText || 'Ok',
      cancelBtnText: cancelText || 'Cancel',
      closeCallback: callback || this.dialogConfirmationCallback.bind(this),
      content: submitWarningDialogContent
    };

    this.warningDialog = this.createDynamicDialog(config);

    this.warningDialog.updateStyles({'--etools-dialog-confirm-btn-bg': 'var(--button-primary-bg-color)'});
  }

  dialogConfirmationCallback(event) {
    console.warn('Confirmation callback action not defined for' + this.is);
  }

  cleanDialogs() {
    if (this.warningDialog) {
      this.removeDialog(this.warningDialog);
    }
  }

  openDialog() {
    if (!this.warningDialog) {
      return;
    }
    this.warningDialog.opened = true;
  }
}
