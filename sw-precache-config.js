/**
 * @license
 * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

module.exports = {
  staticFileGlobs: [
    'src/**/*',
    'images/**/*',
    'manifest.json',
    'node_modules/msal/dist/msal.min.js',
    'node_modules/moment/min/moment.min.js',
    'node_modules/web-animations-js/web-animations-next-lite.min.js',
    'node_modules/@webcomponents/webcomponentsjs/webcomponents-loader.js'
  ],
  runtimeCaching: [
    {
      urlPattern: /\/@webcomponents\/webcomponentsjs\//,
      handler: 'fastest'
    }
  ],
  navigateFallbackWhitelist: [/^(?!\/admin\/)/]
};
// TODO: figure out a viable way of importing msal only when needed
