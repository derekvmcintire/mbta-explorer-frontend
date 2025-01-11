import { get } from "svelte/store";
import { vehicleStateMap } from "../stores/live_track_store";
import * as L from "leaflet";
import { vehicleUpdateQueue } from "../stores/vehicle_update_queue_store";
import { mapStore } from "../stores/map_store";

let isProcessing = false;

/**
 * Processes a batch of vehicle updates and updates the map with their locations.
 *
 *
 * This function processes queued vehicle updates, ensuring that existing vehicles
 * are updated with new positions and attributes, or new markers are created for
 * vehicles not already on the map. It also prevents concurrent processing by
 * using a flag to track processing state.
 */
export function processBatchUpdates() {
  const map = get(mapStore);
  if (!map) return;

  const updateQueue = get(vehicleUpdateQueue);

  // Exit early if already processing or if there are no updates in the queue.
  if (isProcessing || updateQueue.length === 0) return;

  isProcessing = true;
  const updates = [...updateQueue]; // Copy the queue
  vehicleUpdateQueue.set([]); // Clear the queue after copying

  // Update the vehicle state map with the new data.
  vehicleStateMap.update((state) => {
    updates.forEach((vehicle) => {
      const { id, attributes } = vehicle;
      const existingVehicle = state[id];

      if (existingVehicle) {
        // Update the position of the existing vehicle marker.
        existingVehicle.marker.setLatLng([
          attributes.latitude,
          attributes.longitude,
        ]);
        state[id].data = attributes; // Update vehicle data.
      } else {
        // Create a new marker for a vehicle not currently on the map.
        const marker = L.circle([attributes.latitude, attributes.longitude], {
          color: "black",
          fillColor: "yellow",
          fillOpacity: 1,
          radius: 40,
        }).addTo(map);
        state[id] = { marker, data: attributes }; // Add the new vehicle to the state.
      }
    });

    return state;
  });

  isProcessing = false;
}
