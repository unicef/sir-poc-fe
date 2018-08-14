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
          <display-comment comment="[[item]]" all-users="[[allUsers]]"> </display-comment>
        </template>
      </div>

      <div class="card list" hidden$="[[isOffline]]">
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
      allUsers: {
        type: Array,
        computed: '_setUsers(state.staticData.users)'
      },
      dataItems: {
        type: Array,
        value: []
      },
      isOffline: {
        type: Boolean,
        computed: '_setIsOffline(state.app.offline)'
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

  _setIsOffline(offline) {
    return offline;
  }

  _setIncidentId(id) {
    return id;
  }

  _setComments(comments) {
    return comments;
  }

  _setUsers(users) {
    return users;
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
