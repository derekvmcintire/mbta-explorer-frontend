import { writable } from "svelte/store";
import type { Writable } from "svelte/store";
import type { CircleMarker } from "leaflet";

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
export const vehicleStateMap: Writable<Record<string, VehicleStateMap>> =
  writable({});
