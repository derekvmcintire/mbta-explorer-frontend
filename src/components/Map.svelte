<script lang="ts">
  import { onMount } from "svelte";
  import * as L from "leaflet";
  import { fetchMapData } from "../explorer-api/fetch_map";
  import { estriDark } from "../constants";
  import { mapLayerControl, mapStore } from "../stores/map_store";

  const tile = estriDark;

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
  });
</script>

<div id="map"></div>

<style>
  #map {
    height: 100vh;
    width: 100%;
  }
</style>
