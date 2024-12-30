// src/stores/mapStore.ts
import { writable } from "svelte/store";
import type { Map } from "leaflet";

export type MapStore = Map | undefined;

export const mapStore = writable<MapStore>(undefined);
