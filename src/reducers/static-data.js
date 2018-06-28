import {
    LOAD_PROPERTY_CATEGORIES,
    LOAD_INCIDENT_TYPES,
    LOAD_CRITICALITIES,
    LOAD_VEHICLE_TYPES,
    LOAD_CRASH_TYPES,
    LOAD_COUNTRIES,
    LOAD_REGIONS,
    LOAD_IMPACTS,
    LOAD_FACTORS,
    LOAD_WEAPONS,
    LOAD_USERS,
    LOAD_TEAMS
} from '../actions/static-data.js';


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
    case LOAD_PROPERTY_CATEGORIES:
      return {
        ...state,
        propertyCategories: action.propertyCategories
      };
    case LOAD_INCIDENT_TYPES:
      return {
        ...state,
        incidentTypes: action.incidentTypes
      };
    case LOAD_CRITICALITIES:
      return {
        ...state,
        criticalities: action.criticalities
      };
    case LOAD_VEHICLE_TYPES:
      return {
        ...state,
        vehicleTypes: action.vehicleTypes
      };
    case LOAD_CRASH_TYPES:
      return {
        ...state,
        crashTypes: action.crashTypes
      };
    case LOAD_COUNTRIES:
      return {
        ...state,
        countries: action.countries
      };
    case LOAD_REGIONS:
      return {
        ...state,
        regions: action.regions
      };
    case LOAD_IMPACTS:
      return {
        ...state,
        impacts: action.impacts
      };
    case LOAD_FACTORS:
      return {
        ...state,
        factors: action.factors
      };
    case LOAD_WEAPONS:
      return {
        ...state,
        weapons: action.weapons
      };
    case LOAD_USERS:
      return {
        ...state,
        users: action.users
      };
    case LOAD_TEAMS:
      return {
        ...state,
        teams: action.teams
      };
    default:
      return state;
  }
}

export default staticData;
