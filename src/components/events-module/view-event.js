/**
@license
*/
import { EventsBaseView } from './events-base-view.js';
import { isOnViewEvent } from '../../reducers/app.js';

/**
 * @polymer
 * @customElement
 */
class ViewEvent extends EventsBaseView {
  connectedCallback() {
    super.connectedCallback();
    this.readonly = true;
    this.title = 'View event';
  }

  isOnExpectedPage() {
    return isOnViewEvent(this.state);
  }

}

window.customElements.define('view-event', ViewEvent);

