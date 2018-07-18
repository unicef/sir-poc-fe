/**
@license
*/
import { EventsBaseView } from './events-base-view.js';
import { editEvent, syncEvent, fetchEvent } from '../../actions/events.js';
import { selectEvent } from '../../reducers/events.js';
import { onEditEvent } from '../../reducers/app.js';

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

  static get observers() {
    return [
      'stateChanged(state)'
    ];
  }

  connectedCallback() {
    super.connectedCallback();
    this.title = 'Edit event';
  }

  stateChanged() {
    if (!this.isVisible()) {
      return;
    }
    this.set('event', selectEvent(this.state));
  }

  save() {
    if (this.event.unsynced && !this.state.app.offline) {
      this.store.dispatch(syncEvent(this.event));
    } else {
      this.store.dispatch(editEvent(this.event));
    }
  }

  _idChanged(newId) {
    // *TODO Don't know which is better onEditEvent or this.isVisible
    if (!newId || !onEditEvent(this.state)) {
      return;
    }
    if (!this.state.app.offline) {
      this.store.dispatch(fetchEvent(this.eventId));
    }
  }
}

window.customElements.define(EditEvent.is, EditEvent);
