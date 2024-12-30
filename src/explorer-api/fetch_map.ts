import { simpleFetch } from "simple-fetch-ts";
import { SUBWAY_ROUTES } from "../constants";
import { plotLiveData, plotMultipleRoutes } from "../map_helpers";

const fetchMBTASubwayURL = `http://localhost:8080/api/routes?route_ids=${SUBWAY_ROUTES.join(",")}`;
const getFetchLiveMBTASubwayDataURL = (routeId: string) => `http://localhost:8080/api/live?route_id=${routeId}`;


export const updateLiveData = async (map: any) => {
  SUBWAY_ROUTES.forEach(async (routeId: string) => {
    const liveVehicleCoordinates = await simpleFetch<any[]>(getFetchLiveMBTASubwayDataURL(routeId)) || [];
    plotLiveData(map, liveVehicleCoordinates, routeId)
   })
}

export const fetchMapData = async (map: any) => {
   // Fetch Subway data
   const subwayRouteData = (await simpleFetch<any[]>(fetchMBTASubwayURL)) || [];
  
   if (subwayRouteData === null) {
     console.log("No data found, handling gracefully.");
   } else {
     // Plot Subway data
     if (subwayRouteData.length > 0) {
       plotMultipleRoutes(map, subwayRouteData);
     }
   }
}