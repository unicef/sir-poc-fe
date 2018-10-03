import { createSelector } from 'reselect';
import * as ACTIONS from '../actions/constants.js';

const events = (state = {list: [], draft: {}}, action) => {
  switch (action.type) {
    case ACTIONS.SET_EVENT_DRAFT:
      return {
        ...state,
        draft: action.event
      };
    case ACTIONS.RECEIVE_EVENTS:
      return {
        ...state,
        list: getRefreshedEvents(state.list, action.events)
      };
    case ACTIONS.RECEIVE_EVENT:
      return {
        ...state,
        list: getEditedList(state.list, action)
      };
    case ACTIONS.ADD_EVENT_SUCCESS:
      return {
        ...state,
        list: [...state.list, action.newEvent]
      };
    case ACTIONS.EDIT_EVENT_SUCCESS:
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
  let unsynced = oldEvents.filter(elem => elem.unsynced && isNaN(elem.id));
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
