/**
@license
*/
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-icons/image-icons.js';
import '@polymer/iron-media-query/iron-media-query.js';

import 'etools-data-table';

import HistoryHelpers from '../../history-components/history-helpers.js';
import { getUserName } from '../../common/utils.js';
import DateMixin from '../../common/date-mixin.js';

import '../../styles/shared-styles.js';
import '../../styles/grid-layout-styles.js';


export class RevisionsList extends DateMixin(HistoryHelpers(PolymerElement)) {
  static get template() {
    // language=HTML
    return html`
      <style include="shared-styles data-table-styles grid-layout-styles">
        :host {
          @apply --layout-vertical;
        }

        etools-data-table-row[no-collapse] {
          --list-row-wrapper-padding: 0 24px 0 56px;
        }

        .action {
          text-transform: capitalize;
        }
      </style>

      <iron-media-query query="(max-width: 767px)" query-matches="{{lowResolutionLayout}}"></iron-media-query>

      <div class="card list">
        <etools-data-table-header id="listHeader" label="History of changes"
                                  low-resolution-layout="[[lowResolutionLayout]]">
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
          <etools-data-table-row no-collapse="[[isCreateAction(item.action)]]"
                                 low-resolution-layout="[[lowResolutionLayout]]">
            <div slot="row-data">
              <span class="col-data col-3" data-col-header-label="Action">
                <span class="truncate action">
                  [[item.action]]
                </span>
              </span>
              <span class="col-data col-4" data-col-header-label="By user">
                <span class="truncate">
                  [[getUserName(item.by_user)]]
                </span>
              </span>
              <span class="col-data col-4" data-col-header-label="Date and time">
                <span class="truncate">
                  [[prettyDate(item.modified, 'D-MMM-YYYY hh:mm A')]]
                </span>
              </span>
              <span class="col-data col-1"  data-col-header-label="More">
                <span title="View entire event at this version">
                  <a href="/[[module]]/history/[[item.data.id]]/view/[[item.id]]">
                    <iron-icon icon="assignment"></iron-icon>
                  </a>
                </span>
                <span title="View changes from previous version"
                      hidden$="[[!hasChangedFilds(item.change)]]">
                  <a href="/[[module]]/history/[[item.data.id]]/diff/[[item.id]]">
                    <iron-icon icon="image:compare"></iron-icon>
                  </a>
                </span>
              </span>
            </div>
            <div slot="row-data-details">
              <div class="row-h flex-c row-details-content">
                <strong class="rdc-title inline">Fileds modified:</strong>
                <span>[[getChangedFileds(item.change)]]</span>
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
      lowResolutionLayout: Boolean,
      history: Array,
      module: String,
      getUserName: {
        type: Function,
        value: () => getUserName
      }
    };
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
}

window.customElements.define(RevisionsList.is, RevisionsList);
