import { makeRequest } from '../components/common/request-helper.js';
import { Endpoints } from '../config/endpoints.js';
import * as ACTIONS from './constants.js';

export const fetchAndStoreUsers = () => (dispatch, getState) => {
  makeRequest(Endpoints.users).then((result) => {
    dispatch(receiveUsers(result || []));
  });
};

const receiveUsers = (users) => {
  users = users.map((elem) => {
    elem.name = elem.display_name || elem.first_name + ' ' + elem.last_name;
    return elem;
  });

  return {
    type: ACTIONS.RECEIVE_USERS,
    users
  };
};
