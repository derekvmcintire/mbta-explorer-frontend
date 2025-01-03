import { simpleFetch } from "simple-fetch-ts";
import { plotMultipleRoutes } from "../utils/map_helpers";
import { SUBWAY_ROUTES } from "../constants";
import { startStreaming } from "./stream";
import { fetchInitialVehicleData } from "./fetch_live_vehicles";
import type { Route } from "../types/map_types";

/**
 * Base URL for fetching MBTA subway routes.
 */
const fetchMBTASubwayURL = `http://localhost:8080/api/routes?route_ids=${SUBWAY_ROUTES.join(",")}`;

/**
 * Fetches subway route data and plots it on the map.
 * After plotting route data, it fetches and plots live vehicle data for each route.
 *
 * @returns A promise that resolves when the entire data-fetching and plotting process is complete.
 */
export const fetchMapData = async (): Promise<void> => {
  try {
    // Fetch subway route data
    const subwayRouteData =
      (await simpleFetch<Route[]>(fetchMBTASubwayURL)) || [];

    if (subwayRouteData.length === 0) {
      console.log("No subway route data found.");
      return;
    }

    // Plot subway routes on the map
    plotMultipleRoutes(subwayRouteData);
    // fetch initial live data
    fetchInitialVehicleData();
    // stream for live updates
    startStreaming();
  } catch (error) {
    console.error("Error fetching and plotting map data:", error);
  }
};
