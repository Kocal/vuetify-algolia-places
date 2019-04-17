<template>
  <v-autocomplete
    v-model="place"
    v-bind="$attrs"
    v-on="$listeners"
    :items="places"
    :loading="loading"
    :search-input.sync="query"
    :filter="filter"
    return-object
    item-text="value"
    :append-icon="appendIcon"
    @input="onInput"
    @click:clear="onClear"
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
import debounce from 'debounce';

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
    type: {
      type: String,
      default: null,
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
    aroundLatLng: {
      type: String,
      default: null,
    },
    aroundLatLngViaIp: {
      type: Boolean,
      default: true,
    },
    aroundRadius: {
      type: [Number, String],
      default: null,
    },
    debounce: {
      type: [Boolean, Number],
      default: 0,
    },
    // Vuetify props
    appendIcon: {
      type: String,
      default: 'location_on',
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
        return true; // display all items, Algolia Places is already doing the work
      },
    };
  },
  computed: {
    searchOptions() {
      const searchOptions = { query: this.query };

      if (this.type !== null) {
        searchOptions.type = this.type;
      }

      const language = this.language.toLowerCase();
      if (language) {
        searchOptions.language = language;
      }

      const countries = this.countries.map(country => country.toLowerCase());
      if (countries.length > 0) {
        searchOptions.countries = countries;
      }

      if (this.aroundLatLng) {
        searchOptions.aroundLatLng = this.aroundLatLng;
      }

      searchOptions.aroundLatLngViaIP = this.aroundLatLngViaIp;

      if (this.aroundRadius) {
        searchOptions.aroundRadius = parseFloat(this.aroundRadius);
      }

      return searchOptions;
    },
  },
  watch: {
    query(val) {
      if (val) {
        this.debouncedSearchPlaces();
      }
    },
    debounce: {
      immediate: true,
      handler(val) {
        if (val) {
          if (typeof val === 'boolean') {
            this.debouncedSearchPlaces = debounce(this.searchPlaces, 300);
          } else if (typeof val === 'number') {
            this.debouncedSearchPlaces = debounce(this.searchPlaces, val);
          }
        } else {
          this.debouncedSearchPlaces = this.searchPlaces;
        }
      },
    },
    searchOptions: {
      deep: true,
      handler(newVal, oldVal) {
        if (newVal.query !== null && newVal.query === oldVal.query) {
          this.debouncedSearchPlaces(place => {
            this.place = place;
            this.onInput();
          });
        }
      },
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
      this.loading = true;
      this.placesClient
        .search(this.searchOptions)
        .then(content => {
          this.loading = false;
          this.places = content.hits.map((hit, hitIndex) =>
            formatHit({
              formatInputValue,
              hit,
              hitIndex,
              query: this.query,
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
    debouncedSearchPlaces(callback = () => {}) {
      return this.searchPlaces(callback);
    },
    onInput() {
      this.$emit('input', this.place);
    },
    onClear() {
      this.$emit('input', null);
      this.$emit('clear');
    },
    fixHighlight(initialHighlight) {
      const highlight = Object.assign({}, initialHighlight); // eslint-disable-line
      const replace = value => (value || '').replace(/<em>/g, '<b>').replace(/<\/em>/g, '</b>');

      Object.entries(highlight).forEach(([key, value]) => {
        highlight[key] = replace(value);
      });

      let ret = highlight.name;
      if (highlight.city) {
        ret += `, <small>${highlight.city}</small>`;
      }
      if (highlight.administrative) {
        ret += `<small>, ${highlight.administrative}</small>`;
      }
      if (highlight.country) {
        ret += `<small>, ${highlight.country}</small>`;
      }

      return ret;
    },
  },
};
</script>
