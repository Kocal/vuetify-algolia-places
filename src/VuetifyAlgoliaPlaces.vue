<template>
  <v-select
    v-model="place"
    :items="places"
    :loading="loading"
    :search-input.sync="query"
    :disabled="disabled"
    :required="required"
    :rules="validationRules"
    autocomplete
    hide-details
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
  },
  data() {
    return {
      loading: false,
      query: '',
      place: null,
      places: [],
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
      this.placesClient = algoliasearch.initPlaces();
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
          console.log(error);
        });
    },
    onInput() {
      this.$emit('change', this.place);
    },
  },
};
</script>
