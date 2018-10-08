export function validateFields(host, fieldSelectors, useShadowRoot) {

  if (host instanceof HTMLElement === false) {
    throw new Error('[validateFields] Invalid host element provided for validation.');
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

export function resetFieldsValidations(host, fieldSelectors, useShadowRoot) {
  if (host instanceof HTMLElement === false) {
    throw new Error('[validateFields] Invalid host element provided for validation reset.');
  }

  if (fieldSelectors instanceof Array === false || fieldSelectors.length === 0) {
    return;
  }

  useShadowRoot = useShadowRoot || true;
  const queryDom = useShadowRoot ? host.shadowRoot : host;

  fieldSelectors.forEach((selector) => {
    const field = queryDom.querySelector(selector);
    if (field) {
      field.set('invalid', false);
    }
  });
}

export function validateAllRequired(host, selector, useShadowRoot) {
  if (host instanceof HTMLElement === false) {
    throw new Error('[validateFields] Invalid host element provided for validation.');
  }

  selector = selector || '*[required]';

  useShadowRoot = useShadowRoot || true;
  const queryDom = useShadowRoot ? host.shadowRoot : host;

  let valid = true;

  const fields = queryDom.querySelectorAll(selector);

  if (fields && fields.length) {
    fields.forEach((elem) => {
      valid = elem.validate() && valid;
    });
  }

  return valid;
}

export function resetRequiredValidations(host, selector, useShadowRoot) {

  if (host instanceof HTMLElement === false) {
    throw new Error('[validateFields] Invalid host element provided for validation.');
  }

  selector = selector || '*[required]';

  useShadowRoot = useShadowRoot || true;
  const queryDom = useShadowRoot ? host.shadowRoot : host;

  const fields = queryDom.querySelectorAll(selector);

  if (fields && fields.length) {
    fields.forEach((elem) => {
      elem.set('invalid', false);
    });
  }

}
