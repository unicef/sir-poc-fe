/**
@license
*/
import { html } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-icons/editor-icons.js';
import { IncidentsBaseView } from './incidents-base-view.js';
import './buttons/submit.js';
/**
 * @polymer
 * @customElement
 *
 */
class ViewIncident extends IncidentsBaseView {
  static get submitIncidentTmpl() {
    // language=HTML
    return html`
      <submit-button incident="[[incident]]"
                     hidden$="[[!canSubmit(state.app.offline, incident.status, incident.unsynced)]]">
      </submit-button>`;
  }

  static get goToEditBtnTmpl() {
    // language=HTML
    return html`
      <a href="/incidents/edit/[[incidentId]]"
         hidden$="[[!canEdit(state.app.offline, incident.status, incident.unsynced)]]">
        <paper-button raised>
          Edit
        </paper-button>
      </a>
    `;
  }

  static get changeOwnership() {
     // language=HTML
    return html`
    <paper-button raised on-click="widgetClicked"
     hidden$="[[!canViewBtn(state.app.offline, incident.status, incident.unsynced)]]">CHANGE OWNERSHIP</paper-button>
           <paper-dialog id="modal" modal >
                <h2>USERS</h2>
                <div>
                <etools-dropdown 
                          class="filter select"
                          label="Users"
                          enable-none-option
                          option-label="display_name"
                          option-value="id"
                          options="[[reportingUsers]]"
                          selected="{{userId}}"
                    </etools-dropdown>  
                 </div>  
                    
              <div class="buttons">
                  <paper-button dialog-dismiss on-click="_closeDialog">Cancel</paper-button>
                  <paper-button  dialog-confirm on-click="_changeOwnership"
                   disabled$="[[!userId]]">Change</paper-button>
             </div>
       </paper-dialog> 
    `;
  }

  static get changeToDraftBtnTmpl() {
     // language=HTML
    return html`
    <template is="dom-if" if="[[isSubmitted(incident)]]">
        <paper-button class="danger" raised on-click="_changeToDraft" incident-id$="[[incident.id]]">
          Change to Draft
       </paper-button>
   <template>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    this.readonly = true;
    this.title = 'View incident';
  }

  canSubmit(offline, status, unsynced) {
    return ['created', 'rejected'].indexOf(status) > -1 &&
          !unsynced && !offline && this.hasPermission('submit_incident');
  }
}

window.customElements.define('view-incident', ViewIncident);
