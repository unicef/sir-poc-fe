import {
  ADD_EVENT_SUCCESS,
  RECEIVE_EVENTS,
  EDIT_EVENT_SUCCESS
} from '../actions/events.js';

const events = (state = {list: []}, action) => {
  switch (action.type) {
    case RECEIVE_EVENTS:
      return {
        ...state,
        list: getRefreshedEvents(state.list, action.events)
      };
    case ADD_EVENT_SUCCESS:
      return {
        ...state,
        list: [...state.list, action.newEvent]
      };
    case EDIT_EVENT_SUCCESS:
      return {
        ...state,
        list: getEditedList(state.list, action)
      };
    default:
      return state;
  }
}

export default events;

const getEditedList = (list, action) => {
  return list.map((event) => {
    if (action.id !== event.id) {
      return event;
    }
    return action.event;
  });
}

const getRefreshedEvents = (oldEvents, newEvents) => {
  let unsynced = oldEvents.filter(elem => elem.unsynced);
  return [...newEvents, ...unsynced];
}