import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import HistoryHelpers from './history-helpers.js';
import '@polymer/iron-icons/image-icons.js';
import '../../styles/shared-styles.js';

export class HistoryNavigationLinks extends HistoryHelpers(PolymerElement) {

  static get template() {
    return html`
      <style include="shared-styles">
        a {
          color: var(--primary-color);
          text-decoration: none;
        }
      </style>

      <a href="incidents/history/[[workingItem.data.id]]/list" title="Go to changes list">
        <paper-button raised class="white-bg smaller">
          <iron-icon icon="list"></iron-icon>
          History List
        </paper-button>
      </a>

      <a href="incidents/history/[[workingItem.data.id]]/view/[[workingItem.id]]"
           hidden$="[[pageIs('view')]]"
           title="View entire incident at this version">
        <paper-button raised class="white-bg smaller">
          <iron-icon icon="assignment"></iron-icon>
           Incident at this revision
        </paper-button>
      </a>

      <a href="incidents/history/[[workingItem.data.id]]/diff/[[workingItem.id]]"
           hidden$="[[shouldHideViewChangesButton(workingItem.change)]]"
           title="View changes from previous version">
        <paper-button raised class="white-bg smaller">
          <iron-icon icon="image:compare"></iron-icon>
          Changes from prev. version
        </paper-button>
      </a>
    `;
  }

  static get is() {
    return 'history-navigation-links';
  }

  static get properties() {
    return {
      page: String,
      workingItem: Object
    };
  }

  pageIs(loc) {
    return this.page === loc;
  }

  shouldHideViewChangesButton(change) {
    if (!change) {
      return true;
    }
    return this.pageIs('diff') || !this.hasChangedFilds(change);
  }
}

window.customElements.define(HistoryNavigationLinks.is, HistoryNavigationLinks);
