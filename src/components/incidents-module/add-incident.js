/**
@license
*/
import { html } from '@polymer/polymer/polymer-element.js';
import { timeOut } from '@polymer/polymer/lib/utils/async.js';
import { Debouncer } from '@polymer/polymer/lib/utils/debounce.js';
import { scrollToTop } from '../common/content-container-helper.js';
import { IncidentsBaseView } from './incidents-base-view.js';
import { getIncidentModel } from '../../models/incident-model';
import { addIncident,
         setIncidentDraft,
         updateAddedAttachmentIds } from '../../actions/incidents.js';
import { showSnackbar } from '../../actions/app.js';
import { updatePath } from '../common/navigation-helper.js';
import './buttons/reset.js';

/**
 * @polymer
 * @customElement
 */
class AddIncident extends IncidentsBaseView {
  connectedCallback() {
    super.connectedCallback();
    this.readonly = false;
    this.title = 'Add new incident';
    this.hideReviewFields = true;
    this.set('incident', this.state.incidents.draft);
  }

  static get addImpactButtonTmpl() {
    return html`
      <paper-button class="secondary"
                    raised
                    on-tap="saveAndAddImpact"
                    disabled$="[[!canSave(incident.event, state.app.offline, incidentId)]]">
        Add Impact
      </paper-button>
    `;
  }

  static get resetButtonTmpl() {
    return html`
      <reset-button on-reset-incident="resetForm">
      </reset-button>
    `;
  }

  static get observers() {
    return [
      '_incidentChanged(incident.*)'
    ];
  }

  _incidentChanged() {
    this._debouncer = Debouncer.debounce(
        this._debouncer,
        timeOut.after(1000),
        this.saveDraft.bind(this)
    );
  }

  saveDraft() {
    this.store.dispatch(setIncidentDraft(this.incident));
  }

  async save() {
    if (!this.validate()) {
      return;
    }

    let createdId = await this.store.dispatch(addIncident(this.incident));
    if (createdId) {
      this.store.dispatch(updateAddedAttachmentIds(createdId, this.incident.attachments));
      this.handleSuccessfullCreation();
      updatePath(`/incidents/view/${createdId}`);
    }
  }

  async saveAndAddImpact() {
    if (!this.validate()) {
      return;
    }
    let createdId = await this.store.dispatch(addIncident(this.incident));
    if (createdId) {
      this.store.dispatch(updateAddedAttachmentIds(createdId, this.incident.attachments));
      this.handleSuccessfullCreation();
      updatePath(`/incidents/impact/${createdId}/list`);
    }
  }

  handleSuccessfullCreation(incident) {
    scrollToTop();
    this.resetForm();
    this.resetValidations();
    this.showSuccessMessage();
  }

  resetForm() {
    this.incident = getIncidentModel();
    this.resetValidations();
  }

  _idChanged() {
    // nothing to do here
  }

  showSuccessMessage() {
    if (this.state.app.offline) {
      this.store.dispatch(showSnackbar('Incident stored. Must be synced when online'));
    } else {
      this.store.dispatch(showSnackbar('Incident saved'));
    }
  }

}

window.customElements.define('add-incident', AddIncident);
