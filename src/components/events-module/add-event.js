/**
 @license
 */
import { addEvent } from '../../actions/events.js';
import { EventsBaseView } from './events-base-view.js';
import { EventModel } from './models/event-model.js';


class AddEvent extends EventsBaseView {
  connectedCallback() {
    super.connectedCallback();
    this.readonly = false;
    this.title = 'Add new event';
  }

  async save() {
    if (!this.validate()) {
      return;
    }
    let successfull = await this.store.dispatch(addEvent(this.event));
    if (typeof successfull === 'boolean' && successfull) {
      this.resetForm();
    }
  }

  resetForm() {
    this.event = JSON.parse(JSON.stringify(EventModel));
  }
}

window.customElements.define('add-event', AddEvent);
