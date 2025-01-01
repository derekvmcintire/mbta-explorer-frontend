import { simpleFetch } from "simple-fetch-ts";
import { SUBWAY_ROUTES } from "../constants";
import { plotLiveData } from "../utils/map_live_data";

/**
 * Generates the URL for fetching live vehicle data for a specific route.
 * @param routeId - The ID of the subway route.
 * @returns A string URL for fetching live vehicle data.
 */
const getFetchLiveMBTASubwayDataURL = (routeId: string): string => 
  `http://localhost:8080/api/live?route_id=${routeId}`;

/**
 * Fetches and updates live vehicle data on the map for all subway routes.
 * 
 * @param layerControl - Leaflet control for managing layers on the map.
 * @returns A promise that resolves when live data updates are complete.
 */
export const updateLiveData = async (): Promise<void> => {
  try {
    // Create promises for updating live data for each route
    const liveDataPromises = SUBWAY_ROUTES.map(async (routeId: string) => {
      const url = getFetchLiveMBTASubwayDataURL(routeId);
      const liveVehicleCoordinates = await simpleFetch<any[]>(url);

      if (liveVehicleCoordinates && liveVehicleCoordinates.length > 0) {
        await plotLiveData(liveVehicleCoordinates, routeId);
      }
    });

    // Wait for all live data updates to complete
    await Promise.all(liveDataPromises);
  } catch (error) {
    console.error("Error updating live data:", error);
  }
};