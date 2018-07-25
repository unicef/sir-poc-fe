import { fetchAndStoreEvents } from '../../actions/events.js';
import * as staticDataActions from '../../actions/static-data.js';

export const loadAllStaticData = (store) => {
  store.dispatch(fetchAndStoreEvents());
  // store.dispatch(staticDataActions.fetchAndStorePropertyCategories());
  store.dispatch(staticDataActions.fetchAndStoreIncidentCategories());
  store.dispatch(staticDataActions.fetchAndStoreThreatCategories());
  store.dispatch(staticDataActions.fetchAndStoreCriticalities());
  store.dispatch(staticDataActions.fetchAndStoreVehicleTypes());
  store.dispatch(staticDataActions.fetchAndStoreCrashTypes());
  store.dispatch(staticDataActions.fetchAndStoreCountries());
  store.dispatch(staticDataActions.fetchAndStoreAgencies());
  store.dispatch(staticDataActions.fetchAndStoreRegions());
  // store.dispatch(staticDataActions.fetchAndStoreImpacts());
  store.dispatch(staticDataActions.fetchAndStoreFactors());
  store.dispatch(staticDataActions.fetchAndStoreTargets());
  store.dispatch(staticDataActions.fetchAndStoreWeapons());
  store.dispatch(staticDataActions.fetchAndStoreUsers());
  store.dispatch(staticDataActions.fetchAndStoreTeams());
};
