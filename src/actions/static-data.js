import { makeRequest } from '../components/common/request-helper.js';
import { Endpoints } from '../config/endpoints.js';
import { RECEIVE_PERSONNEL_CATEGORIES,
         RECEIVE_INCIDENT_CATEGORIES,
         RECEIVE_EVACUATION_IMPACTS,
         RECEIVE_THREAT_CATEGORIES,
         RECEIVE_PROGRAMME_IMPACTS,
         RECEIVE_PROPERTY_IMPACTS,
         RECEIVE_PROGRAMME_SCOPES,
         RECEIVE_PROGRAMME_AREAS,
         RECEIVE_PROGRAMME_TYPES,
         RECEIVE_CRASH_SUB_TYPES,
         RECEIVE_PERSON_IMPACTS,
         RECEIVE_PROPERTY_TYPES,
         RECEIVE_PREMISES_TYPES,
         RECEIVE_CRITICALITIES,
         RECEIVE_VEHICLE_TYPES,
         RECEIVE_NATIONALITIES,
         RECEIVE_UN_LOCATIONS,
         RECEIVE_CRASH_TYPES,
         RECEIVE_COUNTRIES,
         RECEIVE_AGENCIES,
         RECEIVE_REGIONS,
         RECEIVE_FACTORS,
         RECEIVE_TARGETS,
         RECEIVE_WEAPONS,
         RECEIVE_CITIES,
         RECEIVE_USERS,
         RECEIVE_TEAMS } from './constants.js';
export const loadAllStaticData = () => (dispatch) => {
  dispatch(fetchAndStorePersonnelCategories());
  dispatch(fetchAndStoreIncidentCategories());
  dispatch(fetchAndStoreEvacuationImpacts());
  dispatch(fetchAndStoreThreatCategories());
  dispatch(fetchAndStoreProgrammeImpacts());
  dispatch(fetchAndStorePropertyImpacts());
  dispatch(fetchAndStoreProgrammeScopes());
  dispatch(fetchAndStoreProgrammeAreas());
  dispatch(fetchAndStoreProgrammeTypes());
  dispatch(fetchAndStorePersonImpacts());
  dispatch(fetchAndStoreCriticalities());
  dispatch(fetchAndStorePropertyTypes());
  dispatch(fetchAndStorePremisesTypes());
  dispatch(fetchAndStoreNationalities());
  dispatch(fetchAndStoreVehicleTypes());
  dispatch(fetchAndStoreUnLocations());
  dispatch(fetchAndStoreCrashTypes());
  dispatch(fetchAndStoreCrashSubTypes());
  dispatch(fetchAndStoreCountries());
  dispatch(fetchAndStoreAgencies());
  dispatch(fetchAndStoreRegions());
  dispatch(fetchAndStoreFactors());
  dispatch(fetchAndStoreTargets());
  dispatch(fetchAndStoreWeapons());
  dispatch(fetchAndStoreCities());
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

export const fetchAndStoreCities = () => (dispatch, getState) => {
  makeRequest(Endpoints.cities).then((result) => {
    dispatch(receiveCities(result));
  });
};

const receiveCities = (cities) => {
  return {
    type: RECEIVE_CITIES,
    cities
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

export const fetchAndStoreCrashSubTypes = () => (dispatch, getState) => {
  makeRequest(Endpoints.crashSubTypes).then((result) => {
    dispatch(receiveCrashSubTypes(result));
  });
};

const receiveCrashSubTypes = (crashSubTypes) => {
  return {
    type: RECEIVE_CRASH_SUB_TYPES,
    crashSubTypes
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

export const fetchAndStoreEvacuationImpacts = () => (dispatch, getState) => {
  makeRequest(Endpoints.evacuationImpacts).then((result) => {
    dispatch(receiveEvacuationImpacts(result));
  });
};

const receiveEvacuationImpacts = (evacuationImpact) => {
  return {
    type: RECEIVE_EVACUATION_IMPACTS,
    evacuationImpact
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

export const fetchAndStorePremisesTypes = () => (dispatch, getState) => {
  makeRequest(Endpoints.premisesTypes).then((result) => {
    dispatch(receivePremisesTypes(result));
  });
};

const receivePremisesTypes = (premisesTypes) => {
  return {
    type: RECEIVE_PREMISES_TYPES,
    premisesTypes
  };
};

export const fetchAndStoreProgrammeScopes = () => (dispatch, getState) => {
  makeRequest(Endpoints.programmeScopes).then((result) => {
    dispatch(receiveProgrammeScopes(result));
  });
};

const receiveProgrammeScopes = (programmeScopes) => {
  return {
    type: RECEIVE_PROGRAMME_SCOPES,
    programmeScopes
  };
};

export const fetchAndStoreProgrammeAreas = () => (dispatch, getState) => {
  makeRequest(Endpoints.programmeAreas).then((result) => {
    dispatch(receiveProgrammeAreas(result));
  });
};

const receiveProgrammeAreas = (programmeAreas) => {
  return {
    type: RECEIVE_PROGRAMME_AREAS,
    programmeAreas
  };
};

export const fetchAndStoreProgrammeTypes = () => (dispatch, getState) => {
  makeRequest(Endpoints.programmeTypes).then((result) => {
    dispatch(receiveProgrammeTypes(result));
  });
};

const receiveProgrammeTypes = (programmeTypes) => {
  return {
    type: RECEIVE_PROGRAMME_TYPES,
    programmeTypes
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
