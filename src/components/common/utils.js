export const objDiff = (o1, o2) => {
  return Object.keys(o2).reduce((diff, key) => {
    if (typeof o1[key] === 'object' && typeof o1[key] === 'object') {
      return {
        ...diff,
        [key]: objDiff(o1[key], o2[key])
      };
    }
    if (o1[key] === o2[key]) {
      return diff;
    }
    return {
      ...diff,
      [key]: o2[key]
    }
  }, {});

};
