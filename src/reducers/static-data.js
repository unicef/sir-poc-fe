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
    case ACTIONS.RECEIVE_PROPERTY_CATEGORIES:
      return {
        ...state,
        propertyCategories: action.propertyCategories
      };
    case ACTIONS.RECEIVE_INCIDENT_TYPES:
      return {
        ...state,
        incidentTypes: action.incidentTypes
      };
    case ACTIONS.RECEIVE_CRITICALITIES:
      return {
        ...state,
        criticalities: action.criticalities
      };
    case ACTIONS.RECEIVE_VEHICLE_TYPES:
      return {
        ...state,
        vehicleTypes: action.vehicleTypes
      };
    case ACTIONS.RECEIVE_CRASH_TYPES:
      return {
        ...state,
        crashTypes: action.crashTypes
      };
    case ACTIONS.RECEIVE_COUNTRIES:
      return {
        ...state,
        countries: action.countries
      };
    case ACTIONS.RECEIVE_REGIONS:
      return {
        ...state,
        regions: action.regions
      };
    case ACTIONS.RECEIVE_IMPACTS:
      return {
        ...state,
        impacts: action.impacts
      };
    case ACTIONS.RECEIVE_FACTORS:
      return {
        ...state,
        factors: action.factors
      };
    case ACTIONS.RECEIVE_WEAPONS:
      return {
        ...state,
        weapons: action.weapons
      };
    case ACTIONS.RECEIVE_USERS:
      return {
        ...state,
        users: action.users
      };
    case ACTIONS.RECEIVE_TEAMS:
      return {
        ...state,
        teams: action.teams
      };
    default:
      return state;
  }
}

export default staticData;
