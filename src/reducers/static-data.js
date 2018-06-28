import * as ACTION_TYPES from '../actions/static-data.js';


const defaultStaticData = {
    propertyCategories: [],
    incidentTypes: [],
    criticalities: [],
    vehicleTypes: [],
    crashTypes: [],
    countries: [],
    regions: [],
    impacts: [],
    factors: [],
    weapons: [],
    users: [],
    teams: [],
};
const staticData = (state = defaultStaticData, action) => {
  switch (action.type) {
    case ACTION_TYPES.LOAD_PROPERTY_CATEGORIES:
      return {
        ...state,
        propertyCategories: action.propertyCategories
      };
    case ACTION_TYPES.LOAD_INCIDENT_TYPES:
      return {
        ...state,
        incidentTypes: action.incidentTypes
      };
    case ACTION_TYPES.LOAD_CRITICALITIES:
      return {
        ...state,
        criticalities: action.criticalities
      };
    case ACTION_TYPES.LOAD_VEHICLE_TYPES:
      return {
        ...state,
        vehicleTypes: action.vehicleTypes
      };
    case ACTION_TYPES.LOAD_CRASH_TYPES:
      return {
        ...state,
        crashTypes: action.crashTypes
      };
    case ACTION_TYPES.LOAD_COUNTRIES:
      return {
        ...state,
        countries: action.countries
      };
    case ACTION_TYPES.LOAD_REGIONS:
      return {
        ...state,
        regions: action.regions
      };
    case ACTION_TYPES.LOAD_IMPACTS:
      return {
        ...state,
        impacts: action.impacts
      };
    case ACTION_TYPES.LOAD_FACTORS:
      return {
        ...state,
        factors: action.factors
      };
    case ACTION_TYPES.LOAD_WEAPONS:
      return {
        ...state,
        weapons: action.weapons
      };
    case ACTION_TYPES.LOAD_USERS:
      return {
        ...state,
        users: action.users
      };
    case ACTION_TYPES.LOAD_TEAMS:
      return {
        ...state,
        teams: action.teams
      };
    default:
      return state;
  }
}

export default staticData;
