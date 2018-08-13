import { createSelector } from 'reselect';
import {
  EDIT_EVENT_SUCCESS,
  ADD_EVENT_SUCCESS,
  RECEIVE_EVENTS,
  RECEIVE_EVENT
} from '../actions/events.js';

const events = (state = {list: []}, action) => {
  switch (action.type) {
    case RECEIVE_EVENTS:
      return {
        ...state,
        list: getRefreshedEvents(state.list, action.events)
      };
    case RECEIVE_EVENT:
      return {
        ...state,
        list: getEditedList(state.list, action)
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
};

export default events;

const getEditedList = (list, action) => {
  return list.map((event) => {
    if (action.id !== event.id) {
      return event;
    }
    return action.event;
  });
};

const getRefreshedEvents = (oldEvents, newEvents) => {
  oldEvents = oldEvents instanceof Array ? oldEvents : [];
  newEvents = newEvents instanceof Array ? newEvents : [];
  let unsynced = oldEvents.filter(elem => elem.unsynced);
  return [...newEvents, ...unsynced];
};

// ---------- SELECTORS ---------
const eventsSelector = state => state.events.list;
const selectedEventId = state => state.app.locationInfo.eventId;
export const selectEvent = createSelector(
  eventsSelector,
  selectedEventId,
  (events, eventId) => {
    if (!eventId) {
      return null;
    }
    return events.find(ev => String(ev.id) === String(eventId)) || null;
  }
);
