<template>
  <v-autocomplete
    :value="value"
    v-bind="$attrs"
    :items="places"
    :loading="loading"
    :search-input.sync="query"
    return-object
    item-text="value"
    :append-icon="appendIcon"
    v-on="$listeners"
    @input="$emit('input', $event)"
    @click:clear="onClear"
    @change="query = ''"
  >
    <template slot="item" slot-scope="data">
      <template v-if="typeof data.item !== 'object'">
        <v-list-item-content>{{ data.item }}</v-list-item-content>
      </template>
      <template v-else>
        <v-list-item-content>
          <slot name="highlight" :highlight="data.item.highlight">
            <v-list-item-title v-html="data.item.highlight" />
          </slot>
        </v-list-item-content>
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
      type: [Object, Array],
      default: () => ({}),
    },
    searchInput: {
      type: String,
      default: '',
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
      type: [Boolean, Number, String],
      default: false,
    },
    // Vuetify props
    appendIcon: {
      type: String,
      default: 'location_on',
    },
    customHighlight: {
      type: Function,
      default: initialHighlight => {
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
  },
  data() {
    return {
      loading: false,
      places: [],
    };
  },
  computed: {
    query: {
      get() {
        return this.searchInput;
      },
      set(value) {
        this.$emit('update:search-input', value);
      },
    },
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
            this.debouncedSearchPlaces = debounce(this.searchPlaces, 250);
          } else if (typeof val === 'number' || typeof val === 'string') {
            this.debouncedSearchPlaces = debounce(this.searchPlaces, Number(val));
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
            this.$emit('input', place);
          });
        }
      },
    },
  },
  created() {
    this.initAlgoliaPlaces();

    if (this.query !== null) {
      this.searchPlaces(place => {
        this.$emit('input', place);
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
          this.places = content.hits
            .map((hit, hitIndex) =>
              formatHit({
                formatInputValue,
                hit,
                hitIndex,
                query: this.query,
                rawAnswer: content,
              })
            )
            // formatHit() reforms Algolia's _highlightResult object into a highlight prop in the root of each item.
            // Making a second pass to apply the highlight function to each array item should have a negligible
            // performance difference, since the highlight function was originally being called in a v-for in the template
            .map(p => ({ ...p, highlight: this.customHighlight(p.highlight) }));

          if (typeof this.places[0] === 'object') {
            callback(this.places[0]);
          }
        })
        .catch(error => {
          this.$emit('error', error);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    debouncedSearchPlaces(callback = () => {}) {
      return this.searchPlaces(callback);
    },
    onClear() {
      this.$emit('input', null);
      this.$emit('clear');
    },
  },
};
</script>
