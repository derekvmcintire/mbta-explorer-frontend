<script lang="ts">
  import { onMount } from "svelte";
  import * as L from "leaflet";
  import { fetchMapData } from "../explorer-api/fetch_map";
  import { cartocdnTile } from "../constants";
  import { mapLayerControl, mapStore } from "../stores/map_store";
  import { updateLiveData } from "../explorer-api/fetch_live_vehicles";

  const tile = cartocdnTile;

  /**
   * Sets up the Leaflet map on component mount, including adding the base tile layer,
   * initializing the layer control, and setting up the map instance in the store.
   * It also starts polling for live vehicle data every 15 seconds, for a maximum of 30 minutes.
   */
  onMount(async () => {
    // Initialize the map with Boston coordinates and zoom level
    const map = L.map("map", {
      center: [42.3601, -71.0589], // Boston coordinates
      zoom: 13,
    });

    // Add a tile layer from the CartoCDN service
    L.tileLayer(tile.url, {
      attribution: tile.attribution,
    }).addTo(map);

    // Create and add a layer control to the map
    const layerControl = L.control.layers({}).addTo(map);

    // Set the layer control and map instance in the store for later use
    mapLayerControl.set(layerControl);
    mapStore.set(map);

    // Fetch initial map data (e.g., routes, stops) to display on the map
    fetchMapData();

    // Poll for live vehicle data at a regular interval (every 15 seconds)
    const POLLING_INTERVAL = 15000; // 15 seconds
    const MAX_POLLING_TIME = 1800000; // Stop polling after 30 minutes

    // Set up the polling interval
    const interval = setInterval(() => updateLiveData(), POLLING_INTERVAL);

    // Stop polling after the maximum time limit
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
