import * as ACTIONS from '../actions/static-data.js';

const defaultStaticData = {
    personnelCategories: [],
    incidentCategories: [],
    threatCategories: [],
    propertyTypes: [],
    nationalities: [],
    criticalities: [],
    vehicleTypes: [],
    unLocations: [],
    crashTypes: [],
    countries: [],
    agencies: [],
    impacts: {},
    regions: [],
    factors: [],
    targets: [],
    weapons: [],
    cities: [],
    users: [],
    teams: [],
    genders: [
      {id: 'male', name: 'Male'},
      {id: 'female', name: 'Female'}
    ]
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
    case ACTIONS.RECEIVE_PROGRAMME_IMPACTS:
      return {
        ...state,
        impacts: {
          ...state.impacts,
          programme: action.programmeImpacts
        }
      };
    case ACTIONS.RECEIVE_EVACUATION_IMPACTS:
      return {
        ...state,
        impacts: {
          ...state.impacts,
          evacuation: action.evacuationImpact
        }
      };
    case ACTIONS.RECEIVE_PROPERTY_IMPACTS:
      return {
        ...state,
        impacts: {
          ...state.impacts,
          property: action.propertyImpacts
        }
      };
    case ACTIONS.RECEIVE_PERSON_IMPACTS:
      return {
        ...state,
        impacts: {
          ...state.impacts,
          person: action.personImpacts
        }
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
    case ACTIONS.RECEIVE_CITIES:
      return {
        ...state,
        cities: action.cities
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
    case ACTIONS.RECEIVE_UN_LOCATIONS:
      return {
        ...state,
        unLocations: action.unLocations
      };
    case ACTIONS.RECEIVE_PROPERTY_TYPES:
      return {
        ...state,
        propertyTypes: action.propertyTypes
      };
    case ACTIONS.RECEIVE_PERSONNEL_CATEGORIES:
      return {
        ...state,
        personnelCategories: action.personnelCategories
      };
    case ACTIONS.RECEIVE_NATIONALITIES:
      return {
        ...state,
        nationalities: action.nationalities
      };
    default:
      return state;
  }
};

export default staticData;
