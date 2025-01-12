import { simpleFetch } from "simple-fetch-ts";
import { mapStore } from "../stores/map_store";
import { get } from "svelte/store";
import { handleResetEvent } from "./stream_handlers";
import type { Vehicle } from "../stores/live_track_store";

/**
 * URL for fetching live vehicle data for all subway routes.
 * Includes route IDs for Red, Orange, Blue, Green lines (B, C, D, E), and Mattapan.
 */
const fetchLiveMBTASubwayDataURL = `http://localhost:8080/api/vehicles?route_ids=Red,Orange,Blue,Green-B,Green-C,Green-D,Green-E,Mattapan`;

/**
 * Fetches and updates live vehicle data on the map for all subway routes.
 *
 * This function retrieves real-time vehicle data for specified routes,
 * validates that data is available, and triggers a reset event to update the map
 * layers and markers accordingly. If no map instance exists or if the fetch fails,
 * appropriate error handling ensures stability.
 *
 * @returns {Promise<void>} A promise that resolves when live data updates are complete.
 */
export const fetchInitialVehicleData = async (): Promise<void> => {
  try {
    const url = fetchLiveMBTASubwayDataURL;

    // Fetch live vehicle data from the specified URL.
    const liveVehicleCoordinates = await simpleFetch<Vehicle[]>(url);

    if (liveVehicleCoordinates && liveVehicleCoordinates.length > 0) {
      const map = get(mapStore); // Retrieve the current map instance from the store.

      if (!map) {
        // Exit early if no map instance is available.
        console.warn("Map instance not found.");
        return;
      }

      // Trigger event to update the map with new live vehicle data.
      handleResetEvent(liveVehicleCoordinates);
    } else {
      // Log a warning if no vehicle data is returned.
      console.warn("No live vehicle data available.");
    }
  } catch (error) {
    // Log errors encountered during the fetch process.
    console.error("Error updating live data:", error);
  }
};
