import { addRouteShape, addRoutesToMap, addSubwayStop } from "./map_layer";
import { getRouteColor } from "../constants";
import type { Route, RouteMap, Stop } from "../types/map_types";

/**
 * Plots a single route, including its shape and stops, on the map.
 *
 * @param route - The route object containing the route id, coordinates, and stop data.
 * @returns An object containing the route shape (as a polyline) and stop markers (as circle markers).
 */
const plotSingleRoute = (route: Route) => {
  const color = getRouteColor(route.id) || "";
  const coordinates =
    route.id === "Green-E" ? route.coordinates.slice(0, 2) : route.coordinates;

  // Create the route shape (polyline) based on the coordinates and color
  const shape = addRouteShape(coordinates);

  // Create the stop markers based on each stop's latitude and longitude
  const stops = route.stops.map((stop: Stop) => {
    const { attributes } = stop;
    const { latitude, longitude, name, municipality, address } = attributes;
    const location = { lat: latitude, lng: longitude };

    return addSubwayStop({ location, color, name, municipality, address });
  });

  return { shape, stops };
};

/**
 * Plots multiple routes and adds them to the map with their respective shapes and stop markers.
 *
 * @param routes - An array of route objects, each containing the route's id, coordinates, and stops.
 * @returns A void function that updates the map by adding the plotted routes.
 */
export const plotMultipleRoutes = (routes: Route[]): void => {
  const routeMap: RouteMap = {};

  // Iterate over each route and generate its shape and stop markers
  routes.forEach((route) => {
    routeMap[route.id] = plotSingleRoute(route);
  });

  // Add the route data to the map using the layer control
  addRoutesToMap(routeMap);
};
