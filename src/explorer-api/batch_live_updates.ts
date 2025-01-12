import { get } from "svelte/store";
import type {
  Vehicle,
  VehicleAttributes,
  VehicleStateMap,
} from "../stores/live_track_store";
import * as L from "leaflet";
import { vehicleStateMap } from "../stores/live_track_store";
import { vehicleUpdateQueue } from "../stores/vehicle_update_queue_store";
import { mapStore } from "../stores/map_store";

const VEHICLE_STATUS_TEXT_MAP = new Map([
  ["STOPPED_AT", "Stopped"],
  ["IN_TRANSIT_TO", "In Transit"],
  ["INCOMING_AT", "Arriving"],
]);

class VehicleMarkerManager {
  private static createPopupContent(
    attributes: VehicleAttributes & { route?: string },
  ): string {
    const { current_status, speed, route, updated_at } = attributes;
    const vehicleStatus =
      VEHICLE_STATUS_TEXT_MAP.get(current_status || "") || "";

    return `
      <strong>Route: ${attributes.route || "Not Provided"}</strong><br>
      Speed: ${speed || "Unknown"}${speed ? "mph" : ""}<br>
      Status: ${vehicleStatus}<br>
      Updated At: ${updated_at}<br>
    `;
  }

  private static createMarker(
    map: L.Map | L.LayerGroup<any>,
    attributes: VehicleAttributes & { route?: string },
  ): L.Circle {
    const marker = L.circle([attributes.latitude, attributes.longitude], {
      color: "yellow",
      fillColor: "yellow",
      fillOpacity: 1,
      radius: 50,
    });

    marker.bindPopup(this.createPopupContent(attributes));
    marker.addTo(map);
    return marker;
  }

  private static updateMarker(
    markerState: VehicleStateMap,
    newAttributes: VehicleAttributes & { route?: string },
  ): void {
    const updatedAttributes = { ...markerState.data };

    // Update position
    updatedAttributes.latitude = newAttributes.latitude;
    updatedAttributes.longitude = newAttributes.longitude;
    markerState.marker.setLatLng([
      newAttributes.latitude,
      newAttributes.longitude,
    ]);

    // Update other attributes if they exist and are valid
    if (newAttributes.direction !== undefined)
      updatedAttributes.direction = newAttributes.direction;
    if (newAttributes.speed !== undefined && newAttributes.speed !== 0)
      updatedAttributes.speed = newAttributes.speed;
    if (newAttributes.updated_at)
      updatedAttributes.updated_at = newAttributes.updated_at;
    if (newAttributes.current_status)
      updatedAttributes.current_status = newAttributes.current_status;
    if (newAttributes.bearing !== undefined)
      updatedAttributes.bearing = newAttributes.bearing;
    if (newAttributes.route) updatedAttributes.route = newAttributes.route;

    // Update the popup content with new information
    markerState.marker.setPopupContent(
      this.createPopupContent(updatedAttributes),
    );

    // Update the stored data
    markerState.data = updatedAttributes;
  }

  static handleVehicleUpdate(
    vehicle: Vehicle,
    vehicleStates: Record<string, VehicleStateMap>,
    map: L.Map,
  ): Record<string, VehicleStateMap> {
    const { id, attributes } = vehicle;
    const route = vehicle?.relationships?.route?.data?.id || "";
    const enrichedAttributes = { ...attributes, route };

    if (vehicleStates[id]) {
      this.updateMarker(vehicleStates[id], enrichedAttributes);
    } else {
      const marker = this.createMarker(map, enrichedAttributes);
      vehicleStates[id] = { marker, data: enrichedAttributes };
    }

    return vehicleStates;
  }
}

let isProcessing = false;

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
