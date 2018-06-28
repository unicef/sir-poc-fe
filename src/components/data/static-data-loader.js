import { makeRequest } from '../common/request-helper.js';
import { loadEvents } from '../../actions/events.js';
import {
  loadPropertyCategories,
  loadIncidentTypes,
  loadCriticalities,
  loadVehicleTypes,
  loadCrashTypes,
  loadCountries,
  loadRegions,
  loadImpacts,
  loadFactors,
  loadWeapons,
  loadUsers,
  loadTeams
} from '../../actions/static-data.js';

const eventsListEndpointName =  'eventsList';
const propertyCategoriesEndpointName = 'propertyCategories';
const incidentTypesEndpointName = 'incidentTypes';
const criticalitiesEndpointName = 'criticalities';
const vehicleTypesEndpointName = 'vehicleTypes';
const crashTypesEndpointName = 'crashTypes';
const countriesEndpointName = 'countries';
const impactsEndpointName = 'impacts';
const factorsEndpointName = 'factors';
const regionsEndpointName = 'regions';
const weaponsEndpointName = 'weapons';
const teamsEndpointName = 'teams';
const usersEndpointName = 'users';

export const loadAllStaticData = (store) => {
  fetchAndStoreEvents(store);
  fetchAndStorePropertyCategories(store);
  fetchAndStoreIncidentTypes(store);
  fetchAndStoreCriticalities(store);
  fetchAndStoreVehicleTypes(store);
  fetchAndStoreCrashTypes(store);
  fetchAndStoreCountries(store);
  fetchAndStoreRegions(store);
  fetchAndStoreImpacts(store);
  fetchAndStoreFactors(store);
  fetchAndStoreWeapons(store);
  fetchAndStoreUsers(store);
  fetchAndStoreTeams(store);
};

export const fetchAndStoreEvents = (store) => {
  makeRequest(eventsListEndpointName).then((result) => {
    store.dispatch(loadEvents(JSON.parse(result)));
  });
};

export const fetchAndStorePropertyCategories = (store) => {
  makeRequest(propertyCategoriesEndpointName).then(result => {
    store.dispatch(loadPropertyCategories(JSON.parse(result)));
  });
};

export const fetchAndStoreIncidentTypes = (store) => {
  makeRequest(incidentTypesEndpointName).then(result => {
    store.dispatch(loadIncidentTypes(JSON.parse(result)));
  });
};

export const fetchAndStoreCriticalities = (store) => {
  makeRequest(criticalitiesEndpointName).then(result => {
    store.dispatch(loadCriticalities(JSON.parse(result)));
  });
};

export const fetchAndStoreVehicleTypes = (store) => {
  makeRequest(vehicleTypesEndpointName).then(result => {
    store.dispatch(loadVehicleTypes(JSON.parse(result)));
  });
};

export const fetchAndStoreCrashTypes = (store) => {
  makeRequest(crashTypesEndpointName).then(result => {
    store.dispatch(loadCrashTypes(JSON.parse(result)));
  });
};

export const fetchAndStoreRegions = (store) => {
  makeRequest(regionsEndpointName).then(result => {
    store.dispatch(loadRegions(JSON.parse(result)));
  });
};

export const fetchAndStoreCountries = (store) => {
  makeRequest(countriesEndpointName).then(result => {
    store.dispatch(loadCountries(JSON.parse(result)));
  });
};

export const fetchAndStoreImpacts = (store) => {
  makeRequest(impactsEndpointName).then(result => {
    store.dispatch(loadImpacts(JSON.parse(result)));
  });
};

export const fetchAndStoreFactors = (store) => {
  makeRequest(factorsEndpointName).then(result => {
    store.dispatch(loadFactors(JSON.parse(result)));
  });
};

export const fetchAndStoreWeapons = (store) => {
  makeRequest(weaponsEndpointName).then(result => {
    store.dispatch(loadWeapons(JSON.parse(result)));
  });
};

export const fetchAndStoreTeams = (store) => {
  makeRequest(teamsEndpointName).then(result => {
    store.dispatch(loadTeams(JSON.parse(result)));
  });
};

export const fetchAndStoreUsers = (store) => {
  makeRequest(usersEndpointName).then(result => {
    store.dispatch(loadUsers(JSON.parse(result)));
  });
};
