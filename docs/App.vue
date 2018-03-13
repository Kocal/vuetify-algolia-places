<template>
  <v-app>
    <v-content>
      <v-toolbar dark fixed color="primary">
        <v-toolbar-title>Vuetify Algolia Places</v-toolbar-title>
      </v-toolbar>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm10 md8 lg6>
            <h1 class="display-3 text-xs-center">Vuetify Algolia Places</h1>
            <vuetify-algolia-places
              v-model="place"
              v-bind="options"
              class="mt-5 mb-2"
            />
            <code v-if="place !== null" class="mb-5 pa-3 d-block">{{ JSON.stringify(place, null, 2) }}</code>
            <v-card>
              <v-card-title>
                <h3 class="headline mb-0">Configuration</h3>
              </v-card-title>
              <v-card-text>
                <v-switch v-model="options.disabled" label="Disabled" color="primary"/>
                <v-switch v-model="options.required" label="Required" color="primary"/>
                <v-text-field v-model="options.label" label="Label"/>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
const initialPlace = {
  name: '30 Rue du Sergent Michel Berthet',
  administrative: 'Auvergne-Rhône-Alpes',
  city: 'Lyon 9e Arrondissement',
  country: 'France',
  countryCode: 'fr',
  type: 'address',
  latlng: {
    lat: 45.7704,
    lng: 4.8053,
  },
  postcode: '69009',
  highlight: {
    name: '<em>30</em> <em>Rue</em> <em>du</em> <em>Sergent</em> <em>Michel</em> Berthet',
    city: 'Lyon 9e Arrondissement',
    administrative: 'Auvergne-Rhône-Alpes',
    country: 'France',
  },
  hitIndex: 0,
  query: '30 rue du sergent michel',
  value: '30 Rue du Sergent Michel Berthet, Lyon 9e Arrondissement, Auvergne-Rhône-Alpes, France',
};

export default {
  name: 'App',
  data() {
    return {
      place: initialPlace,
      options: {
        disabled: false,
        required: true,
        label: 'Search a place',
      },
    };
  },
  watch: {
    place() {
      delete this.place.hit;
      delete this.place.rawAnswer;
    },
  },
};
</script>
