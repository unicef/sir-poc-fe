/**
@license
*/
import '@polymer/iron-icons/iron-icons.js';
import { html } from '@polymer/polymer/polymer-element.js';
import { deleteIncidentAttachment } from '../../../actions/incidents.js';
import { showSnackbar } from '../../../actions/app.js';
import { ButtonsBaseClass } from './buttons-base.js';
import { updatePath } from '../../common/navigation-helper';
import '../../styles/button-styles.js';

/**
 * @polymer
 * @customElement
 *
 */
class DeleteAttachmentButton extends ButtonsBaseClass {
  static get template() {
    return html`
      <style include="button-styles">
        iron-icon {
          color: var(--primary-color);
          cursor: pointer;
        }
      </style>

      <iron-icon icon="icons:delete"
                    on-tap="openDialog">
      </iron-icon>
      `;
  }

  static get is() {
    return 'delete-attachment-button';
  }

  static get properties() {
    return {
      attachment: Object
    };
  }

  connectedCallback() {
    super.connectedCallback();
    if (!this.warningDialog && this.attachment) {
      this.createDeleteConfirmationDialog();
    }
  }

  createDeleteConfirmationDialog() {
    let content = `Are you sure you want to delete this attachment?`;
    let okText = `Delete`;
    this.createConfirmationDialog(content, okText);
  }

  async delete() {
    let successfull = await this.store.dispatch(deleteIncidentAttachment(this.attachment.id));

    if (typeof successfull === 'boolean' && successfull) {
      this.fireSuccessEvent();
    }
  }

  dialogConfirmationCallback(event) {
    if (event.detail.confirmed) {
      this.delete();
    }
  }

  fireSuccessEvent() {
    let successEvent = new CustomEvent('remove-attachment', {
      detail: this.attachment,
      bubbles: true,
      composed: true

    });
    this.dispatchEvent(successEvent);
  }
}

window.customElements.define(DeleteAttachmentButton.is, DeleteAttachmentButton);
