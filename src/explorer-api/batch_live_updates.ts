import { get } from "svelte/store";
import { vehicleStateMap } from "../stores/live_track_store";
import * as L from "leaflet";
import { vehicleUpdateQueue } from "../stores/vehicle_update_queue_store";

let isProcessing = false;

export function processBatchUpdates(map: L.Map) {
  const updateQueue = get(vehicleUpdateQueue);
  if (isProcessing || updateQueue.length === 0) return;

  isProcessing = true;
  const updates = [...updateQueue]; // Copy the queue
  vehicleUpdateQueue.set([]);

  // Apply updates
  vehicleStateMap.update((state) => {
    updates.forEach((vehicle) => {
      const { id, attributes } = vehicle;
      const existingVehicle = state[id];

      if (existingVehicle) {
        existingVehicle.marker.setLatLng([
          attributes.latitude,
          attributes.longitude,
        ]);
        state[id].data = attributes;
      } else {
        const marker = L.circle([attributes.latitude, attributes.longitude], {
          color: "white",
          fillColor: "white",
          fillOpacity: 1,
          radius: 40,
        }).addTo(map);
        state[id] = { marker, data: attributes };
      }
    });

    return state;
  });

  isProcessing = false;
}
