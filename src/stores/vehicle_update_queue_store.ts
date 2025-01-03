import { writable, type Writable } from "svelte/store";
import type { Vehicle } from "./live_track_store";

// Store for tracking vehicle state
export const vehicleUpdateQueue: Writable<Vehicle[]> = writable([]);
