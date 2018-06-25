import {
  ADD_NEW_EVENT,
  LOAD_EVENTS
} from '../actions/events.js';

const events = (state = {events: []}, action) => {
  switch (action.type) {
    case LOAD_EVENTS:
      return {
        ...state,
        events: action.events
      };
    case ADD_NEW_EVENT:
      return {
        ...state,
        events: [...state.events, action.newEvent]
      };
    default:
      return state;
  }
}

export default events;
