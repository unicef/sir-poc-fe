import {
  ADD_EVENT_SUCCESS,
  RECEIVE_EVENTS
} from '../actions/events.js';

const events = (state = {list: []}, action) => {
  switch (action.type) {
    case RECEIVE_EVENTS:
      return {
        ...state,
        list: action.events
      };
    case ADD_EVENT_SUCCESS:
      return {
        ...state,
        list: [...state.list, action.newEvent]
      };
    default:
      return state;
  }
}

export default events;
