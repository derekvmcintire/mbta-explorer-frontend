import { simpleFetch } from "simple-fetch-ts";
import { plotLiveData, plotMultipleRoutes } from "../map_helpers";
import { SUBWAY_ROUTES } from "../constants";
import type { Map as LeafletMap, Control } from 'leaflet';

/**
 * Base URL for fetching MBTA subway routes.
 */
const fetchMBTASubwayURL = `http://localhost:8080/api/routes?route_ids=${SUBWAY_ROUTES.join(",")}`;

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
export const updateLiveData = async (
  layerControl: Control.Layers
): Promise<void> => {
  try {
    // Create promises for updating live data for each route
    const liveDataPromises = SUBWAY_ROUTES.map(async (routeId: string) => {
      const url = getFetchLiveMBTASubwayDataURL(routeId);
      const liveVehicleCoordinates = await simpleFetch<any[]>(url);

      if (liveVehicleCoordinates && liveVehicleCoordinates.length > 0) {
        await plotLiveData(layerControl, liveVehicleCoordinates, routeId);
      }
    });

    // Wait for all live data updates to complete
    await Promise.all(liveDataPromises);
  } catch (error) {
    console.error("Error updating live data:", error);
  }
};

/**
 * Fetches subway route data and plots it on the map.
 * After plotting route data, it fetches and plots live vehicle data for each route.
 * 
 * @param layerControl - Leaflet control for managing layers on the map.
 * @returns A promise that resolves when the entire data-fetching and plotting process is complete.
 */
export const fetchMapData = async (
  layerControl: Control.Layers
): Promise<void> => {
  try {
    // Fetch subway route data
    const subwayRouteData = await simpleFetch<any[]>(fetchMBTASubwayURL) || [];

    if (subwayRouteData.length === 0) {
      console.log("No subway route data found.");
      return;
    }

    // Plot subway routes on the map
    plotMultipleRoutes(layerControl, subwayRouteData);

    // Fetch and plot live vehicle data
    await updateLiveData(layerControl);
  } catch (error) {
    console.error("Error fetching and plotting map data:", error);
  }
};
