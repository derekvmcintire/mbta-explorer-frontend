<script lang="ts">
  import * as L from "leaflet";
  import { derived } from "svelte/store";
  import { vehicleStateMap } from "../stores/live_track_store";
  import { onMount } from "svelte";
  import { get } from "svelte/store";
  import { mapStore } from "../stores/map_store";

  // Debounce helper function
  function debounce<T extends (...args: any[]) => void>(
    fn: T,
    delay: number
  ): T {
    let timeout: ReturnType<typeof setTimeout>;
    return ((...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn(...args), delay);
    }) as T;
  }

  // Derived store for average speed calculation
  const averageSpeed = derived(vehicleStateMap, ($vehicleStateMap, set) => {
    const calculateAverageSpeed = () => {
      const speeds = Object.values($vehicleStateMap)
        .map((vehicle) => vehicle.data.speed)
        .filter(
          (speed): speed is number => speed !== null && speed !== undefined
        ); // Type guard for number

      const totalSpeed = speeds.reduce((sum, speed) => sum + speed, 0);
      const count = speeds.length;

      set(count > 0 ? totalSpeed / count : 0);
    };

    // Debounce the calculation
    const debouncedCalculate = debounce(calculateAverageSpeed, 300);
    debouncedCalculate();

    // Run the calculation whenever the store changes
    return () => calculateAverageSpeed();
  });

  // Reactive variable to display the speed
  let displaySpeed: number = 0;

  // Subscribe to the derived store to update the reactive variable
  averageSpeed.subscribe((value) => {
    displaySpeed = value as number; // Explicitly cast `value` to `number` to avoid type error
  });

  let speedDisplayContainer: HTMLDivElement;

  onMount(() => {
    console.log("mounting SpeedDispaly");
    const map = get(mapStore); // Get the Leaflet map from the store
    if (!map) {
      console.error("Map is not initialized.");
      return;
    }

    // Create a custom Leaflet control
    const speedControl = new L.Control({ position: "bottomright" }); // Use the L.Control constructor
    speedControl.onAdd = function () {
      return speedDisplayContainer; // Return the container for the control
    };
    speedControl.addTo(map); // Add the control to the map
  });
</script>

<div bind:this={speedDisplayContainer} id="speed-display">
  <h2>Average Reported Vehicle Speed</h2>
  <h3>{displaySpeed?.toFixed(2) || "N/A"} mph</h3>
</div>

<style>
  #speed-display {
    background: white;
    color: black;
    padding: 10px;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
    font-size: 14px;
  }
</style>
