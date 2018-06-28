import {dedupingMixin} from '@polymer/polymer/lib/utils/mixin.js';
/* eslint-disable no-unused-vars */

/**
 * @polymer
 * @mixinFunction
 */
export const SirContentScrollMixin = dedupingMixin(baseClass => class extends baseClass {
  /* eslint-enable no-unused-vars */

  _getContentContainer() {
    let appShell = document.querySelector('app-shell');
    if (!appShell) {
      return null;
    }
    let appHeadLayout = appShell.shadowRoot.querySelector('app-header-layout');
    if (!appHeadLayout) {
      return null;
    }
    return appHeadLayout.shadowRoot.querySelector('#contentContainer');
  }

  scrollToTop() {
    const contentContainer = this._getContentContainer();
    if (!contentContainer) {
      console.warn('Cannot scroll! `contentContainer` object is null or undefined');
      return;
    }
    contentContainer.scrollTop = 0;
  }

});
