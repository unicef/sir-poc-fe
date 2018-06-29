import * as ACTIONS from '../actions/static-data.js';

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
    case ACTIONS.LOAD_PROPERTY_CATEGORIES:
      return {
        ...state,
        propertyCategories: action.propertyCategories
      };
    case ACTIONS.LOAD_INCIDENT_TYPES:
      return {
        ...state,
        incidentTypes: action.incidentTypes
      };
    case ACTIONS.LOAD_CRITICALITIES:
      return {
        ...state,
        criticalities: action.criticalities
      };
    case ACTIONS.LOAD_VEHICLE_TYPES:
      return {
        ...state,
        vehicleTypes: action.vehicleTypes
      };
    case ACTIONS.LOAD_CRASH_TYPES:
      return {
        ...state,
        crashTypes: action.crashTypes
      };
    case ACTIONS.LOAD_COUNTRIES:
      return {
        ...state,
        countries: action.countries
      };
    case ACTIONS.LOAD_REGIONS:
      return {
        ...state,
        regions: action.regions
      };
    case ACTIONS.LOAD_IMPACTS:
      return {
        ...state,
        impacts: action.impacts
      };
    case ACTIONS.LOAD_FACTORS:
      return {
        ...state,
        factors: action.factors
      };
    case ACTIONS.LOAD_WEAPONS:
      return {
        ...state,
        weapons: action.weapons
      };
    case ACTIONS.LOAD_USERS:
      return {
        ...state,
        users: action.users
      };
    case ACTIONS.LOAD_TEAMS:
      return {
        ...state,
        teams: action.teams
      };
    default:
      return state;
  }
}

export default staticData;
