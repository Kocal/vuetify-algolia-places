import Vue from 'vue';
import VuetifyAlgoliaPlaces from '..';
import vuetify from './vuetify';

import App from './App.vue';

Vue.use(VuetifyAlgoliaPlaces);

/* eslint-disable no-new */
new Vue({
  vuetify,
  el: '#app',
  render: h => h(App),
});
