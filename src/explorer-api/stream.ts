// import { map } from "leaflet";
// import { plotLiveData } from "../utils/map_live_data";
import { get } from "svelte/store";
import { mapStore } from "../stores/map_store";
import { handleAddOrUpdateEvent, handleRemoveEvent, handleResetEvent } from "../stores/live_track_store";

let eventSource: EventSource;

export function startStreaming() {
  // Include the API key in the query parameters
  const url = `http://localhost:8080/stream/vehicles`;
  
  eventSource = new EventSource(url, { withCredentials: false });

  // Handle the "reset" event
  eventSource.addEventListener("reset", (event) => {
    const data = JSON.parse(event.data);
    const map = get(mapStore);
    if (!map) return;
    handleResetEvent(data, map)
    console.log("Reset event received", data);
  });

  // Handle the "add" event
  eventSource.addEventListener("add", (event) => {
    const data = JSON.parse(event.data);
    const map = get(mapStore);
    if (!map) return;
    handleAddOrUpdateEvent(data, map);
  });

  // Handle the "update" event
  eventSource.addEventListener("update", (event) => {
    const data = JSON.parse(event.data);
    const map = get(mapStore);
    if (!map) return;
    handleAddOrUpdateEvent(data, map);
  });

  // Handle the "remove" event
  eventSource.addEventListener("remove", (event) => {
    const data = JSON.parse(event.data);
    const map = get(mapStore);
    if (!map) return;
    handleRemoveEvent(data);
  });

  // Handle connection errors
  eventSource.onerror = (error) => {
    console.error("SSE connection error", error);
    eventSource.close();
  };
}

export function stopListening() {
  if (eventSource) {
    eventSource.close();
    console.log("SSE connection closed");
  }
}
