import { makeRequest } from '../components/common/request-helper.js';
import { Endpoints } from '../config/endpoints.js';

// export const RECEIVE_PROPERTY_CATEGORIES = 'RECEIVE_PROPERTY_CATEGORIES';
export const RECEIVE_INCIDENT_CATEGORIES = 'RECEIVE_INCIDENT_CATEGORIES';
export const RECEIVE_THREAT_CATEGORIES = 'RECEIVE_THREAT_CATEGORIES';
export const RECEIVE_CRITICALITIES = 'RECEIVE_CRITICALITIES';
export const RECEIVE_VEHICLE_TYPES = 'RECEIVE_VEHICLE_TYPES';
export const RECEIVE_CRASH_TYPES = 'RECEIVE_CRASH_TYPES';
export const RECEIVE_COUNTRIES = 'RECEIVE_COUNTRIES';
export const RECEIVE_AGENCIES = 'RECEIVE_AGENCIES';
export const RECEIVE_REGIONS = 'RECEIVE_REGIONS';
// export const RECEIVE_IMPACTS = 'RECEIVE_IMPACTS';
export const RECEIVE_FACTORS = 'RECEIVE_FACTORS';
export const RECEIVE_TARGETS = 'RECEIVE_TARGETS';
export const RECEIVE_WEAPONS = 'RECEIVE_WEAPONS';
export const RECEIVE_USERS = 'RECEIVE_USERS';
export const RECEIVE_TEAMS = 'RECEIVE_TEAMS';


// export const fetchAndStorePropertyCategories = () => (dispatch, getState) => {
//   makeRequest(Endpoints.propertyCategories).then(result => {
//     dispatch(receivePropertyCategories(JSON.parse(result)));
//   });
// };

// const receivePropertyCategories = (propertyCategories) => {
//   return {
//     type: RECEIVE_PROPERTY_CATEGORIES,
//     propertyCategories
//   };
// };

export const fetchAndStoreIncidentCategories = () => (dispatch, getState) => {
  makeRequest(Endpoints.incidentCategories).then(result => {
    dispatch(receiveIncidentCategories(JSON.parse(result)));
  });
};

const receiveIncidentCategories = (incidentCategories) => {
  return {
    type: RECEIVE_INCIDENT_CATEGORIES,
    incidentCategories
  };
};

export const fetchAndStoreThreatCategories = () => (dispatch, getState) => {
  makeRequest(Endpoints.threatCategories).then(result => {
    dispatch(receiveThreatCategories(JSON.parse(result)));
  });
};

const receiveThreatCategories = (threatCategories) => {
  return {
    type: RECEIVE_THREAT_CATEGORIES,
    threatCategories
  };
};

export const fetchAndStoreCriticalities = () => (dispatch, getState) => {
  makeRequest(Endpoints.criticalities).then(result => {
    dispatch(receiveCriticalities(JSON.parse(result)));
  });
};

const receiveCriticalities = (criticalities) => {
  return {
    type: RECEIVE_CRITICALITIES,
    criticalities
  };
};

export const fetchAndStoreVehicleTypes = () => (dispatch, getState) => {
  makeRequest(Endpoints.vehicleTypes).then(result => {
    dispatch(receiveVehicleTypes(JSON.parse(result)));
  });
};

const receiveVehicleTypes = (vehicleTypes) => {
  return {
    type: RECEIVE_VEHICLE_TYPES,
    vehicleTypes
  };
};

export const fetchAndStoreCountries = () => (dispatch, getState) => {
  makeRequest(Endpoints.countries).then(result => {
    dispatch(receiveCountries(JSON.parse(result)));
  });
};

const receiveCountries = (countries) => {
  return {
    type: RECEIVE_COUNTRIES,
    countries
  };
};

export const fetchAndStoreAgencies = () => (dispatch, getState) => {
  makeRequest(Endpoints.agencies).then(result => {
    dispatch(receiveAgencies(JSON.parse(result)));
  });
};

const receiveAgencies = (agencies) => {
  return {
    type: RECEIVE_AGENCIES,
    agencies
  };
};

export const fetchAndStoreRegions = () => (dispatch, getState) => {
  makeRequest(Endpoints.regions).then(result => {
    dispatch(receiveRegions(JSON.parse(result)));
  });
};

const receiveRegions = (regions) => {
  return {
    type: RECEIVE_REGIONS,
    regions
  };
};

// export const fetchAndStoreImpacts = () => (dispatch, getState) => {
//   makeRequest(Endpoints.impacts).then(result => {
//     dispatch(receiveImpacts(JSON.parse(result)));
//   });
// };

// const receiveImpacts = (impacts) => {
//   return {
//     type: RECEIVE_IMPACTS,
//     impacts
//   };
// };

export const fetchAndStoreFactors = () => (dispatch, getState) => {
  makeRequest(Endpoints.factors).then(result => {
    dispatch(receiveFactors(JSON.parse(result)));
  });
};

const receiveFactors = (factors) => {
  return {
    type: RECEIVE_FACTORS,
    factors
  };
};

export const fetchAndStoreTargets = () => (dispatch, getState) => {
  makeRequest(Endpoints.targets).then(result => {
    dispatch(receiveTargets(JSON.parse(result)));
  });
};

const receiveTargets = (targets) => {
  return {
    type: RECEIVE_TARGETS,
    targets
  };
};

export const fetchAndStoreWeapons = () => (dispatch, getState) => {
  makeRequest(Endpoints.weapons).then(result => {
    dispatch(receiveWeapons(JSON.parse(result)));
  });
};

const receiveWeapons = (weapons) => {
  return {
    type: RECEIVE_WEAPONS,
    weapons
  };
};

export const fetchAndStoreUsers = () => (dispatch, getState) => {
  makeRequest(Endpoints.users).then(result => {
    dispatch(receiveUsers(JSON.parse(result)));
  });
};

const receiveUsers = (users) => {
  return {
    type: RECEIVE_USERS,
    users
  };
};

export const fetchAndStoreTeams = () => (dispatch, getState) => {
  makeRequest(Endpoints.teams).then(result => {
    dispatch(receiveTeams(JSON.parse(result)));
  });
};

const receiveTeams = (teams) => {
  return {
    type: RECEIVE_TEAMS,
    teams
  };
};

export const fetchAndStoreCrashTypes = () => (dispatch, getState) => {
  makeRequest(Endpoints.crashTypes).then(result => {
    dispatch(receiveCrashTypes(JSON.parse(result)));
  });
};

const receiveCrashTypes = (crashTypes) => {
  return {
    type: RECEIVE_CRASH_TYPES,
    crashTypes
  };
};



