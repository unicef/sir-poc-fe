/**
@license
*/
import { EventsBaseView } from './events-base-view.js';
import { editEvent, syncEvent } from '../../actions/events.js';

/**
 * @polymer
 * @customElement
 */
class EditEvent extends EventsBaseView {
  static get is() {
    return 'edit-event';
  }

  static get properties() {
    return {
      eventId: {
        type: Number,
        observer: '_idChanged'
      }
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this.title = 'Edit event';
  }

  save() {
    if (this.event.unsynced && !this.state.app.offline) {
      this.store.dispatch(syncEvent(this.event));
    } else {
      this.store.dispatch(editEvent(this.event));
    }
  }

  _idChanged(newId) {
    // TODO: fix ==
    let event = this.state.events.list.find(ev => ev.id == this.eventId);
    if (event) {
      this.set('event', JSON.parse(JSON.stringify(event)));
    }
  }
}

window.customElements.define(EditEvent.is, EditEvent);
