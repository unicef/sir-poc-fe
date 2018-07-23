/**
 @license
 */
import { addEvent } from '../../actions/events.js';
import { EventsBaseView } from './events-base-view.js';
import { isOnNewEvent } from '../../reducers/app.js';
import { EventModel } from './models/event-model.js';


class AddEvent extends EventsBaseView {
  static get observers() {
    return [
      'stateChanged(state)'
    ];
  }
  connectedCallback() {
    super.connectedCallback();
    this.readonly = false;
    this.title = 'Add new event';
  }

  stateChanged() {
    if (isOnNewEvent(this.state)) {
      this.event = JSON.parse(JSON.stringify(EventModel));
    }
  }

  save() {
    this.store.dispatch(addEvent(this.event));
  }

  isOnExpectedPage() {
    return isOnNewEvent(this.state);
  }
}

window.customElements.define('add-event', AddEvent);
