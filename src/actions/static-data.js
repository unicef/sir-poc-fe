import { makeRequest } from '../components/common/request-helper.js';
import { Endpoints } from '../config/endpoints.js';

export const RECEIVE_INCIDENT_CATEGORIES = 'RECEIVE_INCIDENT_CATEGORIES';
export const RECEIVE_THREAT_CATEGORIES = 'RECEIVE_THREAT_CATEGORIES';
export const RECEIVE_CRITICALITIES = 'RECEIVE_CRITICALITIES';
export const RECEIVE_VEHICLE_TYPES = 'RECEIVE_VEHICLE_TYPES';
export const RECEIVE_CRASH_TYPES = 'RECEIVE_CRASH_TYPES';
export const RECEIVE_COUNTRIES = 'RECEIVE_COUNTRIES';
export const RECEIVE_AGENCIES = 'RECEIVE_AGENCIES';
export const RECEIVE_REGIONS = 'RECEIVE_REGIONS';
export const RECEIVE_FACTORS = 'RECEIVE_FACTORS';
export const RECEIVE_TARGETS = 'RECEIVE_TARGETS';
export const RECEIVE_WEAPONS = 'RECEIVE_WEAPONS';
export const RECEIVE_USERS = 'RECEIVE_USERS';
export const RECEIVE_TEAMS = 'RECEIVE_TEAMS';

export const loadAllStaticData = () => (dispatch) => {
  dispatch(fetchAndStoreIncidentCategories());
  dispatch(fetchAndStoreThreatCategories());
  dispatch(fetchAndStoreCriticalities());
  dispatch(fetchAndStoreVehicleTypes());
  dispatch(fetchAndStoreCrashTypes());
  dispatch(fetchAndStoreCountries());
  dispatch(fetchAndStoreAgencies());
  dispatch(fetchAndStoreRegions());
  dispatch(fetchAndStoreFactors());
  dispatch(fetchAndStoreTargets());
  dispatch(fetchAndStoreWeapons());
  dispatch(fetchAndStoreUsers());
  dispatch(fetchAndStoreTeams());
};

export const fetchAndStoreIncidentCategories = () => (dispatch, getState) => {
  makeRequest(Endpoints.incidentCategories).then((result) => {
    dispatch(receiveIncidentCategories(result));
  });
};

const receiveIncidentCategories = (incidentCategories) => {
  return {
    type: RECEIVE_INCIDENT_CATEGORIES,
    incidentCategories
  };
};

export const fetchAndStoreThreatCategories = () => (dispatch, getState) => {
  makeRequest(Endpoints.threatCategories).then((result) => {
    dispatch(receiveThreatCategories(result));
  });
};

const receiveThreatCategories = (threatCategories) => {
  return {
    type: RECEIVE_THREAT_CATEGORIES,
    threatCategories
  };
};

export const fetchAndStoreCriticalities = () => (dispatch, getState) => {
  makeRequest(Endpoints.criticalities).then((result) => {
    dispatch(receiveCriticalities(result));
  });
};

const receiveCriticalities = (criticalities) => {
  return {
    type: RECEIVE_CRITICALITIES,
    criticalities
  };
};

export const fetchAndStoreVehicleTypes = () => (dispatch, getState) => {
  makeRequest(Endpoints.vehicleTypes).then((result) => {
    dispatch(receiveVehicleTypes(result));
  });
};

const receiveVehicleTypes = (vehicleTypes) => {
  return {
    type: RECEIVE_VEHICLE_TYPES,
    vehicleTypes
  };
};

export const fetchAndStoreCountries = () => (dispatch, getState) => {
  makeRequest(Endpoints.countries).then((result) => {
    dispatch(receiveCountries(result));
  });
};

const receiveCountries = (countries) => {
  return {
    type: RECEIVE_COUNTRIES,
    countries
  };
};

export const fetchAndStoreAgencies = () => (dispatch, getState) => {
  makeRequest(Endpoints.agencies).then((result) => {
    dispatch(receiveAgencies(result));
  });
};

const receiveAgencies = (agencies) => {
  return {
    type: RECEIVE_AGENCIES,
    agencies
  };
};

export const fetchAndStoreRegions = () => (dispatch, getState) => {
  makeRequest(Endpoints.regions).then((result) => {
    dispatch(receiveRegions(result));
  });
};

const receiveRegions = (regions) => {
  return {
    type: RECEIVE_REGIONS,
    regions
  };
};

export const fetchAndStoreFactors = () => (dispatch, getState) => {
  makeRequest(Endpoints.factors).then((result) => {
    dispatch(receiveFactors(result));
  });
};

const receiveFactors = (factors) => {
  return {
    type: RECEIVE_FACTORS,
    factors
  };
};

export const fetchAndStoreTargets = () => (dispatch, getState) => {
  makeRequest(Endpoints.targets).then((result) => {
    dispatch(receiveTargets(result));
  });
};

const receiveTargets = (targets) => {
  return {
    type: RECEIVE_TARGETS,
    targets
  };
};

export const fetchAndStoreWeapons = () => (dispatch, getState) => {
  makeRequest(Endpoints.weapons).then((result) => {
    dispatch(receiveWeapons(result));
  });
};

const receiveWeapons = (weapons) => {
  return {
    type: RECEIVE_WEAPONS,
    weapons
  };
};

export const fetchAndStoreUsers = () => (dispatch, getState) => {
  makeRequest(Endpoints.users).then((result) => {
    dispatch(receiveUsers(result));
  });
};

const receiveUsers = (users) => {
  return {
    type: RECEIVE_USERS,
    users
  };
};

export const fetchAndStoreTeams = () => (dispatch, getState) => {
  makeRequest(Endpoints.teams).then((result) => {
    dispatch(receiveTeams(result));
  });
};

const receiveTeams = (teams) => {
  return {
    type: RECEIVE_TEAMS,
    teams
  };
};

export const fetchAndStoreCrashTypes = () => (dispatch, getState) => {
  makeRequest(Endpoints.crashTypes).then((result) => {
    dispatch(receiveCrashTypes(result));
  });
};

const receiveCrashTypes = (crashTypes) => {
  return {
    type: RECEIVE_CRASH_TYPES,
    crashTypes
  };
};
