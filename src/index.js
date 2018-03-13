/* eslint-disable no-param-reassign,no-underscore-dangle */

import VuetifyAlgoliaPlaces from './VuetifyAlgoliaPlaces.vue';

const defaultOptions = {
  algolia: {
    apiKey: null,
    appId: null,
  },
};

const install = (Vue, options = {}) => {
  options = Object.assign({}, defaultOptions, options);

  Vue.component('vuetify-algolia-places', VuetifyAlgoliaPlaces);
  Vue.prototype.__vuetifyAlgoliaPlaces = {
    options,
  };
};

export default install;
