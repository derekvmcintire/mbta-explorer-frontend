<script>
  import { onMount } from "svelte";
  import * as L from "leaflet";
  import { simpleFetch } from "simple-fetch-ts";
  import { plotMultipleRoutes } from "../map_helpers";
  import { SUBWAY_ROUTES } from "../constants";

  /**
   * @type {any}
   */
  let map;

  const fetchMBTASubwayURL = `http://localhost:8080/api/routes?route_ids=${SUBWAY_ROUTES.join(",")}`;

  onMount(async () => {
    // Initialize Map
    console.log("Initializing Leaflet map...");
    map = L.map("map").setView([42.3601, -71.0589], 13); // Boston
    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CartoDB</a>',
    }).addTo(map);
    console.log("Map initialized");

    // Fetch Subway data
    const subwayLines = (await simpleFetch(fetchMBTASubwayURL)) || [];
    if (subwayLines === null) {
      console.log("No data found, handling gracefully.");
    } else {
      console.log("Received subwayLines:", subwayLines);
      // Plot Subway data
      if (subwayLines.length > 0) {
        plotMultipleRoutes(map, subwayLines);
      }
    }
  });
</script>

<div id="map"></div>

<style>
  #map {
    height: 100vh;
    width: 100%;
  }
</style>
