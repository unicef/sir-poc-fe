import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-input/paper-textarea.js';
import '@polymer/paper-dialog/paper-dialog.js';
import { connect } from 'pwa-helpers/connect-mixin.js';

import '../common/etools-dropdown/etools-dropdown-lite.js';
import { editIncident, addComment } from '../../actions/incidents.js';
import { selectIncident } from '../../reducers/incidents.js';
import { showSnackbar } from '../../actions/app.js';
import DateMixin from '../common/date-mixin.js';
import { store } from '../../redux/store.js';
import '../styles/form-fields-styles.js';
import '../styles/grid-layout-styles.js';
import '../styles/shared-styles.js';
import '../common/errors-box.js';
import { updatePath } from '../common/navigation-helper';
import './buttons/reject.js';
import './buttons/approve.js';
/**
 * @polymer
 * @customElement
 */
class IncidentReview extends connect(store)(DateMixin(PolymerElement)) {
  static get template() {
    return html`
      <style include="shared-styles grid-layout-styles form-fields-styles">
        :host {
          display: block;
        }
        .error-card {
          padding: 0;
          box-shadow: none;
        }
        errors-box {
          width: auto;
        }
      </style>

      <div class="card error-card" hidden$="[[!errors.length]]">
        <errors-box prepared-errors="{{errors}}"></errors-box>
      </div>

      <div class="card">
        <div class="row-h flex-c">
          <div class="col col-6">
            <etools-dropdown-lite id="eodReview"
                                  readonly="[[readonly]]"
                                  label="EOD review by"
                                  options="[[state.staticData.users]]"
                                  selected="{{incident.eod_review_by}}">
            </etools-dropdown-lite>
          </div>
          <div class="col col-6">
            <paper-input id="eodReviewDate"
                          placeholder="&#8212;"
                          readonly
                          label="EOD review date"
                          type="text"
                          value="[[prettyDate(incident.eod_review_date)]]">
            </paper-input>
          </div>
        </div>
        <div class="row-h flex-c">
          <div class="col col-6">
            <etools-dropdown-lite id="dhrReview"
                                  readonly="[[readonly]]"
                                  label="DHR review by"
                                  options="[[state.staticData.users]]"
                                  selected="{{incident.dhr_review_by}}">
            </etools-dropdown-lite>
          </div>
          <div class="col col-6">
            <paper-input id="dhrReviewDate"
                          placeholder="&#8212;"
                          readonly
                          label="DHR review date"
                          type="text"
                          value="[[prettyDate(incident.dhr_review_date)]]">
            </paper-input>
          </div>
        </div>
        <div class="row-h flex-c">
          <div class="col col-6">
            <etools-dropdown-lite id="dfamReview"
                                  readonly="[[readonly]]"
                                  label="DFAM review by"
                                  options="[[state.staticData.users]]"
                                  selected="{{incident.dfam_review_by}}">
            </etools-dropdown-lite>
          </div>
          <div class="col col-6">
            <paper-input id="dfamReviewDate"
                          placeholder="&#8212;"
                          readonly
                          label="DFAM review date"
                          type="text"
                          value="[[prettyDate(incident.dfam_review_date)]]">
            </paper-input>
          </div>
        </div>
        <div class="row-h flex-c">
          <div class="col col-6">
            <etools-dropdown-lite id="legalReview"
                                  readonly="[[readonly]]"
                                  label="Legal review by"
                                  options="[[state.staticData.users]]"
                                  selected="{{incident.legal_review_by}}">
            </etools-dropdown-lite>
          </div>
          <div class="col col-6">
            <paper-input id="legalReviewDate"
                          placeholder="&#8212;"
                          readonly
                          label="Legal review date"
                          type="text"
                          value="[[prettyDate(incident.legal_review_date)]]">
            </paper-input>
          </div>
        </div>
        <div class="row-h flex-c">
          <div class="col col-12">
            <paper-button raised
                          on-click="save"
                          hidden$="[[!canSave(offline, incident.unsynced, incidentId)]]">
              Save
            </paper-button>
          </div>
        </div>
      </div>
      <div class="card">
          <div class="row-h flex-c">
            <div class="col col-12">
              <paper-textarea label="Write your comment here" id="commentText"
                              required auto-validate
                              error-message="Please add a comment"
                              value="{{commentText}}"></paper-textarea>
            </div>
          </div>
          <div class="row-h flex-c">
            <div class="col col-12">
              <paper-button class="btn" raised
                                        on-click="addComment"
                                        hidden$="[[offline]]">
                Add comment
              </paper-button>

              <approve-button incident="[[incident]]"
                              hidden$="[[_hideApproveButton(offline, incident.status)]]">
              </approve-button>

              <reject-button comment-text="[[commentText]]"
                             incident="[[incident]]"
                             on-tap="validateComment"
                             hidden$="[[_hideRejectButton(offline, incident.status)]]">
              </reject-button>
            </div>
          </div>
      </div>
    `;
  }

  static get is() {
    return 'incident-review';
  }

  static get properties() {
    return {
      incidentId: {
        type: String,
        observer: '_idChanged'
      },
      offline: {
        type: Boolean
      },
      state: {
        type: Object
      },
      incident: Object
    };
  }

  static get observers() {
    return [
    ];
  }

  _idChanged() {
    this.incident = JSON.parse(JSON.stringify(selectIncident(this.state)));
  }

  _stateChanged(state) {
    this.state = state;
    this.offline = state.app.offline;
    this.incidentId = state.app.locationInfo.incidentId;
  }

  save() {
    store.dispatch(editIncident(this.incident));
  }

  canSave() {
    if (this.offline) {
      return false;
    }
    if (isNaN(this.incidentId) || (this.incident && this.incident.unsynced)) {
      return false;
    }
    return true;
  }

  restComment() {
    this.commentText = '';
    this.$.commentText.invalid = false;
  }

  validateComment() {
    return this.$.commentText.validate();
  }

  async addComment() {
    if (!this.validateComment()) {
      return;
    }

    let comment = {
      incident: this.incidentId,
      comment: this.commentText
    };

    let successfull = await store.dispatch(addComment(comment));
    if (typeof successfull === 'boolean' && successfull) {
      this.restComment();
      store.dispatch(showSnackbar('Comment added'));
    }
  }

  _hideApproveButton(offline, status) {
    return ['submitted', 'rejected'].indexOf(status) === -1 || offline;
  }

  _hideRejectButton(offline, status) {
    return status !== 'submitted' || offline;
  }
}

window.customElements.define(IncidentReview.is, IncidentReview);
