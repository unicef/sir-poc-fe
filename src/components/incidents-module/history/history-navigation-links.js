import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import HistoryHelpers from './history-helpers.js';
import '@polymer/iron-icons/image-icons.js';

export class HistoryNavigationLinks extends HistoryHelpers(PolymerElement) {

  static get template() {
    return html`
      <style>
        a {
          color: var(--primary-color);
          text-decoration: none;
        }
      </style>

      <a href="incidents/history/[[workingItem.data.id]]/list">
        <iron-icon icon="list"></iron-icon>
      </a>
      <a href="incidents/history/[[workingItem.data.id]]/view/[[workingItem.id]]" hidden$="[[pageIs('view')]]">
        <iron-icon icon="assignment"></iron-icon>
      </a>
      <a href="incidents/history/[[workingItem.data.id]]/diff/[[workingItem.id]]" hidden$="[[shouldHideViewChangesButton(workingItem.change)]]">
        <iron-icon icon="image:compare"></iron-icon>
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
    }
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
