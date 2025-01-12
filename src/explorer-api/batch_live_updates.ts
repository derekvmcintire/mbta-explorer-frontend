import { get } from "svelte/store";
import { vehicleStateMap } from "../stores/live_track_store";
import { vehicleUpdateQueue } from "../stores/vehicle_update_queue_store";
import { mapStore } from "../stores/map_store";
import { VehicleMarkerManager } from "./vehicle_marker_manager";

let isProcessing = false;

/**
 * Processes a batch of vehicle updates from the update queue and updates the map.
 *
 * This function retrieves updates from the `vehicleUpdateQueue` store, updates the
 * state of vehicle markers on the map, and prevents concurrent processing by using a flag.
 */
export function processBatchUpdates(): void {
  const map = get(mapStore);
  if (!map || isProcessing) return;

  const updates = get(vehicleUpdateQueue);
  if (updates.length === 0) return;

  isProcessing = true;

  try {
    // Clear the queue immediately to prevent duplicate processing
    vehicleUpdateQueue.set([]);

    // Update the vehicle state map with the new data
    vehicleStateMap.update((currentState) =>
      updates.reduce(
        (updatedState, vehicle) =>
          VehicleMarkerManager.handleVehicleUpdate(vehicle, updatedState, map),
        currentState,
      ),
    );
  } finally {
    isProcessing = false;
  }
}
