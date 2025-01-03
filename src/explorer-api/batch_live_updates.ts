import { get } from "svelte/store";
import { vehicleStateMap, type Vehicle } from "../stores/live_track_store";
import * as L from "leaflet";


let updateQueue: Vehicle[] = [];
let isProcessing = false;

function processBatchUpdates(map: L.Map) {
  console.log('********** processing batched updates **********')
  if (isProcessing || updateQueue.length === 0) return;

  isProcessing = true;
  const updates = [...updateQueue]; // Copy the queue
  updateQueue = []; // Clear the queue

  // Apply updates
  vehicleStateMap.update((state) => {
    updates.forEach((vehicle) => {
      const { id, attributes } = vehicle;
      const existingVehicle = state[id];

      if (existingVehicle) {
        existingVehicle.marker.setLatLng([attributes.latitude, attributes.longitude]);
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

export function isDataFresh(vehicle: any): boolean {
  const { id, attributes } = vehicle;
  const currentState = get(vehicleStateMap);
  const existingData = currentState[id]?.data;

  return !existingData || new Date(attributes.updated_at) > new Date(existingData.updated_at);
}

// Modify `handleAddOrUpdateEvent` to queue updates
export function handleAddOrUpdateEvent(vehicle: Vehicle, map: L.Map) {
  if (!isDataFresh(vehicle)) return;
  updateQueue.push(vehicle);

  // Schedule batch processing
  setTimeout(() => processBatchUpdates(map), 1000); // Adjust interval as needed
}