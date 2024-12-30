import * as L from "leaflet";
import { getRouteColor } from "./constants";

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
    stops: L.CircleMarker[];
  };
}

// Helper function to create the route shape (polyline)
const createRouteShape = (coordinates: [number, number][], color: string): L.Polyline => {
  return L.polyline(coordinates, { color });
};

// Helper function to create a stop marker (circleMarker)
const createStopMarker = (latitude: number, longitude: number, color: string): L.CircleMarker => {
  return L.circleMarker([latitude, longitude], {
    color,
    fillColor: "white",
    fillOpacity: 1,
    radius: 10
  });
};

// Main function to plot multiple routes
export const plotMultipleRoutes = (
  map: L.Map,
  layerControl: L.Control.Layers,
  routes: Route[]
): void => {
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

    // Store the route data in the routeMap
    routeMap[route.id] = { shape, stops };
  });

  // Add routes and stops to the map with layer control
  Object.entries(routeMap).forEach(([routeId, { shape, stops }]) => {
    const routeLayerGroup = L.layerGroup([shape, ...stops]);
    routeLayerGroup.addTo(map);

    // Add to the layer control with the route name
    layerControl.addOverlay(routeLayerGroup, `${routeId} Line`);
  });
};

// Plot live data with throttling
export const plotLiveData = (map: any, layerControl: any, vehicles: any[], routeId: string): void => {
  const vehicleLayers: L.Layer[] = vehicles.map((vehicle: any) => {
    const { attributes } = vehicle;
    const coordinates: L.LatLngExpression = [attributes.latitude, attributes.longitude];
    const color = getRouteColor(routeId) || "yellow";

    return L.circleMarker(coordinates, {
      color: color,
      fillColor: "black",
      fillOpacity: 1,
      radius: 8,
    });
  });

  const layerGroup = L.layerGroup(vehicleLayers).setZIndex(1000);
  layerGroup.addTo(map);
  layerControl.addOverlay(layerGroup, `${routeId} Line Live Tracking`);

};
