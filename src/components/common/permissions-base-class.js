import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { store } from '../../redux/store.js';

export class PermissionsBase extends PolymerElement {
  hasPermission(permissionName) {
    const userPermissions = store.getState().staticData.profile.permissions;
    return userPermissions && !!userPermissions[permissionName];
  }
}
