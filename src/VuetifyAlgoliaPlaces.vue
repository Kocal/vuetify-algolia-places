<template>
  <v-select
    v-model="place"
    :items="places"
    :loading="loading"
    :search-input.sync="query"
    :filter="filter"
    :disabled="disabled"
    :required="required"
    :rules="validationRules"
    :label="label"
    autocomplete
    single-line
    return-object
    item-text="value"
    append-icon="location_on"
    @input="onInput"
  />
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
  },
};
</script>
