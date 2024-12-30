<script lang="ts">
  import { onMount } from "svelte";
  import * as L from "leaflet";
  import { fetchMapData, updateLiveData } from "../explorer-api/fetch_map";
  import { cartocdnTile } from "../constants";
  import { mapLayerControl, mapStore } from "../stores/map_store";

  const tile = cartocdnTile;

  onMount(async () => {
    const map = L.map("map", {
      center: [42.3601, -71.0589], // Boston coordinates
      zoom: 13,
    });
    L.tileLayer(tile.url, {
      attribution: tile.attribution,
    }).addTo(map);

    const layerControl = L.control.layers({}).addTo(map);

    mapLayerControl.set(layerControl);
    mapStore.set(map);

    fetchMapData();

    // Start polling
    const POLLING_INTERVAL = 15000; // 15 seconds
    const MAX_POLLING_TIME = 1800000;

    const interval = setInterval(() => updateLiveData(), POLLING_INTERVAL);

    setTimeout(() => {
      clearInterval(interval);
    }, MAX_POLLING_TIME);
  });
</script>

<div id="map"></div>

<style>
  #map {
    height: 100vh;
    width: 100%;
  }
</style>
