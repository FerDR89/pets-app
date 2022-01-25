import mapboxgl from "mapbox-gl";
import * as MapboxClient from "mapbox";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoiZmVyZHI4OWRldiIsImEiOiJja3l1ZXZqOXgxbmY5MnVsdWpqbmVrZXNiIn0.suMetmzHmx4QIFU4i5-xXg";

const mapboxClient = new MapboxClient(MAPBOX_TOKEN);
function initMap(mapEl) {
  mapboxgl.accessToken = MAPBOX_TOKEN;
  return new mapboxgl.Map({
    container: mapEl, // container ID
    center: [-122.420679, 37.772537], // starting position [lng, lat]
    zoom: 13, // starting zoom
    style: "mapbox://styles/mapbox/streets-v11",
  });
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
