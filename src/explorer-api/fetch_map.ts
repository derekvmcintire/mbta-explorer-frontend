import { simpleFetch } from "simple-fetch-ts";
import { plotLiveData, plotMultipleRoutes } from "../map_helpers";
import { SUBWAY_ROUTES } from "../constants";

const fetchMBTASubwayURL = `http://localhost:8080/api/routes?route_ids=${SUBWAY_ROUTES.join(",")}`;
const getFetchLiveMBTASubwayDataURL = (routeId: string) => `http://localhost:8080/api/live?route_id=${routeId}`;

// Function to fetch and plot live data
export const updateLiveData = async (map: any, layerControl: any) => {
  const liveDataPromises = SUBWAY_ROUTES.map(async (routeId: string) => {
    const liveVehicleCoordinates = await simpleFetch<any[]>(getFetchLiveMBTASubwayDataURL(routeId)) || [];
    if (liveVehicleCoordinates.length > 0) {
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

  // Now fetch and plot live vehicle data after the routes have been plotted
  await updateLiveData(map, layerControl);  // This ensures live data is plotted after routes
};
