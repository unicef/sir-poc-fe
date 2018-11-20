import * as ACTIONS from '../actions/constants.js';

const defaultData = {
  list: []
};

const staticData = (state = defaultData, action) => {
  switch (action.type) {
    case ACTIONS.RECEIVE_USERS:
      return {
        ...state,
        list: action.users
      };
    default:
      return state;
  }
};

export default staticData;
