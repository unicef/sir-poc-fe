/**
@license
*/
import { HistoryNavigationLinksBase } from '../../history-components/history-navigation-links.js';
/**
 * @polymer
 * @customElement
 */
class EventHistoryNavigationLinks extends HistoryNavigationLinksBase {
  static get is() {
    return 'event-history-navigation-links';
  }

  connectedCallback() {
    super.connectedCallback();
    this.module = 'events';
  }
}

window.customElements.define(EventHistoryNavigationLinks.is, EventHistoryNavigationLinks);
