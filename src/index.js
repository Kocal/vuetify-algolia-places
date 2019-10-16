/* eslint-disable no-param-reassign,no-underscore-dangle */

import VuetifyAlgoliaPlaces from './VuetifyAlgoliaPlaces.vue';

const defaultOptions = {
  algolia: {
    apiKey: null,
    appId: null,
  },
};

const install = (Vue, options = {}) => {
  options = { ...defaultOptions, ...options );

  Vue.$vuetifyAlgoliaPlacesOptions = options;
  Vue.mixin({
    created() {
      this.$vuetifyAlgoliaPlacesOptions = options;
    },
  });

  Vue.component('vuetify-algolia-places', VuetifyAlgoliaPlaces);
};

export default install;
