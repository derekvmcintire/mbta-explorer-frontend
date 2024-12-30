import * as L from "leaflet";
import { getRouteColor } from "./constants";

// // Helper to add layers in bulk
// const addLayerGroup = (map: any, layers: L.Layer[]): void => {
//   const layerGroup = L.layerGroup(layers);
//   layerGroup.addTo(map);
// };

// // Optimize route plotting
// export const plotRoute = (map: any, coordinates: any[], color: string): L.Polyline => {
//   return L.polyline(coordinates, { color }).addTo(map);
// };

// // Optimize stop plotting
// export const plotStop = (map: any, coordinates: L.LatLngExpression, color: string): L.Circle => {
//   return L.circle(coordinates, {
//     color,
//     fillColor: color,
//     fillOpacity: 0.5,
//     radius: 50,
//   });
// };

// Plot multiple routes with optimizations
export const plotMultipleRoutes = (map: any, routes: any[]): void => {
  const routeLayers: L.Layer[] = [];
  const stopLayers: L.Layer[] = [];

  routes.forEach((route: any) => {
    const color = getRouteColor(route.id) || "";

    // Handle special case for "Green-E"
    const routeCoordinates = route.id === "Green-E"
      ? route.coordinates.slice(0, 2) // Only first two coordinates
      : route.coordinates;

    // Add route layer
    routeLayers.push(L.polyline(routeCoordinates, { color }));

    // Add stops for the route
    route.stops.forEach((stop: any) => {
      const { attributes } = stop;
      const coordinates: L.LatLngExpression = [attributes.latitude, attributes.longitude];
      stopLayers.push(
        L.circleMarker(coordinates, {
          color,
          fillColor: "white",
          fillOpacity: 1,
          radius: 10,
        })
      );
    });
  });

  // Add all routes and stops as layer groups
  const routeLayerGroup = L.layerGroup(routeLayers).setZIndex(1);
  routeLayerGroup.addTo(map);
  const stopLayerGroup = L.layerGroup(stopLayers).setZIndex(1);
  stopLayerGroup.addTo(map);
  // addLayerGroup(map, routeLayers);
  // addLayerGroup(map, stopLayers);
};

// Plot live data with throttling
export const plotLiveData = (map: any, vehicles: any[], routeId: string): void => {
  const vehicleLayers: L.Layer[] = vehicles.map((vehicle: any) => {
    const { attributes } = vehicle;
    console.log('attributes: ', attributes)
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
};
