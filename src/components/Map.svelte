<script>
  import { onMount } from "svelte";
  import * as L from "leaflet";
  import { fetchMapData, updateLiveData } from "../explorer-api/fetch_map";

  /**
   * @type {any}
   */
  let map;

  const osmTile = {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: "© OpenStreetMap contributors",
  };
  // const cartocdnTile = {
  //   url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
  //   attribution: `&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CartoDB</a>`
  // }

  const tile = osmTile;
  onMount(async () => {
    // Initialize Map
    console.log("Initializing Leaflet map...");
    map = L.map("map").setView([42.3601, -71.0589], 13); // Boston
    L.tileLayer(tile.url, {
      attribution: tile.attribution,
    }).addTo(map);
    console.log("Map initialized");

    updateLiveData(map);

    fetchMapData(map);

    const panes = map.getPanes();
    console.log("panes are: ", panes);

    // function triggerLiveUpdates() {
    //   updateLiveData(map); // Call the function immediately
    //   setTimeout(() => {
    //     triggerLiveUpdates(); // Schedule the next call
    //   }, 15000); // 15 seconds
    // }

    // triggerLiveUpdates();
  });
</script>

<div id="map"></div>

<style>
  #map {
    height: 100vh;
    width: 100%;
  }
</style>
