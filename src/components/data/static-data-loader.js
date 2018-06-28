import { EtoolsAjaxLite } from '../common/etools-ajax-lite.js';
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
import { ENDPOINTS_URL } from "../../config/endpoints.js";

const dataMapping = [
  {
    url: ENDPOINTS_URL.EVENTS,
    action: loadEvents
  },
  {
    url: ENDPOINTS_URL.PROPERTY_CATEGORIES,
    action: loadPropertyCategories
  },
  {
    url: ENDPOINTS_URL.INCIDENT_TYPES,
    action: loadIncidentTypes
  },
  {
    url: ENDPOINTS_URL.CRITICALITIES,
    action: loadCriticalities
  },
  {
    url: ENDPOINTS_URL.VEHICLE_TYPES,
    action: loadVehicleTypes
  },
  {
    url: ENDPOINTS_URL.CRASH_TYPES,
    action: loadCrashTypes
  },
  {
    url: ENDPOINTS_URL.COUNTRIES,
    action: loadCountries
  },
  {
    url: ENDPOINTS_URL.REGIONS,
    action: loadRegions
  },
  {
    url: ENDPOINTS_URL.IMPACTS,
    action: loadImpacts
  },
  {
    url: ENDPOINTS_URL.FACTORS,
    action: loadFactors
  },
  {
    url: ENDPOINTS_URL.WEAPONS,
    action: loadWeapons
  },
  {
    url: ENDPOINTS_URL.USERS,
    action: loadUsers
  },
  {
    url: ENDPOINTS_URL.TEAMS,
    action: loadTeams
  }
];

export const loadAllStaticData = (store) => {
  dataMapping.forEach((data) => {
    EtoolsAjaxLite.request({
      url: data.url,
      method: 'GET'
    }).then((result) => {
      // update redux state using mapped action
      store.dispatch(data.action(result));
    }).catch((error) => {
      // TODO: handle requests errors here
      console.log(error);
    });
  });
};
