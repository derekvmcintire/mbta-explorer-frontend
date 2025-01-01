import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import type { LayerGroup } from 'leaflet';

const initialMap = new Map();
initialMap.set("Red", []);
export const liveData: Writable<Map<string, LayerGroup>> = writable(initialMap);

// Store to track added overlays
export const overlays: Writable<Set<string>> = writable(new Set());