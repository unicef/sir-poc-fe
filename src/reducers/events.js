import {
  ADD_NEW_EVENT
} from '../actions/events.js';
let mockEvents = [{"startDate":"2018-06-02","endDate":"2018-06-15","description":"Event 1","location":"location 1","note":"event 1 note"},{"startDate":"2018-06-01","endDate":"2018-06-23","description":"desc2","note":"ev2","location":"loc2"}];

const events = (state = {events: [...mockEvents]}, action) => {
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
