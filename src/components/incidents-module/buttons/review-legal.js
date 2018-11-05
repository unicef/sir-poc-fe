/**
@license
*/
import '@polymer/paper-button/paper-button.js';
import { html } from '@polymer/polymer/polymer-element.js';
import { reviewIncidentLegal } from '../../../actions/incidents.js';
import { showSnackbar } from '../../../actions/app.js';
import { ButtonsBaseClass } from './buttons-base.js';
import { updatePath } from '../../common/navigation-helper';
import '../../styles/button-styles.js';

/**
 * @polymer
 * @customElement
 *
 */
class ReviewLegalButton extends ButtonsBaseClass {
  static get template() {
    return html`
      <style include="button-styles">
        paper-button {
          margin-top: 16px;
        }
      </style>
      <paper-button class="no-t-transform" raised on-tap="openDialog">
        Mark as reviewed
      </paper-button>
      `;
  }

  static get is() {
    return 'review-legal-button';
  }

  incidentChanged() {
    if (!this.warningDialog && this.incident) {
      this.createReviewConfirmationDialog();
    }
  }

  createReviewConfirmationDialog() {
    let content = `Are you sure you want to mark this as reviewed?`;
    let okText = `Mark as reviewed`;
    this.createConfirmationDialog(content, okText);
  }

  dialogConfirmationCallback(event) {
    if (event.detail.confirmed) {
      this.markAsReviewed();
    }
  }

  async markAsReviewed() {
    let successfull = await this.store.dispatch(reviewIncidentLegal(this.incident));

    if (typeof successfull === 'boolean' && successfull) {
      this.showSuccessMessage();
      updatePath(`/incidents/list/`);
    }
  }

  showSuccessMessage() {
    this.store.dispatch(showSnackbar('Incident marked as reviewed'));
  }
}

window.customElements.define(ReviewLegalButton.is, ReviewLegalButton);
