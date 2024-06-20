<script lang="ts">
  import { onMount } from "svelte";
  import mapboxgl, { type Map } from "mapbox-gl";
  import { format } from "timeago.js";
  export let latitude: number;
  export let longitude: number;
  export let interactive: boolean;
  export let markers: any[] = [];

  let mapElement: HTMLElement;
  let map: Map;
  let accessToken = import.meta.env.VITE_MAPBOX_API_ACCESS_TOKEN;
  let mapStyle = "mapbox://styles/mapbox/light-v9";
  let viewState = {
    longitude: longitude ?? 33.7641472,
    latitude: latitude ?? -13.9558912,
    zoom: 8,
    pitch: 0,
    bearing: 0,
  };

  onMount(() => {
    createMap();
  });

  function createMap() {
    map = new mapboxgl.Map({
      accessToken: accessToken,
      container: mapElement,
      interactive: interactive,
      style: mapStyle,
      center: [viewState.longitude, viewState.latitude],
      zoom: viewState.zoom,
      pitch: viewState.pitch,
      bearing: viewState.bearing,
    });

    markers.forEach((marker) => {
      new mapboxgl.Marker()
        .setLngLat([marker.longitude, marker.latitude])
        .setPopup(new mapboxgl.Popup().setText(marker.name))
        .addTo(map);
    });
  }
</script>

<div
  id="map"
  bind:this={mapElement}
  class="rounded-lg h-full w-full object-cover overflow-auto"
></div>

<style>
  #map {
    background: #e5e9ec;
  }
</style>
