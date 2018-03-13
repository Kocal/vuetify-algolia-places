import Vue from 'vue';
import Vuetify from 'vuetify';
import VuetifyAlgoliaPlaces from '..';

import App from './App.vue';

Vue.use(Vuetify);
Vue.use(VuetifyAlgoliaPlaces);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
});
