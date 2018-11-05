import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-input/paper-textarea.js';
import '@polymer/paper-dialog/paper-dialog.js';
import { connect } from 'pwa-helpers/connect-mixin.js';

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
import { hasPermission, getNameFromId } from '../common/utils';
import './buttons/reject.js';
import './buttons/approve.js';
import './buttons/review-eod.js';
import './buttons/review-dhr.js';
import './buttons/review-dfam.js';
import './buttons/review-legal.js';
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
            <paper-input id="eodReviewDate"
                          placeholder="&#8212;"
                          readonly
                          label="EOD review date"
                          type="text"
                          value="[[prettyDate(incident.eod_review_date)]]">
            </paper-input>
          </div>
          <div class="col col-6" hidden$="[[_canReview(incident.eod_review_by, 'review_eod')]]">
            <paper-input id="eodReviewBy"
                          placeholder="&#8212;"
                          readonly
                          label="EOD review by"
                          type="text"
                          value="[[_getUserName(incident.eod_review_by)]]">
            </paper-input>
          </div>
          <div class="col col-6" hidden$="[[!_canReview(incident.eod_review_by, 'review_eod')]]">
            <review-eod-button incident="[[incident]]"></review-eod-button>
          </div>
        </div>
        <div class="row-h flex-c">
          <div class="col col-6">
            <paper-input id="dhrReviewDate"
                          placeholder="&#8212;"
                          readonly
                          label="DHR review date"
                          type="text"
                          value="[[prettyDate(incident.dhr_review_date)]]">
            </paper-input>
          </div>
          <div class="col col-6" hidden$="[[_canReview(incident.dhr_review_by, 'review_dhr')]]">
            <paper-input id="dhrReviewBy"
                          placeholder="&#8212;"
                          readonly
                          label="DHR review by"
                          type="text"
                          value="[[_getUserName(incident.dhr_review_by)]]">
            </paper-input>
          </div>
          <div class="col col-6" hidden$="[[!_canReview(incident.dhr_review_by, 'review_dhr')]]">
            <review-dhr-button incident="[[incident]]"></review-dhr-button>
          </div>
        </div>
        <div class="row-h flex-c">
          <div class="col col-6">
            <paper-input id="dfamReviewDate"
                          placeholder="&#8212;"
                          readonly
                          label="DFAM review date"
                          type="text"
                          value="[[prettyDate(incident.dfam_review_date)]]">
            </paper-input>
          </div>
          <div class="col col-6" hidden$="[[_canReview(incident.dfam_review_by, 'review_dfam')]]">
            <paper-input id="dfamReviewBy"
                          placeholder="&#8212;"
                          readonly
                          label="DFAM review by"
                          type="text"
                          value="[[_getUserName(incident.dfam_review_by)]]">
            </paper-input>
          </div>
          <div class="col col-6" hidden$="[[!_canReview(incident.dfam_review_by, 'review_dfam')]]">
            <review-dfam-button incident="[[incident]]"></review-dfam-button>
          </div>
        </div>
        <div class="row-h flex-c">
          <div class="col col-6">
            <paper-input id="legalReviewDate"
                          placeholder="&#8212;"
                          readonly
                          label="Legal review date"
                          type="text"
                          value="[[prettyDate(incident.legal_review_date)]]">
            </paper-input>
          </div>
          <div class="col col-6" hidden$="[[_canReview(incident.legal_review_by, 'review_legal')]]">
            <paper-input id="legalReviewBy"
                          placeholder="&#8212;"
                          readonly
                          label="Legal review by"
                          type="text"
                          value="[[_getUserName(incident.legal_review_by)]]">
            </paper-input>
          </div>
          <div class="col col-6" hidden$="[[!_canReview(incident.legal_review_by, 'review_legal')]]">
            <review-legal-button incident="[[incident]]"></review-legal-button>
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
                                        hidden$="[[_hideCommentButton(offline)]]">
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

  _hideCommentButton(offline) {
    return offline || this.readonly || !hasPermission('comment_incident');
  }

  _getUserName(id) {
    return getNameFromId(id, 'users');
  }

  _canReview(reviewerId, permissionsKey) {
    return hasPermission(permissionsKey) && !reviewerId;
  }
}

window.customElements.define(IncidentReview.is, IncidentReview);
