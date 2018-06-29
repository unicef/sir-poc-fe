import {
  ADD_EVENT_SUCCESS,
  RECEIVE_EVENTS
} from '../actions/events.js';

const events = (state = {events: []}, action) => {
  switch (action.type) {
    case RECEIVE_EVENTS:
      return {
        ...state,
        events: action.events
      };
    case ADD_EVENT_SUCCESS:
      return {
        ...state,
        events: [...state.events, action.newEvent]
      };
    default:
      return state;
  }
}

export default events;
