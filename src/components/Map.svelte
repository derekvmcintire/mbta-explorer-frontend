<script lang="ts">
  import { onMount } from "svelte";
  import * as L from "leaflet";
  import { fetchMapData, updateLiveData } from "../explorer-api/fetch_map";
  import { cartocdnTile } from "../constants";

  let map: L.Map;

  const tile = cartocdnTile;
  onMount(async () => {
    map = L.map("map", { renderer: L.canvas() }).setView(
      [42.3601, -71.0589],
      13
    ); // Boston
    L.tileLayer(tile.url, {
      attribution: tile.attribution,
    }).addTo(map);
    const layerControl = L.control.layers({}).addTo(map);

    fetchMapData(map, layerControl);

    // Start polling
    const POLLING_INTERVAL = 1000; // 5 seconds
    const MAX_POLLING_TIME = 1800000;

    const interval = setInterval(
      () => updateLiveData(map, layerControl),
      POLLING_INTERVAL
    );

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
