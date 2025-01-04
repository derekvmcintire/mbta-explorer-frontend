import { get } from "svelte/store";
import { vehicleStateMap, type Vehicle } from "../stores/live_track_store";
import { processBatchUpdates } from "./batch_live_updates";
import { vehicleUpdateQueue } from "../stores/vehicle_update_queue_store";

/**
 * Determines if the incoming vehicle data is fresher than the current state.
 *
 * @param {Vehicle} vehicle - The vehicle data to compare.
 * @returns {boolean} True if the data is fresh or the vehicle does not exist in the current state.
 */
export function isDataFresh(vehicle: Vehicle): boolean {
  const { id, attributes } = vehicle;
  const newUpdatedAt = attributes?.updated_at || "";
  const currentState = get(vehicleStateMap);
  const existingData = currentState[id]?.data;
  const { updated_at } = existingData || {};

  return (
    !existingData ||
    !updated_at ||
    !newUpdatedAt ||
    new Date(newUpdatedAt) > new Date(updated_at)
  );
}

let batchTimeout: number | undefined; // Use number for browser setTimeout return type
const processDelay = 100; // 100 ms

/**
 * Schedules batch processing of vehicle updates after a delay.
 *
 * Ensures that batch processing is triggered only after the specified delay
 * and avoids overlapping executions.
 */
function scheduleBatchProcessing() {
  if (batchTimeout !== undefined) {
    clearTimeout(batchTimeout);
  }
  batchTimeout = window.setTimeout(() => {
    processBatchUpdates();
    batchTimeout = undefined; // Clear timeout reference after execution
  }, processDelay);
}

/**
 * Handles adding or updating a vehicle's state in the update queue.
 *
 * @param {Vehicle} vehicle - The vehicle to add or update.
 *
 * Adds the vehicle to the update queue and schedules batch processing after a delay.
 */
export function handleAddOrUpdateEvent(vehicle: Vehicle) {
  if (!isDataFresh(vehicle)) return;
  vehicleUpdateQueue.update((queue) => [...queue, vehicle]);
  scheduleBatchProcessing();
}

/**
 * Handles resetting the map and updating it with a new set of vehicle data.
 *
 * @param {Vehicle[]} data - The array of vehicle data to render.
 *
 * Clears all existing markers from the map and replaces them with markers for the new data.
 */
export function handleResetEvent(data: Vehicle[]) {
  // Clear existing markers
  const currentState = get(vehicleStateMap);
  Object.values(currentState).forEach(({ marker }) => marker.remove());
  vehicleStateMap.set({}); // Clear the store

  // Add new markers for the provided data
  data.forEach((vehicle) => handleAddOrUpdateEvent(vehicle));
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
