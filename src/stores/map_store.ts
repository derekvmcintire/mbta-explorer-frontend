import { writable } from "svelte/store";
import type { Map } from "leaflet";

export type MapStore = Map | undefined;

// Store for tracking map state
export const mapStore = writable<MapStore>(undefined);

export type MapLayerControl = L.Control.Layers | undefined;

// Store for tracking map layer control state
export const mapLayerControl = writable<MapLayerControl>(undefined);
