import {
  handleAddOrUpdateEvent,
  handleRemoveEvent,
  handleResetEvent,
} from "./stream_handlers";

let eventSource: EventSource;

/**
 * Starts streaming live vehicle data using Server-Sent Events (SSE).
 *
 * This function establishes a connection to the server's SSE endpoint and
 * listens for "reset", "add", "update", and "remove" events. Each event type
 * is handled to update the map accordingly.
 */
export function startStreaming(): void {
  // Define the SSE endpoint URL
  const url = `http://localhost:8080/stream/vehicles`;

  // Initialize the EventSource connection
  eventSource = new EventSource(url, { withCredentials: false });

  // Handle the "reset" event
  eventSource.addEventListener("reset", (event) => {
    const data = JSON.parse(event.data);
    handleResetEvent(data);
    console.log("Reset event received", data);
  });

  // Handle the "add" event
  eventSource.addEventListener("add", (event) => {
    const data = JSON.parse(event.data);
    handleAddOrUpdateEvent(data);
  });

  // Handle the "update" event
  eventSource.addEventListener("update", (event) => {
    const data = JSON.parse(event.data);
    handleAddOrUpdateEvent(data);
  });

  // Handle the "remove" event
  eventSource.addEventListener("remove", (event) => {
    const data = JSON.parse(event.data);
    handleRemoveEvent(data);
  });

  // Handle connection errors
  eventSource.onerror = (error) => {
    console.error("SSE connection error", error);
    eventSource.close();
  };
}

/**
 * Stops listening to live vehicle data events.
 *
 * Closes the existing SSE connection if it is active and logs the closure.
 */
export function stopListening(): void {
  if (eventSource) {
    eventSource.close();
    console.log("SSE connection closed");
  }
}
