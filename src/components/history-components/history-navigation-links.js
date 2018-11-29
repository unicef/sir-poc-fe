import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import HistoryHelpers from './history-helpers.js';
import '@polymer/iron-icons/image-icons.js';
import '../styles/shared-styles.js';

export class HistoryNavigationLinksBase extends HistoryHelpers(PolymerElement) {

  static get template() {
    return html`
      <style include="shared-styles">
        a {
          color: var(--primary-color);
          text-decoration: none;
        }
      </style>

      <a href="[[module]]/history/[[workingItem.data.id]]/list/" title="Go to changes list">
        <paper-button raised class="white smaller">
          <iron-icon icon="list"></iron-icon>
          History List
        </paper-button>
      </a>

      <a href="[[module]]/history/[[workingItem.data.id]]/[[viewUrl]]/[[workingItem.id]]/"
           hidden$="[[_pageIs('view')]]"
           title="View entire [[_getLabel(module)]] at this version">
        <paper-button raised class="white smaller">
          <iron-icon icon="assignment"></iron-icon>
           [[_getLabel(module)]] at this revision
        </paper-button>
      </a>

      <a href="[[module]]/history/[[workingItem.data.id]]/diff/[[workingItem.id]]/"
           hidden$="[[_shouldHideViewChangesButton(workingItem.change)]]"
           title="View changes from previous version">
        <paper-button raised class="white smaller">
          <iron-icon icon="image:compare"></iron-icon>
          Changes from prev. version
        </paper-button>
      </a>
    `;
  }

  static get properties() {
    return {
      page: String,
      module: String,
      workingItem: Object,
      viewUrl: {
        type: String,
        value: 'view'
      }
    };
  }

  _pageIs(loc) {
    return this.page === loc;
  }

  _shouldHideViewChangesButton(change) {
    if (!change) {
      return true;
    }
    return this._pageIs('diff') || !this.hasChangedFilds(change);
  }

  _getLabel(module) {
    if (module === 'events') {
      return 'event';
    }
    if (module === 'incidents') {
      return 'incident';
    }
  }
}
