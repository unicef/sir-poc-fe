/**
@license
*/
import { IncidentsBaseView } from './incidents-base-view.js';
import { isOnViewIncident } from '../../reducers/app';

/**
 * @polymer
 * @customElement
 */
class ViewIncident extends IncidentsBaseView {
  connectedCallback() {
    super.connectedCallback();
    this.readonly = true;
    this.title = 'View incident';
  }

  isOnExpectedPage() {
    return isOnViewIncident(this.state);
  }
}

window.customElements.define('view-incident', ViewIncident);
