import mapboxgl from "mapbox-gl";
import * as MapboxClient from "mapbox";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoiZmVyZHI4OWRldiIsImEiOiJja3l1ZXZqOXgxbmY5MnVsdWpqbmVrZXNiIn0.suMetmzHmx4QIFU4i5-xXg";

const mapboxClient = new MapboxClient(MAPBOX_TOKEN);
function initMap(mapEl, lng?, lat?) {
  mapboxgl.accessToken = MAPBOX_TOKEN;
  if (lng && lat) {
    return new mapboxgl.Map({
      container: mapEl, // container ID
      center: [lng, lat], // starting position [lng, lat]
      zoom: 15, // starting zoom
      style: "mapbox://styles/mapbox/streets-v11",
    });
  } else {
    return new mapboxgl.Map({
      container: mapEl, // container ID
      center: [-58.38162, -34.60376], // starting position [lng, lat]
      zoom: 13, // starting zoom
      style: "mapbox://styles/mapbox/streets-v11",
    });
  }
}

async function initSearchForm(query) {
  return await mapboxClient.geocodeForward(query, {
    country: "ar",
    autocomplete: true,
    language: "es",
  });
}

function setMarket([lng, lat], mapEl) {
  const marker = new mapboxgl.Marker().setLngLat([lng, lat]).addTo(mapEl);
  mapEl.setCenter([lng, lat]);
  mapEl.setZoom(15);
}

export { initMap, initSearchForm, setMarket };
