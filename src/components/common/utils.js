export const objDiff = (object1, object2) => {
  return Object.keys(object2).reduce((diff, key) => {
    let elem1 = object1[key];
    let elem2 = object2[key];

    if (!elem1 && !elem2) {
      return diff;
    }

    if (isObject(elem1) && isObject(elem2)) {
      let elemsDiff = objDiff(elem1, elem2);

      if (!isEmptyObject(elemsDiff)) {
        return {
          ...diff,
          [key]: elemsDiff
        };
      }

      return diff;
    }

    if (isArray(elem1) && isArray(elem2)) {
      if (elem1.length !== elem2.length) {
        return {
          ...diff,
          [key]: elem2
        };
      } else if (arraysAreSame(elem1, elem2)) {
        return diff;
      }
    }

    if (elem1 === elem2) {
      return diff;
    }

    return {
      ...diff,
      [key]: elem2
    }
  }, {});
};

const arraysAreSame = (array1, array2) => {
  return array1.length === array1.length &&
         array1.length == array1.filter((elem, index) => {
           return array1[index] == array2[index];
         });
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
