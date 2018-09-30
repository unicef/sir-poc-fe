/**
@license
*/
import { IncidentsBaseView } from './incidents-base-view.js';
import { editIncident } from '../../actions/incidents.js';
import { makeRequest, prepareEndpoint } from '../../components/common/request-helper.js';
import { Endpoints } from '../../config/endpoints.js';
import { serverError } from '../../actions/errors';

/**
 * @polymer
 * @customElement
 */
class EditIncident extends IncidentsBaseView {
  static get is() {
    return 'edit-incident';
  }

  connectedCallback() {
    super.connectedCallback();
    this.title = 'Edit incident';
  }

  save() {
    if (!this.validate()) {
      return;
    }

    this.saveAttachmentsNotes().then(() =>{
      this.store.dispatch(editIncident(this.incident));
    });
  }

  saveAttachmentsNotes() {
    if (this.state.app.offline || this.incident.unsynced) {
      return Promise.resolve();
    }
    if (!this.incident.attachments || !this.incident.attachments.length) {
      return Promise.resolve();
    }
    let origIncident = this.state.incidents.list.find(elem => elem.id === Number(this.incidentId));
    if (!origIncident) {
      return Promise.resolve();
    }

    let attChanges = [];
    let origAtt = origIncident.attachments;
    let currAtt = this.incident.attachments;

    for (let i = 0; i < origAtt.length; i++) {
      if (origAtt[i].note !== currAtt[i].note) {
        attChanges.push({
          id: currAtt[i].id,
          note: currAtt[i].note
        });
      }
    }

    if (!attChanges.length) {
      return Promise.resolve();
    }

    let operations = [];
    attChanges.forEach((c) => {
      let endpoint = prepareEndpoint(Endpoints.editIncidentAttachments, {id: c.id});
      operations.push(makeRequest(endpoint, {note: c.note}));
    });

    return Promise.all(operations).catch((err) => {
           this.store.dispatch(serverError(err.status === 500 ?
             'There was an error updating Related Documents section' : err));
           return Promise.resolve(); // the rest of the Incident changes will be saved despite attachments error
          });
  }

}

window.customElements.define(EditIncident.is, EditIncident);
