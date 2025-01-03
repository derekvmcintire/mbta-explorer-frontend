import { get } from "svelte/store";
import { vehicleStateMap, type Vehicle } from "../stores/live_track_store";
import { processBatchUpdates } from "./batch_live_updates";
import { type Map } from "leaflet";
import { vehicleUpdateQueue } from "../stores/vehicle_update_queue_store";

export function isDataFresh(vehicle: any): boolean {
  const { id, attributes } = vehicle;
  const currentState = get(vehicleStateMap);
  const existingData = currentState[id]?.data;

  return (
    !existingData ||
    new Date(attributes.updated_at) > new Date(existingData.updated_at)
  );
}

export function handleAddOrUpdateEvent(vehicle: Vehicle, map: L.Map) {
  if (!isDataFresh(vehicle)) return;
  vehicleUpdateQueue.update((queue) => [...queue, vehicle]);

  setTimeout(() => processBatchUpdates(map), 3000); // Adjust interval as needed
}

// Handle the reset event
export function handleResetEvent(data: Vehicle[], map: Map) {
  // Clear existing markers
  const currentState = get(vehicleStateMap);
  Object.values(currentState).forEach(({ marker }) => marker.remove());
  vehicleStateMap.set({}); // Clear the store

  // Add new markers
  data.forEach((vehicle) => handleAddOrUpdateEvent(vehicle, map));
}

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
