<script>
  import { onMount } from "svelte";
  import * as L from "leaflet";

  let map;

  onMount(() => {
    console.log("Initializing Leaflet map...");
    map = L.map("map").setView([42.3601, -71.0589], 13); // Boston
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);
    console.log("Map initialized");
  });
</script>

<div id="map"></div>

<style>
  #map {
    height: 100vh;
    width: 100%;
  }
</style>
