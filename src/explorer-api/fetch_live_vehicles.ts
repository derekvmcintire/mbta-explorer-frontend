import { simpleFetch } from "simple-fetch-ts";
import { mapStore } from "../stores/map_store";
import { get } from "svelte/store";
import { handleResetEvent } from "./stream_handlers";

/**
 * Generates the URL for fetching live vehicle data for a specific route.
 * @param routeId - The ID of the subway route.
 * @returns A string URL for fetching live vehicle data.
 */
const fetchLiveMBTASubwayDataURL = `http://localhost:8080/api/live?route_id=Red,Orange,Blue,Green-B,Green-C,Green-D,Green-E,Mattapan`;

/**
 * Fetches and updates live vehicle data on the map for all subway routes.
 *
 * @param layerControl - Leaflet control for managing layers on the map.
 * @returns A promise that resolves when live data updates are complete.
 */
export const updateLiveData = async (): Promise<void> => {
  try {
    const url = fetchLiveMBTASubwayDataURL;
    const liveVehicleCoordinates = await simpleFetch<any[]>(url);

    if (liveVehicleCoordinates && liveVehicleCoordinates.length > 0) {
      // await plotLiveData(liveVehicleCoordinates, routeId);
      const map = get(mapStore);
      if (!map) return;
      handleResetEvent(liveVehicleCoordinates, map);
    }
  } catch (error) {
    console.error("Error updating live data:", error);
  }
};
