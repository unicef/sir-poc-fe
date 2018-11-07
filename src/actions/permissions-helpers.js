import { Permissions } from '../config/permissions.js';

export const computePermissions = (profile) => {
  let permissions = {};
  if (!profile || !profile.teams) {
    return permissions;
  }

  profile.teams.forEach((team) => {
    if (!Permissions[team.name]) {
      return;
    }

    permissions = {
      ...permissions,
      ...Permissions[team.name]
    };
  });

  return permissions;
};
