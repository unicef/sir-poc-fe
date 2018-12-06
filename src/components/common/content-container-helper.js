const _getContentContainer = () => {
  let appShell = document.querySelector('app-shell');
  if (!appShell) {
    return null;
  }
  let appHeadLayout = appShell.shadowRoot.querySelector('app-header-layout');
  if (!appHeadLayout) {
    return null;
  }
  return appHeadLayout.shadowRoot.querySelector('#contentContainer');
};

export const scrollToTop = () => {
  const contentContainer = _getContentContainer();
  if (!contentContainer) {
    // console.warn('Cannot scroll! `contentContainer` object is null or undefined');
    return;
  }
  contentContainer.scrollTop = 0;
};
