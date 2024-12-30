import * as L from "leaflet";
import { getRouteColor } from "../constants";
import { liveData, overlays } from "../stores/boston_subway_store";
import { get } from "svelte/store";
import { mapLayerControl, mapStore, type MapStore } from "../stores/map_store";

// Define types for route and stop structures
interface StopAttributes {
  latitude: number;
  longitude: number;
}

interface Route {
  id: string;
  coordinates: [number, number][]; // Array of lat/lng pairs
  stops: { attributes: StopAttributes }[];
}

interface RouteMap {
  [routeId: string]: {
    shape: L.Polyline;
    stops: L.Circle[];
  };
}

/**
 * Creates a polyline representing a route shape.
 *
 * @param coordinates - Array of latitude and longitude pairs defining the route.
 * @param color - The color of the polyline.
 * @returns A Leaflet Polyline instance.
 */
const createRouteShape = (coordinates: [number, number][], color: string): L.Polyline => {
  return L.polyline(coordinates, { color });
};

/**
 * Creates a circle marker representing a stop on the route.
 *
 * @param latitude - The latitude of the stop.
 * @param longitude - The longitude of the stop.
 * @param color - The border color of the stop marker.
 * @returns A Leaflet CircleMarker instance.
 */
const createStopMarker = (latitude: number, longitude: number, color: string): L.Circle => {
  return L.circle([latitude, longitude], {
    color,
    fillColor: "white",
    fillOpacity: 1,
    radius: 50,
  });
};

/**
 * Plots multiple routes on the map and adds them to the layer control.
 *
 * @param layerControl - A Leaflet layer control to manage the visibility of routes.
 * @param routes - An array of routes, each containing coordinates and stops.
 */
export const plotMultipleRoutes = (
  routes: Route[]
): void => {
  const map: MapStore = get(mapStore);
  const layerControl = get(mapLayerControl)

  if (!map) {
    throw new Error("Map is undefined");
  }

  const routeMap: RouteMap = {};

  routes.forEach((route) => {
    const color = getRouteColor(route.id) || "";
    const coordinates =
      route.id === "Green-E" ? route.coordinates.slice(0, 2) : route.coordinates;

    const shape = createRouteShape(coordinates, color);

    const stops = route.stops.map((stop) => {
      const { attributes } = stop;
      return createStopMarker(attributes.latitude, attributes.longitude, color);
    });

    routeMap[route.id] = { shape, stops };
  });

  Object.entries(routeMap).forEach(([routeId, { shape, stops }]) => {
    const routeLayerGroup = L.layerGroup([shape, ...stops]);
    routeLayerGroup.addTo(map);

    layerControl && layerControl.addOverlay(routeLayerGroup, `${routeId} Line`);
  });
};

/**
 * A record that represents the lock status of routes.
 * The keys are route names and the values are boolean values indicating whether the route is locked or not.
 */
const routeLocks: Record<string, boolean> = {};

/**
 * Plots live vehicle data for a specific route on the map, replacing any existing data for that route.
 * Prevents concurrent updates for the same route using a lock mechanism.
 *
 * @param layerControl - A Leaflet layer control to manage the live tracking overlays.
 * @param vehicles - An array of vehicle objects, each containing latitude and longitude attributes.
 * @param routeId - The ID of the route for which live data is being plotted.
 */
export const plotLiveData = async (
  vehicles: any[],
  routeId: string
): Promise<void> => {
  const layerControl = get(mapLayerControl)
  
  if (routeLocks[routeId]) {
    console.log(`Update for ${routeId} is already in progress. Skipping.`);
    return;
  }

  routeLocks[routeId] = true; // Acquire the lock

  try {
    const map: MapStore = get(mapStore);

    if (!map) {
      throw new Error("Map is undefined");
    }

    const currentLiveData = get(liveData);
    // const currentOverlays = get(overlays);

    // First, clean up the previous data (if any) before adding new layers
    const existingLayerGroup = currentLiveData.get(routeId);
    if (existingLayerGroup && layerControl) {
      map.removeLayer(existingLayerGroup);  // Remove the existing layer
      currentLiveData.delete(routeId);  // Delete from live data store

      // Also remove from layerControl to prevent duplicate entries
      layerControl.removeLayer(existingLayerGroup);
    }

    // Create new layers for the vehicles
    const vehicleLayers: L.Layer[] = vehicles.map((vehicle: any) => {
      const { attributes } = vehicle;
      const coordinates: L.LatLngExpression = [attributes.latitude, attributes.longitude];

      return L.circle(coordinates, {
        color: "black",
        fillColor: "yellow",
        fillOpacity: 1,
        radius: 30,
      });
    });

    // Create a new layer group
    const layerGroup = L.layerGroup(vehicleLayers);

    // Add the new layer group to the map
    layerGroup.addTo(map);

    // Add to layer control if not already added
    const overlayName = `${routeId} Line Live Tracking`;
    if (layerControl) {
      layerControl.addOverlay(layerGroup, overlayName);

      overlays.update((data) => {
        data.add(overlayName);
        return data;
      });
    }

    // Update the liveData store with the new layer group
    liveData.update((data) => {
      data.set(routeId, layerGroup);
      return data;
    });
  } catch (error) {
    console.error(`Error updating live data for route ${routeId}:`, error);
  } finally {
    routeLocks[routeId] = false; // Release the lock
  }
};