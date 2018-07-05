/**
@license
*/
import { EventsBaseView } from './events-base-view.js';

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

  static get properties() {
    return {
      eventId: {
        type: Number,
        observer: '_idChanged'
      }
    };
  }

  _idChanged(newId) {
    // TODO: fix ==
     this.set('event', this.state.events.events.find(ev => ev.id == this.eventId ));
  }
}

window.customElements.define('view-event', ViewEvent);
