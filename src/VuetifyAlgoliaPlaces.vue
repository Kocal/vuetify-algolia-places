<template>
  <v-autocomplete
    v-model="place"
    :items="places"
    :loading="loading"
    :search-input.sync="query"
    :filter="filter"
    :disabled="disabled"
    :required="required"
    :rules="validationRules"
    :label="label"
    single-line
    return-object
    item-text="value"
    append-icon="location_on"
    @input="onInput"
  >
    <template slot="item" slot-scope="data">
      <template v-if="typeof data.item !== 'object'">
        <v-list-tile-content>{{ data.item }}</v-list-tile-content>
      </template>
      <template v-else>
        <v-list-tile-content>
          <v-list-tile-title v-if="data.item.highlight" v-html="fixHighlight(data.item.highlight)" />
        </v-list-tile-content>
      </template>
    </template>
  </v-autocomplete>
</template>

<script>
import formatHit from 'places.js/src/formatHit';
import formatInputValue from 'places.js/src/formatInputValue';
import algoliasearch from 'algoliasearch/dist/algoliasearchLite';

export default {
  name: 'VuetifyAlgoliaPlaces',
  props: {
    value: {
      type: [Object, String],
      required: false,
      default() {
        return {};
      },
    },
    language: {
      type: String,
      default: navigator.language.split('-')[0],
    },
    countries: {
      type: Array,
      default() {
        return [];
      },
    },
    // Vuetify props
    disabled: {
      type: Boolean,
      default: false,
    },
    required: {
      type: Boolean,
      default: false,
    },
    requiredMessage: {
      type: String,
      default: 'You must select a place',
    },
    rules: {
      type: Array,
      default() {
        return [v => (v && v.value !== '') || this.requiredMessage];
      },
    },
    label: {
      type: String,
      default: '',
    },
  },
  data() {
    // The initial value can be a string or an object
    // eslint-disable-next-line no-nested-ternary
    const initialValue = this.value ? (typeof this.value === 'string' ? this.value : this.value.value) : null;
    const initialPlace = { value: initialValue };

    return {
      loading: false,
      query: initialValue,
      place: initialPlace,
      places: initialValue ? [initialPlace] : [],
      filter() {
        return true;
      },
    };
  },
  computed: {
    validationRules() {
      if (!this.required) {
        return [];
      }

      return this.rules;
    },
  },
  watch: {
    query(val) {
      if (val) {
        this.searchPlaces();
      }
    },
  },
  created() {
    this.initAlgoliaPlaces();

    if (this.query !== null) {
      this.searchPlaces(place => {
        this.place = place;
        this.onInput();
      });
    }
  },
  methods: {
    initAlgoliaPlaces() {
      const { algolia } = this.$vuetifyAlgoliaPlacesOptions;

      this.placesClient = algoliasearch.initPlaces(algolia.appId, algolia.apiKey);
    },
    searchPlaces(callback = () => {}) {
      const { query } = this;
      const language = this.language.toLowerCase();
      const countries = this.countries.map(country => country.toLowerCase());

      this.loading = true;
      this.placesClient
        .search({
          query,
          language,
          countries,
        })
        .then(content => {
          this.loading = false;
          this.places = content.hits.map((hit, hitIndex) =>
            formatHit({
              formatInputValue,
              hit,
              hitIndex,
              query,
              rawAnswer: content,
            })
          );

          if (typeof this.places[0] === 'object') {
            callback(this.places[0]);
          }
        })
        .catch(error => {
          this.loading = false;
          this.$emit('error', error);
        });
    },
    onInput() {
      this.$emit('input', this.place);
    },
    fixHighlight(highlight) {
      const highlightCopy = Object.assign({}, highlight);
      const replace = value => (value || '').replace(/<em>/g, '<b>').replace(/<\/em>/g, '</b>');

      Object.entries(highlightCopy).forEach(([key, value]) => {
        highlightCopy[key] = replace(value);
      });

      return `${highlightCopy.name}, <small>${highlightCopy.city}, ${highlightCopy.administrative}, ${
        highlightCopy.country
      }</small>`;
    },
  },
};
</script>
