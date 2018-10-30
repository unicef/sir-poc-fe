import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { DynamicDialogMixin } from 'etools-dialog/dynamic-dialog-mixin.js';
import { store } from '../../../redux/store.js';

export class ButtonsBaseClass extends DynamicDialogMixin(PolymerElement) {
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

  disconnectedCallback() {
    super.disconnectedCallback();
    this.cleanDialogs();
  }

  incidentChanged() {
    // overwrite when needed
  }

  createConfirmationDialog(warningText, okText, cancelText, callback) {
    const dialogContent = document.createElement('span');
    dialogContent.innerHTML = warningText;

    const config = {
      size: 'sm',
      okBtnText: okText || 'Ok',
      cancelBtnText: cancelText || 'Cancel',
      closeCallback: callback || this.dialogConfirmationCallback.bind(this),
      content: dialogContent
    };

    this.warningDialog = this.createDynamicDialog(config);

    this.warningDialog.updateStyles({'--etools-dialog-confirm-btn-bg': 'var(--button-primary-bg-color)'});
  }

  dialogConfirmationCallback(event) {
    console.warn('Confirmation callback action not defined');
  }

  openDialog() {
    if (!this.warningDialog) {
      return;
    }
    this.warningDialog.opened = true;
  }

  cleanDialogs() {
    if (this.warningDialog) {
      this.removeDialog(this.warningDialog);
    }
  }
}
