import {
  ADD_NEW_EVENT
} from '../actions/events.js';

const events = (state = {events: []}, action) => {
  switch (action.type) {
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
