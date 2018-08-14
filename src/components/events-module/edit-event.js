/**
@license
*/
import { EventsBaseView } from './events-base-view.js';
import { editEvent, syncEvent } from '../../actions/events.js';
import { isOnEditEvent } from '../../reducers/app.js';

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

  save() {
    if (!this.validate()) {
      return;
    }
    if (this.event.unsynced && !this.state.app.offline) {
      this.store.dispatch(syncEvent(this.event));
    } else {
      this.store.dispatch(editEvent(this.event));
    }
  }

  isOnExpectedPage() {
    return isOnEditEvent(this.state);
  }

}

window.customElements.define(EditEvent.is, EditEvent);
