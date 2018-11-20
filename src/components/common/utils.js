import { store } from '../../redux/store.js';

const arraysAreSame = (array1, array2) => {
  return array1.length === array2.length &&
         array1.length === array1.filter((elem, index) => {
           return array1[index] === array2[index];
         }).length;
};

const isObject = (a) => {
  return a && a.constructor === Object;
};

const isArray = (a) => {
  return a && a.constructor === Array;
};

const isEmptyObject = (a) => {
  return isObject(a) && Object.keys(a).length === 0;
};

export const objDiff = (object1, object2) => {
  return Object.keys(object2).reduce((diff, key) => {
    let elem1 = object1[key];
    let elem2 = object2[key];

    if (!elem1 && !elem2) {
      return diff;
    }

    if (isObject(elem1) && isObject(elem2)) {
      let elemsDiff = objDiff(elem1, elem2);

      if (isEmptyObject(elemsDiff)) {
        return diff;
      }

      return {
        ...diff,
        [key]: elemsDiff
      };
    }

    if (isArray(elem1) && isArray(elem2) && arraysAreSame(elem1, elem2)) {
      return diff;
    }

    if (elem1 === elem2) {
      return diff;
    }

    return {
      ...diff,
      [key]: elem2
    };
  }, {});
};

const getStaticDataByPath = (path, data) => {
  if (path.indexOf('.') === -1) {
    return data[path];
  }

  let pathPieces = path.split('.');
  let newData = data[pathPieces.shift()];
  return getStaticDataByPath(pathPieces.join('.'), newData);
};

export const getNameFromId = (id, staticDataPath) => {
  if (!id) {
    return '';
  }

  let staticData = store.getState().staticData;
  let result = getStaticDataByPath(staticDataPath, staticData).find(v => Number(v.id) === Number(id));
  return result ? result.name || '' : '';
};

export const isNumber = (candidate) => {
  return !isNaN(parseFloat(candidate));
};

export const getCountriesForRegion = (regionId) => {
  if (!regionId) {
    return null;
  }

  let allCountries = store.getState().staticData.countries;
  return allCountries.filter(country => Number(country.region) === Number(regionId));
}

export const getUserName = (id) => {
  let state = store.getState();
  if (!id || !state || !state.app || state.app.offline) {
    return '';
  }

  let usersList = state.users.list;
  let result = usersList.find(v => Number(v.id) === Number(id));
  return result ? result.name || '' : '';
}
