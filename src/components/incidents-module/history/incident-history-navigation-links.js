import { HistoryNavigationLinksBase } from '../../history-components/history-navigation-links.js';

class IncidentHistoryNavigationLinks extends HistoryNavigationLinksBase {
  static get is() {
    return 'incident-history-navigation-links';
  }

  connectedCallback() {
    super.connectedCallback();
    this.module = 'incidents';
  }
}

window.customElements.define(IncidentHistoryNavigationLinks.is, IncidentHistoryNavigationLinks);
