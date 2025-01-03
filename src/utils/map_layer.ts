import * as L from "leaflet";
import { mapLayerControl, mapStore, type MapStore } from "../stores/map_store";
import { get } from "svelte/store";
import type { RouteMap } from "../types/map_types";

/**
 * Creates a polyline representing the shape of a route on the map.
 * 
 * @param coordinates - An array of latitude and longitude pairs defining the route's shape.
 * @param color - The color of the polyline.
 * @returns A Leaflet Polyline instance representing the route's shape.
 */
export const createRouteShape = (coordinates: [number, number][], color: string): L.Polyline => {
  return L.polyline(coordinates, { color: "#bababa" });
};

/**
 * Creates a circle marker representing a stop on the route.
 * 
 * @param latitude - The latitude of the stop.
 * @param longitude - The longitude of the stop.
 * @param color - The color of the circle's border.
 * @returns A Leaflet CircleMarker instance representing the stop.
 */
export const createStopMarker = (latitude: number, longitude: number, color: string): L.Circle => {
  return L.circle([latitude, longitude], {
    color,
    fillOpacity: 1,
    radius: 50,
  });
};

/**
 * Adds a collection of routes to the map, including their shape and stop markers.
 * Each route is represented by a `routeLayerGroup` containing its shape and stop markers.
 * The group is added to the map and included in the layer control for visibility management.
 * 
 * @param routeMap - An object mapping route ids to their respective shapes and stop markers.
 * Each entry contains the shape (a polyline) and an array of stop markers (circle markers).
 * @throws Throws an error if the map is undefined.
 */
export const addRoutesToMap = (routeMap: RouteMap) => {
  const map: MapStore = get(mapStore);
  const layerControl = get(mapLayerControl);

  if (!map) {
    throw new Error("Map is undefined");
  }

  // Iterate over the route map and add each route's shape and stops to the map
  Object.entries(routeMap).forEach(([routeId, { shape, stops }]) => {
    const routeLayerGroup = L.layerGroup([shape, ...stops]);
    routeLayerGroup.addTo(map);

    // Add the route layer group to the layer control for toggling visibility
    layerControl && layerControl.addOverlay(routeLayerGroup, `${routeId} Line`);
  });
};
