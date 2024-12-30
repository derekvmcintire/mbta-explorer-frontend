<script>
  import { onMount } from "svelte";
  import * as L from "leaflet";
  import { fetchMapData } from "../explorer-api/fetch_map";
  import { cartocdnTile } from "../constants";

  /**
   * @type {any}
   */
  let map;

  const tile = cartocdnTile;
  onMount(async () => {
    // Initialize Map
    console.log("Initializing Leaflet map...");
    map = L.map("map", { renderer: L.canvas() }).setView(
      [42.3601, -71.0589],
      13
    ); // Boston
    L.tileLayer(tile.url, {
      attribution: tile.attribution,
    }).addTo(map);
    const layerControl = L.control.layers({}).addTo(map);
    console.log("Map initialized");

    fetchMapData(map, layerControl);
  });
</script>

<div id="map"></div>

<style>
  #map {
    height: 100vh;
    width: 100%;
  }
</style>
