<script>
  import { onMount } from 'svelte';
  import L from 'leaflet';

  let map;

  onMount(() => {
    map = L.map('map').setView([42.3601, -71.0589], 13); // Center on Boston
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);
  });
</script>

<style>
  #map {
    height: 100vh;
    width: 100%;
  }
</style>

<div id="map"></div>
