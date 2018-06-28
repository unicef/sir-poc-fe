import { makeRequest } from '../common/request-helper.js';
import { loadEvents } from '../../actions/events.js';
import * as staticDataActions from '../../actions/static-data.js';
import { Endpoints } from '../../config/endpoints.js';

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
  makeRequest(Endpoints.eventsList).then(result => {
    store.dispatch(loadEvents(JSON.parse(result)));
  });
};

export const fetchAndStorePropertyCategories = (store) => {
  makeRequest(Endpoints.propertyCategories).then(result => {
    store.dispatch(staticDataActions.loadPropertyCategories(JSON.parse(result)));
  });
};

export const fetchAndStoreIncidentTypes = (store) => {
  makeRequest(Endpoints.incidentTypes).then(result => {
    store.dispatch(staticDataActions.loadIncidentTypes(JSON.parse(result)));
  });
};

export const fetchAndStoreCriticalities = (store) => {
  makeRequest(Endpoints.criticalities).then(result => {
    store.dispatch(staticDataActions.loadCriticalities(JSON.parse(result)));
  });
};

export const fetchAndStoreVehicleTypes = (store) => {
  makeRequest(Endpoints.vehicleTypes).then(result => {
    store.dispatch(staticDataActions.loadVehicleTypes(JSON.parse(result)));
  });
};

export const fetchAndStoreCrashTypes = (store) => {
  makeRequest(Endpoints.crashTypes).then(result => {
    store.dispatch(staticDataActions.loadCrashTypes(JSON.parse(result)));
  });
};

export const fetchAndStoreRegions = (store) => {
  makeRequest(Endpoints.regions).then(result => {
    store.dispatch(staticDataActions.loadRegions(JSON.parse(result)));
  });
};

export const fetchAndStoreCountries = (store) => {
  makeRequest(Endpoints.countries).then(result => {
    store.dispatch(staticDataActions.loadCountries(JSON.parse(result)));
  });
};

export const fetchAndStoreImpacts = (store) => {
  makeRequest(Endpoints.impacts).then(result => {
    store.dispatch(staticDataActions.loadImpacts(JSON.parse(result)));
  });
};

export const fetchAndStoreFactors = (store) => {
  makeRequest(Endpoints.factors).then(result => {
    store.dispatch(staticDataActions.loadFactors(JSON.parse(result)));
  });
};

export const fetchAndStoreWeapons = (store) => {
  makeRequest(Endpoints.weapons).then(result => {
    store.dispatch(staticDataActions.loadWeapons(JSON.parse(result)));
  });
};

export const fetchAndStoreTeams = (store) => {
  makeRequest(Endpoints.teams).then(result => {
    store.dispatch(staticDataActions.loadTeams(JSON.parse(result)));
  });
};

export const fetchAndStoreUsers = (store) => {
  makeRequest(Endpoints.users).then(result => {
    store.dispatch(staticDataActions.loadUsers(JSON.parse(result)));
  });
};
