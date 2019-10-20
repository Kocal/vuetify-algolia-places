<template>
  <v-app>
    <v-app-bar app dark fixed color="primary">
      <v-toolbar-title>Vuetify Algolia Places</v-toolbar-title>
      <v-spacer />
      <v-toolbar-items>
        <v-btn text href="https://github.com/Kocal/vuetify-algolia-places" target="_blank">
          GitHub
          <v-icon right>open_in_new</v-icon>
        </v-btn>
        <v-btn text href="https://community.algolia.com/places/" target="_blank">
          Algolia Places
          <v-icon right>open_in_new</v-icon>
        </v-btn>
        <v-btn text href="https://vuetifyjs.com/components/autocompletes" target="_blank">
          Vuetify Autocomplete
          <v-icon right>open_in_new</v-icon>
        </v-btn>
      </v-toolbar-items>
    </v-app-bar>
    <v-content>
      <v-container style="max-width:1920px" fluid>
        <v-row justify="center">
          <v-col md="10" lg="8" xl="6">
            <h2 class="display-2 text-center">Vuetify Algolia Places</h2>
            <vuetify-algolia-places
              v-model="placeFormatted"
              :search-input.sync="query"
              :cache-items="options.multiple"
              v-bind="options"
              class="mt-10 mb-4"
              @error="onError"
              @clear="onClear"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" sm="12" md="6">
            <v-card>
              <v-card-title>
                <h3 class="headline mb-0">Configuration</h3>
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="12" xs="12" sm="6" md="4">
                    <v-select v-model="options.type" :items="types" label="Type" clearable />
                  </v-col>
                  <v-col cols="12" xs="12" sm="6" md="4">
                    <v-select v-model="options.language" :items="languages" label="Language" clearable />
                  </v-col>
                  <v-col cols="12" xs="12" sm="6" md="4">
                    <v-select v-model="options.countries" :items="countries" multiple label="Countries" />
                  </v-col>
                  <v-col cols="12" xs="12" sm="6" md="4">
                    <v-text-field v-model="options.aroundLatLng" label="Around Lat/Lng" placeholder="12.232,23.1" />
                  </v-col>
                  <v-col cols="12" xs="12" sm="6" md="4">
                    <v-text-field v-model="options.aroundRadius" type="number" label="Around radius (meters)" />
                  </v-col>
                  <v-col cols="12" xs="12" sm="6" md="4">
                    <v-switch v-model="options.aroundLatLngViaIp" label="Around Lat/Lng via IP" color="primary" />
                  </v-col>
                  <v-col cols="12" xs="12" sm="6" md="4">
                    <v-text-field v-model="options.debounce" label="Debounce (ms)" type="number" min="0" />
                  </v-col>
                </v-row>
              </v-card-text>
              <v-card-title>
                <h4 class="headline mb-2">Vuetify props</h4>
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="12" md="4" sm="12">
                    <v-switch v-model="options.disabled" label="Disabled" color="primary" hide-details />
                    <v-switch v-model="options.clearable" label="Clearable" color="primary" hide-details />
                    <v-switch v-model="options.singleLine" label="Single line" color="primary" hide-details />
                    <v-switch v-model="options.filled" label="Style filled" color="primary" hide-details />
                    <v-switch v-model="options.solo" label="Style solo" color="primary" hide-details />
                    <v-switch
                      v-model="options.multiple"
                      label="Multiple"
                      color="primary"
                      hide-details
                      @change="updateModel"
                    />
                    <v-switch v-model="options.chips" label="Chips" color="primary" hide-details />
                    <v-switch v-model="options.deletableChips" label="Deletable chips" color="primary" hide-details />
                  </v-col>
                  <v-col cols="12" md8 sm="12">
                    <v-text-field v-model="options.label" label="Label" />
                    <v-select v-model="options.appendIcon" :items="appendIcons" label="Append icon">
                      <template slot="item" slot-scope="{ item }">
                        <v-icon>{{ item }}</v-icon>
                        <span class="ml-2">{{ item }}</span>
                      </template>
                    </v-select>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" sm="12" md="6">
            <v-row>
              <v-col class="pt-0">
                <h2 class="headline mb-3">Installation and usage</h2>
                <code class="pa-3 mb-3 d-block">{{ installationCode }}</code>
                <code class="pa-3 mb-3 d-block">{{ usageCode }}</code>
              </v-col>
            </v-row>
            <v-row v-if="showModel">
              <v-col>
                <h2 class="headline mb-3">Model</h2>
                <code class="mb-3 pa-3 d-block">{{ JSON.stringify(placeFormatted, null, 2) }}</code>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      query: '30 Rue du Sergent Michel Berthet, Lyon',
      place: null,
      types: ['city', 'country', 'address', 'busStop', 'trainStation', 'townhall', 'airport'],
      languages: ['fr', 'en', 'es'],
      countries: ['fr', 'gb', 'es'],
      appendIcons: ['location_on', 'local_airport', 'location_city'],
      options: {
        type: null,
        language: 'fr',
        countries: [],
        aroundLatLng: null,
        aroundLatLngViaIp: true,
        aroundRadius: null,
        debounce: 0,
        // Vuetify
        disabled: false,
        clearable: false,
        singleLine: false,
        filled: false,
        solo: true,
        label: 'Search a place',
        appendIcon: 'location_on',
        multiple: false,
        chips: false,
        deletableChips: false,
      },
    };
  },
  computed: {
    showModel() {
      return Array.isArray(this.place) ? this.place.length > 0 : this.place;
    },
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
      code += '\n<vuetify-algolia-places';
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

      if (this.options.appendIcon && this.options.appendIcon !== 'location_on') {
        code += `\n  append-icon="${this.options.appendIcon}"`;
      }

      if (this.options.label) {
        code += `\n  label="${this.options.label}"`;
      }

      if (this.options.debounce) {
        code += `\n  debounce="${this.options.debounce}"`;
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
      if (this.options.filled) {
        code += `\n  filled`;
      }
      if (this.options.solo) {
        code += `\n  solo`;
      }

      if (this.options.multiple) {
        code += `\n  multiple`;
      }

      if (this.options.chips) {
        code += `\n  chips`;
      }

      if (this.options.deletableChips) {
        code += `\n  deletableChips`;
      }

      code += '\n/>';
      return code;
    },
    placeFormatted: {
      get() {
        if (Array.isArray(this.place)) {
          // Remove hit and rawAnswer props from every object in place array
          return this.place.map(({ hit, rawAnswer, ...p }) => p);
        }

        if (this.place) {
          delete this.place.hit;
          delete this.place.rawAnswer;
          return this.place;
        }

        return this.place;
      },
      set(value) {
        this.place = value;
      },
    },
  },
  watch: {
    'options.filled': function(filled) {
      if (filled) {
        this.options.solo = false;
      }
    },
    'options.solo': function(solo) {
      if (solo) {
        this.options.filled = false;
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
    updateModel(multiple) {
      if (multiple) {
        this.place = [];
      } else {
        this.place = null;
      }
    },
  },
};
</script>
