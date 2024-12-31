import { streamData } from "../stores/boston_subway_store";

let eventSource: EventSource;

export function startListening(apiKey: string) {
  // Include the API key in the query parameters
  const url = `https://api-v3.mbta.com/vehicles?filter[route]=Red&api_key=${apiKey}`;
  
  eventSource = new EventSource(url, { withCredentials: false });

  // Handle the "reset" event
  eventSource.addEventListener("reset", (event) => {
    const data = JSON.parse(event.data);
    console.log("Reset event received", data);
    streamData.set(data); // Update the store with the full dataset
  });

  // Handle the "add" event
  eventSource.addEventListener("add", (event) => {
    const data = JSON.parse(event.data);
    console.log("Add event received", data);
    // Handle added data (e.g., merge with existing data)
  });

  // Handle the "update" event
  eventSource.addEventListener("update", (event) => {
    const data = JSON.parse(event.data);
    console.log("Update event received", data);
    // Handle updated data (e.g., update specific entries)
  });

  // Handle the "remove" event
  eventSource.addEventListener("remove", (event) => {
    const data = JSON.parse(event.data);
    console.log("Remove event received", data);
    // Handle removed data (e.g., remove entries from your store)
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
