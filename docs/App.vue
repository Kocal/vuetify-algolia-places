<template>
  <v-app>
    <v-content>
      <v-toolbar dark fixed color="primary">
        <v-toolbar-title>Vuetify Algolia Places</v-toolbar-title>
      </v-toolbar>
      <v-container align-center justify-center fill-height>
        <vuetify-algolia-places/>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import VuetifyAlgoliaPlaces from '../src/VuetifyAlgoliaPlaces';

export default {
  components: { VuetifyAlgoliaPlaces },
  name: 'App',
};
</script>
