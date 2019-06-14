import { allPermissions } from '../config/permissions.js';

export const computePermissions = (profile) => {
  let permissions = {};
  if (!profile || !profile.permissions) {
    return permissions;
  }

  allPermissions.forEach((elem) => {
    if (profile.permissions.indexOf(elem) > -1) {
      permissions[elem] = true;
    }
  });

  return permissions;
};
