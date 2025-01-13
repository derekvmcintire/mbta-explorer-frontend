<script lang="ts">
  import * as L from "leaflet";
  import { derived } from "svelte/store";
  import { vehicleStateMap } from "../stores/live_track_store";
  import { onMount } from "svelte";
  import { get } from "svelte/store";
  import { mapStore } from "../stores/map_store";
  import { HelpCircle } from "lucide-svelte";

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
      // Single reduce operation to calculate sum and count of valid speeds
      const { sum, count } = Object.values($vehicleStateMap).reduce(
        (acc, vehicle) => {
          const speed = vehicle.data.speed;
          // Only include speeds that are valid numbers and greater than 0
          if (typeof speed === "number" && speed > 0) {
            return {
              sum: acc.sum + speed,
              count: acc.count + 1,
            };
          }
          return acc;
        },
        { sum: 0, count: 0 }
      );

      set(count > 0 ? sum / count : 0);
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

  let tooltipVisible = false;
</script>

<div bind:this={speedDisplayContainer} id="speed-display">
  <h2>
    Average Reported Vehicle Speed
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <span
      class="tooltip-icon"
      on:mouseenter={() => (tooltipVisible = true)}
      on:mouseleave={() => (tooltipVisible = false)}
    >
      <HelpCircle size={16} />
      {#if tooltipVisible}
        <span class="custom-tooltip">
          This average only includes actively moving vehicles with reported
          speeds greater than 0 mph. Stopped or unreported vehicles are
          excluded.
        </span>
      {/if}
    </span>
  </h2>
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

  .tooltip-icon {
    display: inline-flex;
    align-items: center;
    margin-left: 4px;
    cursor: help;
    color: #666;
    position: relative; /* For tooltip positioning */
  }

  .tooltip-icon:hover {
    color: #333;
  }

  .custom-tooltip {
    position: absolute;
    right: 0%; /* Position to the left of the icon instead of centered */
    top: -325%; /* Center vertically relative to the icon */
    transform: translateY(-50%); /* Center vertically */
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 8px 12px;
    border-radius: 4px;
    font-size: 12px;
    z-index: 1000;
    margin-right: 8px; /* Space between tooltip and icon */
    width: 220px; /* Fixed width for better text wrapping */
    line-height: 1.4; /* Better line spacing */
  }

  /* Adjust the arrow to point to the right */
  .custom-tooltip::after {
    content: "";
    position: absolute;
    top: 100%; /* Keep at bottom of tooltip */
    left: 95%; /* Center horizontally */
    transform: translateX(-50%); /* Center horizontally */
    border-width: 5px;
    border-style: solid;
    border-color: rgba(0, 0, 0, 0.8) transparent transparent transparent; /* Make arrow point down */
  }
</style>
