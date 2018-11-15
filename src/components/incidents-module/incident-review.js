import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-input/paper-textarea.js';
import { connect } from 'pwa-helpers/connect-mixin.js';

import { addComment } from '../../actions/incidents.js';
import { selectIncident } from '../../reducers/incidents.js';
import { showSnackbar } from '../../actions/app.js';
import DateMixin from '../common/date-mixin.js';
import { store } from '../../redux/store.js';
import '../styles/form-fields-styles.js';
import '../styles/grid-layout-styles.js';
import '../styles/shared-styles.js';
import '../common/errors-box.js';
import { PermissionsBase } from '../common/permissions-base-class';
import { updatePath } from '../common/navigation-helper';
import { getNameFromId } from '../common/utils';
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
class IncidentReview extends connect(store)(DateMixin(PermissionsBase)) {
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

      <div class="card" hidden$="[[_hideBottomCard(offline, incident.status)]]">
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
              <approve-button incident="[[incident]]"
                              hidden$="[[_hideApproveButton(offline, incident.status)]]">
              </approve-button>
              <reject-button comment-text="[[commentText]]"
                             incident="[[incident]]"
                             on-tap="validateComment"
                             hidden$="[[_hideRejectButton(offline, incident.status)]]">
              </reject-button>

              <paper-button class="btn" raised
                                        on-click="addComment"
                                        hidden$="[[_hideCommentButton(offline)]]">
                Add comment
              </paper-button>

            </div>
          </div>
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
          <div class="col col-6" hidden$="[[_canReview(offline, incident.eod_review_by, 'eod_review_incident')]]">
            <paper-input id="eodReviewBy"
                          placeholder="&#8212;"
                          readonly
                          label="EOD review by"
                          type="text"
                          value="[[_getUserName(incident.eod_review_by)]]">
            </paper-input>
          </div>
          <div class="col col-6" hidden$="[[!_canReview(offline, incident.eod_review_by, 'eod_review_incident')]]">
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
          <div class="col col-6" hidden$="[[_canReview(offline, incident.dhr_review_by, 'dhr_review_incident')]]">
            <paper-input id="dhrReviewBy"
                          placeholder="&#8212;"
                          readonly
                          label="DHR review by"
                          type="text"
                          value="[[_getUserName(incident.dhr_review_by)]]">
            </paper-input>
          </div>
          <div class="col col-6" hidden$="[[!_canReview(offline, incident.dhr_review_by, 'dhr_review_incident')]]">
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
          <div class="col col-6" hidden$="[[_canReview(offline, incident.dfam_review_by, 'dfam_review_incident')]]">
            <paper-input id="dfamReviewBy"
                          placeholder="&#8212;"
                          readonly
                          label="DFAM review by"
                          type="text"
                          value="[[_getUserName(incident.dfam_review_by)]]">
            </paper-input>
          </div>
          <div class="col col-6" hidden$="[[!_canReview(offline, incident.dfam_review_by, 'dfam_review_incident')]]">
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
          <div class="col col-6" hidden$="[[_canReview(offline, incident.legal_review_by, 'review_review_incident')]]">
            <paper-input id="legalReviewBy"
                          placeholder="&#8212;"
                          readonly
                          label="Legal review by"
                          type="text"
                          value="[[_getUserName(incident.legal_review_by)]]">
            </paper-input>
          </div>
          <div class="col col-6" hidden$="[[!_canReview(offline, incident.legal_review_by, 'review_review_incident')]]">
            <review-legal-button incident="[[incident]]"></review-legal-button>
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
    return offline || this.readonly || !this.hasPermission('add_comment');
  }

  _hideBottomCard(offline, status) {
    return this._hideApproveButton(offline, status) &&
           this._hideRejectButton(offline, status) &&
           this._hideCommentButton(offline);
  }
  _getUserName(id) {
    return getNameFromId(id, 'users');
  }

  _canReview(offline, reviewerId, permissionsKey) {
    return !offline && this.hasPermission(permissionsKey) && !reviewerId;
  }
}

window.customElements.define(IncidentReview.is, IncidentReview);
