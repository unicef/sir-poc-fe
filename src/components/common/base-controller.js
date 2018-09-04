import { PolymerElement } from '@polymer/polymer/polymer-element.js';

export class BaseController extends PolymerElement {
  static get observers() {
    return [
      'routeChanged(routeData.section, routeData.id)',
      'pageChanged(page)'
    ];
  }

  routeChanged(section, id) {
    if (!section) {
      this.set('page', 'list');
    } else if (this._idNotInUrlWhenRequired(section, id)) {
      this._redirectToList();
    } else {
      this.set('page', section);
    }
  }

  pageIs(actualPage, expectedPage) {
    return actualPage === expectedPage;
  }

  _idNotInUrlWhenRequired(section, id) {
    return ['list', 'new'].indexOf(section) < 0 && !id;
  }

  _redirectToList() {
    this.set('routeData.section', 'list');
  }

  pageChanged(page) {
    // overwrite me, my children
  }
}
