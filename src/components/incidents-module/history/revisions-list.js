/**
@license
*/
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-icon-button';
import '@polymer/iron-icons/editor-icons.js';
import 'etools-data-table';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { store } from '../../../redux/store.js';
import '../../styles/shared-styles.js';
import '../../styles/grid-layout-styles.js';
import { getLabelForField } from './history-helper.js';

export class RevisionsList extends connect(store)(PolymerElement)  {
  static get template() {
    return html`
      <style include="shared-styles grid-layout-styles data-table-styles">
        :host {
          @apply --layout-vertical;
        }

        etools-data-table-row[no-collapse] {
          padding-left: 32px;
        }

        .action {
          text-transform: capitalize;
        }
      </style>
      <div class="card list">
        <etools-data-table-header id="listHeader" label="History of changes">
          <etools-data-table-column class="col-3">
            Action
          </etools-data-table-column>
          <etools-data-table-column class="col-4">
            By user
          </etools-data-table-column>
          <etools-data-table-column class="col-4">
            Date and time
          </etools-data-table-column>
          <etools-data-table-column class="col-1">
          </etools-data-table-column>
        </etools-data-table-header>

        <template id="rows" is="dom-repeat" items="[[history]]">
          <etools-data-table-row no-collapse="[[isCreateAction(item.action)]]">
            <div slot="row-data">
              <span class="col-data col-3" data-col-header-label="Change made by">
                <span class="truncate action">
                  [[item.action]]
                </span>
              </span>
              <span class="col-data col-4" data-col-header-label="Date and time">
                <span class="truncate">
                  [[getUserName(item.by_user)]]
                </span>
              </span>
              <span class="col-data col-4" data-col-header-label="Date and time">
                <span class="truncate">
                  [[prettyDate(item.modified)]]
                </span>
              </span>
              <span class="col-data col-1">
                <paper-icon-button icon="assignment" on-click="showEntireIncident"></paper-icon-button>
                <paper-icon-button icon="editor:mode-edit" on-click="showChanges" hidden$="[[!hasChangedFilds(item.change)]]"></paper-icon-button>
              </span>
            </div>
            <div slot="row-data-details">
              <div class="col-12">
                <strong> Fileds modified: </strong>
                <span> [[getChangedFileds(item.change)]] </span>
              </div>
            </div>
          </etools-data-table-row>
        </template>
      </div>
    `;
  }

  static get is() {
    return 'revisions-list';
  }

  static get properties() {
    return {
      history: Object,
      workingItem: {
        type: Object,
        notify: true
      },
      action: {
        type: String,
        notify: true
      },
      users: {
        type: Array
      }
    };
  }

  _stateChanged(state) {
    if (!state || !state.staticData) {
      return;
    }

    this.users = state.staticData.users.map((user, key) => {
      user.id = key + 1;
      return user;
    });
  }

  isCreateAction(action) {
    return action === 'create';
  }

  hasChangedFilds(changesObj) {
    return Object.keys(changesObj).length > 1;
  }

  showChanges(event) {
    this.set('workingItem', event.model.__data.item);
    this.set('action', 'diff');
  }

  showEntireIncident(event) {
    this.set('workingItem', event.model.__data.item);
    this.set('action', 'view');
  }

  getChangedFileds(changesObj) {
    let changes = Object.keys(changesObj)
    changes = changes.filter(change => change !== 'version');
    changes = changes.map(change => getLabelForField(change))
    return (changes.length > 0 ? changes: ['No changes']).join(', ');
  }

  getUserName(userId) {
    let user = this.users.find(u => u.id === Number(userId));
    return user.first_name + ' ' + user.last_name;
  }

  // TODO: Remove this when the date behavior is ready
  prettyDate(date) {
    let today = new Date(date);
    let dd = today.getDate();
    let mm = today.getMonth() + 1; //January is 0!
    let yyyy = today.getFullYear();

    if (dd < 10) {
      dd = '0' + dd;
    }
    if (mm < 10) {
      mm = '0' + mm;
    }
    return dd + '-' + mm + '-' + yyyy;
  }

}

window.customElements.define(RevisionsList.is, RevisionsList);
