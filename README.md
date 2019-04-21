# Vuetify Algolia Places

> Use [Algolia Places](https://community.algolia.com/places/) with Vuetify.

[![Travis](https://img.shields.io/travis/Kocal/vuetify-algolia-places.svg?style=flat-square)](https://travis-ci.org/Kocal/vuetify-algolia-places)
[![VueJS 2.x](https://img.shields.io/badge/vue-2.x-brightgreen.svg?style=flat-square)](https://vuejs.org)
[![npm](https://img.shields.io/npm/v/vuetify-algolia-places.svg?style=flat-square)](https://www.npmjs.com/package/vuetify-algolia-places)
![license](https://img.shields.io/github/license/mashape/apistatus.svg?style=flat-square)

## Demo

A demo is available [here](https://vuetify-algolia-places.netlify.com).

## Installation

Run in your terminal:

```bash
yarn add vuetify-algolia-places
```

You also need to install [algoliasearch](https://github.com/algolia/algoliasearch-client-javascript) and [places.js](https://github.com/algolia/places):

```bash
yarn add 'algoliasearch@^3' 'places.js@^1'
```

Then install the plugin:

```js
import Vue from 'vue';
import VuetifyAlgoliaPlaces from 'vuetify-algolia-places';

Vue.use(VuetifyAlgoliaPlaces, {
  algolia: {
    appId: '...', // Optional
    apiKey: '...', // Optional
  },
});
```

## Usage

Vuetify Algolia Places is still under development, so for now there is no way to specify props nor events.

```vue
<vuetify-algolia-places v-model="place" />
```

The variable `place` looks like this:

```json
{
  "name": "30 Rue du Sergent Michel Berthet",
  "administrative": "Auvergne-Rhône-Alpes",
  "city": "Lyon 9e Arrondissement",
  "country": "France",
  "countryCode": "fr",
  "type": "address",
  "latlng": {
    "lat": 45.7704,
    "lng": 4.80536
  },
  "postcode": "69009",
  "highlight": {
    "name": "<em>30</em> <em>Rue</em> <em>du</em> <em>Sergent</em> <em>Michel</em> <em>Be</em>rthet",
    "city": "Lyon 9e Arrondissement",
    "administrative": "Auvergne-Rhône-Alpes",
    "country": "France"
  },
  "hitIndex": 0,
  "query": "30 rue du sergent michel berthet",
  "value": "30 Rue du Sergent Michel Berthet, Lyon 9e Arrondissement, Auvergne-Rhône-Alpes, France"
}
```

##### Note about initial value

If you don't store this kind of object in your application, you can still pass a plain string that is equivalent to the value `value`, e.g.: `30 Rue du Sergent Michel Berthet, Lyon`.

If this value is not `null` during the initialization of the component, it will automatically request Algolia API and use the first hit.

That means if `place` is equal to `30 Rue du Sergent Michel Berthet, Lyon`, it will be automatically transformed to the above JSON object.

### Props

| Name                | Type              | Algolia Places documentation                                                                                              |
| ------------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `type`              |  `String`         | Check [`type` option](https://community.algolia.com/places/documentation.html#api-options-type)                           |
| `language`          | `String`          | Check [`language` option](https://community.algolia.com/places/documentation.html#api-options-language)                   |
| `countries`         | `String[]`        | Check [`countries` option](https://community.algolia.com/places/documentation.html#api-options-countries)                 |
| `aroundLatLng`      | `String`          | Check [`aroundLatLng` option](https://community.algolia.com/places/documentation.html#api-options-aroundLatLng)           |
| `aroundLatLngViaIp` | `Boolean`         | Check [`aroundLatLngViaIP` option](https://community.algolia.com/places/documentation.html#api-options-aroundLatLngViaIP) |
| `aroundRadius`      | `Number`          | Check [`aroundRadius` option](https://community.algolia.com/places/documentation.html#api-options-aroundRadius)           |
| `debounce`          | `Number\|Boolean` |  Pass `true` to debounce for 250ms, or pass a custom delay. Default: `false`                                              |

Every props from [Vuetify Autocomplete component](https://vuetifyjs.com/en/components/autocompletes#api) are supported, except `items`, `loading`, `search-input.sync`, `filter` and `return-object` that are used internally.

### Events

| Name    | Description                                                                     | Arguments                                 |
| ------- | ------------------------------------------------------------------------------- | ----------------------------------------- |
| `input` | Emitted when the user select a place                                            | `@input="onInput"`, `onInput(place) { }`  |
| `error` | Emitted when there is an error with Algolia API                                 |  `@error="onError"`, `onError(error) { }` |
| `clear` |  Emitted when the user click on the _clear button_ (used with prop `clearable`) | `@clear="onClear"`, `onClear() { }`       |
