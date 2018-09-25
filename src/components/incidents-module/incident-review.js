import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import { connect } from 'pwa-helpers/connect-mixin.js';

import '../common/etools-dropdown/etools-dropdown-lite.js';
import { selectIncident } from '../../reducers/incidents.js';
import { editIncident } from '../../actions/incidents.js';
import { clearErrors } from '../../actions/errors.js';
import DateMixin from '../common/date-mixin.js';
import { store } from '../../redux/store.js';
import '../styles/form-fields-styles.js';
import '../styles/grid-layout-styles.js';
import '../styles/shared-styles.js';
import '../common/errors-box.js';

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
      </style>
      <div class="card">
        <div class="layout-horizontal">
          <errors-box></errors-box>
        </div>
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
                          hidden$="[[canNotSave(offline, incident.unsynced, incidentId)]]">
              Save
            </paper-button>
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
        type: Boolean,
      },
      state: {
        type: Object
      },
      visible: {
        type: Boolean,
        value: false,
        observer: '_visibilityChanged'
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

  canNotSave() {
    if (this.offline) {
      return true;
    }
    if (isNaN(this.incidentId) || (this.incident && this.incident.unsynced)) {
      return true;
    }
    return false;
  }

  _visibilityChanged(visible) {
    if (visible === false) {
      store.dispatch(clearErrors());
    }
  }

}

window.customElements.define(IncidentReview.is, IncidentReview);
