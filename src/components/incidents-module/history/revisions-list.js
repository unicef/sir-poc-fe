/**
@license
*/
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-icon-button';
import 'etools-data-table';

import '../../styles/shared-styles.js';
import '../../styles/grid-layout-styles.js';

export class RevisionsList extends PolymerElement  {
  static get template() {
    return html`
      <style include="shared-styles grid-layout-styles data-table-styles">
        :host {
          @apply --layout-vertical;
        }

        etools-data-table-row[no-collapse] {
          padding-left: 32px;
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
                <span class="truncate">
                  [[item.action]]
                </span>
              </span>
              <span class="col-data col-4" data-col-header-label="Date and time">
                <span class="truncate">
                  [[item.by_user_display]]
                </span>
              </span>
              <span class="col-data col-4" data-col-header-label="Date and time">
                <span class="truncate">
                  [[item.modified]]
                </span>
              </span>
              <span class="col-data col-1">
                <paper-icon-button icon="assignment" on-click="showDetails" hidden$="[[!hasChangedFilds(item.change)]]"></paper-icon-button>
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
      }
    };
  }

  isCreateAction(action) {
    return action === 'create';
  }

  hasChangedFilds(changesObj) {
    return Object.keys(changesObj).length > 1;
  }

  showDetails(event) {
    this.set('workingItem', event.model.__data.item);
  }

  getChangedFileds(changesObj) {
    let changes = Object.keys(changesObj).filter((change) => change !== 'version');
    return (changes.length > 0 ? changes: ['No changes']).join(', ');
  }

}

window.customElements.define(RevisionsList.is, RevisionsList);
