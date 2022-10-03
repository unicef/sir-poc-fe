import * as ACTIONS from '../actions/constants.js';

let defaultState = {
  list: []
};

const reporting = (state = defaultState, action) => {
  switch (action.type) {
    case ACTIONS.RECEIVE_REPORTING_USER:
      return {
        ...state,
        list: action.list
      };
    default:
      return state;
  }
};

export default reporting;


