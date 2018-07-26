import * as ACTIONS from '../actions/static-data.js';

const defaultStaticData = {
    // propertyCategories: [],
    incidentCategories: [],
    threatCategories: [],
    criticalities: [],
    vehicleTypes: [],
    crashTypes: [],
    countries: [],
    agencies: [],
    regions: [],
    // impacts: [],
    factors: [],
    targets: [],
    weapons: [],
    users: [],
    teams: [],
};
const staticData = (state = defaultStaticData, action) => {
  switch (action.type) {
    case ACTIONS.RECEIVE_INCIDENT_CATEGORIES:
      return {
        ...state,
        incidentCategories: action.incidentCategories
      };
    case ACTIONS.RECEIVE_THREAT_CATEGORIES:
      return {
        ...state,
        threatCategories: action.threatCategories
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
    case ACTIONS.RECEIVE_AGENCIES:
      return {
        ...state,
        agencies: action.agencies
      };
    case ACTIONS.RECEIVE_REGIONS:
      return {
        ...state,
        regions: action.regions
      };
    case ACTIONS.RECEIVE_FACTORS:
      return {
        ...state,
        factors: action.factors
      };
    case ACTIONS.RECEIVE_TARGETS:
      return {
        ...state,
        targets: action.targets
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
