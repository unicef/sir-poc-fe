import { makeRequest, prepareEndpoint } from '../components/common/request-helper.js';
import { Endpoints } from '../config/endpoints.js';
import { showSnackbar } from '../actions/app.js';


import * as ACTIONS from './constants.js';


const receiveReporting = (list) => {
  return {
    type: ACTIONS.RECEIVE_REPORTING_USER,
    list
  };
};
export const fetchReportingUser = id => async (dispatch) => {
  let endpoint = prepareEndpoint(Endpoints.reportingList, { id });
  try {
    makeRequest(endpoint).then((result) => {
      dispatch(receiveReporting(result));
    })
      .catch((e) => {dispatch(showSnackbar('You do not have permission to perform this action.'));} );
  } catch (error) {
    dispatch(showSnackbar('You do not have permission to perform this action.'));
    return false;
  }
};


