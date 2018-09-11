import { makeRequest } from '../components/common/request-helper.js';
import { Endpoints } from '../config/endpoints.js';

export const RECEIVE_PERSONNEL_CATEGORIES = 'RECEIVE_PERSONNEL_CATEGORIES';
export const RECEIVE_INCIDENT_CATEGORIES = 'RECEIVE_INCIDENT_CATEGORIES';
export const RECEIVE_THREAT_CATEGORIES = 'RECEIVE_THREAT_CATEGORIES';
export const RECEIVE_PROGRAMME_IMPACTS = 'RECEIVE_PROGRAMME_IMPACTS';
export const RECEIVE_PROPERTY_IMPACTS = 'RECEIVE_PROPERTY_IMPACTS';
export const RECEIVE_PERSON_IMPACTS = 'RECEIVE_PERSON_IMPACTS';
export const RECEIVE_PROPERTY_TYPES = 'RECEIVE_PROPERTY_TYPES';
export const RECEIVE_CRITICALITIES = 'RECEIVE_CRITICALITIES';
export const RECEIVE_VEHICLE_TYPES = 'RECEIVE_VEHICLE_TYPES';
export const RECEIVE_NATIONALITIES = 'RECEIVE_NATIONALITIES';
export const RECEIVE_UN_LOCATIONS = 'RECEIVE_UN_LOCATIONS';
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
  dispatch(fetchAndStorePersonnelCategories());
  dispatch(fetchAndStoreIncidentCategories());
  dispatch(fetchAndStoreThreatCategories());
  dispatch(fetchAndStoreProgrammeImpacts());
  dispatch(fetchAndStorePropertyImpacts());
  dispatch(fetchAndStorePersonImpacts());
  dispatch(fetchAndStoreCriticalities());
  dispatch(fetchAndStorePropertyTypes());
  dispatch(fetchAndStoreNationalities());
  dispatch(fetchAndStoreVehicleTypes());
  dispatch(fetchAndStoreUnLocations());
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
  users = users.map((elem) => {
    elem.name = elem.first_name + ' ' + elem.last_name;
    return elem;
  });

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

export const fetchAndStoreProgrammeImpacts = () => (dispatch, getState) => {
  makeRequest(Endpoints.programmeImpacts).then((result) => {
    dispatch(receiveProgrammeImpacts(result));
  });
};

const receiveProgrammeImpacts = (programmeImpacts) => {
  return {
    type: RECEIVE_PROGRAMME_IMPACTS,
    programmeImpacts
  };
};

export const fetchAndStorePropertyImpacts = () => (dispatch, getState) => {
  makeRequest(Endpoints.propertyImpacts).then((result) => {
    dispatch(receivePropertyImpacts(result));
  });
};

const receivePropertyImpacts = (propertyImpacts) => {
  return {
    type: RECEIVE_PROPERTY_IMPACTS,
    propertyImpacts
  };
};

export const fetchAndStorePersonImpacts = () => (dispatch, getState) => {
  makeRequest(Endpoints.personImpacts).then((result) => {
    dispatch(receivePersonImpacts(result));
  });
};

const receivePersonImpacts = (personImpacts) => {
  return {
    type: RECEIVE_PERSON_IMPACTS,
    personImpacts
  };
};

export const fetchAndStoreUnLocations = () => (dispatch, getState) => {
  makeRequest(Endpoints.unLocations).then((result) => {
    dispatch(receiveUnLocations(result));
  });
};

const receiveUnLocations = (unLocations) => {
  return {
    type: RECEIVE_UN_LOCATIONS,
    unLocations
  };
};

export const fetchAndStorePropertyTypes = () => (dispatch, getState) => {
  makeRequest(Endpoints.propertyTypes).then((result) => {
    dispatch(receivePropertyTypes(result));
  });
};

const receivePropertyTypes = (propertyTypes) => {
  return {
    type: RECEIVE_PROPERTY_TYPES,
    propertyTypes
  };
};

export const fetchAndStorePersonnelCategories = () => (dispatch, getState) => {
  makeRequest(Endpoints.personnelCategories).then((result) => {
    dispatch(receivePersonnelCategories(result));
  });
};

const receivePersonnelCategories = (personnelCategories) => {
  return {
    type: RECEIVE_PERSONNEL_CATEGORIES,
    personnelCategories
  };
};

export const fetchAndStoreNationalities = () => (dispatch, getState) => {
  makeRequest(Endpoints.nationalities).then((result) => {
    dispatch(receiveNationalities(result));
  });
};

const receiveNationalities = (nationalities) => {
  return {
    type: RECEIVE_NATIONALITIES,
    nationalities
  };
};
