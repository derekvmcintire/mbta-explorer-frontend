import { get, writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import type { CircleMarker, Map } from 'leaflet';
import L from 'leaflet';
import { handleAddOrUpdateEvent } from '../explorer-api/batch_live_updates';

// Define the shape of vehicle attributes
interface VehicleAttributes {
  latitude: number;
  longitude: number;
  bearing?: number;
  current_status?: string;
  [key: string]: any; // Add more keys if needed
}

// Define the shape of a vehicle object
export interface Vehicle {
  id: string;
  attributes: VehicleAttributes;
}

// Define the state for each vehicle
export interface VehicleStateMap {
  marker: CircleMarker;
  data: VehicleAttributes;
}

// Store for tracking vehicle state
export const vehicleStateMap: Writable<Record<string, VehicleStateMap>> = writable({});

// export function isDataFresh(vehicle: any): boolean {
//   const { id, attributes } = vehicle;
//   const currentState = get(vehicleStateMap);
//   const existingData = currentState[id]?.data;

//   return !existingData || new Date(attributes.updated_at) > new Date(existingData.updated_at);
// }

// Handle the reset event
export function handleResetEvent(data: Vehicle[], map: Map) {
  // Clear existing markers
  const currentState = get(vehicleStateMap);
  Object.values(currentState).forEach(({ marker }) => marker.remove());
  vehicleStateMap.set({}); // Clear the store

  // Add new markers
  data.forEach((vehicle) => handleAddOrUpdateEvent(vehicle, map));
}

// // Handle add or update event
// export function handleAddOrUpdateEvent(vehicle: Vehicle, map: Map) {
//   if (!isDataFresh(vehicle)) {
//     return
//   }

//   const { id, attributes } = vehicle;

//   if (!id) {
//     console.error("Vehicle ID is missing");
//     return;
//   }

//   vehicleStateMap.update((state) => {
//     const existingVehicle = state[id];

//     if (existingVehicle) {
//       // Update existing marker
//       const { marker } = existingVehicle;
//       marker.setLatLng([attributes.latitude, attributes.longitude]);
//       state[id].data = attributes; // Update state data
//     } else {
//       // Add new marker
//       const marker = L.circle([attributes.latitude, attributes.longitude], {
//         color: "white",
//         fillColor: "white",
//         fillOpacity: 1,
//         radius: 60,
//       }).addTo(map);

//       state[id] = { marker, data: attributes };
//     }

//     return state;
//   });
// }

export function handleRemoveEvent(vehicle: Vehicle) {
  const { id } = vehicle;

  if (!id) {
    console.error("Vehicle ID is missing");
    return;
  }

  vehicleStateMap.update((state) => {
    const existingVehicle = state[id];

    if (existingVehicle) {
      // Remove marker from the map
      existingVehicle.marker.remove();
      // Delete from the state map
      delete state[id];
    }

    return state;
  });
}
