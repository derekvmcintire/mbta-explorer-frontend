import { get } from "svelte/store";
import { vehicleStateMap, type Vehicle } from "../stores/live_track_store";
import { processBatchUpdates } from "./batch_live_updates";
import { type Map } from "leaflet";
import { vehicleUpdateQueue } from "../stores/vehicle_update_queue_store";

/**
 * Determines if the incoming vehicle data is fresher than the current state.
 *
 * @param {Vehicle} vehicle - The vehicle data to compare.
 * @returns {boolean} True if the data is fresh or the vehicle does not exist in the current state.
 */
export function isDataFresh(vehicle: Vehicle): boolean {
  const { id, attributes } = vehicle;
  const currentState = get(vehicleStateMap);
  const existingData = currentState[id]?.data;

  return (
    !existingData ||
    new Date(attributes.updated_at) > new Date(existingData.updated_at)
  );
}

/**
 * Handles adding or updating a vehicle's state in the update queue.
 *
 * @param {Vehicle} vehicle - The vehicle to add or update.
 * @param {L.Map} map - The Leaflet map instance.
 *
 * Adds the vehicle to the update queue and schedules batch processing after a delay.
 */
export function handleAddOrUpdateEvent(vehicle: Vehicle, map: Map) {
  if (!isDataFresh(vehicle)) return;
  vehicleUpdateQueue.update((queue) => [...queue, vehicle]);

  // Process the batch after a delay to group updates together.
  setTimeout(() => processBatchUpdates(map), 3000); // Adjust interval as needed
}

/**
 * Handles resetting the map and updating it with a new set of vehicle data.
 *
 * @param {Vehicle[]} data - The array of vehicle data to render.
 * @param {Map} map - The Leaflet map instance.
 *
 * Clears all existing markers from the map and replaces them with markers for the new data.
 */
export function handleResetEvent(data: Vehicle[], map: Map) {
  // Clear existing markers
  const currentState = get(vehicleStateMap);
  Object.values(currentState).forEach(({ marker }) => marker.remove());
  vehicleStateMap.set({}); // Clear the store

  // Add new markers for the provided data
  data.forEach((vehicle) => handleAddOrUpdateEvent(vehicle, map));
}

/**
 * Handles removing a vehicle from the map and the current state.
 *
 * @param {Vehicle} vehicle - The vehicle to remove.
 *
 * Removes the vehicle's marker from the map and deletes its state entry.
 * Logs an error if the vehicle ID is missing.
 */
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
