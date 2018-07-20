import '@polymer/polymer/polymer-element.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';

const $_documentContainer = document.createElement('template');
$_documentContainer.innerHTML = `
<dom-module id="grid-layout-styles">
  <template>
    <style>
      .layout-horizontal,
      .layout-vertical {
        box-sizing: border-box;
      }

      .layout-horizontal {
         @apply --layout-horizontal;
      }

      .layout-vertical,
      .col.layout-vertical {
         @apply --layout-vertical;
      }

      .flex-c {
        /* flex container */
        @apply --layout-flex;
      }

      .row-h, .row-v {
        padding: 4px 24px;
      }
      .col {
        box-sizing: border-box;
      }
      .col-1 {
        flex: 0 0 8.333333333%;
        max-width: 8.333333333%;
      }

      .col-2 {
        flex: 0 0 16.66666667%;
        max-width: 16.66666667%;
      }

      .col-3 {
        flex: 0 0 25%;
        max-width: 25%;
      }

      .col-4 {
        flex: 0 0 33.333333%;
        max-width: 33.333333%;
      }

      .col-5 {
        flex: 0 0 41.66666667%;
        max-width: 41.66666667%;
      }

      .col-6 {
        flex: 0 0 50%;
        max-width: 50%;
      }

      .col-7 {
        flex: 0 0 58.333333%;
        max-width: 58.333333%;
      }

      .col-8 {
        flex: 0 0 66.66666667%;
        max-width: 66.66666667%;
      }

      .col-9 {
        flex: 0 0 75%;
        max-width: 75%;
      }

      .col-10 {
        flex: 0 0 83.33333333%;
        max-width: 83.33333333%;
      }

      .col-12 {
        flex: 0 0 100%;
        max-width: 100%;
      }

      @media only screen and (min-width: 900px) {
        .row-h {
          @apply --layout-horizontal;
        }

        .col:not(:first-of-type) {
          padding-left: 24px;
        }
      }

      @media only screen and (max-width: 900px) {
        .col {
          flex: 0 0 100%;
          max-width: 100%;
        }
      }
      /* TODO: more classes will e added if needed */

    </style>
  </template>
</dom-module>
`;

document.head.appendChild($_documentContainer.content);
