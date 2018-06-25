import {
  ADD_NEW_EVENT
} from '../actions/events.js';
let testData = [
              {
                  "id": 1,
                  "version": 1529926221198351,
                  "last_modify_date": "2018-06-25T11:46:07.883205Z",
                  "start_date": "2018-06-25",
                  "end_date": "2018-06-25",
                  "description": "Test desc 1",
                  "note": "test note 1",
                  "location": "test loc 1"
              },
              {
                  "id": 2,
                  "version": 1529926239395301,
                  "last_modify_date": "2018-06-25T11:46:26.080126Z",
                  "start_date": "2018-06-25",
                  "end_date": "2018-06-25",
                  "description": "test desc 2",
                  "note": "test desc 2",
                  "location": "test loc 2"
              }
        ];

const events = (state = {events: [...testData]}, action) => {
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
