import { simpleFetch } from "simple-fetch-ts";
import { plotLiveData, plotMultipleRoutes } from "../map_helpers";
import { SUBWAY_ROUTES } from "../constants";
import type { Map as LeafletMap, Control } from 'leaflet';

const fetchMBTASubwayURL = `http://localhost:8080/api/routes?route_ids=${SUBWAY_ROUTES.join(",")}`;
const getFetchLiveMBTASubwayDataURL = (routeId: string) => `http://localhost:8080/api/live?route_id=${routeId}`;

export const updateLiveData = async (
  map: LeafletMap,
  layerControl: Control.Layers
): Promise<void> => {
  const liveDataPromises = SUBWAY_ROUTES.map(async (routeId: string) => {
    const url = getFetchLiveMBTASubwayDataURL(routeId);
    const liveVehicleCoordinates = await simpleFetch<any[]>(url);

    if (liveVehicleCoordinates && liveVehicleCoordinates.length > 0) {
      plotLiveData(map, layerControl, liveVehicleCoordinates, routeId);
    }
  });

  // Await all live data fetches
  await Promise.all(liveDataPromises);
};



// Function to fetch and plot subway route data
export const fetchMapData = async (map: any, layerControl: any) => {
  // Fetch Subway route data
  const subwayRouteData = await simpleFetch<any[]>(fetchMBTASubwayURL) || [];

  if (subwayRouteData === null) {
    console.log("No data found, handling gracefully.");
    return;
  }

  // Plot Subway routes once data is fetched
  if (subwayRouteData.length > 0) {
    plotMultipleRoutes(map, layerControl, subwayRouteData);
  }

  // @TODO sort fetching live data on page load
  // Now fetch and plot live vehicle data after the routes have been plotted
  await updateLiveData(map, layerControl);  // This ensures live data is plotted after routes
};
