/**
 @license
 */
import { addEvent } from '../../actions/events.js';
import { EventsBaseView } from './events-base-view.js';
import { onNewEvent } from '../../reducers/app.js';
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
    if (this.isVisible()  && onNewEvent(this.state)) {
      this.event = JSON.parse(JSON.stringify(EventModel));
    }
  }

  save() {
    this.store.dispatch(addEvent(this.event));
  }
}

window.customElements.define('add-event', AddEvent);
