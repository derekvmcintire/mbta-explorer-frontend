<script>
  import Map from "./components/Map.svelte";
  import SpeedDisplay from "./components/SpeedDisplay.svelte";
</script>

<div id="map-container">
  <Map />
  <SpeedDisplay />
</div>

<style>
  #map-container {
    height: 100vh;
    width: 100%;
  }
</style>
