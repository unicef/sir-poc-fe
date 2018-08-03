export function validateFields(host, fieldSelectors, useShadowRoot) {

  if (host instanceof HTMLElement === false) {
    throw new Error('[validateFields] Invalid host element provided for validation check.');
  }
  if (fieldSelectors instanceof Array === false || fieldSelectors.length === 0) {
    // nothing to validate
    return true;
  }

  useShadowRoot = useShadowRoot || true;
  const queryDom = useShadowRoot ? host.shadowRoot : host;

  let valid = true;
  fieldSelectors.forEach((selector) => {
    const field = queryDom.querySelector(selector);
    if (field && !field.validate()) {
      valid = false;
    }
  });
  return valid;
}
