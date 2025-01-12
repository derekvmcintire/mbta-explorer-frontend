import { writable } from "svelte/store";
import type { Writable } from "svelte/store";
import type { CircleMarker } from "leaflet";

export interface VehicleAttributes {
  latitude: number;
  longitude: number;
  bearing?: number;
  current_status?: string;
  updated_at?: string;
  direction?: number;
  speed?: number;
  route?: string;
}

export interface VehicleRelationships {
  route?: {
    data?: {
      id?: string;
      type?: string;
    };
  };
}

export interface Vehicle {
  id: string;
  attributes: VehicleAttributes;
  relationships?: VehicleRelationships;
}

export interface VehicleStateMap {
  marker: CircleMarker;
  data: VehicleAttributes;
}

// Store for tracking vehicle state
export const vehicleStateMap: Writable<Record<string, VehicleStateMap>> =
  writable({});
