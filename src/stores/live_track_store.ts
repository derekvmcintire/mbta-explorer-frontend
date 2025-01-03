import { writable } from "svelte/store";
import type { Writable } from "svelte/store";
import type { CircleMarker } from "leaflet";

interface VehicleAttributes {
  latitude: number;
  longitude: number;
  bearing?: number;
  current_status?: string;
}

export interface Vehicle {
  id: string;
  attributes: VehicleAttributes;
}

export interface VehicleStateMap {
  marker: CircleMarker;
  data: VehicleAttributes;
}

// Store for tracking vehicle state
export const vehicleStateMap: Writable<Record<string, VehicleStateMap>> =
  writable({});
