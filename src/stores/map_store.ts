import { writable } from "svelte/store";
import type { Map } from "leaflet";

export type MapStore = Map | undefined;

export const mapStore = writable<MapStore>(undefined);

export type MapLayerControl = L.Control.Layers | undefined;

export const mapLayerControl = writable<MapLayerControl>(undefined)
