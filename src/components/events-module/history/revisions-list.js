/**
@license
*/
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-icons/image-icons.js';
import 'etools-data-table';
import { connect } from 'pwa-helpers/connect-mixin.js';

import { store } from '../../../redux/store.js';
import DateMixin from '../../common/date-mixin.js';
import HistoryHelpers from './history-helpers.js';

import '../../styles/shared-styles.js';
import '../../styles/grid-layout-styles.js';


export class RevisionsList extends DateMixin(HistoryHelpers(connect(store)(PolymerElement))) {
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
                  [[prettyDate(item.modified, 'D-MMM-YYYY hh:mm A')]]
                </span>
              </span>
              <span class="col-data col-1">
                <span title="View entire event at this version">
                  <a href="/events/history/[[eventId]]/view/[[item.id]]">
                    <iron-icon icon="assignment"></iron-icon>
                  </a>
                </span>
                <span title="View changes from previous version"
                      hidden$="[[!hasChangedFilds(item.change)]]">
                  <a href="/events/history/[[eventId]]/diff/[[item.id]]">
                    <iron-icon icon="image:compare"></iron-icon>
                  </a>
                </span>
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
    return 'event-revisions-list';
  }

  static get properties() {
    return {
      history: Object,
      eventId: Number,
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
    if (!state || !state.staticData || !state.app) {
      return;
    }

    this.eventId = state.app.locationInfo.eventId;
    this.users = state.staticData.users;
  }

  isCreateAction(action) {
    return action === 'create';
  }

  getChangedFileds(changesObj) {
    let changes = Object.keys(changesObj);

    changes = changes.filter(change => change !== 'version');
    changes = changes.map(change => this.getLabelForField(change));

    return (changes.length > 0 ? changes: ['No changes']).join(', ');
  }

  getUserName(userId) {
    let user = this.users.find(u => u.id === Number(userId));
    return user.first_name + ' ' + user.last_name;
  }

}

window.customElements.define(RevisionsList.is, RevisionsList);
