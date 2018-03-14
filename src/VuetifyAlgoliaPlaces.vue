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
  },
  methods: {
    initAlgoliaPlaces() {
      /* eslint-disable-next-line no-underscore-dangle */
      const { algolia: algoliaOptions } = this.__vuetifyAlgoliaPlaces.options;

      this.placesClient = algoliasearch.initPlaces(algoliaOptions.appId, algoliaOptions.apiKey);
    },
    searchPlaces() {
      const { query } = this;

      this.loading = true;
      this.placesClient
        .search({
          query,
          language: navigator.language.split('-')[0],
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
        })
        .catch(error => {
          this.loading = false;
          reject(error);
        });
    },
    onInput() {
      this.$emit('input', this.place);
    },
  },
};
</script>
