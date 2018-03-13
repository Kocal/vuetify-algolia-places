<template>
  <v-select
    v-model="place"
    :items="places"
    :loading="loading"
    :search-input.sync="query"
    autocomplete
    hide-details
    return-object
    item-text="value"
    append-icon="location_on"
  />
</template>

<script>
import formatHit from 'places.js/src/formatHit';
import formatInputValue from 'places.js/src/formatInputValue';
import algoliasearch from 'algoliasearch/dist/algoliasearchLite';

export default {
  name: 'VuetifyAlgoliaPlaces',
  props: {},
  data() {
    return {
      loading: false,
      query: '',
      place: null,
      places: [],
    };
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
  },
};
</script>
