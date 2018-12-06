const _getContentContainer = () => {
  let appShell = document.querySelector('app-shell');
  if (!appShell) {
    console.warn('app-shell not found');
    return null;
  }
  let appHeadLayout = appShell.shadowRoot.querySelector('app-header-layout');
  if (!appHeadLayout) {
    console.warn('app-head-layout not found');
    return null;
  }
  return appHeadLayout.shadowRoot.querySelector('#contentContainer');
};

export const scrollToTop = () => {
  const contentContainer = _getContentContainer();
  if (!contentContainer) {
    console.warn('Cannot scroll! `contentContainer` object is null or undefined');
    return;
  }
  contentContainer.scrollTop = 0;
};
