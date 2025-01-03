import { writable, type Writable } from "svelte/store";
import type { Vehicle } from "./live_track_store";

// Store for tracking updates to vehicle state before batch processing
export const vehicleUpdateQueue: Writable<Vehicle[]> = writable([]);
