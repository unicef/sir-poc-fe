export const LOAD_PROPERTY_CATEGORIES = 'LOAD_PROPERTY_CATEGORIES';
export const LOAD_INCIDENT_TYPES = 'LOAD_INCIDENT_TYPES';
export const LOAD_CRITICALITIES = 'LOAD_CRITICALITIES';
export const LOAD_VEHICLE_TYPES = 'LOAD_VEHICLE_TYPES';
export const LOAD_CRASH_TYPES = 'LOAD_CRASH_TYPES';
export const LOAD_COUNTRIES = 'LOAD_COUNTRIES';
export const LOAD_REGIONS = 'LOAD_REGIONS';
export const LOAD_IMPACTS = 'LOAD_IMPACTS';
export const LOAD_FACTORS = 'LOAD_FACTORS';
export const LOAD_WEAPONS = 'LOAD_WEAPONS';
export const LOAD_USERS = 'LOAD_USERS';
export const LOAD_TEAMS = 'LOAD_TEAMS';

export const loadPropertyCategories = (propertyCategories) => (dispatch, getState) => {
  dispatch({
    type: LOAD_PROPERTY_CATEGORIES,
    propertyCategories
  });
};

export const loadIncidentTypes = (incidentTypes) => (dispatch, getState) => {
  dispatch({
    type: LOAD_INCIDENT_TYPES,
    incidentTypes
  });
};

export const loadCriticalities = (criticalities) => (dispatch, getState) => {
  dispatch({
    type: LOAD_CRITICALITIES,
    criticalities
  });
};

export const loadVehicleTypes = (vehicleTypes) => (dispatch, getState) => {
  dispatch({
    type: LOAD_VEHICLE_TYPES,
    vehicleTypes
  });
};

export const loadCrashTypes = (crashTypes) => (dispatch, getState) => {
  dispatch({
    type: LOAD_CRASH_TYPES,
    crashTypes
  });
};

export const loadCountries = (countries) => (dispatch, getState) => {
  dispatch({
    type: LOAD_COUNTRIES,
    countries
  });
};

export const loadRegions = (regions) => (dispatch, getState) => {
  dispatch({
    type: LOAD_REGIONS,
    regions
  });
};

export const loadImpacts = (impacts) => (dispatch, getState) => {
  dispatch({
    type: LOAD_IMPACTS,
    impacts
  });
};

export const loadFactors = (factors) => (dispatch, getState) => {
  dispatch({
    type: LOAD_FACTORS,
    factors
  });
};

export const loadWeapons = (weapons) => (dispatch, getState) => {
  dispatch({
    type: LOAD_WEAPONS,
    weapons
  });
};

export const loadUsers = (users) => (dispatch, getState) => {
  dispatch({
    type: LOAD_USERS,
    users
  });
};

export const loadTeams = (teams) => (dispatch, getState) => {
  dispatch({
    type: LOAD_TEAMS,
    teams
  });
};

