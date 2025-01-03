// import * as L from "leaflet";
// // import { liveData, overlays } from "../stores/boston_subway_store";
// import { get } from "svelte/store";
// import { mapLayerControl, mapStore, type MapStore } from "../stores/map_store";
// import { acquireLock, releaseLock } from "./map_lock";

// // /**
// //  * Creates vehicle layers (circle markers) for each vehicle in the provided array.
// //  * 
// //  * @param vehicles - An array of vehicle objects, each containing attributes with latitude and longitude.
// //  * @returns An array of Leaflet circle markers representing the vehicles on the map.
// //  */
// // export const createVehicleLayers = (vehicles: any[]): L.Layer[] => {
// //   return vehicles.map((vehicle: any) => {
// //     const { attributes } = vehicle;
// //     const coordinates: L.LatLngExpression = [attributes.latitude, attributes.longitude];

// //     return L.circle(coordinates, {
// //       color: "black",
// //       fillColor: "yellow",
// //       fillOpacity: 1,
// //       radius: 30,
// //     });
// //   });
// // };

// /**
//  * Removes the existing layer for a given route from the map and updates the live data and layer control.
//  * 
//  * @param routeId - The ID of the route whose existing layer should be removed.
//  * @param map - The current map instance to remove the layer from.
//  * @param layerControl - The map's layer control to update after removing the layer.
//  */
// const removeExistingLayer = (routeId: string, map: MapStore, layerControl: any): void => {
//   const currentLiveData = get(liveData);
//   const existingLayerGroup = currentLiveData.get(routeId);

//   if (map && existingLayerGroup && layerControl) {
//     map.removeLayer(existingLayerGroup);  // Remove the existing layer from the map
//     currentLiveData.delete(routeId);  // Remove the layer from the live data store
//     layerControl.removeLayer(existingLayerGroup);  // Remove the layer from the layer control
//   }
// };

// /**
//  * Adds a layer group to the map.
//  * 
//  * @param layerGroup - The group of layers (e.g., vehicle markers) to be added to the map.
//  * @param map - The map to which the layer group should be added.
//  * @throws Throws an error if the map is undefined.
//  */
// const addLayerToMap = (layerGroup: L.LayerGroup, map: MapStore): void => {
//   if (!map) {
//     throw new Error("Map is undefined");
//   }
//   layerGroup.addTo(map); // Add the layer group to the map
// };

// /**
//  * Updates the layer control with a new layer group for live tracking of vehicles on a route.
//  * 
//  * @param layerGroup - The group of layers (e.g., vehicle markers) to be added to the layer control.
//  * @param routeId - The ID of the route being updated.
//  * @param layerControl - The map's layer control to update.
//  */
// const updateLayerControl = (layerGroup: L.LayerGroup, routeId: string, layerControl: any): void => {
//   const overlayName = `${routeId} Line Live Tracking`;
//   if (layerControl) {
//     layerControl.addOverlay(layerGroup, overlayName); // Add the overlay to the layer control

//     // Update the overlays store to track the newly added overlay
//     overlays.update((data) => {
//       data.add(overlayName);
//       return data;
//     });
//   }
// };

// /**
//  * Updates the live data store with the new layer group for the given route.
//  * 
//  * @param routeId - The ID of the route being updated.
//  * @param layerGroup - The new layer group containing vehicle markers to be saved in the live data store.
//  */
// const updateLiveData = (routeId: string, layerGroup: L.LayerGroup): void => {
//   liveData.update((data) => {
//     data.set(routeId, layerGroup); // Update the live data store with the new layer group
//     return data;
//   });
// };

// /**
//  * Plots live data (vehicle locations) for a given route and updates the map.
//  * This function acquires a lock to prevent simultaneous updates for the same route,
//  * removes any existing layers, and adds the new layers to the map and layer control.
//  * 
//  * @param vehicles - An array of vehicle objects to be plotted on the map.
//  * @param routeId - The ID of the route for which live data is being plotted.
//  * @returns A Promise that resolves once the live data has been successfully plotted.
//  */
// export const plotLiveData = async (vehicles: any[], routeId: string): Promise<void> => {
//   if (!acquireLock(routeId)) return; // Ensure no concurrent updates for the same route

//   try {
//     const map = get(mapStore);
//     if (!map) return;

//     const layerControl = get(mapLayerControl);
//     if (!layerControl) return;

//     // Remove existing layer group for the route
//     removeExistingLayer(routeId, map, layerControl);

//     // Create new vehicle layers
//     const vehicleLayers = createVehicleLayers(vehicles);
//     const layerGroup = L.layerGroup(vehicleLayers);

//     // Add the new layers to the map and layer control
//     addLayerToMap(layerGroup, map);
//     updateLayerControl(layerGroup, routeId, layerControl);
//     updateLiveData(routeId, layerGroup); // Update the live data store with the new layer group

//   } catch (error) {
//     console.error(`Error updating live data for route ${routeId}:`, error);
//   } finally {
//     releaseLock(routeId); // Release the lock after the update is complete
//   }
// };
