<template>
  <v-app>
    <v-content>
      <v-toolbar app dark fixed color="primary">
        <v-toolbar-title>Vuetify Algolia Places</v-toolbar-title>
      </v-toolbar>
      <v-container fluid grid-list-lg style="max-width: 1920px">
        <v-layout justify-center row wrap>
          <v-flex xs12>
            <v-container>
              <h1 class="display-3 text-xs-center">Vuetify Algolia Places</h1>
              <vuetify-algolia-places
                v-model="place"
                v-bind="options"
                class="mt-5 mb-2"
                @error="onError"
                @clear="onClear"
              />
            </v-container>
          </v-flex>
          <v-flex xs6>
            <v-card>
              <v-card-title>
                <h3 class="headline mb-0">Configuration</h3>
              </v-card-title>
              <v-card-text>
                <v-select v-model="options.type" :items="types" label="Type" clearable />
                <v-select v-model="options.language" :items="languages" label="Language" clearable />
                <v-select v-model="options.countries" :items="countries" multiple label="Countries" />
                <v-text-field v-model="options.aroundLatLng" label="Around Lat/Lng" placeholder="12.232,23.1" />
                <v-switch v-model="options.aroundLatLngViaIp" label="Around Lat/Lng via IP" color="primary" />
                <v-text-field v-model="options.aroundRadius" type="number" label="Around radius (meters)" />
              </v-card-text>
              <v-card-title>
                <h4 class="headline mb-2">Vuetify props</h4>
              </v-card-title>
              <v-card-text>
                <v-layout row wrap>
                  <v-flex md4 sm12>
                    <v-switch v-model="options.disabled" label="Disabled" color="primary" hide-details />
                    <v-switch v-model="options.clearable" label="Clearable" color="primary" hide-details />
                    <v-switch v-model="options.singleLine" label="Single line" color="primary" hide-details />
                    <v-switch v-model="options.box" label="Style box" color="primary" hide-details />
                    <v-switch v-model="options.solo" label="Style solo" color="primary" hide-details />
                  </v-flex>
                  <v-flex md8 sm12>
                    <v-text-field v-model="options.label" label="Label" />
                  </v-flex>
                </v-layout>
              </v-card-text>
            </v-card>
          </v-flex>
          <v-flex xs6>
            <v-layout column>
              <v-flex>
                <h2 class="headline mb-3">Installation and usage</h2>
                <code class="pa-3 mb-3 d-block">{{ installationCode }}</code>
                <code class="pa-3 mb-3 d-block">{{ usageCode }}</code>
              </v-flex>
              <v-flex v-if="place">
                <h2 class="headline mb-3">Place</h2>
                <code class="mb-3 pa-3 d-block">{{ JSON.stringify(place, null, 2) }}</code>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
const initialPlace = '30 Rue du Sergent Michel Berthet, Lyon';

export default {
  name: 'App',
  data() {
    return {
      place: initialPlace,
      types: ['city', 'country', 'address', 'busStop', 'trainStation', 'townhall', 'airport'],
      languages: ['fr', 'en', 'es'],
      countries: ['fr', 'gb', 'es'],
      options: {
        type: null,
        language: 'fr',
        countries: [],
        aroundLatLng: null,
        aroundLatLngViaIp: true,
        aroundRadius: null,
        // Vuetify
        disabled: false,
        clearable: false,
        singleLine: false,
        box: false,
        solo: true,
        label: 'Search a place',
      },
    };
  },
  computed: {
    installationCode() {
      return `import Vue from 'vue';
import VuetifyAlgoliaPlaces from 'vuetify-algolia-places';

Vue.use(VuetifyAlgoliaPlaces, {
  algolia: {
    appId: '...', // optional
    apiKey: '...', // optional
  },
});`;
    },
    usageCode() {
      let code = '// In a .vue component\n';
      code += '\n<v-algolia-places';
      code += `\n  v-model="place"`;

      if (this.options.type) {
        code += `\n  type="${this.options.type}"`;
      }

      if (this.options.language) {
        code += `\n  language="${this.options.language}"`;
      }

      if (this.options.countries.length > 0) {
        code += `\n  countries="['${this.options.countries.join("', '")}']"`;
      }

      if (this.options.aroundLatLng) {
        code += `\n  around-lat-lng="${this.options.aroundLatLng}"`;
      }

      if (this.options.aroundLatLngViaIp === false) {
        code += `\n  :around-lat-lng-via-ip="false"`;
      }

      if (this.options.aroundRadius) {
        code += `\n  around-radius="${this.options.aroundRadius}"`;
      }

      if (this.options.label) {
        code += `\n  label="${this.options.label}"`;
      }

      if (this.options.disabled) {
        code += `\n  disabled`;
      }
      if (this.options.clearable) {
        code += `\n  clearable`;
      }
      if (this.options.singleLine) {
        code += `\n  single-line`;
      }
      if (this.options.box) {
        code += `\n  box`;
      }
      if (this.options.solo) {
        code += `\n  solo`;
      }

      code += '\n/>';
      return code;
    },
  },
  watch: {
    place() {
      if (this.place) {
        delete this.place.hit;
        delete this.place.rawAnswer;
      }
    },
    'options.box': function(box) {
      if (box) {
        this.options.solo = false;
      }
    },
    'options.solo': function(solo) {
      if (solo) {
        this.options.box = false;
      }
    },
  },
  methods: {
    onError(error) {
      console.error(error);
    },
    onClear() {
      console.log('Clear');
    },
  },
};
</script>
