import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { store } from '../../redux/store.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { selectIncidentComments } from '../../reducers/incidents.js';
import { addComment } from '../../actions/incidents.js';
import './display-comment.js';
import './add-comment.js';
import '../styles/shared-styles.js';

/**
 * @polymer
 * @customElement
 */
class IncidentComments extends connect(store)(PolymerElement) {
  static get template() {
    return html`
      <style include="shared-styles">
        :host {
          display: block;
        }
      </style>
      <div class="card list" hidden$="[[!dataItems.length]]">
        <template is="dom-repeat" items="{{dataItems}}">
          <display-comment comment="[[item]]"> </display-comment>
        </template>
      </div>

      <div class="card list">
        <add-comment id="addComment" on-add-comment="addComment"></add-comment>
      </div>
    `;
  }

  static get properties() {
    return {
      incidentId: {
        type: String,
        computed: '_setIncidentId(state.app.locationInfo.incidentId)'
      },
      allComments: {
        type: Array,
        computed: '_setComments(state.incidents.comments)'
      },
      dataItems: {
        type: Array,
        value: []
      },
      state: {
        type: Object
      }
    };
  }

  static get observers() {
    return [
      'setIncidentComments(incidentId, allComments)'
    ];
  }

  _stateChanged(state) {
    this.state = state;
  }

  setIncidentComments(id, allComments) {
    if (!id || allComments === undefined) {
      return;
    }

    if (!allComments || !allComments.length) {
      this.dataItems = [];
      return;
    }

    this.dataItems = JSON.parse(JSON.stringify(selectIncidentComments(this.state))) || [];
  }

  _setIncidentId(id) {
    return id;
  }

  _setComments(comments) {
    return comments;
  }

  async addComment(e) {
    let comment = {
      incident: this.incidentId,
      comment: e.detail
    };

    let successfull = await store.dispatch(addComment(comment));
    if (typeof successfull === 'boolean' && successfull) {
      this.$.addComment.resetForm();
    }
  }

}

window.customElements.define('incident-comments', IncidentComments);
