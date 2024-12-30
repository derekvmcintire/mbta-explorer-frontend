import { simpleFetch } from "simple-fetch-ts";
import { plotMultipleRoutes } from "../utils/map_helpers";
import { SUBWAY_ROUTES } from "../constants";
import { updateLiveData } from "./fetch_live_vehicles";

/**
 * Base URL for fetching MBTA subway routes.
 */
const fetchMBTASubwayURL = `http://localhost:8080/api/routes?route_ids=${SUBWAY_ROUTES.join(",")}`;

/**
 * Fetches subway route data and plots it on the map.
 * After plotting route data, it fetches and plots live vehicle data for each route.
 * 
 * @param layerControl - Leaflet control for managing layers on the map.
 * @returns A promise that resolves when the entire data-fetching and plotting process is complete.
 */
export const fetchMapData = async (): Promise<void> => {
  try {
    // Fetch subway route data
    const subwayRouteData = await simpleFetch<any[]>(fetchMBTASubwayURL) || [];

    if (subwayRouteData.length === 0) {
      console.log("No subway route data found.");
      return;
    }

    // Plot subway routes on the map
    plotMultipleRoutes(subwayRouteData);

    // Fetch and plot live vehicle data
    await updateLiveData();
  } catch (error) {
    console.error("Error fetching and plotting map data:", error);
  }
};
