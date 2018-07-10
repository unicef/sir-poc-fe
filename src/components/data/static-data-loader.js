import { fetchAndStoreEvents } from '../../actions/events.js';
import * as staticDataActions from '../../actions/static-data.js';

export const loadAllStaticData = (store) => {
  store.dispatch(fetchAndStoreEvents());
  store.dispatch(staticDataActions.fetchAndStorePropertyCategories());
  store.dispatch(staticDataActions.fetchAndStoreIncidentTypes());
  store.dispatch(staticDataActions.fetchAndStoreCriticalities());
  store.dispatch(staticDataActions.fetchAndStoreVehicleTypes());
  store.dispatch(staticDataActions.fetchAndStoreCountries());
  store.dispatch(staticDataActions.fetchAndStoreRegions());
  store.dispatch(staticDataActions.fetchAndStoreImpacts());
  store.dispatch(staticDataActions.fetchAndStoreFactors());
  store.dispatch(staticDataActions.fetchAndStoreWeapons());
  store.dispatch(staticDataActions.fetchAndStoreUsers());
  store.dispatch(staticDataActions.fetchAndStoreTeams());
  store.dispatch(staticDataActions.fetchAndStoreCrashTypes());
};
