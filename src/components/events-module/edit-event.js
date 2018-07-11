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
  connectedCallback() {
    super.connectedCallback();
    this.title = 'Edit event';
  }

  static get properties() {
    return {
      eventId: {
        type: Number,
        observer: '_idChanged'
      }
    };
  }

  save() {
    this.store.dispatch(editEvent(this.event));
  }

  sync() {
    this.store.dispatch(syncEvent(this.event));
  }

  _idChanged(newId) {
    // TODO: fix ==
     this.set('event', this.state.events.list.find(ev => ev.id == this.eventId ));
  }
}

window.customElements.define(EditEvent.is, EditEvent);
