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
export const addRouteShape = (
  coordinates: L.LatLngExpression[],
): L.Polyline => {
  return L.polyline(coordinates, { color: "#bababa" });
};

type AddSubwayStopOptions = {
  location: L.LatLngLiteral;
  color: string;
  name: string;
  municipality: string;
  address: string;
};

/**
 * Adds a subway stop as a circle marker to the map with a popup containing detailed information.
 *
 * @param {AddSubwayStopOptions} options - Options for the subway stop.
 * @param {L.LatLngLiteral} options.location - The latitude and longitude of the subway stop.
 * @param {string} options.color - The color of the circle marker representing the subway stop.
 * @param {string} options.name - The name of the subway stop.
 * @param {string} options.municipality - The municipality where the subway stop is located.
 * @param {string} options.address - The address of the subway stop.
 * @returns {L.Circle} A Leaflet Circle instance representing the subway stop.
 */
export const addSubwayStop = ({
  location,
  color,
  name,
  municipality,
  address,
}: AddSubwayStopOptions): L.Circle => {
  const circle = L.circle([location.lat, location.lng], {
    color,
    fillOpacity: 0,
    radius: 70,
  });

  const popupContent = `
  <strong>${name}</strong><br>
  Municipality: ${municipality}<br>
  Address: ${address}
`;

  circle.bindPopup(popupContent);

  return circle;
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
