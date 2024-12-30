// src/stores.js or stores.ts
import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import type { LayerGroup } from 'leaflet';

export const liveData: Writable<Map<string, LayerGroup>> = writable(new Map());

// Store to track added overlays
export const overlays: Writable<Set<string>> = writable(new Set());